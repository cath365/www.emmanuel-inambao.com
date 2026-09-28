const { test, beforeEach, afterEach } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')
const ts = require('typescript')
const { NextRequest } = require('next/server')

// Compile the production TypeScript modules in isolation, mocking only external
// services. No test sends email, uploads media, or accesses production storage.
function load(relative, mocks = {}) {
  const cache = new Map()
  function visit(file) {
    file = path.resolve(__dirname, '..', file)
    if (!path.extname(file)) file += '.ts'
    if (cache.has(file)) return cache.get(file).exports
    const module = { exports: {} }; cache.set(file, module)
    const nativeRequire = createRequire(file)
    const localRequire = id => {
      if (id === 'server-only') return {}
      if (Object.hasOwn(mocks, id)) return mocks[id]
      if (id.startsWith('@/')) return visit(`src/${id.slice(2)}`)
      return nativeRequire(id)
    }
    const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText
    new Function('require', 'module', 'exports', output)(localRequire, module, module.exports)
    return module.exports
  }
  return visit(relative)
}
const envNames = ['RESEND_API_KEY', 'EMAIL_FROM', 'NOTIFICATION_EMAIL', 'FORMSPREE_ID', 'WEB3FORMS_ACCESS_KEY', 'PRIVATE_BLOB_READ_WRITE_TOKEN', 'BLOB_READ_WRITE_TOKEN', 'CLOUDINARY_URL', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
let previousEnv, previousFetch, previousError
beforeEach(() => {
  previousEnv = Object.fromEntries(envNames.map(key => [key, process.env[key]]))
  envNames.forEach(key => delete process.env[key])
  previousFetch = global.fetch
  global.fetch = async () => { throw new Error('Unexpected external request in test') }
  previousError = console.error; console.error = () => {}
})
afterEach(() => {
  for (const [key, value] of Object.entries(previousEnv)) value === undefined ? delete process.env[key] : process.env[key] = value
  global.fetch = previousFetch; console.error = previousError
})
const request = (route, data, method = 'POST') => new NextRequest(`https://portfolio.example/api/${route}`, {
  method, headers: { 'Content-Type': 'application/json', origin: 'https://portfolio.example' }, body: JSON.stringify(data),
})
const noAuth = { isAuthenticated: async () => false }
const allowed = { rateLimit: () => ({ allowed: true }), getClientIP: () => 'test' }
const notice = { name: 'Test Client', email: 'client@example.com', subject: 'Test inquiry', message: 'Test only' }

test('Web3Forms uses a browser fallback, never a server proxy; other secrets stay private', async () => {
  process.env.WEB3FORMS_ACCESS_KEY = ' public-form-key '
  process.env.PRIVATE_BLOB_READ_WRITE_TOKEN = 'private-secret'
  let calls = 0; global.fetch = async () => { calls++; throw new Error('must not send') }
  const api = load('src/lib/notifications.ts')
  const response = await api.submissionResponse(false, notice, 'Received')
  const payload = await response.json()
  assert.equal(response.status, 202); assert.equal(payload.success, false)
  assert.equal(payload.browserNotification.access_key, 'public-form-key')
  assert.equal(calls, 0); assert.ok(!JSON.stringify(payload).includes('private-secret'))
})
test('Resend acceptance is checked and mail always goes to the owner', async () => {
  process.env.RESEND_API_KEY = 'test-only'; process.env.EMAIL_FROM = 'Portfolio <portfolio@example.com>'
  process.env.NOTIFICATION_EMAIL = 'owner@example.com'
  global.fetch = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails')
    const body = JSON.parse(options.body)
    assert.deepEqual(body.to, ['owner@example.com']); assert.equal(body.reply_to, notice.email)
    return Response.json({ id: 'accepted-id' })
  }
  const result = await load('src/lib/notifications.ts').notifyOwner(notice)
  assert.equal(result.emailSent, true); assert.equal(result.emailProvider, 'resend')
})
test('provider rejection falls back without claiming delivery', async () => {
  process.env.FORMSPREE_ID = 'test'; process.env.WEB3FORMS_ACCESS_KEY = 'public-form-key'
  global.fetch = async () => Response.json({ ok: false }, { status: 200 })
  const result = await load('src/lib/notifications.ts').notifyOwner(notice)
  assert.equal(result.emailSent, false); assert.ok(result.browserNotification)
})
test('client confirms a successful browser notification when storage is unavailable', async () => {
  let calls = 0
  global.fetch = async url => {
    calls++
    if (url === '/api/contact') return Response.json({ success: false, saved: false, error: 'not yet delivered', browserNotification: { access_key: 'public' } }, { status: 202 })
    assert.equal(url, 'https://api.web3forms.com/submit')
    return Response.json({ success: true })
  }
  const response = await load('src/lib/submit-form.ts').submitPortfolioForm('/api/contact', { method: 'POST' })
  const payload = await response.json()
  assert.equal(response.status, 200); assert.equal(payload.success, true); assert.equal(payload.emailSent, true)
  assert.equal(payload.error, undefined); assert.equal(payload.browserNotification, undefined); assert.equal(calls, 2)
})
for (const saved of [false, true]) test(`browser rejection preserves the truthful saved=${saved} result`, async () => {
  global.fetch = async url => url === '/api/contact'
    ? Response.json({ saved, success: saved, browserNotification: { access_key: 'public' } }, { status: saved ? 200 : 202 })
    : Response.json({ success: false }, { status: 403 })
  const response = await load('src/lib/submit-form.ts').submitPortfolioForm('/api/contact', {})
  const payload = await response.json()
  assert.equal(response.status, saved ? 200 : 503); assert.equal(payload.success, saved)
  assert.notEqual(payload.emailSent, true)
})
test('validation failures never invoke the browser email provider', async () => {
  let calls = 0
  global.fetch = async () => { calls++; return Response.json({ error: 'invalid' }, { status: 400 }) }
  const response = await load('src/lib/submit-form.ts').submitPortfolioForm('/api/contact', {})
  assert.equal(response.status, 400); assert.equal(calls, 1)
})
test('failed private reads cannot overwrite the existing collection', async () => {
  process.env.PRIVATE_BLOB_READ_WRITE_TOKEN = 'test-only'
  let writes = 0
  const api = load('src/lib/blob-json.ts', { '@vercel/blob': {
    get: async () => { throw new Error('Access denied') }, put: async () => { writes++ },
  } })
  await assert.rejects(api.updatePrivateJson('data/leads.json', [], old => ['new', ...old]), /Access denied/)
  assert.equal(writes, 0)
})
test('conditional writes retry conflicts without losing a concurrent submission', async () => {
  process.env.PRIVATE_BLOB_READ_WRITE_TOKEN = 'test-only'
  class Conflict extends Error {}
  let reads = 0, writes = 0
  const api = load('src/lib/blob-json.ts', { '@vercel/blob': {
    BlobPreconditionFailedError: Conflict,
    get: async (pathname, options) => {
      reads++; assert.equal(options.access, 'private'); assert.equal(options.useCache, false)
      return { statusCode: 200, stream: Response.json(reads === 1 ? ['old'] : ['concurrent', 'old']).body, blob: { etag: `v${reads}` } }
    },
    put: async (pathname, payload, options) => {
      writes++; assert.equal(options.ifMatch, `v${writes}`)
      if (writes === 1) throw new Conflict()
      assert.deepEqual(JSON.parse(payload), ['new', 'concurrent', 'old'])
    },
  } })
  await api.updatePrivateJson('data/leads.json', [], old => ['new', ...old])
  assert.equal(writes, 2)
})
test('first private collection write refuses to overwrite an intervening creation', async () => {
  process.env.PRIVATE_BLOB_READ_WRITE_TOKEN = 'test-only'
  const api = load('src/lib/blob-json.ts', { '@vercel/blob': {
    get: async () => null,
    put: async (pathname, payload, options) => { assert.equal(options.allowOverwrite, false); assert.equal(options.access, 'private') },
  } })
  await api.updatePrivateJson('data/leads.json', [], old => ['new', ...old])
})
test('newsletter storage failure can still queue a browser notification', async () => {
  process.env.WEB3FORMS_ACCESS_KEY = 'public-key'
  const api = load('src/app/api/newsletter/route.ts', {
    '@/lib/rate-limit': allowed, '@/lib/blob-json': { updatePrivateJson: async () => { throw new Error('Unavailable') } },
  })
  const response = await api.POST(request('newsletter', { email: 'client@example.com' }))
  const result = await response.json()
  assert.equal(response.status, 202); assert.equal(result.saved, false); assert.ok(result.browserNotification)
})
test('a rejected testimonial save returns an error, not a success message', async () => {
  const api = load('src/app/api/testimonials/route.ts', {
    '@/lib/rate-limit': allowed, '@/lib/auth-helpers': noAuth,
    '@/lib/cloudinary-config': { testimonialMediaUrl: () => undefined },
    '@/lib/blob-json': { updatePrivateJson: async () => { throw new Error('Access denied') } },
  })
  const response = await api.POST(request('testimonials', { ...notice, content: 'Helpful work', rating: 5 }))
  assert.equal(response.status, 503); assert.notEqual((await response.json()).success, true)
})
test('public testimonial submission is saved as pending regardless of supplied status', async () => {
  let stored
  const api = load('src/app/api/testimonials/route.ts', {
    '@/lib/rate-limit': allowed, '@/lib/auth-helpers': noAuth,
    '@/lib/cloudinary-config': { testimonialMediaUrl: () => undefined },
    '@/lib/blob-json': { updatePrivateJson: async (path, fallback, update) => { stored = update([]) } },
  })
  const response = await api.POST(request('testimonials', { ...notice, content: 'Helpful work', rating: 5, status: 'approved' }))
  assert.equal(response.status, 200); assert.equal(stored[0].status, 'pending')
  assert.equal(stored[0].email, notice.email)
})
test('public testimonials exclude pending, rejected, deleted and email fields', async () => {
  const api = load('src/app/api/testimonials/route.ts', {
    '@/lib/auth-helpers': noAuth, '@/lib/rate-limit': allowed,
    '@/lib/cloudinary-config': {},
    '@/lib/blob-json': {
      readPublicJson: async () => [{ id: 'legacy', name: 'Legacy', content: 'Legacy testimonial' }],
      readPrivateJson: async () => [
        { id: 'one', status: 'pending', email: 'private@example.com' },
        { id: 'two', status: 'approved', email: 'private@example.com' },
        { id: 'three', status: 'rejected' }, { id: 'legacy', status: 'approved', deleted: true },
      ],
    },
  })
  const result = await (await api.GET()).json()
  assert.deepEqual(result, [{ id: 'two', status: 'approved' }])
  assert.equal((await api.PATCH(request('testimonials', {}, 'PATCH'))).status, 401)
})
test('upload signer accepts codec-bearing videos and never returns the signing secret', async () => {
  const api = load('src/app/api/upload/public/route.ts', {
    '@/lib/rate-limit': allowed,
    '@/lib/cloudinary-config': { cloudinaryConfig: () => ({ cloudName: 'test-cloud', apiKey: 'test-public-key', apiSecret: 'private-signing-secret' }) },
  })
  const response = await api.POST(request('upload/public', { type: 'video/webm;codecs=vp8,opus', size: 8 * 1024 * 1024 }))
  const result = await response.json()
  assert.equal(response.status, 200); assert.match(result.uploadUrl, /test-cloud\/video\/upload$/)
  assert.match(result.params.public_id, /^portfolio\/testimonials\//)
  assert.equal(result.params.overwrite, false); assert.ok(result.signature)
  assert.ok(!JSON.stringify(result).includes('private-signing-secret'))
  assert.equal((await api.POST(request('upload/public', { type: 'video/mp4', size: 51 * 1024 * 1024 }))).status, 400)
  assert.equal((await api.POST(request('upload/public', { type: 'text/html', size: 100 }))).status, 400)
})
test('missing storage and email cannot report a successful inquiry', async () => {
  const api = load('src/app/api/contact/route.ts', { '@/lib/rate-limit': allowed,
    '@/lib/blob-json': { updatePrivateJson: async () => { throw new Error('Unavailable') } },
  })
  const response = await api.POST(request('contact', notice))
  assert.equal(response.status, 503); assert.equal((await response.json()).success, false)
})

test('invalid JSON from an API cannot appear successful to response.ok callers', async () => {
  global.fetch = async () => new Response('invalid', { status: 200 })
  const response = await load('src/lib/submit-form.ts').submitPortfolioForm('/api/contact', {})
  assert.equal(response.status, 503)
})
test('case-study provider failure returns a labeled local draft for review', async () => {
  const api = load('src/app/api/ai/case-study/route.ts', {
    '@/lib/auth-helpers': { isAuthenticated: async () => true },
    '@/lib/groq': { createGroqCompletion: async () => ({ ok: false, reason: 'provider_error', status: 429 }) },
  })
  const response = await api.POST(request('ai/case-study', { projectId: 'test-project', project: {
    id: 'test-project', title: 'Test project', purpose: 'A documented test', techStack: ['TypeScript'], highlights: [],
  } }))
  const result = await response.json()
  assert.equal(response.status, 200); assert.equal(result.source, 'local')
  assert.ok(result.warning); assert.equal(result.caseStudy.title, 'Test project')
})
test('case-study storage denial is surfaced and never confirms publishing', async () => {
  const api = load('src/app/api/portfolio-data/route.ts', {
    '@/lib/auth-helpers': { isAuthenticated: async () => true },
    '@/lib/blob-json': { storageError: () => 'Check public storage', readPublicJson: async () => { throw new Error('Access denied') } },
  })
  const response = await api.POST(request('portfolio-data', { key: 'caseStudies', data: [] }))
  assert.equal(response.status, 503); assert.equal((await response.json()).error, 'Check public storage')
})
