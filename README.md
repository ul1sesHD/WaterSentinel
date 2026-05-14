# Water Sentinel

Sistema de monitoreo y predicción de calidad de agua utilizando aprendizaje automático y visualización interactiva en 3D.

## Descripcion

Water Sentinel es una plataforma web que integra modelos de machine learning (XGBoost, Random Forest) para predecir la calidad del agua basándose en datos satelitales de Landsat y variables climáticas de TerraClimate. Proporciona un dashboard interactivo con visualización geoespacial, análisis de correlaciones y recomendaciones automáticas.

## Caracteristicas Principales

- Predicción de calidad de agua con múltiples modelos ML
- Dashboard interactivo con visualización de datos en tiempo real
- Mapa global 3D integrado con estaciones de monitoreo
- Análisis de correlaciones entre variables ambientales
- Gráficos de dependencia parcial (PDP) para interpretabilidad
- Recomendaciones automáticas basadas en resultados
- Interfaz responsive y moderna

## Requisitos Previos

Antes de instalar, asegúrate de tener lo siguiente en tu computadora:

### Software Requerido

- Node.js versión 16.x o superior (incluye npm)
- Python 3.8 o superior
- Git (opcional, para clonar el repositorio)

### Verificar Instalacion

Abre una terminal (cmd o PowerShell en Windows) y ejecuta:

```bash
node --version
npm --version
python --version
```

Si ves números de versión en los tres comandos, estás listo. Si alguno falla, descárgalo desde:

