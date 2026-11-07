import type { SVGProps } from 'react'

// lucide-react has no TikTok icon; this matches its 24px stroke style.
export default function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 4 4V3c.6 2.6 2.6 4.6 5 5" />
    </svg>
  )
}
