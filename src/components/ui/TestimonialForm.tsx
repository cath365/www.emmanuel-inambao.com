'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/i18n'

interface TestimonialFormData {
  name: string
  email: string
  role: string
  company: string
  content: string
  rating: number
  videoUrl?: string
}

export default function TestimonialForm() {
  const { language, isRTL } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [activeTab, setActiveTab] = useState<'text' | 'video'>('text')
  
  // Video recording states
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [cameraError, setCameraError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    email: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
  })

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true
        await videoRef.current.play()
      }
    } catch (err) {
      console.error('Camera error:', err)
      setCameraError('Could not access camera. Please allow camera permissions.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const startRecording = useCallback(() => {
    if (!streamRef.current) return
    
    chunksRef.current = []
    
    // Find supported mimeType
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
    ]
    
    let selectedMimeType = ''
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        selectedMimeType = mimeType
        break
      }
    }
    
    const options: MediaRecorderOptions = {}
    if (selectedMimeType) {
      options.mimeType = selectedMimeType
    }
    
    const mediaRecorder = new MediaRecorder(streamRef.current, options)
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }
    
    mediaRecorder.onstop = () => {
      const mimeType = selectedMimeType || 'video/webm'
      const blob = new Blob(chunksRef.current, { type: mimeType })
      setRecordedBlob(blob)
      const url = URL.createObjectURL(blob)
      setRecordedUrl(url)
      stopCamera()
    }
    
    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.start(1000)
    setIsRecording(true)
    setRecordingTime(0)
    
    // Timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 60) { // Max 60 seconds
          stopRecording()
          return prev
        }
        return prev + 1
      })
    }, 1000)
  }, [stopCamera])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsRecording(false)
  }, [])

  const resetRecording = useCallback(() => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl)
    }
    setRecordedBlob(null)
    setRecordedUrl(null)
    setRecordingTime(0)
    startCamera()
  }, [recordedUrl, startCamera])

  const uploadVideo = async (): Promise<string | null> => {
    if (!recordedBlob) return null
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const formData = new FormData()
      formData.append('file', recordedBlob, 'testimonial.webm')
      formData.append('type', 'testimonials')
      
      // Use public upload endpoint (no auth required)
      const response = await fetch('/api/upload/public', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }
      
      const result = await response.json()
      setUploadProgress(100)
      return result.url
    } catch (error) {
      console.error('Upload error:', error)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let videoUrl: string | undefined
      
      // Upload video if recorded
      if (recordedBlob) {
        const uploadedUrl = await uploadVideo()
        if (uploadedUrl) {
          videoUrl = uploadedUrl
        }
      }

      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          videoUrl,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed')
      }

      setSubmitted(true)
      
      // Cleanup and reset
      stopCamera()
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl)
      }
      
      setTimeout(() => {
        setIsOpen(false)
        setSubmitted(false)
        setRecordedBlob(null)
        setRecordedUrl(null)
        setActiveTab('text')
        setFormData({
          name: '',
          email: '',
          role: '',
          company: '',
          content: '',
          rating: 5,
        })
      }, 3000)
    } catch (error) {
      console.error('Testimonial error:', error)
      alert('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTabChange = (tab: 'text' | 'video') => {
    setActiveTab(tab)
    if (tab === 'video' && !recordedUrl) {
      startCamera()
    } else if (tab === 'text') {
      stopCamera()
    }
  }

  const handleClose = () => {
    stopCamera()
    stopRecording()
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl)
    }
    setRecordedBlob(null)
    setRecordedUrl(null)
    setIsOpen(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const labels = {
    en: {
      button: 'Leave a Testimonial',
      title: 'Share Your Experience',
      subtitle: 'Your feedback helps others learn about my work',
      textTab: 'Written',
      videoTab: 'Video',
      name: 'Your Name',
      email: 'Your Email',
      role: 'Your Role/Title',
      company: 'Company/Organization',
      testimonial: 'Your Testimonial',
      rating: 'Rating',
      submit: 'Submit Testimonial',
      submitting: 'Submitting...',
      success: 'Thank you!',
      successMsg: 'Your testimonial has been submitted for review.',
      placeholder: 'Share your experience working with Emmanuel...',
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      reRecord: 'Re-record',
      preview: 'Preview your video',
      maxDuration: 'Max 60 seconds',
      uploading: 'Uploading video...',
      cameraPrompt: 'Click Start to record your video testimonial',
    },
    fr: {
      button: 'Laisser un témoignage',
      title: 'Partagez votre expérience',
      subtitle: 'Vos commentaires aident les autres à découvrir mon travail',
      textTab: 'Écrit',
      videoTab: 'Vidéo',
      name: 'Votre nom',
      email: 'Votre email',
      role: 'Votre rôle/titre',
      company: 'Entreprise/Organisation',
      testimonial: 'Votre témoignage',
      rating: 'Note',
      submit: 'Soumettre le témoignage',
      submitting: 'Envoi en cours...',
      success: 'Merci!',
      successMsg: 'Votre témoignage a été soumis pour examen.',
      placeholder: 'Partagez votre expérience de travail avec Emmanuel...',
      startRecording: 'Commencer l\'enregistrement',
      stopRecording: 'Arrêter',
      reRecord: 'Réenregistrer',
      preview: 'Aperçu de votre vidéo',
      maxDuration: 'Max 60 secondes',
      uploading: 'Téléchargement de la vidéo...',
      cameraPrompt: 'Cliquez sur Démarrer pour enregistrer',
    },
    ar: {
      button: 'اترك شهادة',
      title: 'شارك تجربتك',
      subtitle: 'ملاحظاتك تساعد الآخرين على التعرف على عملي',
      textTab: 'مكتوب',
      videoTab: 'فيديو',
      name: 'اسمك',
      email: 'بريدك الإلكتروني',
      role: 'منصبك/لقبك',
      company: 'الشركة/المنظمة',
      testimonial: 'شهادتك',
      rating: 'التقييم',
      submit: 'إرسال الشهادة',
      submitting: 'جاري الإرسال...',
      success: 'شكراً لك!',
      successMsg: 'تم إرسال شهادتك للمراجعة.',
      placeholder: 'شارك تجربتك في العمل مع إيمانويل...',
      startRecording: 'بدء التسجيل',
      stopRecording: 'إيقاف',
      reRecord: 'إعادة التسجيل',
      preview: 'معاينة الفيديو',
      maxDuration: 'بحد أقصى 60 ثانية',
      uploading: 'جاري رفع الفيديو...',
      cameraPrompt: 'انقر فوق ابدأ لتسجيل شهادتك',
    },
  }

  const t = labels[language as keyof typeof labels] || labels.en

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all text-sm font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        {t.button}
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{t.title}</h2>
                    <p className="text-amber-100 text-sm mt-1">{t.subtitle}</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{t.success}</h3>
                    <p className="text-gray-400">{t.successMsg}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleTabChange('text')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
                          activeTab === 'text' 
                            ? 'bg-amber-500 text-white' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {t.textTab}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTabChange('video')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
                          activeTab === 'video' 
                            ? 'bg-amber-500 text-white' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {t.videoTab}
                      </button>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        {t.rating} *
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <svg
                              className={`w-8 h-8 ${
                                star <= (hoveredStar || formData.rating)
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-gray-600'
                              }`}
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Video Recording Section */}
                    {activeTab === 'video' && (
                      <div className="space-y-3">
                        <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video">
                          {recordedUrl ? (
                            <video
                              src={recordedUrl}
                              controls
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <video
                                ref={videoRef}
                                className="w-full h-full object-cover mirror"
                                style={{ transform: 'scaleX(-1)' }}
                              />
                              {!streamRef.current && !cameraError && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                  <div className="text-center">
                                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-500 text-sm">{t.cameraPrompt}</p>
                                  </div>
                                </div>
                              )}
                              {cameraError && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                  <div className="text-center p-4">
                                    <svg className="w-12 h-12 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="text-red-400 text-sm">{cameraError}</p>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                          
                          {/* Recording indicator */}
                          {isRecording && (
                            <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              {formatTime(recordingTime)} / 1:00
                            </div>
                          )}
                        </div>

                        {/* Video Controls */}
                        <div className="flex gap-2">
                          {!recordedUrl ? (
                            <>
                              {!isRecording ? (
                                <button
                                  type="button"
                                  onClick={streamRef.current ? startRecording : startCamera}
                                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="8" />
                                  </svg>
                                  {streamRef.current ? t.startRecording : t.startRecording}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={stopRecording}
                                  className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <rect x="6" y="6" width="12" height="12" rx="2" />
                                  </svg>
                                  {t.stopRecording}
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={resetRecording}
                              className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              {t.reRecord}
                            </button>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs text-center">{t.maxDuration}</p>
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        {t.name} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        {t.email} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    {/* Role & Company */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          {t.role}
                        </label>
                        <input
                          type="text"
                          value={formData.role}
                          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="CEO, Developer..."
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          {t.company}
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Written Testimonial - only required for text tab */}
                    {activeTab === 'text' && (
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          {t.testimonial} *
                        </label>
                        <textarea
                          required={activeTab === 'text'}
                          rows={4}
                          value={formData.content}
                          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                          placeholder={t.placeholder}
                        />
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploading || (activeTab === 'video' && !recordedBlob)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting || isUploading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {isUploading ? t.uploading : t.submitting}
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          {t.submit}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
