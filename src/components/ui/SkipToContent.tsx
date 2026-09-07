'use client'

import { useLanguage } from '@/lib/i18n'

export default function SkipToContent() {
  const { t } = useLanguage()

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-sky focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-brand-navy focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-camel focus:ring-offset-2 focus:ring-offset-brand-navy"
    >
      {t('a11y.skipToContent')}
    </a>
  )
}
