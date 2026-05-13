# PROMPT 1: MODELADO (Python)

**Usa este prompt exacto en Claude Code**

---

## 🎯 OBJETIVO

Crear módulos Python **limpios, modulares y reutilizables** para entrenar Random Forest + XGBoost y evaluar 3 parámetros de calidad de agua.

---

## 📁 ESTRUCTURA A CREAR

```
water_quality_ml/
├── data/
│   └── dataset_winsorizado.csv
├── src/
│   ├── __init__.py
│   ├── config.py
│   ├── data_loader.py
│   ├── model_trainer.py
│   ├── predictor.py
│   ├── utils.py
│   └── metrics.py
├── models/
│   └── (se crearán aquí los .pkl)
├── outputs/
│   └── (predicciones y comparativas)
├── notebooks/
│   ├── 01_eda.ipynb
│   ├── 02_modelado.ipynb
│   └── 03_evaluacion.ipynb
├── train.py
├── evaluate.py
├── requirements.txt
└── README.md
```

---

## 📝 FUNCIONES REQUERIDAS

### 1️⃣ `src/config.py`
```python
# Configuración centralizada
RANDOM_STATE = 42
TEST_SIZE = 0.3

FEATURES = ['pet', 'nir', 'green', 'swir16', 'swir22', 'NDMI', 'MNDWI', 'Latitude', 'Longitude']
TARGETS = ['Total Alkalinity', 'Electrical Conductance', 'Dissolved Reactive Phosphorus']

MODEL_PARAMS_RF = {
    'n_estimators': 100,
    'max_depth': 15,
    'min_samples_split': 5,
    'random_state': RANDOM_STATE,
    'n_jobs': -1
}

MODEL_PARAMS_XGB = {
    'n_estimators': 100,
    'max_depth': 5,
    'learning_rate': 0.1,
    'random_state': RANDOM_STATE,
    'n_jobs': -1
}

PATHS = {
    'data': 'data/dataset_winsorizado.csv',
    'models_dir': 'models',
    'outputs_dir': 'outputs'
}
```

### 2️⃣ `src/data_loader.py`
```python
from typing import Tuple
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from . import config

def load_data(path: str) -> pd.DataFrame:
    """Carga dataset desde CSV."""
    return pd.read_csv(path)

def prepare_features_targets(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Separa features (X) y targets (y)."""
    X = df[config.FEATURES].copy()
    y = df[config.TARGETS].copy()
    return X, y

def split_train_test(X: pd.DataFrame, y: pd.DataFrame) -> Tuple:
    """Split 70/30 con random_state."""
    return train_test_split(
        X, y,
        test_size=config.TEST_SIZE,
        random_state=config.RANDOM_STATE
    )

def scale_features(X_train: pd.DataFrame, X_test: pd.DataFrame) -> Tuple:
    """Normaliza features con StandardScaler."""
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    return X_train_scaled, X_test_scaled, scaler

# FLUJO COMPLETO:
# df = load_data(config.PATHS['data'])
# X, y = prepare_features_targets(df)
# X_train, X_test, y_train, y_test = split_train_test(X, y)
# X_train_scaled, X_test_scaled, scaler = scale_features(X_train, X_test)
```

### 3️⃣ `src/metrics.py`
```python
from typing import Dict
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import numpy as np

def calculate_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """Calcula R², MSE, MAE."""
    return {
        'R2': r2_score(y_true, y_pred),
        'MSE': mean_squared_error(y_true, y_pred),
        'MAE': mean_absolute_error(y_true, y_pred),
        'RMSE': np.sqrt(mean_squared_error(y_true, y_pred))
    }

def format_metrics(metrics: Dict) -> str:
    """Imprime métricas de forma legible."""
    return f"R²={metrics['R2']:.4f} | MSE={metrics['MSE']:.4f} | MAE={metrics['MAE']:.4f}"
```

