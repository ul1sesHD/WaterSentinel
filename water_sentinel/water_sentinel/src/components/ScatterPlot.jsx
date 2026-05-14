import React, { useState, useMemo } from 'react'
import Plot from 'react-plotly.js'

const VAR_LABELS = {
  pet: 'PET',
  nir: 'NIR',
  green: 'Verde',
  swir16: 'SWIR 1.6',
  swir22: 'SWIR 2.2',
  NDMI: 'NDMI',
  MNDWI: 'MNDWI',
  Latitude: 'Latitud',
  Longitude: 'Longitud',
  'Total Alkalinity': 'Alcalinidad',
  'Electrical Conductance': 'Conductancia',
  'Dissolved Reactive Phosphorus': 'Fosforo',
}

export default function ScatterPlot({ data, allVars }) {
  const [varX, setVarX] = useState('Latitude')
  const [varY, setVarY] = useState('Dissolved Reactive Phosphorus')
  const [varColor, setVarColor] = useState('Electrical Conductance')

  const corr = useMemo(() => {
    const xs = data.map((d) => d[varX])
    const ys = data.map((d) => d[varY])
    const n = xs.length
    const mx = xs.reduce((a, b) => a + b) / n
    const my = ys.reduce((a, b) => a + b) / n
    const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0)
    const dx = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0))
    const dy = Math.sqrt(ys.reduce((s, y) => s + (y - my) ** 2, 0))
    return (num / (dx * dy)).toFixed(4)
  }, [data, varX, varY])

  return (
    <>
      <div className="controls-row">
        <label>
          Eje X
          <select value={varX} onChange={(e) => setVarX(e.target.value)}>
            {allVars.map((v) => (
              <option key={v} value={v}>{VAR_LABELS[v] || v}</option>
            ))}
          </select>
        </label>
        <label>
          Eje Y
          <select value={varY} onChange={(e) => setVarY(e.target.value)}>
            {allVars.map((v) => (
              <option key={v} value={v}>{VAR_LABELS[v] || v}</option>
            ))}
          </select>
        </label>
        <label>
          Color por
          <select value={varColor} onChange={(e) => setVarColor(e.target.value)}>
            {allVars.map((v) => (
              <option key={v} value={v}>{VAR_LABELS[v] || v}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="chart-container">
        <Plot
          data={[{
            x: data.map((d) => d[varX]),
            y: data.map((d) => d[varY]),
            type: 'scattergl',
            mode: 'markers',
            marker: {
              color: data.map((d) => d[varColor]),
              colorscale: 'Viridis',
              size: 4,
              opacity: 0.65,
              colorbar: {
                title: { text: VAR_LABELS[varColor] || varColor, font: { color: '#98b3c8' } },
                thickness: 12,
                tickfont: { color: '#98b3c8', size: 10 },
              },
            },
            hovertemplate: `${VAR_LABELS[varX] || varX}: %{x:.2f}<br>${VAR_LABELS[varY] || varY}: %{y:.2f}<extra></extra>`,
          }]}
          layout={{
            height: 450,
            template: 'plotly_dark',
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            margin: { l: 65, r: 20, t: 10, b: 55 },
            font: { color: '#98b3c8', family: 'Inter' },
            xaxis: { title: VAR_LABELS[varX] || varX, color: '#98b3c8', gridcolor: 'rgba(255,255,255,0.04)' },
            yaxis: { title: VAR_LABELS[varY] || varY, color: '#98b3c8', gridcolor: 'rgba(255,255,255,0.04)' },
          }}
          config={{ displayModeBar: false }}
          style={{ width: '100%' }}
        />
      </div>

      <p className="correlation-label">
        Correlacion {VAR_LABELS[varX] || varX} vs {VAR_LABELS[varY] || varY}: <strong>{corr}</strong>
      </p>
    </>
  )
}
