import random
import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.coal_sample import CoalSample
import uuid

# Re-create all tables
Base.metadata.create_all(bind=engine)

def seed_data():
    db: Session = SessionLocal()
    
    mines = ["Alpha Washery", "Beta Colliery", "Gamma Open Cast", "Delta Underground", "Omega Works"]
    
    print("Generating 100,000 synthetic coal samples...")
    batch_size = 5000
    samples = []
    
    start_date = datetime.datetime.now() - datetime.timedelta(days=365)
    
    for i in range(100000):
        mine = random.choice(mines)
        
        # Add some natural variation based on the mine
        if mine == "Alpha Washery":
            gcv = random.uniform(5500, 6500)
            ash = random.uniform(10, 20)
        elif mine == "Beta Colliery":
            gcv = random.uniform(4000, 5000)
            ash = random.uniform(25, 40)
        else:
            gcv = random.uniform(3000, 7000)
            ash = random.uniform(5, 45)
            
        moisture = random.uniform(2, 15)
        volatile_matter = random.uniform(15, 35)
        fixed_carbon = 100 - (ash + moisture + volatile_matter)
        sulfur = random.uniform(0.1, 1.5)
        hgi = random.uniform(40, 90)
        
        # Calculate a basic quality score
        quality_score = max(0, min(100, (gcv / 7000) * 100 - (ash * 0.5) - (moisture * 0.5) - (sulfur * 5)))
        
        sample = CoalSample(
            sample_id=f"SMP-{uuid.uuid4().hex[:8].upper()}",
            mine_name=mine,
            collection_date=start_date + datetime.timedelta(minutes=i * 5),
            gcv=round(gcv, 2),
            ash=round(ash, 2),
            moisture=round(moisture, 2),
            volatile_matter=round(volatile_matter, 2),
            fixed_carbon=round(fixed_carbon, 2),
            sulfur=round(sulfur, 2),
            hgi=round(hgi, 2),
            quality_score=round(quality_score, 2),
            is_anomaly=False
        )
        samples.append(sample)
        
        if len(samples) >= batch_size:
            db.bulk_save_objects(samples)
            db.commit()
            print(f"Inserted {i + 1} records...")
            samples = []
            
    if samples:
        db.bulk_save_objects(samples)
        db.commit()
        
    print("Successfully seeded 100,000 coal samples!")
    db.close()

if __name__ == "__main__":
    seed_data()
