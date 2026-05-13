# PROMPT 2: FRONTEND STREAMLIT (Opción Fácil)

**Usa este prompt exacto en Claude Code**

---

## 🎯 OBJETIVO

Crear una aplicación Streamlit **limpia y profesional** que:
- 📊 Muestre métricas de modelos ML
- 🗺️ Visualice datos en mapa interactivo
- 📈 Grafique importancia de variables y predicciones
- 🎚️ Tenga filtros dinámicos
- 📥 Permita descargar resultados

---

## 📁 ESTRUCTURA

```
water_quality_ml/
├── frontend/
│   ├── app.py                 # Main Streamlit app
│   ├── pages/
│   │   ├── 1_📊_Dashboard.py
│   │   ├── 2_🗺️_Mapa.py
│   │   ├── 3_📈_Análisis.py
│   │   ├── 4_📉_Predicciones.py
│   │   └── 5_📥_Descargar.py
│   └── utils/
│       ├── loaders.py         # Carga modelos y datos
│       ├── visualizations.py  # Gráficos
│       └── helpers.py         # Funciones auxiliares
├── models/                    # (Aquí están los .pkl del modelado)
├── outputs/                   # (Aquí están las predicciones .csv)
└── requirements.txt
```

---

## 📝 ARCHIVOS A CREAR

### 1️⃣ `frontend/app.py` (Página Principal)

```python
import streamlit as st
import pandas as pd
from pathlib import Path

# Config página
st.set_page_config(
    page_title="Water Quality ML",
    page_icon="💧",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .metric-box { 
        background-color: #f0f2f6; 
        padding: 20px; 
        border-radius: 10px; 
        margin: 10px 0;
    }
    .title-section { 
        color: #0066cc; 
        font-size: 28px; 
        font-weight: bold; 
        margin: 20px 0;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown("""
<div style="text-align: center; margin-bottom: 30px;">
    <h1 💧 Predicción de Calidad de Agua - Sudáfrica</h1>
    <p style="font-size: 16px; color: gray;">
        Modelos ML (Random Forest + XGBoost) usando datos satelitales Landsat + TerraClimate
    </p>
</div>
""", unsafe_allow_html=True)

# Sidebar navegación
st.sidebar.title("📱 Navegación")
st.sidebar.markdown("---")

# Info proyecto
with st.sidebar.expander("ℹ️ Acerca del Proyecto"):
    st.markdown("""
    **Objetivo**: Predecir parámetros de calidad de agua en ríos de Sudáfrica
    
    **Parámetros**:
    - Total Alkalinity (alcalinidad)
    - Electrical Conductance (sales disueltas)
    - Dissolved Reactive Phosphorus (fósforo)
    
    **Datos**: 9,319 mediciones | 162 estaciones | 2011-2015
    
    **Modelos**: Random Forest + XGBoost
    """)

# Info modelos
with st.sidebar.expander("🤖 Modelos Entrenados"):
    st.markdown("""
    **Random Forest**:
    - 100 árboles
    - Max depth: 15
    
    **XGBoost**:
    - 100 estimadores
    - Max depth: 5
    - Learning rate: 0.1
    """)

st.sidebar.markdown("---")

# Página principal (dashboard)
col1, col2, col3 = st.columns(3)

with col1:
    st.metric(
        label="📊 Estaciones",
        value="162",
        delta="Sudáfrica"
    )

with col2:
    st.metric(
        label="📅 Período",
        value="2011-2015",
        delta="5 años"
    )

with col3:
    st.metric(
        label="🎯 Benchmark",
        value="R² = 0.20",
        delta="EY"
    )

st.markdown("---")

# Resumen modelos
st.markdown("### 🏆 Rendimiento de Modelos (Test Set)")

try:
    comparison_df = pd.read_csv('outputs/model_comparison.csv')
    st.dataframe(
        comparison_df,
        use_container_width=True,
        hide_index=True
    )
except FileNotFoundError:
    st.warning("⚠️ Archivo model_comparison.csv no encontrado. Ejecuta el entrenamiento primero.")

st.markdown("---")

# Instrucciones
st.markdown("""
### 📖 Cómo Usar

1. **🗺️ Mapa**: Visualiza las 162 estaciones en Sudáfrica
2. **📈 Análisis**: Ve la importancia de cada variable en las predicciones
3. **📉 Predicciones**: Compara predicciones reales vs modelos
4. **📥 Descargar**: Exporta los resultados en CSV

Usa el menú lateral para navegar entre páginas.
""")
```

