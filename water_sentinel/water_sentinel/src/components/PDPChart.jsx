import React, { useState } from 'react'
import Plot from 'react-plotly.js'

const TARGET_SHORT = {
  'Dissolved Reactive Phosphorus': 'Fosforo',
  'Electrical Conductance': 'Conductancia',
  'Total Alkalinity': 'Alcalinidad',
}

const FEATURE_LABELS = {
  pet: 'PET (evapotranspiracion)',
  nir: 'NIR (infrarrojo cercano)',
  green: 'Verde',
  swir16: 'SWIR 1.6',
  swir22: 'SWIR 2.2',
  NDMI: 'NDMI (humedad)',
  MNDWI: 'MNDWI (agua)',
  Latitude: 'Latitud',
  Longitude: 'Longitud',
}

export default function PDPChart({ data, features, targets }) {
  const [feat, setFeat] = useState('NDMI')
  const [target, setTarget] = useState('Dissolved Reactive Phosphorus')

  const pdpX = data.pdp[target][feat].x
  const pdpY = data.pdp[target][feat].y
  const range = data.feature_ranges[feat]
  const targetShort = TARGET_SHORT[target] || target

  return (
    <>
      <div className="controls-row">
        <label>
          Variable a explorar
          <select value={feat} onChange={(e) => setFeat(e.target.value)}>
            {features.map((f) => (
              <option key={f} value={f}>
                {FEATURE_LABELS[f] || f}
              </option>
            ))}
          </select>
        </label>
        <label>
          Objetivo a predecir
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            {targets.map((t) => (
              <option key={t} value={t}>
                {TARGET_SHORT[t] || t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="chart-container">
        <Plot
          data={[
            {
              x: pdpX,
              y: pdpY,
              type: 'scatter',
              mode: 'lines',
              line: { color: '#00d4ff', width: 3, shape: 'spline' },
              fill: 'tozeroy',
              fillcolor: 'rgba(0,212,255,0.08)',
              hovertemplate: '%{x:.3f} → %{y:.3f}<extra></extra>',
            },
          ]}
          layout={{
            height: 400,
            template: 'plotly_dark',
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            margin: { l: 70, r: 30, t: 30, b: 60 },
            font: { color: '#98b3c8', family: 'Inter' },
            xaxis: {
              title: `${FEATURE_LABELS[feat] || feat} (escalado)`,
              color: '#98b3c8',
              gridcolor: 'rgba(255,255,255,0.04)',
            },
            yaxis: {
              title: `Prediccion: ${targetShort}`,
              color: '#98b3c8',
              gridcolor: 'rgba(255,255,255,0.04)',
            },
            annotations: [
              {
                text: `Rango real: ${range.min} a ${range.max}`,
                xref: 'paper',
                yref: 'paper',
                x: 0.98,
                y: 0.98,
                showarrow: false,
                font: { color: '#5d7388', size: 11 },
                xanchor: 'right',
              },
            ],
          }}
          config={{ displayModeBar: false }}
          style={{ width: '100%' }}
        />
      </div>
    </>
  )
}
