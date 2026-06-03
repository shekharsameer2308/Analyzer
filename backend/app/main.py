from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import samples, analytics, ml, blending, chat
from app.core.database import engine, Base
from app.models import coal_sample, user

# Automatically create tables in SQLite
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(samples.router, prefix=f"{settings.API_V1_STR}/samples", tags=["samples"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["analytics"])
app.include_router(ml.router, prefix=f"{settings.API_V1_STR}/ml", tags=["ml"])
app.include_router(blending.router, prefix=f"{settings.API_V1_STR}/blending", tags=["blending"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["chat"])

@app.get("/")
def root():
    return {"message": "Welcome to CoalLab AI API"}

@app.on_event("startup")
def startup_event():
    # Auto-seed if db is empty
    from app.core.database import SessionLocal
    from app.models.coal_sample import CoalSample
    db = SessionLocal()
    try:
        sample_count = db.query(CoalSample).count()
        if sample_count == 0:
            print("Database is empty. Auto-seeding 500 samples...")
            try:
                import sys
                import os
                # Ensure the backend root path is in sys.path to import seed_data
                backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                if backend_dir not in sys.path:
                    sys.path.append(backend_dir)
                from seed_data import seed_data
                seed_data(count=500, db=db)
            except Exception as e:
                print(f"Failed to auto-seed database: {e}")
    finally:
        db.close()

@app.post("/seed")
def seed_database(count: int = 500):
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        import sys
        import os
        backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        if backend_dir not in sys.path:
            sys.path.append(backend_dir)
        from seed_data import seed_data
        seed_data(count=count, db=db)
        return {"message": f"Database seeded with {count} samples successfully!"}
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=f"Seeding failed: {str(e)}")
    finally:
        db.close()
