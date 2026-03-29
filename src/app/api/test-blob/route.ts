import { NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

export async function GET() {
  const results: Record<string, unknown> = {}

  // Check if token exists
  results.hasToken = !!process.env.BLOB_READ_WRITE_TOKEN
  results.tokenPrefix = process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 20) + '...'

  // Try writing
  try {
    await put('data/test.json', JSON.stringify({ test: true, time: new Date().toISOString() }), {
      access: 'private',
      addRandomSuffix: false,
    })
    results.writeSuccess = true
  } catch (e) {
    results.writeError = String(e)
  }

  // Try listing
  try {
    const { blobs } = await list({ prefix: 'data/' })
    results.listSuccess = true
    results.blobCount = blobs.length
    results.blobs = blobs.map(b => ({ pathname: b.pathname, url: b.url }))
  } catch (e) {
    results.listError = String(e)
  }

  return NextResponse.json(results)
}
