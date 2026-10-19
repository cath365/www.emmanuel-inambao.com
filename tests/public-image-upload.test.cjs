const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const path = require('node:path')
const ts = require('typescript')

const filename = path.join(__dirname, '../src/lib/public-image-upload.ts')
const source = fs.readFileSync(filename, 'utf8')
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText

function load(fetchStub) {
  const context = { exports: {}, fetch: fetchStub }
  vm.runInNewContext(js, context, { filename: 'public-image-upload.js' })
  return context.exports
}

test('long mobile image filenames do not exceed the upload path limit', () => {
  const { safePublicImageName } = load(async () => { throw Error('unexpected fetch') })
  const imageName = 'Samsung-Galaxy-Camera-' + 'a'.repeat(120) + '.JPG'
  const safe = safePublicImageName(imageName)
  const pathname = `portfolio/images/${'e'.repeat(36)}-${safe}`
  assert.match(safe, /^[a-zA-Z0-9._-]+$/)
  assert.ok(pathname.length < 150)
  assert.match(safe, /\.jpg$/)
})

test('expired admin session yields a useful error before requesting a token', async () => {
  const { ensurePublicImageUploadReady } = load(async () => ({ status: 401, ok: false }))
  await assert.rejects(ensurePublicImageUploadReady(), /session has expired/i)
})

test('invalid public store is reported separately from the private store', async () => {
  const { ensurePublicImageUploadReady } = load(async () => ({
    status: 200, ok: true,
    json: async () => ({ publicMedia: 'unavailable', privateSubmissions: 'connected' }),
  }))
  await assert.rejects(ensurePublicImageUploadReady(), /public blob storage is unavailable/i)
})

test('connected public Blob passes the preflight check', async () => {
  let calls = 0
  const { ensurePublicImageUploadReady } = load(async () => {
    calls++
    return { status: 200, ok: true, json: async () => ({ publicMedia: 'connected', privateSubmissions: 'not-configured' }) }
  })
  await ensurePublicImageUploadReady()
  assert.equal(calls, 1)
})

test('public upload handler accepts preview aliases as same-origin host', () => {
  const code = fs.readFileSync(path.join(__dirname, '../src/app/api/upload/blob/route.ts'), 'utf8')
  assert.match(code, /allowedHosts\.includes\(originHost\)/)
  assert.match(code, /request\.headers\.get\('host'\)/)
  assert.match(code, /await isAuthenticated\(\)/)
  assert.match(code, /process\.env\.BLOB_READ_WRITE_TOKEN/)
  assert.doesNotMatch(code, /PRIVATE_BLOB_READ_WRITE_TOKEN/)
})
