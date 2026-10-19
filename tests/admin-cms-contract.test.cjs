// Zero-dependency source contract tests. These don't replace deployment E2E tests.
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8')

test('Admin text editor saves published data, and public sections read the same provider', () => {
  const editor = read('src/components/admin/SiteContentEditor.tsx')
  const provider = read('src/lib/site-content.tsx')
  assert.match(editor, /await saveContent\(draft\)/)
  assert.match(provider, /persistPortfolioData\('siteContent', value\)/)
  assert.match(provider, /fetch\('\/api\/portfolio-data\?key=siteContent'/)
  for (const section of ['About', 'HowIWork', 'FAQ', 'EngineeringDirection']) {
    assert.match(read(`src/components/sections/${section}.tsx`), /useSiteContent\(\)/)
  }
})

test('media upload uses session-gated public Blob, not client-exposed secrets', () => {
  const handler = read('src/app/api/upload/blob/route.ts')
  const client = read('src/lib/admin-media-upload.ts')
  assert.match(handler, /isAuthenticated\(\)/)
  assert.match(handler, /process\.env\.BLOB_READ_WRITE_TOKEN/)
  assert.doesNotMatch(handler, /PRIVATE_BLOB_READ_WRITE_TOKEN/)
  assert.match(handler, /maximumSizeInBytes: 10 \* 1024 \* 1024/)
  assert.match(client, /fetchMediaLibrary\(\)/)
  assert.match(client, /persistPortfolioData\('mediaLibrary'/)
  assert.doesNotMatch(client, /NEXT_PUBLIC_.*TOKEN/)
})

test('publishing endpoint validates permissions and verifies stored JSON', () => {
  const server = read('src/app/api/portfolio-data/route.ts')
  assert.match(server, /'siteContent'/)
  assert.match(server, /'mediaLibrary'/)
  assert.match(server, /await isAuthenticated\(\)/)
  assert.match(server, /Invalid request origin/)
  assert.match(server, /MAX_PUBLISHED_JSON_BYTES/)
  assert.match(server, /cache: 'no-store'/)
  assert.match(server, /persisted !== payload/)
})

test('engineering direction claims are marked as forward-looking and reference evidence', () => {
  const content = read('src/lib/site-content.tsx')
  const section = read('src/components/sections/EngineeringDirection.tsx')
  assert.match(content, /priorities and goals—not claims of completed outcomes/)
  assert.match(section, /href="\/case-studies"/)
  assert.match(section, /href="\/projects"/)
})

test('published edits invalidate other public tabs without discarding admin drafts', () => {
  const sync = read('src/components/ui/PortfolioPublicationSync.tsx')
  const provider = read('src/components/Providers.tsx')
  assert.match(sync, /addEventListener\('storage'/)
  assert.match(sync, /location\.pathname\.startsWith\('\/admin'\)/)
  assert.match(sync, /location\.reload\(\)/)
  assert.match(provider, /<PortfolioPublicationSync \/>/)
})


test('media uploads can recover a URL when library publishing fails', () => {
  const ui = read('src/components/admin/MediaUploader.tsx')
  assert.match(ui, /setRecoveryUrl\(uploadedUrl\)/)
  assert.match(ui, /Recovery image URL/)
  assert.match(ui, /await fetchMediaLibrary\(\)/)
  assert.match(ui, /image\/avif/)
})

test('private and public storage health remain separate and admin-only', () => {
  const health = read('src/app/api/admin/storage-health/route.ts')
  const storage = read('src/lib/blob-json.ts')
  assert.match(health, /await isAuthenticated\(\)/)
  assert.match(health, /PRIVATE_BLOB_READ_WRITE_TOKEN/)
  assert.match(health, /BLOB_READ_WRITE_TOKEN/)
  assert.match(storage, /access === 'private' \? 'PRIVATE_BLOB_READ_WRITE_TOKEN' : 'BLOB_READ_WRITE_TOKEN'/)
})