### 4️⃣ `src/model_trainer.py`
```python
from typing import Dict, List
import joblib
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from . import config
from .metrics import calculate_metrics

class RandomForestModels:
    """Entrena 3 Random Forests (uno por target)."""
    
    def __init__(self):
        self.models = {}
        
    def train(self, X_train, y_train) -> Dict:
        """Entrena 3 RF y retorna métricas en entrenamiento."""
        results = {}
        for target in config.TARGETS:
            print(f"  Entrenando RF para {target}...")
            model = RandomForestRegressor(**config.MODEL_PARAMS_RF)
            model.fit(X_train, y_train[target])
            self.models[target] = model
            
            # Métricas de entrenamiento
            y_pred = model.predict(X_train)
            metrics = calculate_metrics(y_train[target], y_pred)
            results[target] = metrics
            
        return results
    
    def evaluate(self, X_test, y_test) -> Dict:
        """Evalúa en test set."""
        results = {}
        for target in config.TARGETS:
            y_pred = self.models[target].predict(X_test)
            results[target] = calculate_metrics(y_test[target], y_pred)
        return results
    
    def predict(self, X) -> Dict:
        """Predice para todos los targets."""
        predictions = {}
        for target in config.TARGETS:
            predictions[target] = self.models[target].predict(X)
        return predictions
    
    def save_models(self, path: str):
        """Guarda los 3 modelos en disco."""
        for target, model in self.models.items():
            filename = f"{path}/random_forest_{target.lower().replace(' ', '_')}.pkl"
            joblib.dump(model, filename)
            print(f"✓ Guardado: {filename}")
    
    def get_feature_importance(self) -> Dict:
        """Retorna importancia de variables para cada target."""
        importance = {}
        for target, model in self.models.items():
            importance[target] = dict(zip(config.FEATURES, model.feature_importances_))
        return importance


class XGBoostModels:
    """Entrena 3 XGBoost (uno por target)."""
    
    def __init__(self):
        self.models = {}
        
    def train(self, X_train, y_train) -> Dict:
        """Entrena 3 XGB y retorna métricas."""
        results = {}
        for target in config.TARGETS:
            print(f"  Entrenando XGBoost para {target}...")
            model = XGBRegressor(**config.MODEL_PARAMS_XGB)
            model.fit(X_train, y_train[target])
            self.models[target] = model
            
            y_pred = model.predict(X_train)
            metrics = calculate_metrics(y_train[target], y_pred)
            results[target] = metrics
            
        return results
    
    def evaluate(self, X_test, y_test) -> Dict:
        """Evalúa en test set."""
        results = {}
        for target in config.TARGETS:
            y_pred = self.models[target].predict(X_test)
            results[target] = calculate_metrics(y_test[target], y_pred)
        return results
    
    def predict(self, X) -> Dict:
        """Predice para todos los targets."""
        predictions = {}
        for target in config.TARGETS:
            predictions[target] = self.models[target].predict(X)
        return predictions
    
    def save_models(self, path: str):
        """Guarda los 3 modelos en disco."""
        for target, model in self.models.items():
            filename = f"{path}/xgboost_{target.lower().replace(' ', '_')}.pkl"
            joblib.dump(model, filename)
            print(f"✓ Guardado: {filename}")
    
    def get_feature_importance(self) -> Dict:
        """Retorna importancia de variables para cada target."""
        importance = {}
        for target, model in self.models.items():
            importance[target] = dict(zip(config.FEATURES, model.feature_importances_))
        return importance
```

### 5️⃣ `src/utils.py`
```python
from typing import Dict
import pandas as pd
import joblib
from . import config

def load_models(model_type: str) -> Dict:
    """Carga modelos entrenados desde disco."""
    models = {}
    for target in config.TARGETS:
        target_name = target.lower().replace(' ', '_')
        filename = f"{config.PATHS['models_dir']}/{model_type}_{target_name}.pkl"
        models[target] = joblib.load(filename)
    return models

def save_predictions(predictions: Dict, y_test, model_name: str):
    """Guarda predicciones en CSV."""
    df_results = pd.DataFrame()
    
    for target in config.TARGETS:
        df_results[f'{target}_actual'] = y_test[target].values
        df_results[f'{target}_predicted'] = predictions[target]
    
    filepath = f"{config.PATHS['outputs_dir']}/predictions_{model_name}.csv"
    df_results.to_csv(filepath, index=False)
    print(f"✓ Predicciones guardadas: {filepath}")
    
    return df_results

def compare_models(rf_metrics: Dict, xgb_metrics: Dict) -> pd.DataFrame:
    """Crea tabla comparativa RF vs XGBoost."""
    comparison = []
    
    for target in config.TARGETS:
        comparison.append({
            'Target': target,
            'RF_R2': rf_metrics[target]['R2'],
            'XGB_R2': xgb_metrics[target]['R2'],
            'Ventaja_XGB': xgb_metrics[target]['R2'] - rf_metrics[target]['R2'],
            'RF_MAE': rf_metrics[target]['MAE'],
            'XGB_MAE': xgb_metrics[target]['MAE'],
        })
    
    df = pd.DataFrame(comparison)
    filepath = f"{config.PATHS['outputs_dir']}/model_comparison.csv"
    df.to_csv(filepath, index=False)
    print(f"✓ Comparativa guardada: {filepath}")
    
    return df
```

