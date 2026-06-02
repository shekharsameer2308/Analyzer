from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class CoalSample(Base):
    __tablename__ = "coal_samples"

    id = Column(Integer, primary_key=True, index=True)
    sample_id = Column(String, unique=True, index=True, nullable=False)
    mine_name = Column(String, index=True, nullable=False)
    collection_date = Column(DateTime(timezone=True), nullable=False)
    
    # Parameters
    gcv = Column(Float, nullable=False)  # Gross Calorific Value (kcal/kg)
    ash = Column(Float, nullable=False)  # Ash Content (%)
    moisture = Column(Float, nullable=False)  # Total Moisture (%)
    volatile_matter = Column(Float, nullable=False)  # Volatile Matter (%)
    fixed_carbon = Column(Float, nullable=False)  # Fixed Carbon (%)
    sulfur = Column(Float, nullable=False)  # Sulfur Content (%)
    hgi = Column(Float, nullable=True)  # Hardgrove Grindability Index
    
    # AI/ML Generated
    quality_score = Column(Float, nullable=True) # 0-100
    predicted_grade = Column(String, nullable=True)
    is_anomaly = Column(Boolean, default=False)
    anomaly_reason = Column(Text, nullable=True)
    
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