- [Node.js](https://nodejs.org/) - Descarga la versión LTS
- [Python](https://www.python.org/downloads/) - Descarga la última versión estable

## Instalacion Paso a Paso

### 1. Descargar el Proyecto

Si tienes Git instalado:

```bash
git clone <URL_DEL_REPOSITORIO>
cd WaterSentinel
```

Si no tienes Git, descarga el proyecto como ZIP y extráelo en tu computadora.

### 2. Instalar Dependencias de Python (Backend)

Abre una terminal en la carpeta `data/` y ejecuta:

```bash
pip install pandas numpy scikit-learn xgboost jupyter
```

Esto instala las librerías necesarias para procesar datos y entrenar modelos.

### 3. Instalar Dependencias de Node.js (Frontend)

Ve a la carpeta `water_sentinel/water_sentinel/` y ejecuta:

```bash
npm install
```

Este comando lee `package.json` y descarga todas las dependencias necesarias (React, Vite, Three.js, etc.).

### 4. Preparar Datos (Opcional) <--------  IMPORTANTE SOLO ES OPCIONAL POR SI NO CARGAN LOS DATOS DEL SCRIPT

Si necesitas regenerar los archivos de datos en `public/data/`, ejecuta:

```bash
python prepare_data.py
```

Este script procesa los CSV originales y genera archivos JSON optimizados para el frontend.

## Estructura del Proyecto

```
WaterSentinel/
├── data/                          # Datos brutos y notebooks de análisis
│   ├── 0. landsat_features_training.csv
│   ├── 0. terraclimate_features_training.csv
│   ├── 0. water_quality_training_dataset.csv
│   ├── dataset_winsorizado.csv    # Dataset procesado sin outliers
│   ├── 1. AnalisisDescriptivo_beforeWinsorizado.ipynb
│   ├── 2. Isolation_RandomForesto_PrediccionModelo.ipynb
│   ├── 5. Modelos_Calidad_Agua_XGBOOST_Random.ipynb
│   └── Entrega 1/                 # Entregas anteriores
│
└── water_sentinel/
    └── water_sentinel/            # Aplicación frontend
        ├── package.json           # Dependencias de Node.js
        ├── vite.config.js         # Configuración de Vite
        ├── prepare_data.py        # Script para procesar datos
        ├── index.html             # HTML principal
        ├── public/
        │   └── data/              # Archivos JSON pre-procesados
        │       ├── correlations.json
        │       ├── model_results.json
        │       ├── pdp_data.json
        │       ├── scatter_sample.json
        │       └── stations.json
        └── src/
            ├── App.jsx            # Componente principal
            ├── main.jsx           # Punto de entrada
            ├── App.css            # Estilos principales
            ├── components/        # Componentes reutilizables
            │   ├── Dashboard.jsx
            │   ├── Globe.jsx      # Visualización 3D
            │   ├── MapView.jsx
            │   ├── CorrelationMatrix.jsx
            │   ├── PDPChart.jsx
            │   ├── ScatterPlot.jsx
            │   ├── Header.jsx
            │   ├── Hero.jsx
            │   ├── TopBar.jsx
            │   ├── IntroSplash.jsx
            │   ├── ProjectStory.jsx
            │   ├── RecommendationsCarousel.jsx
            │   ├── InfoModal.jsx
            │   └── Credits.jsx
            └── hooks/             # Hooks personalizados
                └── useReveal.js
```

## Ejecucion del Proyecto

### Ejecutar en Desarrollo

Ve a la carpeta `water_sentinel/water_sentinel/` y corre:

```bash
npm run dev
```

Verás un mensaje como:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Abre tu navegador en [http://localhost:5173/](http://localhost:5173/) para ver el dashboard.

### Ejecutar en Produccion

Para crear una versión optimizada:

```bash
npm run build
```

Esto genera una carpeta `dist/` con archivos listos para producción.

Para servir localmente después del build:

```bash
npm run preview
```

## Descripcion de Componentes

| Componente | Funcionalidad |
|-----------|--------------|
| **Dashboard.jsx** | Panel principal que coordina todos los gráficos y visualizaciones |
| **Globe.jsx** | Visualización 3D interactiva del mapa mundial con Three.js |
| **MapView.jsx** | Mapa 2D de estaciones de monitoreo |
| **CorrelationMatrix.jsx** | Matriz de correlaciones entre variables |
| **PDPChart.jsx** | Gráficos de dependencia parcial para interpretabilidad del modelo |
| **ScatterPlot.jsx** | Dispersión de predicciones vs valores reales |
| **RecommendationsCarousel.jsx** | Recomendaciones automáticas basadas en resultados |
| **Hero.jsx** | Sección de bienvenida |
| **ProjectStory.jsx** | Descripción del proyecto y metodología |

## Archivos de Datos

Los archivos JSON en `public/data/` contienen:

- **correlations.json**: Matriz de correlaciones entre variables ambientales
- **model_results.json**: Resultados de predicciones y métricas de desempeño
- **pdp_data.json**: Datos para gráficos de dependencia parcial
- **scatter_sample.json**: Muestra de datos para el gráfico de dispersión
- **stations.json**: Ubicaciones y metadatos de estaciones de monitoreo

## Solucion de Problemas

### Error: "npm: No se reconoce como comando"

Node.js no está instalado. Descárgalo desde [nodejs.org](https://nodejs.org/) e instálalo. Reinicia tu terminal después.

### Error: "python: No se reconoce como comando"

Python no está instalado. Descárgalo desde [python.org](https://www.python.org/) e instálalo. Marca la opción "Add Python to PATH" durante la instalación.

### Puerto 5173 ya está en uso

Otro proceso está usando el puerto. Ejecuta:

```bash
npm run dev -- --port 3000
```

Esto ejecutará la aplicación en el puerto 3000 en su lugar.

### Los datos no se cargan en el dashboard

Asegúrate de que los archivos JSON están en `water_sentinel/water_sentinel/public/data/`. Si faltan, ejecuta:

```bash
python prepare_data.py
```

### La visualización 3D no se ve

Verifica que tu navegador soporta WebGL. Prueba con Chrome, Firefox o Edge recientes.

## Tecnologias Utilizadas

### Frontend
- React 18.x - Librería de interfaz de usuario
- Vite - Herramienta de construcción rápida
- Three.js - Visualización 3D
- CSS3 - Estilos y animaciones

### Backend / Análisis
- Python 3.8+ - Lenguaje de programación
- Pandas - Manipulación de datos
- Scikit-learn - Modelos de machine learning
- XGBoost - Modelo de predicción avanzado
- Jupyter - Notebooks para análisis exploratorio

### Datos
- Landsat 8/9 - Imágenes satelitales
- TerraClimate - Datos climáticos globales

## Notas Importantes

1. La primera carga de `npm install` puede tardar varios minutos dependiendo de tu conexión.
2. Los modelos ya están entrenados. No es necesario reentrenarlos para usar la aplicación.
3. Si modificas código en `src/`, los cambios se reflejan automáticamente en el navegador (hot reload).
4. Los archivos en `public/data/` se sirven estáticamente y no requieren backend adicional.

## Licencia

Este proyecto está desarrollado para propósitos académicos y de investigación.

## Contacto y Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

Última actualización: Mayo 2026