import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth-helpers'
import { readPrivateJson, readPublicJson, storageError } from '@/lib/blob-json'
import { emailConfiguration } from '@/lib/notifications'
import { cloudinaryConfig } from '@/lib/cloudinary-config'

export const dynamic = 'force-dynamic'
export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // Cheap single-file reads (not list(), a billed advanced operation) prove each store is reachable.
  const probes = {
    public: () => readPublicJson('data/portfolio/profile.json'),
    private: () => readPrivateJson('data/leads.json', []),
  }
  const checks = await Promise.all((['public', 'private'] as const).map(async access => {
    try {
      await probes[access]()
      return { name: `${access} Blob`, ok: true, detail: 'Store reachable for reads. Writes still need a save check.' }
    } catch { return { name: `${access} Blob`, ok: false, detail: storageError(access) } }
  }))
  const email = emailConfiguration()
  checks.push({ name: 'Owner email notifications', ok: Object.values(email).some(Boolean),
    detail: [email.resend && 'Resend configured', email.formspree && 'Formspree configured', email.web3forms && 'Web3Forms browser fallback configured'].filter(Boolean).join('; ') || 'Configure WEB3FORMS_ACCESS_KEY, FORMSPREE_ID, or RESEND_API_KEY with EMAIL_FROM.' })
  checks.push({ name: 'Video and photo uploads', ok: Boolean(cloudinaryConfig()), detail: cloudinaryConfig() ? 'Cloudinary credentials present. Confirm with an upload.' : 'Configure CLOUDINARY_URL or all three CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET variables.' })
  return NextResponse.json({ checks, note: 'No test emails were sent. Configuration does not confirm inbox delivery.' }, { headers: { 'Cache-Control': 'no-store' } })
}
