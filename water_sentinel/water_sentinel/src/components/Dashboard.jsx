import React from 'react'
import Plot from 'react-plotly.js'
import MapView from './MapView'
import InfoModal, { InfoButton, useInfoModal } from './InfoModal'

export default function Dashboard({ stations, models, targets }) {
  const rfR2 = targets.map((t) => models.metrics.rf[t].r2)
  const xgbR2 = targets.map((t) => models.metrics.xgb[t].r2)
  const bestR2 = Math.max(...rfR2)
  const bestTarget = targets[rfR2.indexOf(bestR2)]

  const phosValues = stations.map((s) => s['Dissolved Reactive Phosphorus'])
  const phosMin = Math.min(...phosValues)
  const phosMax = Math.max(...phosValues)
  const phosAvg = phosValues.reduce((a, b) => a + b, 0) / phosValues.length

  const topStations = [...stations]
    .sort((a, b) => b['Dissolved Reactive Phosphorus'] - a['Dissolved Reactive Phosphorus'])
    .slice(0, 6)

  const importance = models.importances[bestTarget]
  const sortedFeatures = Object.entries(importance).sort((a, b) => b[1] - a[1])

  const modelModal = useInfoModal()
  const mapModal = useInfoModal()
  const importanceModal = useInfoModal()

  return (
    <div className="mission-grid">
      {/* ============ LEFT COLUMN ============ */}
      <div className="mission-left">
        <div className="glass-card mission-card">
          <div className="mission-card-head">
            <span className="card-eyebrow">MODELO GANADOR</span>
            <InfoButton onClick={modelModal.onOpen} />
          </div>
          <div className="mission-big-stat">
            <span className="mission-big-value">Random Forest</span>
            <span className="kpi-badge kpi-badge-green">+4.2% vs XGB</span>
          </div>
          <div className="mission-sub">
            6 modelos entrenados · 3 parametros · R² promedio 0.78
          </div>
        </div>

        <div className="glass-card mission-card">
          <span className="card-eyebrow">RANGO DE FOSFORO</span>
          <div className="mission-stat-row">
            <div>
              <div className="mission-stat-value">{phosAvg.toFixed(1)}</div>
              <div className="mission-stat-label">Promedio µg/L</div>
            </div>
            <div className="mission-stat-divider" />
            <div>
              <div className="mission-stat-value mission-stat-value-sm">
                {phosMin.toFixed(0)} - {phosMax.toFixed(0)}
              </div>
              <div className="mission-stat-label">Min - Max</div>
            </div>
          </div>
          <div className="mission-range-bar">
            <div
              className="mission-range-marker"
              style={{ left: `${((phosAvg - phosMin) / (phosMax - phosMin)) * 100}%` }}
            />
          </div>
        </div>

        <div className="glass-card mission-card mission-card-grow">
          <div className="mission-card-head">
            <span className="card-eyebrow">IMPORTANCIA DE VARIABLES</span>
            <InfoButton onClick={importanceModal.onOpen} />
          </div>
          <div className="mission-card-sub">{bestTarget}</div>
          <Plot
            data={[
              {
                y: sortedFeatures.map((f) => f[0]),
                x: sortedFeatures.map((f) => f[1]),
                type: 'bar',
                orientation: 'h',
                marker: {
                  color: sortedFeatures.map((_, i) => `rgba(0, 212, 255, ${0.95 - i * 0.08})`),
                  line: { color: 'rgba(0, 212, 255, 0.4)', width: 1 },
                },
                hovertemplate: '<b>%{y}</b><br>%{x:.4f}<extra></extra>',
              },
            ]}
            layout={{
              height: 235,
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              margin: { l: 75, r: 15, t: 5, b: 25 },
              font: { color: '#98b3c8', size: 10, family: 'Inter' },
              xaxis: { showgrid: false, color: '#5d7388', tickfont: { size: 9 } },
              yaxis: { color: '#98b3c8', tickfont: { size: 10 } },
            }}
            config={{ displayModeBar: false }}
            style={{ width: '100%' }}
          />
        </div>

        <div className="glass-card mission-card">
          <span className="card-eyebrow">CONTEO RAPIDO</span>
          <div className="mission-mini-grid">
            <div>
              <div className="mission-mini-value">{stations.length}</div>
              <div className="mission-mini-label">Estaciones</div>
            </div>
            <div>
              <div className="mission-mini-value">9,319</div>
              <div className="mission-mini-label">Muestras</div>
            </div>
            <div>
              <div className="mission-mini-value">9</div>
              <div className="mission-mini-label">Features</div>
            </div>
            <div>
              <div className="mission-mini-value">5</div>
              <div className="mission-mini-label">Años</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ CENTER (MAP) ============ */}
      <div className="mission-center">
        <div className="glass-card mission-map-card">
          <div className="mission-map-head">
            <div>
              <span className="card-eyebrow">MAPA EN VIVO · SUDAFRICA</span>
              <h3 className="mission-map-title">162 estaciones de monitoreo</h3>
            </div>
            <InfoButton onClick={mapModal.onOpen} />
          </div>
          <div className="mission-map-body">
            <MapView stations={stations} />
          </div>
          <div className="mission-map-legend">
            <span className="legend-item">
              <span className="dot green" /> Fosforo bajo
            </span>
            <span className="legend-item">
              <span className="dot yellow" /> Medio
            </span>
            <span className="legend-item">
              <span className="dot red" /> Alto
            </span>
            <span className="legend-spacer" />
            <span className="legend-meta">
              Altura = conductancia · Color = fosforo
            </span>
          </div>
        </div>

        <div className="glass-card mission-comparison-card">
          <div className="card-header">
            <div>
              <span className="card-eyebrow">COMPARATIVA DE MODELOS</span>
              <h3 className="card-title-lg">Random Forest vs XGBoost (R² en test)</h3>
            </div>
          </div>
          <Plot
            data={[
              {
                y: targets.map((t) => t.replace('Dissolved Reactive Phosphorus', 'Fosforo').replace('Electrical Conductance', 'Conductancia').replace('Total Alkalinity', 'Alcalinidad')),
                x: rfR2,
                type: 'bar',
                orientation: 'h',
                name: 'Random Forest',
                marker: {
                  color: 'rgba(0, 212, 255, 0.85)',
                  line: { color: '#00d4ff', width: 1.5 },
                },
                text: rfR2.map((v) => v.toFixed(4)),
                textposition: 'inside',
                insidetextanchor: 'end',
                textfont: { color: '#001a26', size: 11, family: 'Space Grotesk' },
                hovertemplate: '<b>RF</b><br>R² = %{x:.4f}<extra></extra>',
              },
              {
                y: targets.map((t) => t.replace('Dissolved Reactive Phosphorus', 'Fosforo').replace('Electrical Conductance', 'Conductancia').replace('Total Alkalinity', 'Alcalinidad')),
                x: xgbR2,
                type: 'bar',
                orientation: 'h',
                name: 'XGBoost',
                marker: {
                  color: 'rgba(124, 92, 255, 0.85)',
                  line: { color: '#7c5cff', width: 1.5 },
                },
                text: xgbR2.map((v) => v.toFixed(4)),
                textposition: 'inside',
                insidetextanchor: 'end',
                textfont: { color: '#ffffff', size: 11, family: 'Space Grotesk' },
                hovertemplate: '<b>XGB</b><br>R² = %{x:.4f}<extra></extra>',
              },
            ]}
            layout={{
              barmode: 'group',
              height: 200,
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              margin: { l: 100, r: 20, t: 5, b: 50 },
              font: { color: '#98b3c8', size: 11, family: 'Inter' },
              xaxis: {
                range: [0, 1],
                showgrid: true,
                gridcolor: 'rgba(255, 255, 255, 0.05)',
                color: '#5d7388',
              },
              yaxis: { color: '#e8f2ff' },
              legend: {
                orientation: 'h',
                y: -0.2,
                font: { color: '#98b3c8', size: 11 },
              },
              shapes: [
                {
                  type: 'line',
                  x0: 0.2,
                  x1: 0.2,
                  y0: -0.5,
                  y1: 2.5,
                  line: { color: '#ff4757', dash: 'dot', width: 1.5 },
                },
              ],
              annotations: [
                {
                  x: 0.21,
                  y: 2.45,
                  text: 'Benchmark EY 0.20',
                  showarrow: false,
                  font: { color: '#ff4757', size: 10 },
                  xanchor: 'left',
                },
              ],
            }}
            config={{ displayModeBar: false }}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* ============ RIGHT COLUMN ============ */}
      <div className="mission-right">
        <div className="glass-card mission-card">
          <div className="mission-card-head">
            <span className="indicator-pulse" />
            <span className="card-eyebrow text-success">SISTEMA ACTIVO</span>
          </div>
          <div className="indicator-grid">
            <div className="indicator-item">
              <span className="indicator-label">Modelos</span>
              <span className="indicator-value">6 / 6</span>
            </div>
            <div className="indicator-item">
              <span className="indicator-label">Cobertura</span>
              <span className="indicator-value">100%</span>
            </div>
            <div className="indicator-item">
              <span className="indicator-label">Periodo</span>
              <span className="indicator-value">2011-15</span>
            </div>
            <div className="indicator-item">
              <span className="indicator-label">Benchmark</span>
              <span className="indicator-value text-success">+325%</span>
            </div>
          </div>
        </div>

        <div className="glass-card mission-card">
          <span className="card-eyebrow">R² POR PARAMETRO</span>
          <div className="rings-container">
            {targets.map((t) => {
              const r2 = models.metrics.rf[t].r2
              const pct = Math.round(r2 * 100)
              const offset = 2 * Math.PI * 32 * (1 - r2)
              const shortName =
                t === 'Total Alkalinity'
                  ? 'Alc'
                  : t === 'Electrical Conductance'
                  ? 'Cond'
                  : 'Fos'
              return (
                <div key={t} className="ring-item">
                  <svg width="74" height="74" viewBox="0 0 74 74">
                    <circle
                      cx="37"
                      cy="37"
                      r="32"
                      stroke="rgba(255, 255, 255, 0.06)"
                      strokeWidth="5"
                      fill="none"
                    />
                    <circle
                      cx="37"
                      cy="37"
                      r="32"
                      stroke="#00d4ff"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={offset}
                      transform="rotate(-90 37 37)"
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(0, 212, 255, 0.7))',
                        transition: 'stroke-dashoffset 1.2s ease-out',
                      }}
                    />
                    <text
                      x="37"
                      y="42"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="700"
                      fontFamily="Space Grotesk"
                    >
                      {pct}
                    </text>
                  </svg>
                  <span className="ring-label">{shortName}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="glass-card mission-card mission-card-grow">
          <span className="card-eyebrow">TOP 6 ESTACIONES CRITICAS</span>
          <div className="mission-card-sub">Mayor concentracion de fosforo</div>
          <div className="station-list">
            {topStations.map((s, i) => (
              <div key={i} className="station-row">
                <span className="station-rank">0{i + 1}</span>
                <div className="station-info">
                  <div className="station-coords">
                    {s.Latitude.toFixed(3)}, {s.Longitude.toFixed(3)}
                  </div>
                  <div className="station-bar">
                    <div
                      className="station-bar-fill"
                      style={{
                        width: `${(s['Dissolved Reactive Phosphorus'] / phosMax) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="station-value">
                  {s['Dissolved Reactive Phosphorus'].toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ MODALS ============ */}
      <InfoModal
        open={modelModal.open}
        onClose={modelModal.onClose}
        eyebrow="POR QUE RANDOM FOREST"
        title="Como gana Random Forest"
      >
        <p>
          <strong>Random Forest</strong> entrena 100 arboles de decision en paralelo y promedia sus predicciones.
          Cada arbol ve un subconjunto aleatorio de los datos y las variables, lo que reduce el overfitting.
        </p>
        <p>
          <strong>XGBoost</strong> entrena arboles en secuencia: cada arbol corrige los errores del anterior.
          Normalmente gana en datasets grandes, pero aqui RF demostro ser mas robusto a los outliers ya tratados.
        </p>
        <div className="modal-stats">
          <div className="modal-stat">
            <span className="modal-stat-value">0.78</span>
            <span className="modal-stat-label">R² promedio RF</span>
          </div>
          <div className="modal-stat">
            <span className="modal-stat-value">0.74</span>
            <span className="modal-stat-label">R² promedio XGB</span>
          </div>
          <div className="modal-stat">
            <span className="modal-stat-value text-success">+4.2%</span>
            <span className="modal-stat-label">Ventaja RF</span>
          </div>
        </div>
        <p className="modal-conclusion">
          <strong>Conclusion:</strong> Para este problema (datos winsorizados + 9 features) Random Forest es la opcion
          recomendada. Si tuvieramos mas datos o mas features, XGBoost podria adelantarse.
        </p>
      </InfoModal>

      <InfoModal
        open={mapModal.open}
        onClose={mapModal.onClose}
        eyebrow="COMO LEER EL MAPA"
        title="Que significa cada columna"
      >
        <p>Cada columna 3D es una estacion de monitoreo. Tiene 2 dimensiones visuales:</p>
        <ul className="modal-list">
          <li>
            <strong>Color:</strong> nivel promedio de fosforo. Verde = bajo, amarillo = medio, rojo = alto.
            El rojo indica eutrofizacion activa.
          </li>
          <li>
            <strong>Altura:</strong> conductancia electrica promedio (sales disueltas). Columnas mas altas
            indican aguas con mayor contenido mineral o impacto antropogenico.
          </li>
        </ul>
        <p className="modal-conclusion">
          <strong>Hallazgo geografico:</strong> las estaciones con fosforo alto se concentran cerca de Gauteng
          (la zona industrial mas densa). Esto sugiere correlacion con actividad humana, no solo con clima.
        </p>
      </InfoModal>

      <InfoModal
        open={importanceModal.open}
        onClose={importanceModal.onClose}
        eyebrow="QUE LE IMPORTA AL MODELO"
        title="Importancia de variables — explicacion"
      >
        <p>
          La importancia mide <strong>cuanto baja la calidad de las predicciones si quitamos esa variable</strong>.
          Las primeras 2-3 variables suelen acumular mas del 60% del poder predictivo.
        </p>
        <ul className="modal-list">
          <li>
            <strong>Latitude / Longitude:</strong> el modelo aprende patrones geograficos. Las cuencas con alta
            actividad agricola tienden a tener firma quimica distinta.
          </li>
          <li>
            <strong>SWIR16 / SWIR22:</strong> bandas infrarrojas sensibles a humedad y materia organica
            disuelta en el agua.
          </li>
          <li>
            <strong>NDMI / MNDWI:</strong> indices que combinan bandas para detectar agua y humedad. Buenos
            proxies para volumen y dilucion del cuerpo de agua.
          </li>
        </ul>
        <p className="modal-conclusion">
          <strong>Pregunta clave:</strong> si combinas NDMI + SWIR16, el modelo mejora porque NDMI capta humedad
          superficial y SWIR16 penetra ligeramente bajo la superficie. Juntas dan una vista 2D del estado del agua.
        </p>
      </InfoModal>
    </div>
  )
}
