import React from 'react'
import Globe from './Globe'

const NAV_ITEMS = [
  {
    id: 'historia',
    label: 'Historia',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="8" y1="16" x2="12" y2="16" />
      </svg>
    ),
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    id: 'relaciones',
    label: 'Relaciones',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
      </svg>
    ),
  },
  {
    id: 'pdp',
    label: 'PDP',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 17l4-6 4 3 5-8 5 6" />
        <path d="M3 21h18" />
      </svg>
    ),
  },
  {
    id: 'recomendaciones',
    label: 'Conclusiones',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
]

export default function Hero({ stations }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero">
      <div className="hero-bg-grid" />
      <div className="hero-noise" />

      <div className="hero-globe">
        <Globe stations={stations} />
      </div>

      <div className="hero-content">
        <div className="hero-tag">
          <span className="hero-tag-dot" />
          SOUTH AFRICA · LIVE MONITORING
        </div>
        <h1 className="hero-title">
          Water<br />
          <span className="hero-title-accent">Sentinel</span>
        </h1>
        <p className="hero-subtitle">
          Inteligencia satelital para predecir y proteger
          la calidad del agua en los rios de Sudafrica.
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">{stations?.length || 162}</div>
            <div className="hero-stat-label">Estaciones</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <div className="hero-stat-value">9.3K</div>
            <div className="hero-stat-label">Muestras</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <div className="hero-stat-value">0.85</div>
            <div className="hero-stat-label">Mejor R²</div>
          </div>
        </div>

        <button className="hero-cta" onClick={() => scrollTo('historia')}>
          Comenzar el recorrido
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <nav className="hero-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className="hero-nav-btn"
            onClick={() => scrollTo(item.id)}
            aria-label={item.label}
          >
            <span className="hero-nav-icon">{item.icon}</span>
            <span className="hero-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

    </section>
  )
}
