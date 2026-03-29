import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

const ADMIN_EMAIL = 'denuelinambao@gmail.com'
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
  try {
    const { blobs } = await list({ prefix: BOOKINGS_BLOB_PATH, token: process.env.BLOB_READ_WRITE_TOKEN })
    if (blobs.length === 0) return []
    const res = await fetch(blobs[0].url, { cache: 'no-store' })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

async function writeBookings(bookings: BookingData[]) {
  await put(BOOKINGS_BLOB_PATH, JSON.stringify(bookings), {
    access: 'public',
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })
}

// GET - fetch all bookings for admin panel
export async function GET() {
  try {
    const bookings = await readBookings()
    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Failed to read bookings:', error)
    return NextResponse.json({ bookings: [] })
  }
}

// PATCH - update booking status
export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    const bookings = await readBookings()
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b)
    await writeBookings(updated)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update booking:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

// DELETE - remove a booking
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const bookings = await readBookings()
    const updated = bookings.filter(b => b.id !== id)
    await writeBookings(updated)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete booking:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

// POST - create new booking
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.name || !data.email || !data.date || !data.time) {
      return NextResponse.json(
        { error: 'Name, email, date, and time are required' },
        { status: 400 }
      )
    }

    // Save to Vercel Blob
    const newBooking: BookingData = {
      id: `booking-${Date.now()}`,
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

    const existing = await readBookings()
    await writeBookings([newBooking, ...existing])

    // Send email notification via Web3Forms
    const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY
    if (WEB3FORMS_KEY) {
      const bookingDetails = `📅 NEW BOOKING\n\n👤 ${data.name}\n📧 ${data.email}\n📱 ${data.phone || 'Not provided'}\n\n📆 ${data.date} at ${data.time}\n🌍 ${data.timezone}\n⏱️ ${data.duration} min\n📝 ${data.topic || 'Not specified'}`

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `🗓️ New Booking: ${data.name} — ${data.date} at ${data.time}`,
          from_name: 'Portfolio Booking System',
          name: data.name,
          email: data.email,
          message: bookingDetails,
        }),
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed! Check your email for details.',
    })

  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to process booking. Please try again.' },
      { status: 500 }
    )
  }
}
