import React, { useState, useEffect } from 'react'
import IntroSplash from './components/IntroSplash'
import TopBar from './components/TopBar'
import Hero from './components/Hero'
import ProjectStory from './components/ProjectStory'
import Dashboard from './components/Dashboard'
import CorrelationMatrix from './components/CorrelationMatrix'
import ScatterPlot from './components/ScatterPlot'
import PDPChart from './components/PDPChart'
import RecommendationsCarousel from './components/RecommendationsCarousel'
import Credits from './components/Credits'
import InfoModal, { InfoButton, useInfoModal } from './components/InfoModal'
import useReveal from './hooks/useReveal'

const FEATURES = ['pet', 'nir', 'green', 'swir16', 'swir22', 'NDMI', 'MNDWI', 'Latitude', 'Longitude']
const TARGETS = ['Total Alkalinity', 'Electrical Conductance', 'Dissolved Reactive Phosphorus']
const ALL_VARS = [...FEATURES, ...TARGETS]

function Section({ id, eyebrow, title, description, action, children }) {
  const [ref, inView] = useReveal()
  return (
    <section id={id} ref={ref} className={`section ${inView ? 'in-view' : ''}`}>
      <div className="section-header">
        <div className="section-header-text">
          {eyebrow && <div className="section-eyebrow">{eyebrow}</div>}
          <h2 className="section-title">{title}</h2>
          {description && <p className="section-desc">{description}</p>}
        </div>
        {action && <div className="section-action">{action}</div>}
      </div>
      <div className="section-body">{children}</div>
    </section>
  )
}

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [splashDone, setSplashDone] = useState(false)

  const relationsModal = useInfoModal()
  const pdpModal = useInfoModal()

  useEffect(() => {
    Promise.all([
      fetch('/data/stations.json').then((r) => r.json()),
      fetch('/data/correlations.json').then((r) => r.json()),
      fetch('/data/scatter_sample.json').then((r) => r.json()),
      fetch('/data/model_results.json').then((r) => r.json()),
      fetch('/data/pdp_data.json').then((r) => r.json()),
    ])
      .then(([stations, correlations, scatter, models, pdp]) => {
        setData({ stations, correlations, scatter, models, pdp })
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading data:', err)
        setLoading(false)
      })
  }, [])

  if (loading)
    return (
      <div className="loading">
        <div className="loading-orb" />
        <span>Cargando Water Sentinel</span>
      </div>
    )

  if (!data) return <div className="loading error">Error al cargar datos</div>

  return (
    <div className="app">
      {!splashDone && <IntroSplash onFinish={() => setSplashDone(true)} />}

      <div className="cosmic-bg">
        <div className="cosmic-stars" />
        <div className="cosmic-glow" />
      </div>

      <TopBar />

      <Hero stations={data.stations} />

      <main className="main-content">
        <Section
          id="historia"
          eyebrow="01 · LA HISTORIA"
          title="Como nacio Water Sentinel"
          description="Desde el problema ambiental hasta el modelo final. Cada paso documentado para que puedas reproducirlo."
        >
          <ProjectStory />
        </Section>

        <Section
          id="dashboard"
          eyebrow="02 · CONTROL CENTER"
          title="Dashboard en vivo"
          description="Mapa central + paneles laterales. Cada uno con su (i) para entender que muestra."
        >
          <Dashboard stations={data.stations} models={data.models} targets={TARGETS} />
        </Section>

        <Section
          id="relaciones"
          eyebrow="03 · RELACIONES ENTRE VARIABLES"
          title="Explorador de correlaciones"
          description="Dos vistas complementarias. La matriz muestra TODAS las parejas. El scatter te deja inspeccionar una pareja a fondo, coloreando por una tercera variable."
          action={<InfoButton onClick={relationsModal.onOpen} label="Como interpretar" />}
        >
          <div className="relations-dashboard">
            <div className="glass-card relations-card">
              <div className="card-header">
                <div>
                  <span className="card-eyebrow">PANEL A · VISTA GLOBAL</span>
                  <h3 className="card-title-lg">Matriz de correlacion</h3>
                </div>
              </div>
              <CorrelationMatrix data={data.correlations} />
            </div>

            <div className="glass-card relations-card">
              <div className="card-header">
                <div>
                  <span className="card-eyebrow">PANEL B · INSPECCION</span>
                  <h3 className="card-title-lg">Dispersion personalizada</h3>
                </div>
              </div>
              <ScatterPlot data={data.scatter} allVars={ALL_VARS} />
              <div className="chart-insight">
                <span className="chart-insight-tag">QUE PROBAR</span>
                <p>
                  Pon <strong>Fosforo (Y)</strong> vs <strong>Latitud (X)</strong> coloreado por
                  <strong> Conductancia</strong> para ver si las estaciones del norte tienen mas contaminacion.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="pdp"
          eyebrow="04 · COMO PIENSA EL MODELO"
          title="Partial Dependence Plots"
          description="Que pasa si subo solo una variable y dejo todas las demas constantes. Es como abrir el motor del modelo y ver de que depende realmente."
          action={<InfoButton onClick={pdpModal.onOpen} label="Que es un PDP" />}
        >
          <div className="glass-card chart-card">
            <PDPChart data={data.pdp} features={FEATURES} targets={TARGETS} />
            <div className="chart-insight">
              <span className="chart-insight-tag">CASO DE USO</span>
              <p>
                Selecciona <strong>Variable: NDMI</strong> y <strong>Objetivo: Fosforo</strong>. Si la curva baja al
                aumentar NDMI, el modelo predice menos fosforo cuando hay mas humedad — efecto de dilucion.
              </p>
            </div>
          </div>
        </Section>

        <Section
          id="recomendaciones"
          eyebrow="05 · CONCLUSIONES"
          title="Recomendaciones finales"
          description="Navega las 4 acciones recomendadas para implementar Water Sentinel en produccion. Usa las flechas para avanzar."
        >
          <RecommendationsCarousel />
        </Section>

        <Section
          id="equipo"
          eyebrow="06 · EQUIPO"
          title="El equipo detras del proyecto"
          description="Estudiantes de 8vo semestre · Analitica y Ciencia de Grandes Volumenes de Datos"
        >
          <Credits />
        </Section>

        <footer className="footer">
          <div className="footer-logo">Water Sentinel</div>
          <div className="footer-meta">
            EY Open Science Challenge · Datos Landsat + TerraClimate · 2026
          </div>
        </footer>
      </main>

      <InfoModal
        open={relationsModal.open}
        onClose={relationsModal.onClose}
        eyebrow="EXPLORADOR DE RELACIONES"
        title="Por que las dos vistas juntas"
      >
        <p>
          La <strong>matriz de correlacion</strong> es una vista global: te muestra de un vistazo TODAS las
          parejas posibles, pero solo captura relaciones lineales.
        </p>
        <p>
          El <strong>scatter plot</strong> es una vista local: solo dos variables, pero puedes ver la forma exacta
          (curva, banana, clusters). Ademas el color te da una tercera dimension de informacion.
        </p>
        <ul className="modal-list">
          <li>
            <strong>Correlacion alta en matriz + dispersion compacta:</strong> relacion lineal fuerte, predecible.
          </li>
          <li>
            <strong>Correlacion baja pero dispersion con forma curva:</strong> el modelo SI puede aprenderla,
            aunque la correlacion lineal no la capta.
          </li>
          <li>
            <strong>Multicolinealidad:</strong> dos features con |r| {'>'} 0.8 son casi-redundantes. Puedes quitar una.
          </li>
        </ul>
        <p className="modal-conclusion">
          <strong>Por que importa:</strong> entender las relaciones te ayuda a confiar (o desconfiar) de las
          predicciones del modelo. Si NDMI y Fosforo tienen correlacion -0.4, es plausible que el modelo use
          NDMI como predictor — y ahora sabes por que.
        </p>
      </InfoModal>

      <InfoModal
        open={pdpModal.open}
        onClose={pdpModal.onClose}
        eyebrow="PARTIAL DEPENDENCE PLOTS"
        title="Como funciona y por que importa"
      >
        <p>
          Un PDP simula: <strong>"si yo pudiera cambiar SOLO esta variable y dejar todas las demas
          constantes, como cambiaria la prediccion?"</strong>
        </p>
        <p>
          Para calcularlo, el modelo evalua cada valor posible de la variable usando el resto del dataset como
          contexto, y promedia las predicciones. El resultado es la curva que ves.
        </p>
        <ul className="modal-list">
          <li><strong>Curva creciente:</strong> al aumentar la variable, sube la prediccion. Relacion positiva.</li>
          <li><strong>Curva decreciente:</strong> relacion negativa. Mas de X = menos del objetivo.</li>
          <li><strong>Curva plana:</strong> el modelo no usa esta variable significativamente.</li>
          <li><strong>Cambios bruscos:</strong> hay umbrales criticos. Reglas aprendidas tipo "si X {'>'} valor, salto".</li>
        </ul>
        <p className="modal-conclusion">
          <strong>Limitacion:</strong> el PDP asume que las variables son independientes entre si. Si NDMI y SWIR16
          estan correlacionadas, variar NDMI solo es teorico — en la realidad cambian juntas.
        </p>
      </InfoModal>
    </div>
  )
}
