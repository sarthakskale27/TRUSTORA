# 🛡️ Trustora — Trust Intelligence Layer for Local Rentals

> *“Don't just book what looks good. Book what you can trust.”*

**Trustora** is a Trust Intelligence Layer for accommodation and local rental marketplaces (Geeks2Code Track). It evaluates rental listings across host authenticity, fraud risks, review manipulation, fair pricing, and neighborhood vibe.

---

## 🌟 5 Core Unique Features (Slide 4)

1. **Verified Host**: ID/document upload with basic authenticity and face-match checks to generate an official Verified Host badge.
2. **Scam & Fraud Detector**: Analyzes listing text, underpricing anomalies (>40% below market), reviews, and duplicate stock photos to flag fake or suspicious listings.
3. **Review Anomaly Radar**: Detects unusual review velocity bursts (24-48h spikes), repetitive phrasing, and bot manipulation.
4. **Neighbourhood Vibe**: Generates natural-language local summaries (*e.g. “Quiet area, 5 min from the beach, family-friendly”*) with safety and walkability scores.
5. **Explainable Trust Score (0–100)**: Displays an auditable score detailing the exact positive signals and warning factors behind the score.

---

## 🚀 Quick Start

### 1. Backend (Flask + SQLite/Supabase PostgreSQL)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```
*Backend runs on `http://localhost:5000`*

### 2. Frontend (React 19 + Vite + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## ☁️ Deployment Guide

### Deploying Frontend to Vercel
1. Import repository to Vercel.
2. Set Root Directory to `frontend`.
3. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api`
4. Deploy!

### Deploying Backend to Render / Railway with Supabase
1. Create a PostgreSQL database on [Supabase.com](https://supabase.com).
2. Set environment variables on Render:
   - `DATABASE_URL`: `postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`
   - `SECRET_KEY`: `trustora-production-secret-2026`
   - `JWT_SECRET`: `trustora-jwt-secret-2026`
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn app:app`
