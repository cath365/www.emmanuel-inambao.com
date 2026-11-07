import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Emmanuel Inambao: Robotics & IoT Engineer, Full-Stack Systems Developer, Technical Project Manager'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Shared-link preview for WhatsApp, LinkedIn, X and search results.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 60%, #10243E 100%)',
          color: '#F7F5EF',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            EI
          </div>
          <div style={{ fontSize: 26, color: '#94a3b8', letterSpacing: 4, textTransform: 'uppercase' }}>
            Lusaka, Zambia
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>Emmanuel Inambao</div>
          <div style={{ marginTop: 24, fontSize: 36, color: '#cbd5e1', lineHeight: 1.3 }}>
            Robotics &amp; IoT Engineer · Full-Stack Systems Developer · Technical Project Manager
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, fontSize: 24, color: '#93c5fd' }}>
          <span>ESP32 &amp; embedded systems</span>
          <span style={{ color: '#475569' }}>/</span>
          <span>Web &amp; mobile platforms</span>
          <span style={{ color: '#475569' }}>/</span>
          <span>Prototype to deployment</span>
        </div>
      </div>
    ),
    size
  )
}
