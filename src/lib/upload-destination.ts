// Shared by /api/upload (server-side upload) and /api/upload/sign (direct browser upload)
// so both paths store files in the same Cloudinary folders.
export function uploadDestination(type: string, fileName: string, projectId?: string | null) {
  let folder = 'portfolio/uploads'
  let publicId = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^/.]+$/, '')}`

  if (type === 'profile') {
    folder = 'portfolio/profile'
    publicId = 'profile-picture'
  } else if (type === 'cover') {
    folder = 'portfolio/profile'
    publicId = 'cover-banner'
  } else if (type === 'cv') {
    folder = 'portfolio/cv'
    publicId = `cv-${Date.now()}`
  } else if (type === 'project' && projectId) {
    folder = 'portfolio/projects'
    publicId = `project-${projectId.replace(/[^a-zA-Z0-9_-]/g, '_')}-${Date.now()}`
  } else if (type === 'video' || type === 'testimonial-video') {
    folder = 'portfolio/videos'
    publicId = `video-${Date.now()}`
  } else if (type === 'audio') {
    folder = 'portfolio/audio'
    publicId = `audio-${Date.now()}`
  } else if (type === 'resource') {
    folder = 'portfolio/resources'
    publicId = `resource-${Date.now()}`
  } else if (type === 'testimonial') {
    folder = 'portfolio/testimonials'
    publicId = `testimonial-${Date.now()}`
  } else if (type === 'certification') {
    folder = 'portfolio/certifications'
    publicId = `certification-${Date.now()}`
  } else if (type === 'experience') {
    folder = 'portfolio/experience'
    publicId = `experience-${Date.now()}`
  } else if (type === 'service') {
    folder = 'portfolio/services'
    publicId = `service-${Date.now()}`
  }

  return { folder, publicId }
}
