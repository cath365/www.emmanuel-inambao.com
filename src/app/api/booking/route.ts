import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth-helpers'

import { readPrivateJson, updatePrivateJson, storageError } from '@/lib/blob-json'
import { submissionResponse } from '@/lib/notifications'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

const BOOKINGS_BLOB_PATH = 'data/bookings.json'

interface BookingData {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  timezone: string
  duration: number
  topic: string
  whatsappConsent?: boolean
  submittedAt: string
  status: 'pending' | 'confirmed' | 'cancelled'
  source: string
}

async function readBookings(): Promise<BookingData[]> {
  return readPrivateJson<BookingData[]>(BOOKINGS_BLOB_PATH, [])
}

// GET - fetch all bookings for admin panel
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const bookings = await readBookings()
    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Failed to read bookings:', error)
    return NextResponse.json({ error: storageError('private') }, { status: 503 })
  }
}

// PATCH - update booking status
export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, status } = await request.json()
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    await updatePrivateJson<BookingData[]>(BOOKINGS_BLOB_PATH, [], bookings => bookings.map(b => b.id === id ? { ...b, status } : b))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update booking:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

// DELETE - remove a booking
export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    await updatePrivateJson<BookingData[]>(BOOKINGS_BLOB_PATH, [], bookings => bookings.filter(b => b.id !== id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete booking:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

// POST - create new booking
export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(`booking:${getClientIP(request)}`, 5, 15 * 60 * 1000).allowed) return NextResponse.json({ error: 'Too many requests. Please try later.' }, { status: 429 })
    const data = await request.json()

    if (typeof data.name !== 'string' || !data.name.trim() || data.name.length > 200 || typeof data.email !== 'string' || data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !data.date || !data.time) {
      return NextResponse.json(
        { error: 'Name, email, date, and time are required' },
        { status: 400 }
      )
    }

    // Save to Vercel Blob (non-critical — don't fail the booking if blob errors)
    const newBooking: BookingData = {
      id: `booking-${crypto.randomUUID()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      date: data.date,
      time: data.time,
      timezone: data.timezone || 'Africa/Lusaka',
      duration: data.duration || 30,
      topic: data.topic || '',
      whatsappConsent: data.whatsappConsent || false,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      source: data.source || 'scheduler',
    }

    let saved = false
    try {
      await updatePrivateJson<BookingData[]>(BOOKINGS_BLOB_PATH, [], existing => [newBooking, ...existing])
      saved = true
    } catch (error) { console.error('Booking storage failed:', error) }
    return submissionResponse(saved, {
      name: newBooking.name, email: newBooking.email,
      subject: `Booking request: ${newBooking.name} — ${newBooking.date} at ${newBooking.time}`,
      message: `Name: ${newBooking.name}\nEmail: ${newBooking.email}\nPhone: ${newBooking.phone}\n${newBooking.date} at ${newBooking.time} (${newBooking.timezone})\n${newBooking.topic}`,
    }, 'Your booking request has been received. Emmanuel will confirm availability.')

  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to process booking. Please try again.' },
      { status: 500 }
    )
  }
}
