# DataForge AI

DataForge AI is a full-stack application that generates realistic, domain-specific business datasets for Data Analytics, Data Science, SQL, Power BI, Machine Learning, and Data Engineering learners.

## Features

- **Domain-Specific Generation**: Retail, Healthcare, Finance, and more.
- **Region Locales**: Localized names, addresses, and currencies.
- **Dirty Data Injection**: Simulate real-world messy data with missing values, duplicates, and outliers.
- **Specialized Datasets**: ML Classification/Regression, Time Series, and Power BI Star Schemas.
- **Data Quality Reports**: Automatically score generated datasets.
- **Multi-Format Exports**: CSV, Excel, JSON, Parquet, SQL Scripts, and SQLite DBs.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI
- **Backend**: FastAPI, Pandas, Faker, SQLAlchemy
- **Database**: SQLite (Development), PostgreSQL (Production ready)

## Running Locally

### Option 1: Docker (Recommended)
```bash
docker-compose up --build
```
- App available at: http://localhost
- API Docs available at: http://localhost:8000/docs

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:8000/docs
