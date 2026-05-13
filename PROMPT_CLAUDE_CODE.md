# PROMPT PARA CLAUDE CODE

Copia este prompt completo y pégalo en Claude Code:

---

## Prompt:

```
Necesito que crees un proyecto Python limpio, modular y reutilizable para:

1. MODELADO: Random Forest + XGBoost para predecir 3 variables de calidad de agua
2. VISUALIZACIÓN: Streamlit app interactiva con mapas, gráficos y filtros

## ESTRUCTURA DE CARPETAS (HAZLA TÚ):
```
water_quality_ml/
├── data/
│   └── dataset_winsorizado.csv
├── src/
│   ├── __init__.py
│   ├── data_loader.py
│   ├── model_trainer.py
│   ├── predictor.py
│   └── utils.py
├── models/
│   └── (aquí guardarás RF y XGBoost entrenados)
├── outputs/
│   └── predictions.csv
├── app.py
└── requirements.txt
```

## REQUISITOS FUNCIONALES:

### DATA_LOADER.PY
- Función `load_data(path)`: carga CSV, retorna DataFrame
- Función `prepare_features()`: separa X (features) y y (targets: los 3 parámetros)
- Función `split_data(X, y, test_size=0.3)`: train/test split
- Función `scale_features(X_train, X_test)`: StandardScaler
- **Nota**: NO uses transformación log, usa datos winso ya los tienes

### MODEL_TRAINER.PY
- Clase `RandomForestModels()`:
  - `train(X_train, y_train)` → entrena 3 RF (uno por target)
  - `evaluate(X_test, y_test)` → retorna dict con R², MSE, MAE
  - `save_models(path)` → guarda los 3 modelos
  
- Clase `XGBoostModels()`:
  - `train(X_train, y_train)` → entrena 3 XGBoost (uno por target)
  - Usa hiperparámetros básicos: max_depth=5, learning_rate=0.1, n_estimators=100
  - `evaluate(X_test, y_test)` → retorna dict con R², MSE, MAE
  - `save_models(path)` → guarda los 3 modelos

### PREDICTOR.PY
- Función `load_models(path, model_type)`: carga RF o XGBoost desde disco
- Función `predict_all_targets(models, X)`: predice los 3 targets
- Función `compare_models(rf_models, xgb_models, X_test, y_test)`: compara RF vs XGBoost, retorna tabla

### UTILS.PY
- Función `plot_importance(model, feature_names, target_name)`: importancia de variables
- Función `plot_predictions_vs_actual(y_true, y_pred, target_name)`: gráfico real vs predicho
- Función `calculate_metrics(y_true, y_pred)`: retorna dict {R2, MSE, MAE}

### APP.PY (STREAMLIT)
- Header con título + descripción
- Sidebar con opciones:
  1. "📊 Entrenar Modelos" → botón que ejecuta RF + XGBoost, muestra métricas en tabla
  2. "🗺️ Mapa Interactivo" → mapa de Sudáfrica con estaciones coloreadas por predicción
  3. "📈 Análisis de Variables" → gráfico de importancia (RF vs XGBoost)
  4. "📉 Predicciones vs Real" → 3 tabs (uno por target) con scatter plots
  5. "📥 Descargar Resultados" → botón CSV con predicciones

## DETALLES TÉCNICOS:

- **Librerías**: scikit-learn, xgboost, pandas, numpy, streamlit, folium, streamlit-folium, matplotlib, seaborn
- **Features a usar**: pet, nir, green, swir16, swir22, NDMI, MNDWI (+ geográficas)
- **Targets**: Total Alkalinity, Electrical Conductance, Dissolved Reactive Phosphorus
- **Train/test split**: 70/30
- **Escalado**: StandardScaler en features
- **Modelos guardar**: .pkl con joblib

## ESTILO DE CÓDIGO:

- Type hints en todas las funciones
- Docstrings en formato Google
- Nombres claros: `rf_models`, `xgb_models`, `X_train`, `y_test`, `predictions`
- Manejo de errores: try/except para carga de modelos
- **SIN comentarios innecesarios**, código auto-explicativo
- Funciones cortas (max 20 líneas), una responsabilidad cada una

## OUTPUT FINAL:

El script debe:
1. Cargar datos
2. Entrenar RF + XGBoost en paralelo
3. Comparar métricas (most