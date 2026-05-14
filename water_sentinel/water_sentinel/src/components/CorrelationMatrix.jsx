import React, { useMemo } from 'react'
import Plot from 'react-plotly.js'

const SHORT = {
  'Dissolved Reactive Phosphorus': 'Fosforo',
  'Electrical Conductance': 'Conductancia',
  'Total Alkalinity': 'Alcalinidad',
}

export default function CorrelationMatrix({ data }) {
  const labels = data.columns.map((c) => SHORT[c] || c)

  const topPairs = useMemo(() => {
    const pairs = []
    for (let i = 0; i < data.columns.length; i++) {
      for (let j = i + 1; j < data.columns.length; j++) {
        pairs.push({
          a: SHORT[data.columns[i]] || data.columns[i],
          b: SHORT[data.columns[j]] || data.columns[j],
          v: data.values[i][j],
        })
      }
    }
    return pairs.sort((x, y) => Math.abs(y.v) - Math.abs(x.v)).slice(0, 8)
  }, [data])

  return (
    <div className="correlation-stack">
      {/* Row 1: Heatmap full width */}
      <div className="correlation-matrix-wrap">
        <Plot
          data={[
            {
              z: data.values,
              x: labels,
              y: labels,
              type: 'heatmap',
              colorscale: 'RdBu',
              reversescale: true,
              zmid: 0,
              zmin: -1,
              zmax: 1,
              text: data.values.map((row) => row.map((v) => v.toFixed(2))),
              texttemplate: '%{text}',
              hovertemplate: '%{x} vs %{y}<br>Correlacion: %{z:.3f}<extra></extra>',
            },
          ]}
          layout={{
            height: 560,
            template: 'plotly_dark',
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            margin: { l: 110, r: 30, t: 20, b: 110 },
            font: { color: '#c8d8e8', family: 'Inter', size: 14 },
            xaxis: { tickangle: 45, color: '#c8d8e8', tickfont: { size: 14 } },
            yaxis: { color: '#c8d8e8', tickfont: { size: 14 } },
          }}
          config={{ displayModeBar: false }}
          style={{ width: '100%' }}
        />
      </div>

      {/* Row 2: Top correlations in a horizontal grid */}
      <div className="correlation-pairs-block">
        <div className="correlation-pairs-head">
          <span className="card-eyebrow">RELACIONES MAS FUERTES</span>
          <p className="correlation-side-desc">
            Las 8 parejas con mayor correlacion (positiva o negativa)
          </p>
        </div>
        <div className="correlation-pairs-row">
          {topPairs.map((p, i) => {
            const isPositive = p.v >= 0
            const intensity = Math.abs(p.v)
            return (
              <div key={i} className="correlation-pair" style={{ '--idx': i }}>
                <div className="correlation-pair-top">
                  <span className="correlation-pair-rank">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={isPositive ? 'text-positive' : 'text-negative'}>
                    {p.v > 0 ? '+' : ''}
                    {p.v.toFixed(3)}
                  </span>
                </div>
                <div className="correlation-pair-text">
                  <span className={`neon-text ${isPositive ? 'neon-positive' : 'neon-negative'}`}>
                    {p.a}
                  </span>
                  <span className="correlation-pair-op">
                    {isPositive ? '↗' : '↘'}
                  </span>
                  <span className={`neon-text ${isPositive ? 'neon-positive' : 'neon-negative'}`}>
                    {p.b}
                  </span>
                </div>
                <div className="correlation-pair-bar">
                  <div
                    className={`correlation-pair-bar-fill ${isPositive ? 'pos' : 'neg'}`}
                    style={{ width: `${intensity * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
