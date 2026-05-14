import React from 'react'

const TEAM = [
  { name: 'Alejandra Roa Alonso', role: 'Data Analysis · EDA' },
  { name: 'Hector Ulises Hernandez Dominguez', role: 'ML Engineering · Frontend' },
  { name: 'Katia Marcela Carpio Dominguez', role: 'Data Pipeline · Visualizacion' },
  { name: 'Juan Manuel Palafox Valdes', role: 'Modeling · Evaluacion' },
]

const PROFESSOR = {
  name: 'Juan Damian Silva Galindo',
  role: 'Profesor · Analitica de Grandes Volumenes de Datos',
}

export default function Credits() {
  return (
    <div className="credits-section">
      <div className="credits-header">
        <div className="credits-eyebrow">EL EQUIPO</div>
        <h2 className="credits-title">Quienes construimos Water Sentinel</h2>
        <p className="credits-desc">
          Proyecto final del 8vo semestre — Analitica y Ciencia de Grandes Volumenes de Datos
        </p>
      </div>

      <div className="credits-grid">
        {TEAM.map((member, i) => (
          <div key={i} className="glass-card credit-card" style={{ '--idx': i }}>
            <div className="credit-avatar">
              <span className="credit-initials">
                {member.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
              </span>
              <div className="credit-avatar-ring" />
            </div>
            <div className="credit-name">{member.name}</div>
            <div className="credit-role">{member.role}</div>
          </div>
        ))}
      </div>

      <div className="credits-professor">
        <div className="credits-divider" />
        <div className="glass-card credit-card credit-card-professor">
          <div className="credit-avatar credit-avatar-prof">
            <span className="credit-initials">
              {PROFESSOR.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
            </span>
            <div className="credit-avatar-ring" />
          </div>
          <div>
            <div className="credit-name">{PROFESSOR.name}</div>
            <div className="credit-role">{PROFESSOR.role}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