### 2️⃣ `frontend/pages/1_📊_Dashboard.py`

```python
import streamlit as st
import pandas as pd
import plotly.graph_objects as go
from pathlib import Path

st.set_page_config(page_title="Dashboard", page_icon="📊", layout="wide")

st.markdown("# 📊 Dashboard de Métricas")

st.markdown("""
Comparativa de rendimiento entre Random Forest y XGBoost
""")

try:
    comparison_df = pd.read_csv('outputs/model_comparison.csv')
    
    # Tabla principal
    st.markdown("### Métricas por Parámetro")
    st.dataframe(comparison_df, use_container_width=True, hide_index=True)
    
    # Gráfico R² RF vs XGB
    st.markdown("### R² Comparison: Random Forest vs XGBoost")
    fig = go.Figure(data=[
        go.Bar(x=comparison_df['Target'], y=comparison_df['RF_R2'], name='Random Forest', marker_color='#1f77b4'),
        go.Bar(x=comparison_df['Target'], y=comparison_df['XGB_R2'], name='XGBoost', marker_color='#ff7f0e')
    ])
    fig.add_hline(y=0.20, line_dash="dash", line_color="red", annotation_text="Benchmark EY (0.20)")
    fig.update_layout(
        barmode='group',
        title="R² por Parámetro",
        xaxis_title="Parámetro",
        yaxis_title="R² Score",
        hovermode='x unified',
        height=400
    )
    st.plotly_chart(fig, use_container_width=True)
    
    # Tabla MAE
    st.markdown("### MAE (Error Absoluto Medio)")
    mae_comparison = comparison_df[['Target', 'RF_MAE', 'XGB_MAE']].copy()
    mae_comparison['Mejora (%)'] = ((mae_comparison['RF_MAE'] - mae_comparison['XGB_MAE']) / mae_comparison['RF_MAE'] * 100).round(2)
    st.dataframe(mae_comparison, use_container_width=True, hide_index=True)
    
    # Conclusiones
    st.markdown("### 📌 Conclusiones Principales")
    
    mejor_modelo = 'XGBoost' if comparison_df['XGB_R2'].mean() > comparison_df['RF_R2'].mean() else 'Random Forest'
    mejora_promedio = (comparison_df['XGB_R2'].mean() - comparison_df['RF_R2'].mean()) * 100
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric(
            "Mejor Modelo",
            mejor_modelo,
            f"+{mejora_promedio:.2f}%" if mejora_promedio > 0 else f"{mejora_promedio:.2f}%"
        )
    
    with col2:
        max_r2 = comparison_df['XGB_R2'].max()
        st.metric(
            "Mejor R² (XGB)",
            f"{max_r2:.4f}",
            f"+{(max_r2 - 0.20)*100:.0f}% vs benchmark"
        )
    
    with col3:
        supera_benchmark = (comparison_df['XGB_R2'] >= 0.40).sum()
        st.metric(
            "Parámetros ≥ 0.40",
            f"{supera_benchmark}/3",
            "Meta alcanzada" if supera_benchmark >= 1 else "En progreso"
        )

except FileNotFoundError:
    st.error("❌ Archivo model_comparison.csv no encontrado")
```

### 3️⃣ `frontend/pages/2_🗺️_Mapa.py`

