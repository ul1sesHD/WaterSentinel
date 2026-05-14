import React, { useEffect, useState } from 'react'

export default function IntroSplash({ onFinish }) {
  const [phase, setPhase] = useState('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 900)
    const t2 = setTimeout(() => setPhase('out'), 2100)
    const t3 = setTimeout(() => onFinish && onFinish(), 3000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onFinish])

  return (
    <div className={`splash splash-${phase}`}>
      <div className="splash-bg" />
      <div className="splash-rays" />
      <div className="splash-content">
        <div className="splash-mark">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <defs>
              <radialGradient id="dropG" cx="0.3" cy="0.3">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.5" stopColor="#00d4ff" />
                <stop offset="1" stopColor="#0066aa" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M32 6c-9 14-16 22-16 32a16 16 0 0032 0c0-10-7-18-16-32z"
              fill="url(#dropG)"
              stroke="#00d4ff"
              strokeWidth="0.6"
              filter="url(#glow)"
            />
          </svg>
        </div>
        <h1 className="splash-title">
          Water<span className="splash-title-accent"> Sentinel</span>
        </h1>
        <div className="splash-line" />
        <p className="splash-subtitle">Monitoreo Inteligente · Sudafrica</p>
      </div>
    </div>
  )
}
