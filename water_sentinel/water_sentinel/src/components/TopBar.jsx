import React, { useEffect, useState } from 'react'

export default function TopBar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const dateStr = time.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const timeStr = time.toLocaleTimeString('es-MX', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-logo">
          <img src="/LogoEy.png" alt="EY" className="topbar-ey-logo" />
          <span className="topbar-divider topbar-divider-tall" />
          <span className="topbar-brand">WATER SENTINEL</span>
        </div>
        <span className="topbar-divider" />
        <span className="topbar-subtitle">Monitoreo de Calidad de Agua · Sudafrica</span>
      </div>

      <div className="topbar-right">
        <div className="topbar-status">
          <span className="status-dot" />
          <span>SISTEMA EN LINEA</span>
        </div>
        <span className="topbar-divider" />
        <div className="topbar-time">
          <span className="topbar-date">{dateStr}</span>
          <span className="topbar-clock">{timeStr}</span>
        </div>
      </div>
    </div>
  )
}
