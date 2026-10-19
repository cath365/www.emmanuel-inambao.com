'use client'

/**
 * Check the authenticated public Blob connection before requesting a client token.
 * A missing/invalid token or expired session should never be hidden behind the
 * @vercel/blob generic "Failed to retrieve the client token" error.
 */
export async function ensurePublicImageUploadReady(): Promise<void> {
  let response: Response
  try {
    response = await fetch('/api/admin/storage-health', {
      credentials: 'same-origin',
      cache: 'no-store',
    })
  } catch {
    throw new Error('The image upload service could not be reached. Check your connection and retry.')
  }

  if (response.status === 401) {
    throw new Error('Your admin session has expired. Sign in again, then retry the image upload.')
  }
  if (!response.ok) {
    throw new Error('The image upload service could not confirm storage access. Refresh the admin dashboard and retry.')
  }

  const status = await response.json().catch(() => null) as { publicMedia?: string } | null
  if (status?.publicMedia !== 'connected') {
    throw new Error(
      status?.publicMedia === 'not-configured'
        ? 'Public Blob storage is not configured for this deployment. Check BLOB_READ_WRITE_TOKEN and redeploy.'
        : 'Public Blob storage is unavailable. Check that BLOB_READ_WRITE_TOKEN belongs to your PUBLIC store, then redeploy.'
    )
  }
}

export function safePublicImageName(name: string): string {
  // The endpoint limits path length, and some phone camera filenames are long.
  // Leave room for the UUID and extension.
  const extension = name.match(/\.(jpg|jpeg|png|webp|gif|avif)$/i)?.[0]?.toLowerCase() || ''
  const stem = name.slice(0, name.length - extension.length)
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .slice(0, 65)
    .replace(/^\.+/, '') || 'image'
  return stem + extension
}
