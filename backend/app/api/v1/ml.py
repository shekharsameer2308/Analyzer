from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.coal_sample import CoalSample
from app.ml.anomaly import detect_anomalies
from app.ml.predictor import predict_gcv

class GCVPredictionRequest(BaseModel):
    moisture: float
    ash: float
    volatile_matter: float
    fixed_carbon: float

router = APIRouter()

@router.get("/anomalies")
def get_anomalies(db: Session = Depends(get_db)):
    """
    Fetches latest coal samples, runs them through the Isolation Forest
    ML model, and returns the analyzed data sorted by anomaly score.
    """
    # Fetch latest 2000 samples from the database
    samples = db.query(CoalSample).order_by(CoalSample.collection_date.desc()).limit(2000).all()
    
    # Run anomaly detection
    analyzed_samples = detect_anomalies(samples)
    
    return {
        "status": "success",
        "total_analyzed": len(samples),
        "total_anomalies": sum(1 for s in analyzed_samples if s.get('is_anomaly')),
        "data": analyzed_samples
    }

@router.post("/predict-gcv")
def get_gcv_prediction(request: GCVPredictionRequest, db: Session = Depends(get_db)):
    """
    Predicts the Gross Calorific Value (GCV) using an XGBoost model trained on latest historical samples.
    """
    samples = db.query(CoalSample).order_by(CoalSample.collection_date.desc()).limit(2000).all()
    
    input_features = {
        "moisture": request.moisture,
        "ash": request.ash,
        "volatile_matter": request.volatile_matter,
        "fixed_carbon": request.fixed_carbon
    }
    
    try:
        predicted_gcv = predict_gcv(samples, input_features)
        return {
            "status": "success",
            "predicted_gcv": predicted_gcv
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
