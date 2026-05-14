import React from 'react'

const STORY_STEPS = [
  {
    n: '01',
    year: '2024',
    tag: 'EL PROBLEMA',
    title: 'Eutrofizacion en Sudafrica',
    body:
      'El exceso de fosforo en los rios provoca proliferacion descontrolada de algas, consumo del oxigeno disuelto y muerte de la fauna acuatica. Medir manualmente es lento, caro y solo cubre unas pocas estaciones.',
    metric: { label: 'Estaciones afectadas', value: '162' },
  },
  {
    n: '02',
    year: '2024',
    tag: 'LA HIPOTESIS',
    title: 'Predecir con satelites',
    body:
      'Si las bandas Landsat y las variables TerraClimate cambian segun la quimica del agua, deberia ser posible estimar alcalinidad, conductividad y fosforo SIN tomar una sola muestra fisica.',
    metric: { label: 'Variables satelitales', value: '7' },
  },
  {
    n: '03',
    year: '2025',
    tag: 'LOS DATOS',
    title: '9,319 mediciones unidas',
    body:
      'Cruzamos 3 fuentes (water_quality, landsat, terraclimate) por latitud, longitud y fecha. Aplicamos winsorizacion al 5%-95% para reducir outliers conservando el 100% de las filas.',
    metric: { label: 'Periodo', value: '2011-2015' },
  },
  {
    n: '04',
    year: '2025',
    tag: 'LOS MODELOS',
    title: 'Random Forest vs XGBoost',
    body:
      'Un modelo por cada uno de los 3 parametros, para ambos algoritmos. Split 70/30, escalado con StandardScaler, evaluacion con R², MAE y RMSE en test set.',
    metric: { label: 'R² promedio RF', value: '0.78' },
  },
  {
    n: '05',
    year: '2026',
    tag: 'EL RESULTADO',
    title: 'Benchmark superado 3x',
    body:
      'EY benchmark era R² = 0.20. Logramos 0.82 en alcalinidad, 0.85 en conductividad y 0.67 en fosforo. El modelo explica entre 67% y 85% de la variabilidad usando solo satelite + clima.',
    metric: { label: 'Mejor R²', value: '0.85' },
  },
]

export default function ProjectStory() {
  return (
    <div className="timeline">
      <div className="timeline-glow-bg" />
      <div className="timeline-spine" />

      {STORY_STEPS.map((step, idx) => (
        <div key={step.n} className="timeline-item" style={{ '--idx': idx }}>
          <div className="timeline-node">
            <div className="timeline-node-ring" />
            <span className="timeline-node-n">{step.n}</span>
          </div>

          <div className="glass-card timeline-card">
            <div className="timeline-card-shine" />
            <div className="timeline-card-head">
              <span className="story-tag">{step.tag}</span>
              <span className="timeline-year">{step.year}</span>
            </div>
            <h3 className="timeline-title">{step.title}</h3>
            <p className="timeline-body">{step.body}</p>
            <div className="timeline-footer">
              <div className="story-metric">
                <span className="story-metric-value">{step.metric.value}</span>
                <span className="story-metric-label">{step.metric.label}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
