import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { isAuthenticated } from '@/lib/auth-helpers'

import { readPublicJson, storageError } from '@/lib/blob-json'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const ALLOWED_KEYS = ['profile', 'projects', 'testimonials', 'certifications', 'experiences', 'services', 'gallery', 'resources', 'audio', 'skills', 'caseStudies', 'marketPricing']

function blobPath(key: string) {
  return `data/portfolio/${key}.json`
}

async function readSection(key: string) {
  return readPublicJson<unknown>(blobPath(key))
}

async function writeSection(key: string, data: unknown) {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  if (!token) {
    throw new Error(
      'Portfolio publishing is not configured. Add BLOB_READ_WRITE_TOKEN to the Production environment in Vercel, then redeploy.'
    )
  }

  const payload = JSON.stringify(data)
  const blob = await put(blobPath(key), payload, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    token,
  })

  const verifyUrl = new URL(blob.url)
  verifyUrl.searchParams.set('v', String(Date.now()))
  const verification = await fetch(verifyUrl, { cache: 'no-store' })

  if (!verification.ok) {
    throw new Error(`Blob write verification failed with status ${verification.status}.`)
  }

  const persisted = await verification.text()
  if (persisted !== payload) {
    throw new Error('Blob write verification returned different data.')
  }
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (!key || !ALLOWED_KEYS.includes(key)) {
    return NextResponse.json(null)
  }
  let data
  try { data = await readSection(key) }
  catch (error) {
    console.error('Portfolio data read failed:', error)
    if (await isAuthenticated()) return NextResponse.json({ error: storageError('public') }, { status: 503 })
    data = null
  }
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  })
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { key, data } = await request.json()
    if (!key || !ALLOWED_KEYS.includes(key)) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 })
    }
    await writeSection(key, data)
    return NextResponse.json(
      { success: true, key, publishedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Portfolio data save failed:', message)
    return NextResponse.json({ error: storageError('public') }, { status: 503 })
  }
}