```python
import streamlit as st
import pandas as pd
import folium
from streamlit_folium import st_folium

st.set_page_config(page_title="Mapa", page_icon="🗺️", layout="wide")

st.markdown("# 🗺️ Ubicación de Estaciones")

st.markdown("""
Mapa interactivo de las 162 estaciones de monitoreo en Sudáfrica.
Click en los puntos para ver detalles.
""")

try:
    # Cargar datos
    df = pd.read_csv('data/dataset_winsorizado.csv')
    
    # Crear mapa centrado en Sudáfrica
    map_center = [-28.5, 26.5]
    m = folium.Map(
        location=map_center,
        zoom_start=6,
        tiles='OpenStreetMap'
    )
    
    # Estadísticas por punto
    df_stations = df.drop_duplicates(subset=['Latitude', 'Longitude'])
    
    # Normalizar Phosphorus para color
    phosphorus_min = df['Dissolved Reactive Phosphorus'].min()
    phosphorus_max = df['Dissolved Reactive Phosphorus'].max()
    
    # Agregar puntos
    for idx, row in df_stations.iterrows():
        norm_phosphorus = (row['Dissolved Reactive Phosphorus'] - phosphorus_min) / (phosphorus_max - phosphorus_min)
        
        # Color según fósforo (rojo = alto = eutrofización)
        if norm_phosphorus > 0.66:
            color = 'red'
            icon_color = 'white'
        elif norm_phosphorus > 0.33:
            color = 'orange'
            icon_color = 'white'
        else:
            color = 'green'
            icon_color = 'white'
        
        popup_text = f"""
        <b>Coordenadas</b><br>
        Lat: {row['Latitude']:.4f}<br>
        Lon: {row['Longitude']:.4f}<br>
        <br>
        <b>Calidad del Agua</b><br>
        Alkalinity: {row['Total Alkalinity']:.2f}<br>
        Conductance: {row['Electrical Conductance']:.2f}<br>
        Phosphorus: {row['Dissolved Reactive Phosphorus']:.2f}
        """
        
        folium.CircleMarker(
            location=[row['Latitude'], row['Longitude']],
            radius=5,
            popup=folium.Popup(popup_text, max_width=250),
            color=color,
            fill=True,
            fillColor=color,
            fillOpacity=0.7,
            weight=1
        ).add_to(m)
    
    # Agregar leyenda
    legend_html = '''
    <div style="position: fixed; 
        bottom: 50px; right: 50px; width: 200px; height: 160px; 
        background-color: white; border:2px solid grey; z-index:9999; 
        font-size:14px; padding: 10px">
        
        <p style="margin: 0; font-weight: bold;">Nivel de Fósforo</p>
        <p style="margin: 5px 0;"><i style="background:green; width:20px; height:20px; display:inline-block; border-radius:50%;"></i> Bajo (&lt;1/3)</p>
        <p style="margin: 5px 0;"><i style="background:orange; width:20px; height:20px; display:inline-block; border-radius:50%;"></i> Medio (1/3-2/3)</p>
        <p style="margin: 5px 0;"><i style="background:red; width:20px; height:20px; display:inline-block; border-radius:50%;"></i> Alto (&gt;2/3)</p>
    </div>
    '''
    m.get_root().html.add_child(folium.Element(legend_html))
    
    # Mostrar mapa
    st_folium(m, width=1200, height=600)
    
    st.markdown(f"**Total de estaciones**: {len(df_stations)}")

except FileNotFoundError:
    st.error("❌ Archivo dataset_winsorizado.csv no encontrado")
```

### 4️⃣ `frontend/pages/3_📈_Análisis.py`

