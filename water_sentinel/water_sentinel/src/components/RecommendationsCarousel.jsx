import React, { useState, useEffect } from 'react'

const RECOMMENDATIONS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    accent: 'success',
    eyebrow: 'PRODUCCION',
    title: 'Random Forest como motor principal',
    body:
      'Usar RF como el modelo desplegado en produccion. Reentrenar trimestralmente con nuevos datos satelitales y mantener XGBoost como referencia secundaria de validacion cruzada.',
    metric: { value: '0.78', label: 'R² promedio' },
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <circle cx="12" cy="16" r="0.5" fill="currentColor" />
      </svg>
    ),
    accent: 'warning',
    eyebrow: 'PRIORIDAD',
    title: 'Priorizar el fosforo (DRP)',
    body:
      'El fosforo tiene el R² mas bajo (0.67) — es el parametro mas dificil de predecir. Recolectar mas muestras fisicas en las estaciones criticas para enriquecer el modelo.',
    metric: { value: '0.67', label: 'R² fosforo' },
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
      </svg>
    ),
    accent: 'cyan',
    eyebrow: 'GEOLOCALIZACION',
    title: 'Sistema de alertas geograficas',
    body:
      'Implementar alertas automatizadas para las 6 estaciones criticas detectadas en el dashboard. Avisos en tiempo real cuando la prediccion del modelo supere umbrales ambientales criticos.',
    metric: { value: '6', label: 'Estaciones criticas' },
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 12h6m4 0h6M12 4v6m0 4v6" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    accent: 'purple',
    eyebrow: 'AUTOMATIZACION',
    title: 'Pipeline satelital automatizado',
    body:
      'Conectar la API de Landsat para reentrenamiento mensual automatico. Estimamos reducir el costo de monitoreo tradicional aproximadamente un 70%, manteniendo precision superior al benchmark EY.',
    metric: { value: '70%', label: 'Reduccion de costo' },
  },
]

export default function RecommendationsCarousel() {
  const [idx, setIdx] = useState(0)
  const [direction, setDirection] = useState(1)

  const next = () => {
    setDirection(1)
    setIdx((idx + 1) % RECOMMENDATIONS.length)
  }
  const prev = () => {
    setDirection(-1)
    setIdx((idx - 1 + RECOMMENDATIONS.length) % RECOMMENDATIONS.length)
  }

  // Auto-rotate every 8 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1)
      setIdx((i) => (i + 1) % RECOMMENDATIONS.length)
    }, 8000)
    return () => clearInterval(id)
  }, [])

  const current = RECOMMENDATIONS[idx]

  return (
    <div className="rec-carousel">
      <button
        className="rec-nav rec-nav-prev"
        onClick={prev}
        aria-label="Anterior"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="rec-track">
        <div
          key={idx}
          className={`rec-card-big rec-accent-${current.accent}`}
          data-direction={direction}
        >
          <div className="rec-card-glow" />
          <div className="rec-card-grid" />
          <div className="rec-card-content">
            <div className="rec-card-icon">{current.icon}</div>
            <div className="rec-card-eyebrow">{current.eyebrow}</div>
            <h3 className="rec-card-title">{current.title}</h3>
            <p className="rec-card-body">{current.body}</p>
            <div className="rec-card-footer">
              <div className="rec-card-metric">
                <span className="rec-card-metric-value">{current.metric.value}</span>
                <span className="rec-card-metric-label">{current.metric.label}</span>
              </div>
              <div className="rec-card-pagination">
                {RECOMMENDATIONS.map((_, i) => (
                  <button
                    key={i}
                    className={`rec-dot ${i === idx ? 'active' : ''}`}
                    onClick={() => {
                      setDirection(i > idx ? 1 : -1)
                      setIdx(i)
                    }}
                    aria-label={`Ir a ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="rec-nav rec-nav-next"
        onClick={next}
        aria-label="Siguiente"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  )
}
