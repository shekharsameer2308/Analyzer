from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models.coal_sample import CoalSample
from pydantic import BaseModel

router = APIRouter()

class CoalSampleResponse(BaseModel):
    id: int
    sample_id: str
    mine_name: str
    collection_date: datetime
    gcv: float
    ash: float
    moisture: float
    volatile_matter: float
    fixed_carbon: float
    sulfur: float
    hgi: Optional[float] = None
    quality_score: Optional[float] = None
    predicted_grade: Optional[str] = None
    is_anomaly: bool
    anomaly_reason: Optional[str] = None
    remarks: Optional[str] = None

    class Config:
        from_attributes = True

@router.get("/", response_model=List[CoalSampleResponse])
def get_samples(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    mine_name: Optional[str] = None
):
    query = db.query(CoalSample)
    if mine_name:
        query = query.filter(CoalSample.mine_name == mine_name)
    
    # Simple order by date descending
    samples = query.order_by(CoalSample.collection_date.desc()).offset(skip).limit(limit).all()
    return samples

@router.get("/{sample_id}", response_model=CoalSampleResponse)
def get_sample(sample_id: int, db: Session = Depends(get_db)):
    sample = db.query(CoalSample).filter(CoalSample.id == sample_id).first()
    if not sample:
        raise HTTPException(status_code=404, detail="Sample not found")
    return sample
