# analytics-service/app/ml.py
import os
import mlflow.pyfunc
import json
from typing import Dict, Any

MLFLOW_MODEL_URI = os.getenv("MLFLOW_MODEL_URI", "models:/player_perf_model/Production")

# This loader wraps MLflow model inference; in the hackathon demo this can be a stub
def load_model():
    # In a real deployment we will load the model once at startup.
    try:
        model = mlflow.pyfunc.load_model(MLFLOW_MODEL_URI)
        return model
    except Exception as e:
        # For demo, return None and let code handle prediction fallback
        print(f"Warning: failed to load MLflow model: {e}")
        return None

def predict(model, features: Dict[str, Any]):
    """
    features: a dict of arrays or single-row feature dict depending on model signature.
    In production the function will validate schema, scale features, and call model.predict
    """
    if model is None:
        # fallback heuristic: a simple weighted sum for demo if MLflow model not available
        score = 5.0
        # small heuristic using some keys if present
        score += (features.get("recent_goals", 0) * 0.7)
        score += (features.get("recent_xg", 0) * 0.6)
        score += (features.get("avg_distance_km", 0) * 0.1)
        return max(1.0, min(10.0, score))
    try:
        # model expects data-frame-like structure; mlflow.pyfunc returns numpy/pandas-friendly predictions
        result = model.predict(features)
        # model may return array-like
        if hasattr(result, "__len__"):
            return float(result[0])
        return float(result)
    except Exception as e:
        print(f"Prediction error: {e}")
        # degrade gracefully
        return 5.0

