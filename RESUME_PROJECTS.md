## 📋 PROJECTS

### **CoalLab AI: Enterprise Coal Quality Analytics & Blending Optimization Platform** | _React 19, TypeScript, FastAPI, Python 3.12, Machine Learning_
**Technologies**: React | TypeScript | Vite | Tailwind CSS | FastAPI | Python | Pydantic | SQLAlchemy 2.0 | Scikit-Learn | XGBoost | Pandas | NumPy | SQLite | Render | Vercel | REST API | ASGI

**Deployed at**: [analyzer-ochre.vercel.app](https://analyzer-ochre.vercel.app)

- **Anomaly Detection Engine**: Implemented Isolation Forest algorithm using Scikit-Learn to detect coal quality outliers; real-time scoring (0-100 scale) with normalized anomaly detection processing 6+ feature dimensions
- **Predictive Regression Model**: Built XGBoost GCV Predictor using gradient boosted trees to estimate Gross Calorific Value from proximate analysis inputs; bypasses expensive laboratory testing with ML-powered predictions
- **Prescriptive Optimization**: Developed linear programming solver for coal blending optimization, calculating optimal mixing ratios across two coal sources while minimizing cost and meeting specification targets
- **Full-Stack Architecture**: Designed decoupled microservices with FastAPI backend (ASGI concurrency), React SPA frontend with TanStack React Query state management, SQLAlchemy ORM, and SQLite persistence
- **Real-Time Data Visualization**: Integrated Plotly.js for high-density interactive scatter plots, glassmorphic UI components with Tailwind CSS utility-first styling
- **DevOps & Deployment**: Automated CI/CD pipeline; backend hosted on Render (Python 3.12 runtime), frontend on Vercel Edge Network with environment variable configuration

---

### **TrackFin Intelligence Platform: AI-Ready Personal Finance & Behavioral Analytics SaaS** | _Python, Flask, JavaScript, HTML5, CSS3, SQL_
**Technologies**: Python 3.9+ | Flask Blueprints | SQLAlchemy ORM | PyJWT | Werkzeug Security (Argon2) | SQLite | Chart.js | HTML5 | CSS3 Flexbox/Grid | JavaScript ES6+ | Vercel Serverless

**Deployed at**: [track-fin-bay.vercel.app](https://track-fin-bay.vercel.app) | **Live Guest Demo Available**

- **Smart Auto-Categorization Engine**: Keyword heuristic system automatically tags unstructured transaction data (e.g., "Uber" → Transportation); handles recurring subscription detection with fixed burn-rate calculations
- **AI Financial Advisor Chatbot**: Context-aware chat widget leveraging real-time transaction data to provide spending insights and proactive financial recommendations
- **Behavioral Analytics Dashboard**: Interactive 30-day cashflow visualization using Chart.js; dynamic budget utilization warnings and algorithmic financial health score (0-100) based on savings ratios and discretionary spending
- **Gamified Goal Management**: Dynamic savings goal tracking with automated monthly savings rate calculations; trajectory forecasting for annual financial targets
- **JWT Authentication & Guest Infrastructure**: Stateless session management with PyJWT; instant provisioning of isolated temporary accounts for zero-friction onboarding and secure sandboxing
- **Serverless Backend Architecture**: Flask Blueprint modular routing; SQLite configured for ephemeral serverless storage (`/tmp`); deployed on Vercel Serverless Python Functions with automated branch deployments

---

### **ParkWay: Provider Data Validation & AI-Powered Directory Management Hackathon** | _Python, AI Agents, Web Scraping, OCR, APIs, Data Pipelines_
**Technologies**: Python | Agentic AI Architecture | LangChain | Multi-Agent Orchestration | PDF Processing (pdfplumber, pdf2image, Tesseract OCR) | Web Scraping | NPI Registry APIs | Fuzzy Matching | Entity Resolution | Panel Dashboards | Great Tables Reports

**Status**: Capstone Project for Summer Analytics 2025 (Consulting & Analytics Club) | **1 Star on GitHub**

- **Multi-Agent Orchestrator System**: Designed 4-agent architecture (Data Validation, Information Enrichment, Quality Assurance, Directory Management) with orchestrator reasoning loop; agents coordinate via shared state
- **Provider Validation Pipeline**: End-to-end automation processing 200+ provider profiles; validates NPI credentials, state medical licenses, and contact information against multiple public data sources
- **OCR & Document Processing**: Hybrid pipeline handling both digital PDFs (pdfplumber extraction) and scanned documents (Tesseract OCR + pdf2image); extracts structured provider data from unstructured scans
- **Data Enrichment & Fuzzy Matching**: Performs cross-source validation (NPI Registry, hospital directories, state medical boards, Google Maps APIs); confidence scoring engine flags suspicious/fraudulent patterns
- **Automated Reporting**: Generates enriched provider directory entries, summary reports with accuracy metrics, prioritized manual review lists, and auto-generated provider communications
- **Agentic Reasoning & Self-Correction**: Implements LangChain agent patterns for autonomous reasoning; detects inconsistencies, handles conflicts, and provides explainable decision logs
- **Performance Metrics**: Achieved 70-90% reduction in manual validation workload; processed 200 provider profiles in under 30 minutes with high accuracy in address/phone verification

---

### **ML Models & Machine Learning Algorithms Collection** | _Python, Scikit-Learn, TensorFlow, XGBoost, Data Science_
**Technologies**: Python 3.8+ | Scikit-Learn | XGBoost | LightGBM | TensorFlow | Keras | PyTorch | Pandas | NumPy | Matplotlib | Seaborn | Jupyter Notebooks

**Repository**: [github.com/shekharsameer2308/ML-models-](https://github.com/shekharsameer2308/ML-models-)

- **Supervised Learning Implementations**: Linear/Logistic Regression, KNN, Decision Trees, Random Forest, SVM, Naive Bayes, Gradient Boosting (XGBoost, LightGBM); covers regression and multiclass classification
- **Unsupervised Learning Algorithms**: K-Means Clustering, Hierarchical Clustering, DBSCAN, Gaussian Mixture Models (GMM), PCA, t-SNE dimensionality reduction with visualization
- **Advanced ML Techniques**: Hyperparameter tuning (Grid Search, Random Search, Bayesian Optimization); ensemble methods (Bagging, Boosting, Stacking); cross-validation strategies
- **Model Evaluation Framework**: Comprehensive metrics (Accuracy, Precision, Recall, F1-Score, AUC-ROC); confusion matrices, ROC curves, performance benchmarking across algorithms
- **Feature Engineering Pipelines**: Data preprocessing (scaling, normalization, missing value imputation); imbalanced class handling; feature selection and dimensionality reduction
- **Production-Ready Code**: Clean, modular, documented implementations with real datasets; demonstrates best practices in ML workflows and scalability

---

### **Database Management System (DBMS)** | _HTML5, CSS3, JavaScript, Data Structures, Database Design_
**Technologies**: HTML5 | CSS3 Flexbox/Grid | JavaScript | SQL | B+ Trees | Hash Indexes | Transaction Management | ACID Properties | Query Optimization

**Status**: Educational Implementation | **Apache 2.0 License**

- **Query Processing Engine**: Parser and optimizer for SQL execution; cost-based query planning; support for SELECT, INSERT, UPDATE, DELETE operations
- **Indexing Structures**: B+ Tree indexes for ordered lookups and range queries; Hash indexes for exact-match optimization; composite multi-column indexes
- **Transaction Management**: Full ACID compliance (Atomicity, Consistency, Isolation, Durability); 2-Phase Locking protocol for concurrency control; WAL (Write-Ahead Logging) for durability
- **Storage Architecture**: Fixed-size page structures (4KB/8KB blocks); Heap file storage with record offsets; Buffer pool management and cache coordination
- **Data Integrity**: Primary key, foreign key, and unique constraint enforcement; functional dependency tracking; normalization forms (1NF, 2NF, 3NF, BCNF)
- **Recovery & Durability**: Crash recovery mechanisms; checkpoint snapshots for consistent state; transaction logs for failure tolerance

---

### **Flow Simulation: Multi-Level Physics & Computational Fluid Dynamics** | _Python, Jupyter Notebooks, Numerical Methods_
**Technologies**: Python | Jupyter Notebooks | NumPy | Pandas | SciPy | Matplotlib | CFD Algorithms | Numerical Simulation

- Computational simulations of fluid dynamics at varying complexity levels; numerical methods for solving differential equations
- Data visualization and analysis of simulation results; performance optimization techniques

---

### **Additional Expertise & Contributions**
- **GitHub Desktop Tutorial Repository** - Version control and Git workflow documentation
- **eyprototype** - Research and development prototype project (Apache License)
- **python-scripts** - Python fundamentals and beginner programming examples

---
