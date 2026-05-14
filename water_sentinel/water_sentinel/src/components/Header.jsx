import React from 'react'
import Plot from 'react-plotly.js'

export default function Header({ stations, models, targets }) {
  const bestR2 = Math.max(...targets.map(t => models.metrics.rf[t].r2))
  const rfR2 = targets.map(t => models.metrics.rf[t].r2)
  const xgbR2 = targets.map(t => models.metrics.xgb[t].r2)

  return (
    <header className="header">
      <div className="header-top">
        <h1 className="logo">Water Sentinel</h1>
        <p className="subtitle">Monitoreo de Calidad de Agua en Sudafrica</p>
      </div>

      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-value">{stations.length}</div>
          <div className="metric-label">Estaciones</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">9,319</div>
          <div className="metric-label">Muestras</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{bestR2.toFixed(4)}</div>
          <div className="metric-label">Mejor R²</div>
        </div>
        <div className="metric-card">
          <div className="metric-value accent-green">Random Forest</div>
          <div className="metric-label">Modelo Ganador</div>
        </div>
      </div>

      <div className="chart-container">
        <Plot
          data={[
            {
              y: targets,
              x: rfR2,
              type: 'bar',
              orientation: 'h',
              name: 'Random Forest',
              marker: { color: '#2ed573' }
            },
            {
              y: targets,
              x: xgbR2,
              type: 'bar',
              orientation: 'h',
              name: 'XGBoost',
              marker: { color: '#3498db' }
            },
          ]}
          layout={{
            barmode: 'group',
            height: 220,
            template: 'plotly_dark',
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            margin: { l: 200, r: 20, t: 10, b: 30 },
            xaxis: { title: 'R Square', range: [0, 1] },
            legend: { orientation: 'h', y: 1.15 },
            shapes: [
              {
                type: 'line',
                x0: 0.20,
                x1: 0.20,
                y0: -0.5,
                y1: 2.5,
                line: { color: '#ff4757', dash: 'dash', width: 2 }
              }
            ],
            annotations: [
              {
                x: 0.22,
                y: 2.5,
                text: 'Benchmark EY',
                showarrow: false,
                font: { color: '#ff4757', size: 11 }
              }
            ],
          }}
          config={{ displayModeBar: false }}
          style={{ width: '100%' }}
        />
      </div>
    </header>
  )
}