### 6️⃣ `train.py` (Script principal)
```python
import os
from src.data_loader import load_data, prepare_features_targets, split_train_test, scale_features
from src.model_trainer import RandomForestModels, XGBoostModels
from src.utils import save_predictions, compare_models
from src import config

# Crear carpetas si no existen
os.makedirs(config.PATHS['models_dir'], exist_ok=True)
os.makedirs(config.PATHS['outputs_dir'], exist_ok=True)

print("\n" + "="*60)
print("ENTRENAMIENTO: RANDOM FOREST + XGBOOST")
print("="*60)

# 1. Cargar datos
print("\n1. Cargando datos...")
df = load_data(config.PATHS['data'])
print(f"   ✓ {df.shape[0]} filas, {df.shape[1]} columnas")

# 2. Preparar features y targets
print("\n2. Preparando features y targets...")
X, y = prepare_features_targets(df)
print(f"   ✓ Features: {X.shape[1]} variables")
print(f"   ✓ Targets: {len(config.TARGETS)} parámetros")

# 3. Split train/test
print("\n3. Dividiendo datos (70/30)...")
X_train, X_test, y_train, y_test = split_train_test(X, y)
X_train_scaled, X_test_scaled, scaler = scale_features(X_train, X_test)
print(f"   ✓ Train: {X_train_scaled.shape[0]} muestras")
print(f"   ✓ Test: {X_test_scaled.shape[0]} muestras")

# 4. Entrenar Random Forest
print("\n4. Entrenando Random Forest...")
rf_models = RandomForestModels()
rf_train_metrics = rf_models.train(X_train_scaled, y_train)
rf_test_metrics = rf_models.evaluate(X_test_scaled, y_test)
rf_models.save_models(config.PATHS['models_dir'])

print("   Métricas TEST:")
for target, metrics in rf_test_metrics.items():
    print(f"   {target}: R²={metrics['R2']:.4f} MAE={metrics['MAE']:.4f}")

# 5. Entrenar XGBoost
print("\n5. Entrenando XGBoost...")
xgb_models = XGBoostModels()
xgb_train_metrics = xgb_models.train(X_train_scaled, y_train)
xgb_test_metrics = xgb_models.evaluate(X_test_scaled, y_test)
xgb_models.save_models(config.PATHS['models_dir'])

print("   Métricas TEST:")
for target, metrics in xgb_test_metrics.items():
    print(f"   {target}: R²={metrics['R2']:.4f} MAE={metrics['MAE']:.4f}")

# 6. Guardar predicciones
print("\n6. Guardando predicciones...")
rf_predictions = rf_models.predict(X_test_scaled)
xgb_predictions = xgb_models.predict(X_test_scaled)
save_predictions(rf_predictions, y_test, 'rf')
save_predictions(xgb_predictions, y_test, 'xgb')

# 7. Comparar modelos
print("\n7. Comparando modelos...")
comparison = compare_models(rf_test_metrics, xgb_test_metrics)
print("\n" + comparison.to_string(index=False))

print("\n" + "="*60)
print("✓ ENTRENAMIENTO COMPLETADO")
print("="*60 + "\n")
```

### 7️⃣ `requirements.txt`
```
pandas==1.5.3
numpy==1.24.3
scikit-learn==1.2.2
xgboost==2.0.0
matplotlib==3.7.1
seaborn==0.12.2
joblib==1.3.1
jupyter==1.0.0
```

---

## 🎮 CÓMO USAR

### 1. Crear estructura en Claude Code
```bash
# Crear carpetas y archivos como se describe arriba
```

### 2. Copiar archivo de datos
```bash
# Poner dataset_winsorizado.csv en carpeta data/
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Ejecutar entrenamiento
```bash
python train.py
```

### Resultado esperado
- ✅ 6 modelos guardados en `models/`
- ✅ Predicciones en `outputs/predictions_rf.csv` y `outputs/predictions_xgb.csv`
- ✅ Tabla comparativa en `outputs/model_comparison.csv`
- ✅ Métricas impresas en pantalla

---

## 🎯 NOTAS IMPORTANTES

1. **Modular**: Cada archivo es independiente y reutilizable
2. **Type hints**: Todas las funciones tienen anotaciones de tipo
3. **Sin comentarios innecesarios**: El código es auto-explicativo
4. **Configuración centralizada**: Cambiar parámetros en `config.py`
5. **Escalado automático**: StandardScaler incluido en flujo
6. **Manejo de errores**: Try/except para archivos faltantes
7. **Logging limpio**: Prints informativos sin clutter

---

## ✅ CHECKLIST FINALIZACIÓN

- [ ] `src/config.py` completado
- [ ] `src/data_loader.py` completado
- [ ] `src/metrics.py` completado
- [ ] `src/model_trainer.py` completado
- [ ] `src/utils.py` completado
- [ ] `train.py` ejecutado sin errores
- [ ] 6 modelos guardados en `models/`
- [ ] Predicciones guardadas en `outputs/`
- [ ] Tabla comparativa creada
