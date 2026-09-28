import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth-helpers'
import { readPrivateJson, readPublicJson, updatePrivateJson, storageError } from '@/lib/blob-json'
import { submissionResponse } from '@/lib/notifications'
import { testimonialMediaUrl } from '@/lib/cloudinary-config'
import { rateLimit, getClientIP } from '@/lib/rate-limit'
import type { Testimonial } from '@/lib/testimonials'

export const dynamic = 'force-dynamic'
const PATH = 'data/testimonial-submissions.json'
type StoredTestimonial = Testimonial & { email?: string; deleted?: boolean }

async function allTestimonials(admin: boolean) {
  let legacy: Testimonial[] = []
  let submitted: StoredTestimonial[] = []
  try { legacy = await readPublicJson<Testimonial[]>('data/portfolio/testimonials.json') || [] }
  catch (error) { if (admin) throw error; console.error('Published testimonials unavailable') }
  try { submitted = await readPrivateJson<StoredTestimonial[]>(PATH, []) }
  catch (error) { if (admin) throw error; console.error('Submitted testimonials unavailable') }
  const merged = new Map<string, StoredTestimonial>()
  for (const entry of legacy) merged.set(entry.id, { ...entry, status: entry.status || 'approved' })
  for (const entry of submitted) merged.set(entry.id, entry)
  return Array.from(merged.values()).filter(entry => !entry.deleted && (admin || entry.status === 'approved'))
    .map(({ email, deleted, ...entry }) => entry)
}

export async function GET() {
  try {
    return NextResponse.json(await allTestimonials(await isAuthenticated()), { headers: { 'Cache-Control': 'no-store' } })
  } catch { return NextResponse.json({ error: storageError('private') }, { status: 503 }) }
}

export async function POST(request: NextRequest) {
  if (!rateLimit(`testimonial:${getClientIP(request)}`, 5, 15 * 60 * 1000).allowed) {
    return NextResponse.json({ error: 'Too many submissions. Please try later.' }, { status: 429 })
  }
  const data = await request.json().catch(() => null)
  const name = typeof data?.name === 'string' ? data.name.trim() : ''
  const email = typeof data?.email === 'string' ? data.email.trim().toLowerCase() : ''
  const content = typeof data?.content === 'string' ? data.content.trim() : ''
  if (!name || name.length > 200 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || content.length > 10000 || !Number.isInteger(data?.rating) || data.rating < 1 || data.rating > 5) {
    return NextResponse.json({ error: 'Enter a name, valid email, and a rating from 1 to 5.' }, { status: 400 })
  }
  let video: string | undefined
  let image: string | undefined
  try { video = testimonialMediaUrl(data.videoUrl, 'video'); image = testimonialMediaUrl(data.photo, 'image') }
  catch { return NextResponse.json({ error: 'The media upload could not be verified. Please upload it again.' }, { status: 400 }) }
  if (!content && !video) return NextResponse.json({ error: 'Add a written testimonial or a video.' }, { status: 400 })
  const entry: StoredTestimonial = {
    id: `testimonial-${crypto.randomUUID()}`, name, email, content, video, image,
    position: String(data.role || '').slice(0, 200), company: String(data.company || '').slice(0, 200),
    rating: data.rating, status: 'pending', featured: false, submittedAt: new Date().toISOString(),
  }
  try { await updatePrivateJson<StoredTestimonial[]>(PATH, [], previous => [entry, ...previous]) }
  catch (error) {
    console.error('Testimonial save failed:', error)
    return NextResponse.json({ error: 'Your testimonial could not be saved. Please try again later.' }, { status: 503 })
  }
  return submissionResponse(true, {
    name, email, subject: `Testimonial awaiting review: ${name}`,
    message: `Name: ${name}\nEmail: ${email}\nRating: ${data.rating}/5\n${content}\n${video || ''}\nReview this submission in Admin → Testimonials.`,
  }, 'Thank you. Your testimonial has been saved and is awaiting review.')
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await request.json().catch(() => null)
  const entry = data?.testimonial as Testimonial | undefined
  if (!entry || typeof entry.id !== 'string' || !entry.name || !['pending', 'approved', 'rejected'].includes(entry.status) || !Number.isInteger(entry.rating) || entry.rating < 1 || entry.rating > 5) {
    return NextResponse.json({ error: 'Invalid testimonial.' }, { status: 400 })
  }
  try {
    await updatePrivateJson<StoredTestimonial[]>(PATH, [], entries => {
      const previous = entries.find(item => item.id === entry.id)
      const updated = { ...entry, email: previous?.email, deleted: false }
      return [updated, ...entries.filter(item => item.id !== entry.id)]
    })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: storageError('private') }, { status: 503 }) }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await request.json().catch(() => null)
  if (typeof data?.id !== 'string') return NextResponse.json({ error: 'Invalid testimonial.' }, { status: 400 })
  try {
    const entries = await allTestimonials(true)
    const existing = entries.find(item => item.id === data.id)
    if (!existing) return NextResponse.json({ error: 'Testimonial not found.' }, { status: 404 })
    await updatePrivateJson<StoredTestimonial[]>(PATH, [], current => [{ ...existing, deleted: true }, ...current.filter(item => item.id !== data.id)])
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: storageError('private') }, { status: 503 }) }
}