```python
import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import joblib

st.set_page_config(page_title="Análisis", page_icon="📈", layout="wide")

st.markdown("# 📈 Importancia de Variables")

st.markdown("""
¿Cuáles son los predictores más importantes para cada parámetro?
""")

# Selector modelo
modelo_seleccionado = st.radio("Selecciona modelo", ["Random Forest", "XGBoost"], horizontal=True)
modelo_tipo = "random_forest" if modelo_seleccionado == "Random Forest" else "xgboost"

targets = [
    'Total Alkalinity',
    'Electrical Conductance',
    'Dissolved Reactive Phosphorus'
]

try:
    # Crear tabs por parámetro
    tabs = st.tabs(targets)
    
    for tab, target in zip(tabs, targets):
        with tab:
            # Cargar modelo
            target_name = target.lower().replace(' ', '_')
            model_path = f'models/{modelo_tipo}_{target_name}.pkl'
            model = joblib.load(model_path)
            
            # Obtener importancia
            features = ['pet', 'nir', 'green', 'swir16', 'swir22', 'NDMI', 'MNDWI', 'Latitude', 'Longitude']
            importance = dict(zip(features, model.feature_importances_))
            importance_sorted = dict(sorted(importance.items(), key=lambda x: x[1], reverse=True))
            
            # Gráfico
            fig = go.Figure(
                data=go.Bar(
                    x=list(importance_sorted.values()),
                    y=list(importance_sorted.keys()),
                    orientation='h',
                    marker_color='#1f77b4'
                )
            )
            fig.update_layout(
                title=f"Importancia de Variables - {target}",
                xaxis_title="Importancia",
                yaxis_title="Variable",
                height=400,
                showlegend=False
            )
            st.plotly_chart(fig, use_container_width=True)
            
            # Tabla
            df_importance = pd.DataFrame(
                list(importance_sorted.items()),
                columns=['Variable', 'Importancia']
            )
            df_importance['% Total'] = (df_importance['Importancia'] * 100).round(2)
            st.dataframe(df_importance, use_container_width=True, hide_index=True)

except FileNotFoundError as e:
    st.error(f"❌ Error al cargar modelos: {e}")
```

### 5️⃣ `frontend/pages/4_📉_Predicciones.py`

```python
import streamlit as st
import pandas as pd
import plotly.graph_objects as go

st.set_page_config(page_title="Predicciones", page_icon="📉", layout="wide")

st.markdown("# 📉 Predicciones vs Real")

st.markdown("""
Comparación de valores reales vs predichos para cada modelo y parámetro.
""")

targets = [
    'Total Alkalinity',
    'Electrical Conductance',
    'Dissolved Reactive Phosphorus'
]

try:
    # Cargar predicciones
    df_rf = pd.read_csv('outputs/predictions_rf.csv')
    df_xgb = pd.read_csv('outputs/predictions_xgb.csv')
    
    # Tabs por parámetro
    tabs = st.tabs(targets)
    
    for tab, target in zip(tabs, targets):
        with tab:
            col1, col2 = st.columns(2)
            
            # Random Forest
            with col1:
                st.markdown(f"### Random Forest - {target}")
                col_actual = f'{target}_actual'
                col_pred = f'{target}_predicted'
                
                fig = go.Figure()
                fig.add_trace(go.Scatter(
                    x=df_rf[col_actual],
                    y=df_rf[col_pred],
                    mode='markers',
                    marker=dict(size=5, color='#1f77b4', opacity=0.6),
                    name='Predicciones'
                ))
                
                # Línea de referencia (y=x)
                max_val = max(df_rf[col_actual].max(), df_rf[col_pred].max())
                fig.add_trace(go.Scatter(
                    x=[0, max_val],
                    y=[0, max_val],
                    mode='lines',
                    line=dict(color='red', dash='dash'),
                    name='Referencia (y=x)'
                ))
                
                fig.update_layout(
                    title=f"Predicción vs Real",
                    xaxis_title="Real",
                    yaxis_title="Predicho",
                    height=400,
                    hovermode='closest'
                )
                st.plotly_chart(fig, use_container_width=True)
            
            # XGBoost
            with col2:
                st.markdown(f"### XGBoost - {target}")
                
                fig = go.Figure()
                fig.add_trace(go.Scatter(
                    x=df_xgb[col_actual],
                    y=df_xgb[col_pred],
                    mode='markers',
                    marker=dict(size=5, color='#ff7f0e', opacity=0.6),
                    name='Predicciones'
                ))
                
                max_val = max(df_xgb[col_actual].max(), df_xgb[col_pred].max())
                fig.add_trace(go.Scatter(
                    x=[0, max_val],
                    y=[0, max_val],
                    mode='lines',
                    line=dict(color='red', dash='dash'),
                    name='Referencia (y=x)'
                ))
                
                fig.update_layout(
                    title=f"Predicción vs Real",
                    xaxis_title="Real",
                    yaxis_title="Predicho",
                    height=400,
                    hovermode='closest'
                )
                st.plotly_chart(fig, use_container_width=True)

except FileNotFoundError:
    st.error("❌ Archivos de predicciones no encontrados")
```

