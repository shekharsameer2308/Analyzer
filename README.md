# CoalLab AI: Intelligent Quality Analytics & Blending Optimization

CoalLab AI is an enterprise-grade Machine Learning and Quality Analytics Platform engineered to modernize industrial coal quality assessment. By synthesizing real-time telemetry with predictive modeling and prescriptive analytics, the system automates anomaly detection, optimizes blending ratios, and provides actionable, data-driven insights for high-throughput coal processing facilities.

## System Architecture

The platform implements a decoupled, highly scalable service-oriented architecture. It integrates a React-based presentation layer for real-time visualization with a robust Python/FastAPI backend for high-performance mathematical optimization and machine learning inference.

```mermaid
graph TD
    classDef client fill:#0f172a,stroke:#334155,stroke-width:2px,color:#f8fafc;
    classDef gateway fill:#1e1b4b,stroke:#4338ca,stroke-width:2px,color:#e0e7ff;
    classDef engine fill:#3b0764,stroke:#7e22ce,stroke-width:2px,color:#f3e8ff;
    classDef db fill:#064e3b,stroke:#047857,stroke-width:2px,color:#d1fae5;

    subgraph Client [Presentation Layer - Vercel Edge]
        UI[React 19 SPA] --> State[TanStack Query]
        State --> Viz[Plotly.js Visualizations]
    end

    subgraph Server [Core API Gateway - Render Services]
        FastAPI[FastAPI Async Server] --> Validator[Pydantic Validation]
        Validator --> ORM[SQLAlchemy ORM]
    end

    subgraph ML [Machine Learning Inference]
        IsolationForest[Isolation Forest: Anomaly Detection]
        XGBoost[XGBoost: GCV Regression]
        SciPy[SciPy: Linear Blending Optimizer]
    end

    subgraph Storage [Persistence]
        Database[(Relational Database)]
    end

    State <-->|REST / JSON| FastAPI
    FastAPI --> IsolationForest
    FastAPI --> XGBoost
    FastAPI --> SciPy
    ORM <--> Database

    class UI,State,Viz client;
    class FastAPI,Validator,ORM gateway;
    class IsolationForest,XGBoost,SciPy engine;
    class Database db;
```

## Data Ingestion & Machine Learning Pipeline

The application ingests high-frequency coal quality metrics, validates the payloads through strict data contracts, and executes machine learning inferences synchronously.

```mermaid
sequenceDiagram
    participant Sensor as IoT / Lab Input
    participant API as FastAPI Gateway
    participant DB as Database
    participant ML as ML Engine (Scikit-Learn)

    Sensor->>API: POST /api/v1/samples (Moisture, Ash, GCV)
    API->>API: Pydantic Schema Validation
    API->>DB: Persist Raw Telemetry
    DB-->>API: Acknowledge Transaction
    
    API->>ML: Trigger Anomaly Inference
    ML->>ML: Execute Isolation Forest
    ML-->>API: Return Anomaly Score (0-100)
    
    API-->>Sensor: 201 Created (Include ML Insights)
```

## Technology Stack Specifications

### Frontend Application (Client)
- **Framework:** React 19 (Single Page Application)
- **Build System:** Vite
- **Styling:** Tailwind CSS v4 (Strict dark-mode constraints, glassmorphism)
- **State Management:** TanStack React Query (Server-state synchronization)
- **Visualization:** Plotly.js (Multidimensional analytics rendering)

### Backend Services (Server)
- **API Framework:** FastAPI (Python 3.12, ASGI compliant)
- **Data Serialization:** Pydantic v2
- **ORM:** SQLAlchemy 2.0
- **Machine Learning Dependencies:** 
  - `scikit-learn` (Isolation Forest)
  - `xgboost` (Gradient Boosting Regression)
  - `pandas` & `numpy` (Vectorized data transformations)
  - `scipy` (Linear programming optimization)

## Production Infrastructure

Continuous Integration and Continuous Deployment (CI/CD) pipelines ensure zero-downtime provisioning across isolated environments.

- **Frontend Deployment:** [CoalLab AI Dashboard](https://analyzer-self.vercel.app) (Vercel Edge Network)
- **Backend Services:** [CoalLab API](https://coallab-api.onrender.com/api/v1) (Render Web Services)

## Local Development Configuration

To establish a local development environment, execute the following instructions. Ensure Node.js (v18+) and Python (3.10+) are installed on the host operating system.

### 1. Initialize Backend API
```bash
cd backend
python -m venv venv

# Windows Activation
venv\Scripts\activate
# Unix/MacOS Activation
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
The FastAPI instance will bind to `http://localhost:8000`.

### 2. Initialize Frontend Client
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will initialize at `http://localhost:5173`.

### 3. Database Seeding
To populate the SQLite database with synthetic development data (n=50), execute the administrative seed endpoint:
```bash
curl -X POST http://localhost:8000/seed
```


