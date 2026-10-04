const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')
const ts = require('typescript')
const { NextRequest } = require('next/server')
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

const pathname = 'media/portfolio/12345678-1234-1234-1234-123456789abc.jpg'
function request(body, origin = 'https://portfolio.example') {
  return new NextRequest('https://portfolio.example/api/upload/blob', {
    method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
}
function route(authenticated, handleUpload) {
  return load('src/app/api/upload/blob/route.ts', {
    '@/lib/auth-helpers': { isAuthenticated: async () => authenticated },
    '@/lib/blob-json': { storageToken: access => { assert.equal(access, 'public'); return 'public-test-token' } },
    '@vercel/blob/client': { handleUpload },
  })
}
const grant = { type: 'blob.generate-client-token', payload: { pathname } }
test('unauthenticated, foreign-origin and invalid-path requests cannot obtain upload grants', async () => {
  const never = async () => { throw new Error('SDK must not be called') }
  assert.equal((await route(false, never).POST(request(grant))).status, 401)
  assert.equal((await route(true, never).POST(request(grant, 'https://attacker.example'))).status, 403)
  assert.equal((await route(true, never).POST(request({ ...grant, payload: { pathname: 'portfolio/profile.json' } }))).status, 400)
  assert.equal((await route(true, never).POST(request({ type: 'unknown' }))).status, 400)
})
test('grants use only public credentials, constrain images and prevent overwrites; errors hide credentials', async () => {
  const previous = process.env.BLOB_READ_WRITE_TOKEN
  process.env.BLOB_READ_WRITE_TOKEN = 'test-configured'
  try {
    const api = route(true, async options => {
      assert.equal(options.token, 'public-test-token')
      const grant = await options.onBeforeGenerateToken(pathname)
      assert.equal(grant.maximumSizeInBytes, 10 * 1024 * 1024)
      assert.equal(grant.allowOverwrite, false)
      assert.ok(!grant.allowedContentTypes.includes('image/svg+xml'))
      await assert.rejects(options.onBeforeGenerateToken('private/leads.json'))
      return { type: 'blob.generate-client-token', clientToken: 'scoped-test-grant' }
    })
    const response = await api.POST(request(grant))
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    const failure = await route(true, async () => { throw new Error('private-secret-test') }).POST(request(grant))
    assert.equal(failure.status, 503)
    assert.ok(!(await failure.text()).includes('private-secret-test'))
    delete process.env.BLOB_READ_WRITE_TOKEN
    assert.equal((await api.POST(request(grant))).status, 503)
  } finally {
    previous === undefined ? delete process.env.BLOB_READ_WRITE_TOKEN : process.env.BLOB_READ_WRITE_TOKEN = previous
  }
})

test('large images use direct Blob uploads; invalid images are rejected before network access', async () => {
  const { File } = require('node:buffer')
  const previousFetch = global.fetch
  global.fetch = async () => Response.json({ clientToken: "scoped-test-token" })
  const previousFile = global.File
  global.File = File
  try {
    let calls = 0
    const api = load('src/lib/portfolio-upload.ts', {
      '@vercel/blob/client': { put: async (pathname, file, options) => {
        calls++
        assert.equal(options.access, 'public')
        assert.equal(options.token, 'scoped-test-token')
        assert.equal(file.size, 6 * 1024 * 1024)
        return { url: 'https://example.public.blob.vercel-storage.com/' + pathname, pathname }
      } },
    })
    const form = new FormData()
    form.set('file', new File([new Uint8Array(6 * 1024 * 1024)], 'photo.jpg', { type: 'image/jpeg' }))
    assert.equal((await (await api.uploadPortfolioMedia(form)).json()).success, true)
    assert.equal(calls, 1)
    form.set('file', new File(['svg'], 'photo.svg', { type: 'image/svg+xml' }))
    await assert.rejects(api.uploadPortfolioMedia(form), /Save this image/)
    form.set('file', new File([new Uint8Array(11 * 1024 * 1024)], 'photo.jpg', { type: 'image/jpeg' }))
    await assert.rejects(api.uploadPortfolioMedia(form), /10 MB/)
    assert.equal(calls, 1)
  } finally { global.File = previousFile; global.fetch = previousFetch }
})


test('valid browser host passes proxy origin checking; foreign hosts remain rejected', async () => {
  const previous = process.env.BLOB_READ_WRITE_TOKEN
  process.env.BLOB_READ_WRITE_TOKEN = 'configured-test-token'
  try {
    const api = route(true, async () => ({ clientToken: 'scoped-test-token' }))
    const make = origin => new NextRequest('http://internal-proxy:3000/api/upload/blob', {
      method: 'POST', headers: { host: 'portfolio.example', origin, 'Content-Type': 'application/json' }, body: JSON.stringify(grant),
    })
    assert.equal((await api.POST(make('https://portfolio.example'))).status, 200)
    assert.equal((await api.POST(make('https://attacker.example'))).status, 403)
  } finally { previous === undefined ? delete process.env.BLOB_READ_WRITE_TOKEN : process.env.BLOB_READ_WRITE_TOKEN = previous }
})

test('client displays authorization failure and never uploads without a grant', async () => {
  const { File } = require('node:buffer')
  const previousFile = global.File, previousFetch = global.fetch
  global.File = File
  try {
    let called = false
    const api = load('src/lib/portfolio-upload.ts', { '@vercel/blob/client': { put: async () => { called = true } } })
    global.fetch = async () => Response.json({ error: 'Please log in before uploading.' }, { status: 401 })
    const form = new FormData()
    form.set('file', new File(['image'], 'photo.jpg', { type: 'image/jpeg' }))
    await assert.rejects(api.uploadPortfolioMedia(form), /Please log in before uploading/)
    assert.equal(called, false)
  } finally { global.File = previousFile; global.fetch = previousFetch }
})
