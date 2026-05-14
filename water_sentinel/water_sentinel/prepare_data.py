import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.inspection import partial_dependence
import json
import os

# Configuracion
df = pd.read_csv('../water_quality_ml/data/dataset_winsorizado.csv', index_col=0)
features = ['pet', 'nir', 'green', 'swir16', 'swir22', 'NDMI', 'MNDWI', 'Latitude', 'Longitude']
targets = ['Total Alkalinity', 'Electrical Conductance', 'Dissolved Reactive Phosphorus']

os.makedirs('public/data', exist_ok=True)

print("Procesando dataset...")

# 1. Estaciones unicas con promedios
print("1. Generando stations.json...")
stations = df.groupby(['Latitude', 'Longitude'])[targets].mean().reset_index()
stations.to_json('public/data/stations.json', orient='records', double_precision=4)
print(f"   OK: {len(stations)} estaciones")

# 2. Matriz de correlacion
print("2. Generando correlations.json...")
numeric_cols = features + targets
corr = df[numeric_cols].corr().round(4)
with open('public/data/correlations.json', 'w') as f:
    json.dump({'columns': numeric_cols, 'values': corr.values.tolist()}, f)
print("   OK: Matriz 13x13")

# 3. Muestra para scatter plots
print("3. Generando scatter_sample.json...")
sample = df[numeric_cols].sample(n=2000, random_state=42)
sample.to_json('public/data/scatter_sample.json', orient='records', double_precision=4)
print("   OK: 2000 filas de muestra")

# 4. Entrenar modelos
print("4. Entrenando Random Forest + XGBoost...")
X = df[features]
y = df[targets]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

scaler = StandardScaler()
X_train_sc = scaler.fit_transform(X_train)
X_test_sc = scaler.transform(X_test)

metrics = {'rf': {}, 'xgb': {}}
importances = {}
rf_models = {}

# Random Forest
for target in targets:
    rf = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
    rf.fit(X_train_sc, y_train[target])
    pred = rf.predict(X_test_sc)
    rf_models[target] = rf

    r2 = r2_score(y_test[target], pred)
    mae = mean_absolute_error(y_test[target], pred)
    metrics['rf'][target] = {'r2': round(r2, 4), 'mae': round(mae, 2)}
    importances[target] = {f: round(v, 4) for f, v in zip(features, rf.feature_importances_)}
    print(f"   RF {target}: R²={r2:.4f}")

# XGBoost
try:
    from xgboost import XGBRegressor
    for target in targets:
        xgb = XGBRegressor(n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42, n_jobs=-1)
        xgb.fit(X_train_sc, y_train[target])
        pred = xgb.predict(X_test_sc)
        r2 = r2_score(y_test[target], pred)
        mae = mean_absolute_error(y_test[target], pred)
        metrics['xgb'][target] = {'r2': round(r2, 4), 'mae': round(mae, 2)}
        print(f"   XGB {target}: R²={r2:.4f}")
except ImportError:
    print("   XGBoost no disponible, usando valores por defecto")
    metrics['xgb'] = {t: {'r2': 0, 'mae': 0} for t in targets}

with open('public/data/model_results.json', 'w') as f:
    json.dump({'metrics': metrics, 'importances': importances}, f)
print("   OK: model_results.json")

# 5. Partial Dependence Plots
print("5. Calculando Partial Dependence Plots...")
pdp_data = {}
X_train_df = pd.DataFrame(X_train_sc, columns=features)

for target in targets:
    pdp_data[target] = {}
    for i, feat in enumerate(features):
        result = partial_dependence(
            rf_models[target], X_train_df, features=[i],
            kind='average', grid_resolution=50
        )
        pdp_data[target][feat] = {
            'x': [round(v, 4) for v in result['grid_values'][0].tolist()],
            'y': [round(v, 4) for v in result['average'][0].tolist()]
        }

feature_ranges = {f: {'min': round(X[f].min(), 2), 'max': round(X[f].max(), 2)} for f in features}
with open('public/data/pdp_data.json', 'w') as f:
    json.dump({'pdp': pdp_data, 'feature_ranges': feature_ranges}, f)
print("   OK: 27 curvas PDP (9 features x 3 targets)")

print("\nDONE: Todos los JSONs generados en public/data/")
print(f"   - stations.json ({len(stations)} estaciones)")
print(f"   - correlations.json (13x13)")
print(f"   - scatter_sample.json (2000 puntos)")
print(f"   - model_results.json (RF + XGBoost metrics)")
print(f"   - pdp_data.json (27 curvas)")
