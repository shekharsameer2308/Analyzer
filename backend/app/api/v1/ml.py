from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.coal_sample import CoalSample
from app.ml.anomaly import detect_anomalies

router = APIRouter()

@router.get("/anomalies")
def get_anomalies(db: Session = Depends(get_db)):
    """
    Fetches all coal samples, runs them through the Isolation Forest
    ML model, and returns the analyzed data sorted by anomaly score.
    """
    # Fetch all samples from the database
    samples = db.query(CoalSample).all()
    
    # Run anomaly detection
    analyzed_samples = detect_anomalies(samples)
    
    return {
        "status": "success",
        "total_analyzed": len(samples),
        "total_anomalies": sum(1 for s in analyzed_samples if s.get('is_anomaly')),
        "data": analyzed_samples
    }
