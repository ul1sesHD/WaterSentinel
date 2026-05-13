# 📊 Análisis y Predicción de Calidad de Agua en Sudáfrica

**Proyecto Final**: Analítica y Ciencia de Grandes Volúmenes de Datos (Semestre 8)  
**Estudiantes**: Alejandra Roa Alonso, Hector Ulises Hernández Dominguez, Katia Marcela Carpio Domínguez, Juan Manuel Palafox Valdes  
**Profesor**: Juan Damián Silva Galindo

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Fases CRISP-DM](#fases-crisp-dm)
4. [Instalación y Setup](#instalación-y-setup)
5. [Pasos de Ejecución](#pasos-de-ejecución)
6. [Entregas Esperadas](#entregas-esperadas)
7. [Checklist Final](#checklist-final)

---

## 🎯 Descripción General

### Problema
Sudáfrica enfrenta **eutrofización** en sus ríos debido al exceso de fósforo (nutriente contaminante). Esto causa:
- Proliferación descontrolada de algas
- Reducción de oxígeno disuelto
- Muerte de fauna acuática
- Riesgo para el consumo humano

### Solución
Desarrollar **modelos predictivos** que estimen parámetros de calidad del agua usando **variables satelitales** (Landsat + TerraClimate) para:
- ✅ Identificar zonas en riesgo
- ✅ Monitoreo sin recolección de muestras costosa
- ✅ Apoyo a toma de decisiones ambientales

### Objetivos del Proyecto
- **Primario**: Superar benchmark EY (R² = 0.20) con R² ≥ 0.40
- **Secundario**: Comparar Random Forest vs XGBoost
- **Terciario**: Crear interfaz interactiva (Streamlit o React)
- **Metodología**: CRISP-DM en 6 fases

---

## 📁 Estructura del Proyecto

```
water_quality_analysis/
│
├── 📂 data/
│   ├── dataset_winsorizado.csv          # Dataset consolidado y limpiado
│   ├── landsat_features_training.csv    # Features Landsat (original)
│   ├── terraclimate_features_training.csv # Features TerraClimate (original)
│   └── water_quality_training_dataset.csv # Variables objetivo (original)
│
├── 📂 src/                              # Código Python (Backend)
│   ├── __init__.py
│   ├── data_loader.py                   # Carga y preparación de datos
│   ├── model_trainer.py                 # Entrenamiento RF + XGBoost
│   ├── predictor.py                     # Predicciones
│   ├── utils.py                         # Funciones auxiliares (gráficos, métricas)
│   └── config.py                        # Configuración centralizada
│
├── 📂 models/                           # Modelos entrenados (.pkl)
│   ├── random_forest_alkalinity.pkl
│   ├── random_forest_conductance.pkl
│   ├── random_forest_phosphorus.pkl
│   ├── xgboost_alkalinity.pkl
│   ├── xgboost_conductance.pkl
│   └── xgboost_phosphorus.pkl
│
├── 📂 outputs/                          # Resultados y predicciones
│   ├── predictions_rf.csv               # Predicciones Random Forest
│   ├── predictions_xgb.csv              # Predicciones XGBoost
│   ├── model_comparison.csv             # Comparativa de métricas
│   └── feature_importance.csv           # Importancia de variables
│
├── 📂 notebooks/                        # Jupyter notebooks (exploración)
│   ├── 01_eda.ipynb                     # Análisis exploratorio
│   ├── 02_modelado.ipynb                # Entrenamiento de modelos
│   └── 03_evaluacion.ipynb              # Evaluación y resultados
│
├── 📂 frontend/                         # Aplicación Streamlit O React
│   ├── app.py                           # Streamlit app (opción simple)
│   └── (o carpeta react/ para opción avanzada)
│
├── 📄 requirements.txt                  # Dependencias Python
├── 📄 README.md                         # Este archivo
├── 📄 CRISP_DM_REPORT.md               # Reporte formal CRISP-DM
└── 📄 Proyecto_final.docx              # Documento entrega formal

```

---

## 🔄 Fases CRISP-DM

### ✅ Fase 1: Entendimiento del Negocio
**Estado**: COMPLETADO

**Deliverables**:
- [x] Problema identificado: eutrofización en ríos de Sudáfrica
- [x] Objetivo claro: predecir 3 parámetros de calidad del agua
- [x] Benchmark establecido: R² = 0.20 (EY)
- [x] Hipótesis documentadas (H1–H5)
- [x] Riesgos y contingencias mapeadas

**Archivo**: `Proyecto_final.docx` (Sección 1)

---

### ✅ Fase 2: Entendimiento de los Datos
**Estado**: COMPLETADO

**Deliverables**:
- [x] Carga de 3 datasets (water_quality, landsat, terraclimate)
- [x] Análisis descriptivo:
  - 9,319 filas
  - 162 estaciones en Sudáfrica
  - Período: 2011–2015
  - 0 valores nulos, 0 duplicados
- [x] Distribuciones analizadas:
  - Total Alkalinity: sesgo 0.536
  - Electrical Conductance: sesgo 0.929
  - Dissolved Reactive Phosphorus: sesgo 1.645 (MÁS ASIMÉTRICO)
- [x] Correlaciones mapeadas
- [x] EDA con visualizaciones

**Archivo**: `Proyecto_final.docx` (Sección 2) + `01_eda.ipynb`

---

### ⚠️ Fase 3: Preparación de Datos
**Estado**: COMPLETADO

**Deliverables**:
- [x] Merge de 3 datasets por Latitude, Longitude, Sample Date
- [x] Winsorización de outliers (5% y 95% percentiles)
- [x] 100% retención de filas (9,319/9,319)
- [x] Archivo consolidado: `dataset_winsorizado.csv`

**Archivo**: `dataset_winsorizado.csv`

---

### ⚠️ Fase 4: Modelado
**Estado**: EN PROGRESO / A INICIAR

**Tareas**:
1. Generar variables derivadas:
   - Mes (Sample Date → mes)
   - Estación del año (month → season)
   - Año
   - NDVI (calculado desde nir + banda roja si disponible)

2. Separar features (X) y targets (y):
   - **X**: pet, nir, green, swir16, swir22, NDMI, MNDWI, Latitude, Longitude, mes, estación, año
   - **y**: Total Alkalinity, Electrical Conductance, Dissolved Reactive Phosphorus

3. Split train/test: 70% entrenamiento, 30% test

4. Escalado: StandardScaler

5. **Entrenar Random Forest**:
   - 3 modelos (uno por target)
   - n_estimators=100
   - Guardar en `models/random_forest_*.pkl`

6. **Entrenar XGBoost**:
   - 3 modelos (uno por target)
   - max_depth=5, learning_rate=0.1, n_estimators=100
   - Guardar en `models/xgboost_*.pkl`

**Deliverables**:
- [ ] 6 modelos entrenados (3 RF + 3 XGB) en `models/`
- [ ] `02_modelado.ipynb` documentado
- [ ] `src/model_trainer.py` funcional

---

### ⚠️ Fase 5: Evaluación
**Estado**: PENDIENTE

**Tareas**:
1. Evaluar ambos modelos con:
   - **R²** (coeficiente de determinación)
   - **MSE** (error cuadrático medio)
   - **MAE** (error absoluto medio)

2. Crear tabla comparativa:
   ```
   | Parámetro | RF-R² | XGB-R² | Ganancia |
   |-----------|-------|--------|----------|
   | Alkalinity | ? | ? | ? |
   | Conductance | ? | ? | ? |
   | Phosphorus | ? | ? | ? |
   ```

3. Analizar importancia de variables:
   - ¿Cuál es el predictor más importante?
   - ¿NDMI/MNDWI (índices) o bandas crudas?
   - ¿Pet (clima) es relevante?

4. Conclusiones:
   - ¿Se supera benchmark 0.20?
   - ¿Cuál modelo gana (RF vs XGB)?
   - ¿Qué parámetro es más fácil predecir?

**Deliverables**:
- [ ] `03_evaluacion.ipynb` con análisis completo
- [ ] `outputs/model_comparison.csv` con métricas
- [ ] `outputs/feature_importance.csv`
- [ ] Gráficos:
  - Importancia de variables (RF vs XGB)
  - Predicción vs Real (scatter plot por target)
  - ROC/curvas de desempeño

---

### ⚠️ Fase 6: Implementación
**Estado**: PENDIENTE

**Opción A: Streamlit (RECOMENDADA - Rápida)**

Tareas:
1. Crear `frontend/app.py` con Streamlit
2. Cargar modelos entrenados desde `models/`
3. Interfaz con 5 tabs:
   - 📊 **Dashboard**: métricas resumen, tabla comparativa
   - 🗺️ **Mapa**: Sudáfrica con estaciones (Folium)
   - 📈 **Análisis de Variables**: importancia de features
   - 📉 **Predicciones**: scatter plots real vs predicho
   - 📥 **Descargar**: CSV con predicciones

Deliverables:
- [ ] `frontend/app.py` ejecutable
- [ ] Comando: `streamlit run frontend/app.py`
- [ ] App funcional en localhost:8501

---

**Opción B: React + Deck.gl (AVANZADA - Espectacular)**

Tareas:
1. Crear proyecto React: `npx create-react-app frontend`
2. Instalar: `deck.gl`, `mapbox-gl`, `plotly.js`, `axios`
3. Componentes:
   - `Map3D.jsx`: mapa Deck.gl + Mapbox
   - `Dashboard.jsx`: métricas + gráficos
   - `FilterPanel.jsx`: filtros por río/año/mes
   - `API.js`: conexión con backend Python
4. Backend Python (FastAPI o Flask):
   - `/api/predict` → retorna predicciones
   - `/api/models/compare` → compara RF vs XGB
   - `/api/importance` → importancia de variables

Deliverables:
- [ ] `frontend/` carpeta React completa
- [ ] `backend/api.py` con FastAPI
- [ ] Comandos:
  - `npm start` (frontend en localhost:3000)
  - `python backend/api.py` (backend en localhost:8000)
- [ ] App profesional funcionando

---

## 🚀 Instalación y Setup

### Requisitos Previos
- Python 3.8+
- Node.js 14+ (solo si usas React)
- Git
- Virtual environment (`venv` o `conda`)

### Paso 1: Clonar/Descargar Proyecto
```bash
# Si es Git
git clone <repo_url>
cd water_quality_analysis

# O crear carpeta manualmente
mkdir water_quality_analysis
cd water_quality_analysis
```

### Paso 2: Configurar Python
```bash
# Crear virtual environment
python -m venv venv

# Activar (Linux/Mac)
source venv/bin/activate

# Activar (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### requirements.txt
```
pandas==1.5.3
numpy==1.24.3
scikit-learn==1.2.2
xgboost==2.0.0
matplotlib==3.7.1
seaborn==0.12.2
streamlit==1.28.0
folium==0.14.0
streamlit-folium==0.16.0
plotly==5.17.0
joblib==1.3.1
geopandas==0.13.1
```

### Paso 3: Copiar Datos
```bash
# Copiar dataset_winsorizado.csv a carpeta data/
cp /ruta/al/dataset_winsorizado.csv data/
```

### Paso 4: Ejecutar Notebooks (Opcional)
```bash
# Si tienes Jupyter instalado
pip install jupyter
jupyter notebook notebooks/
```

---

## ⚙️ Pasos de Ejecución

### Opción 1: Streamlit (RECOMENDADA)

**Paso 1: Entrenar modelos**
```bash
# Ejecutar notebook 02_modelado.ipynb
# O crear script standalone:
python -c "from src.model_trainer import RandomForestModels, XGBoostModels; ..."
```

**Paso 2: Ejecutar app**
```bash
streamlit run frontend/app.py
```

**Resultado**: App interactiva en http://localhost:8501

---

### Opción 2: React + Deck.gl (AVANZADA)

**Paso 1: Setup Backend**
```bash
# En carpeta raíz
pip install fastapi uvicorn

# Crear backend/api.py y ejecutar
python backend/api.py
# Servidor en http://localhost:8000
```

**Paso 2: Setup Frontend**
```bash
# En carpeta raíz
cd frontend
npm install
npm start
# App en http://localhost:3000
```

**Resultado**: App React profesional con mapa 3D

---

## 📦 Entregas Esperadas

### Entrega 1: Código Python Modular
```
✅ src/data_loader.py
✅ src/model_trainer.py
✅ src/predictor.py
✅ src/utils.py
✅ src/config.py
✅ models/ (6 archivos .pkl)
✅ outputs/ (predicciones y comparativas)
```

### Entrega 2: Notebooks Documentados
```
✅ notebooks/01_eda.ipynb
✅ notebooks/02_modelado.ipynb
✅ notebooks/03_evaluacion.ipynb
```

### Entrega 3: Frontend (Elige uno)
```
STREAMLIT:
✅ frontend/app.py

REACT:
✅ frontend/ (carpeta completa)
✅ backend/api.py
```

### Entrega 4: Documentación
```
✅ README.md (este archivo)
✅ CRISP_DM_REPORT.md (reporte formal)
✅ Proyecto_final.docx (documento entrega)
```

### Entrega 5: Datasets
```
✅ data/dataset_winsorizado.csv (consolidado)
✅ outputs/predictions_rf.csv
✅ outputs/predictions_xgb.csv
✅ outputs/model_comparison.csv
```

---

## ✅ Checklist Final

### Fase 1: Entendimiento del Negocio
- [x] Problema documentado
- [x] Objetivos claros
- [x] Benchmark establecido (R² = 0.20)
- [x] Hipótesis H1–H5 validadas

### Fase 2: Entendimiento de Datos
- [x] Análisis descriptivo completo
- [x] Distribuciones mapeadas
- [x] Correlaciones analizadas
- [x] EDA con gráficos

### Fase 3: Preparación de Datos
- [x] Merge de 3 datasets
- [x] Winsorización aplicada
- [x] 100% retención de filas
- [x] dataset_winsorizado.csv generado

### Fase 4: Modelado
- [ ] Variables derivadas (mes, estación, año, NDVI)
- [ ] Features y targets separados
- [ ] Train/test split (70/30)
- [ ] Random Forest entrenado (3 modelos)
- [ ] XGBoost entrenado (3 modelos)
- [ ] Modelos guardados en models/
- [ ] src/model_trainer.py completado

### Fase 5: Evaluación
- [ ] R² calculado para ambos modelos
- [ ] MSE y MAE reportados
- [ ] Tabla comparativa creada
- [ ] Importancia de variables analizada
- [ ] Conclusiones documentadas
- [ ] 03_evaluacion.ipynb completado

### Fase 6: Implementación
**Streamlit**:
- [ ] frontend/app.py creado
- [ ] App ejecutable (streamlit run ...)
- [ ] 5 tabs funcionales
- [ ] Mapas interactivos
- [ ] Gráficos actualizándose

**O React**:
- [ ] frontend/ con estructura completa
- [ ] backend/api.py con FastAPI
- [ ] Mapa 3D (Deck.gl + Mapbox)
- [ ] Dashboard con métricas
- [ ] Filtros dinámicos

### Entregables
- [ ] Código Python limpio y documentado
- [ ] Notebooks ejecutables
- [ ] Frontend funcional
- [ ] Datasets en outputs/
- [ ] README.md y documentación
- [ ] CRISP_DM_REPORT.md formal
- [ ] Proyecto_final.docx entregable

---

## 📊 Métricas de Éxito

| Métrica | Benchmark | Meta |
|---------|-----------|------|
| **R² Alkalinity** | 0.20 | ≥ 0.40 |
| **R² Conductance** | 0.20 | ≥ 0.40 |
| **R² Phosphorus** | 0.20 | ≥ 0.40 |
| **Retención datos** | ≥ 70% | ✅ 100% |
| **Modelos guardados** | - | 6 (.pkl) |
| **Código reutilizable** | - | ✅ Funciones modulares |
| **Frontend funcional** | - | ✅ Streamlit o React |

---

## 🔗 Referencias

- **EY AI & Data Challenge**: https://www.ey.com/en/ai-challenge
- **CRISP-DM**: https://en.wikipedia.org/wiki/Cross-industry_standard_process_for_data_mining
- **Scikit-learn docs**: https://scikit-learn.org/
- **XGBoost docs**: https://xgboost.readthedocs.io/
- **Streamlit docs**: https://docs.streamlit.io/
- **Deck.gl docs**: https://deck.gl/

---

## 📞 Contacto / Soporte

**Equipo de Desarrollo**:
- Alejandra Roa Alonso
- Hector Ulises Hernández Dominguez
- Katia Marcela Carpio Domínguez
- Juan Manuel Palafox Valdes

**Profesor**: Juan Damián Silva Galindo

---

**Última actualización**: Mayo 2026  
**Estado**: En Desarrollo (Fases 4–6 activas)
