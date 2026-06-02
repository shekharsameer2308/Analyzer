from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.coal_sample import CoalSample

router = APIRouter()

@router.get("/dashboard/kpis")
def get_dashboard_kpis(db: Session = Depends(get_db)):
    # Calculate basic KPIs for the dashboard
    total_samples = db.query(func.count(CoalSample.id)).scalar()
    avg_gcv = db.query(func.avg(CoalSample.gcv)).scalar()
    avg_ash = db.query(func.avg(CoalSample.ash)).scalar()
    avg_moisture = db.query(func.avg(CoalSample.moisture)).scalar()
    avg_quality = db.query(func.avg(CoalSample.quality_score)).scalar()

    return {
        "total_samples": total_samples or 0,
        "avg_gcv": round(avg_gcv or 0, 2),
        "avg_ash": round(avg_ash or 0, 2),
        "avg_moisture": round(avg_moisture or 0, 2),
        "avg_quality_score": round(avg_quality or 0, 2)
    }

@router.get("/dashboard/mine-distribution")
def get_mine_distribution(db: Session = Depends(get_db)):
    # Group by mine and get counts
    results = db.query(
        CoalSample.mine_name, 
        func.count(CoalSample.id).label('count'),
        func.avg(CoalSample.gcv).label('avg_gcv')
    ).group_by(CoalSample.mine_name).all()
    
    return [
        {"mine_name": r.mine_name, "count": r.count, "avg_gcv": round(r.avg_gcv or 0, 2)}
        for r in results
    ]