### 6️⃣ `frontend/pages/5_📥_Descargar.py`

```python
import streamlit as st
import pandas as pd
from pathlib import Path

st.set_page_config(page_title="Descargar", page_icon="📥", layout="wide")

st.markdown("# 📥 Descargar Resultados")

st.markdown("""
Descarga los archivos de resultados en formato CSV.
""")

archivos_disponibles = {
    'Predicciones Random Forest': 'outputs/predictions_rf.csv',
    'Predicciones XGBoost': 'outputs/predictions_xgb.csv',
    'Comparativa de Modelos': 'outputs/model_comparison.csv',
}

col1, col2, col3 = st.columns(3)

with col1:
    if Path('outputs/predictions_rf.csv').exists():
        with open('outputs/predictions_rf.csv', 'rb') as f:
            st.download_button(
                label="📊 Predicciones RF",
                data=f.read(),
                file_name="predictions_rf.csv",
                mime="text/csv"
            )
    else:
        st.warning("No disponible")

with col2:
    if Path('outputs/predictions_xgb.csv').exists():
        with open('outputs/predictions_xgb.csv', 'rb') as f:
            st.download_button(
                label="📊 Predicciones XGB",
                data=f.read(),
                file_name="predictions_xgb.csv",
                mime="text/csv"
            )
    else:
        st.warning("No disponible")

with col3:
    if Path('outputs/model_comparison.csv').exists():
        with open('outputs/model_comparison.csv', 'rb') as f:
            st.download_button(
                label="📊 Comparativa",
                data=f.read(),
                file_name="model_comparison.csv",
                mime="text/csv"
            )
    else:
        st.warning("No disponible")

st.markdown("---")

# Resumen de archivos
st.markdown("### 📋 Archivos Disponibles")
for nombre, ruta in archivos_disponibles.items():
    if Path(ruta).exists():
        df = pd.read_csv(ruta)
        st.markdown(f"""
        **{nombre}**
        - Filas: {len(df)}
        - Columnas: {len(df.columns)}
        """)
```

### 7️⃣ `frontend/requirements.txt`

```
streamlit==1.28.0
pandas==1.5.3
plotly==5.17.0
folium==0.14.0
streamlit-folium==0.16.0
joblib==1.3.1
scikit-learn==1.2.2
xgboost==2.0.0
```

---

## 🚀 CÓMO EJECUTAR

### Instalación
```bash
cd frontend
pip install -r requirements.txt
```

### Ejecución
```bash
streamlit run app.py
```

### Resultado
- App abierta en `http://localhost:8501`
- 5 páginas (Dashboard, Mapa, Análisis, Predicciones, Descargar)
- Gráficos interactivos con Plotly
- Mapa con Folium
- Descargas de CSV

---

## 📝 NOTAS

- Las rutas `data/`, `models/`, `outputs/` deben existir
- Los archivos `.pkl` y `.csv` deben generarse primero con `train.py`
- Streamlit recarga automáticamente los cambios
- Los gráficos son completamente interactivos (hover, zoom, etc.)
- Responsive design (funciona en móvil)

---

## ✅ CHECKLIST

- [ ] Crear estructura de carpetas `frontend/pages/`
- [ ] `app.py` creado y funcional
- [ ] Las 5 páginas creadas
- [ ] `requirements.txt` generado
- [ ] `streamlit run app.py` ejecuta sin errores
- [ ] App visible en navegador
- [ ] Todos los gráficos aparecen
- [ ] Mapa interactivo funciona
- [ ] Descargas funcionan
