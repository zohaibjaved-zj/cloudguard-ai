from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import os

router = APIRouter()

BASE = os.path.dirname(os.path.dirname(__file__))
MODEL_DIR = os.path.join(BASE, 'saved_models')

try:
    clf = joblib.load(os.path.join(MODEL_DIR, 'risk_classifier.pkl'))
    reg = joblib.load(os.path.join(MODEL_DIR, 'risk_regressor.pkl'))
    le  = joblib.load(os.path.join(MODEL_DIR, 'label_encoder.pkl'))
    MODELS_LOADED = True
except:
    MODELS_LOADED = False

FEATURES = [
    'n_critical','n_high','n_medium','n_low','n_info',
    'total_findings','public_resources','open_ports',
    'unencrypted','no_mfa','old_keys'
]

class ScanInput(BaseModel):
    provider: str
    n_critical: int = 0
    n_high: int = 0
    n_medium: int = 0
    n_low: int = 0
    n_info: int = 0
    total_findings: int = 0
    public_resources: int = 0
    open_ports: int = 0
    unencrypted: int = 0
    no_mfa: int = 0
    old_keys: int = 0

class PredictionOutput(BaseModel):
    risk_score: float
    risk_label: str
    confidence: float
    feature_contributions: dict
    recommendations: List[str]

def get_recommendations(label: str, data: ScanInput) -> List[str]:
    recs = []
    if data.public_resources > 0:
        recs.append(f"🔴 {data.public_resources} publicly exposed resource(s) — restrict access immediately.")
    if data.open_ports > 2:
        recs.append(f"🔴 {data.open_ports} open ports found — audit security group/NSG rules.")
    if data.no_mfa > 0:
        recs.append(f"🟠 {data.no_mfa} account(s) without MFA — enforce MFA on all privileged users.")
    if data.unencrypted > 0:
        recs.append(f"🟠 {data.unencrypted} unencrypted resource(s) — enable encryption at rest.")
    if data.old_keys > 0:
        recs.append(f"🟡 {data.old_keys} access key(s) older than 90 days — rotate immediately.")
    if data.n_critical > 0:
        recs.append(f"🔴 {data.n_critical} critical finding(s) require immediate attention.")
    if not recs:
        recs.append("✅ Environment looks relatively secure. Maintain regular scanning cadence.")
    return recs

@router.post("/predict", response_model=PredictionOutput)
async def predict_risk(data: ScanInput):
    if not MODELS_LOADED:
        raise HTTPException(status_code=503, detail="ML models not loaded. Run train_model.py first.")

    X = np.array([[
        data.n_critical, data.n_high, data.n_medium, data.n_low, data.n_info,
        data.total_findings, data.public_resources, data.open_ports,
        data.unencrypted, data.no_mfa, data.old_keys
    ]])

    label_encoded = clf.predict(X)[0]
    label = le.inverse_transform([label_encoded])[0]
    proba = clf.predict_proba(X)[0]
    confidence = float(proba.max())
    score = float(np.clip(reg.predict(X)[0], 0, 100))

    contributions = {}
    for i, feat in enumerate(FEATURES):
        val = X[0][i]
        contributions[feat] = round(float(val * clf.feature_importances_[i] * 10), 3)

    return PredictionOutput(
        risk_score=round(score, 2),
        risk_label=label,
        confidence=round(confidence, 3),
        feature_contributions=contributions,
        recommendations=get_recommendations(label, data)
    )

@router.get("/health")
async def health():
    return {"status": "ok", "models_loaded": MODELS_LOADED}