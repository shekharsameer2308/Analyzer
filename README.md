# 💎 CoalLab AI

**CoalLab AI** is an advanced Machine Learning & Quality Analytics Platform designed to revolutionize coal quality assessment. By combining real-time data feeds, predictive modeling (XGBoost/Isolation Forests), and modern frontend architecture, CoalLab AI detects anomalies, optimizes blending ratios, and provides deep AI insights into coal processing.

---

## 🚀 Live Demo

- **Frontend Dashboard:** [https://frontend-16thqsm9y-shekharsameer2308s-projects.vercel.app](https://frontend-16thqsm9y-shekharsameer2308s-projects.vercel.app)
- **Backend API:** `https://coallab-api.onrender.com/api/v1`

---

## 🏗️ Architecture & Tech Stack

This repository is structured as a **Monorepo** containing both the React frontend and the Python backend.

### 1. Frontend (`/frontend`)
The presentation layer is a blazing fast Single Page Application (SPA) built with modern web technologies:
* **Framework:** React 19 + Vite
* **Styling:** Tailwind CSS v4
* **Data Fetching:** TanStack React Query & Axios
* **Icons & UI:** Lucide React
* **Data Visualization:** Plotly.js
* **Hosting:** Vercel

### 2. Backend (`/backend`)
The engine powering the machine learning predictions and database management:
* **Framework:** FastAPI (Python 3.12)
* **Database:** SQLite / PostgreSQL (via SQLAlchemy)
* **Data Validation:** Pydantic
* **Hosting:** Render Web Services

---

## 🛠️ Local Development Guide

To run this platform locally on your own machine, follow these steps:

### Prerequisites
- Node.js (v18 or higher)
- Python (3.10 to 3.12 recommended)
- Git

### 1. Start the Backend API
Open a terminal and navigate to the backend directory:
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # Mac/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`*

### 2. Start the Frontend Dashboard
Open a second terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
*The Dashboard will be available at `http://localhost:5173`*

---

## 🧪 Seeding the Database
If your database is empty, you can populate it with 50 generated coal samples by making a POST request to the seed endpoint.
If running locally:
```bash
curl -X POST http://localhost:8000/seed
```
If running in production:
```bash
curl -X POST https://coallab-api.onrender.com/seed
```

---

## 🔮 Future Roadmap (Machine Learning)
- [ ] **Phase 2:** Integrate Isolation Forest for automated anomaly detection in coal sample properties.
- [ ] **Phase 3:** Deploy XGBoost models to predict Gross Calorific Value (GCV) based on moisture and ash content.
- [ ] **Phase 4:** Develop the Coal Blending Optimizer (Linear Programming / Scipy Optimize) to recommend optimal mixture ratios for target GCVs.

---
*Built with ❤️ for the future of resource analytics.*
