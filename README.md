# 🚀 HostBoost AI • Production SaaS Platform for Independent Hosts
> **AI-Powered Property Management, Dynamic Pricing & Trustora Trust Intelligence Platform**

---

## 🌟 Overview & Purpose
**HostBoost AI** is a commercial-grade, production-quality SaaS MVP built specifically for small and independent accommodation hosts (villas, boutique hotels, heritage homestays, apartments, and serviced chalets). It solves the biggest bottlenecks independent hosts face:
1. **Dynamic Revenue Maximization**: 5-Factor automated pricing calendar (seasonality, day-of-week, local events, occupancy, and competitor benchmarks).
2. **Trustora Trust Intelligence Layer**: Integrated from the **Geeks2Code Architecture** (Host identity validation, 0-100 Trust Score, review anomaly burst detection, and hyper-local neighborhood sentiment scoring).
3. **Multi-Tone AI Copywriting**: High-converting SEO headlines, OTA descriptions, and social media hooks.
4. **Photo Quality & Staging Diagnostics**: Computer vision checks for lighting, composition, clutter, and hero photo selection.
5. **WhatsApp AI Guest Concierge**: 24/7 instant automated guest hospitality with simulated keyless entry, local guide recommendations, and policy handling.
6. **Multi-Status Reservation & Financial Analytics**: Interactive Recharts dashboards for revenue tracking, occupancy yields, and channel breakdowns.

---

## 🏗️ Architecture & Tech Stack

`mermaid
graph TD
    A[React 18 + Vite + Tailwind CSS Frontend] -->|REST API + JWT Auth| B[Python Flask API Gateway]
    B --> C[Authentication & Authorization Service]
    B --> D[5-Factor Dynamic Pricing Engine]
    B --> E[Trustora Trust & Review Anomaly Layer]
    B --> F[AI Copywriting & Photo Vision Diagnostic]
    B --> G[WhatsApp NLP Concierge Bot]
    B --> H[Financial & Occupancy Analytics Engine]
    B --> I[(Database Layer: Supabase PostgreSQL / Local SQLite Fallback)]
`

### Backend:
- **Framework**: Python Flask REST API
- **ORM & Database**: SQLAlchemy (16 relational models)
- **Database Engine**: Fully configured for **Supabase PostgreSQL** (postgresql+psycopg://) with zero-config **SQLite** (sqlite:///hostboost.db) automatic fallback
- **Authentication**: JWT & Flask-Bcrypt secure password hashing
- **Seed Data**: 5 realistic luxury properties (Goa, Manali, Bangalore, Jaipur, Mumbai), 20 suites, 30 active bookings, 20 guests, review anomaly signatures, and notifications

### Frontend:
- **Framework**: React 18 (Vite, Rollup)
- **Styling**: Tailwind CSS v3 with sleek modern SaaS dark theme
- **Icons**: Lucide React
- **Data Visualizations**: Recharts (Interactive AreaCharts, BarCharts, PieCharts)
- **State & Notifications**: Context API (AuthContext + ToastContext with floating notifications)

---

## 🔑 Preloaded Demo Credentials
For instant zero-setup demonstration, use the **1-Click Demo Login** button or enter:
- **Email**: host@hostboost.ai
- **Password**: password123

---

## ⚡ Quickstart Guide

### 1. Start the Flask Backend
`ash
cd backend
# Create and activate virtual environment (optional)
# python -m venv venv && source venv/bin/activate (or venv\\Scripts\\activate on Windows)
pip install -r requirements.txt
python app.py
`
*Backend runs on http://127.0.0.1:5000 and automatically self-seeds the database on first launch.*

### 2. Start the React Frontend
`ash
cd frontend
npm install
npm run dev
`
*Frontend runs on http://localhost:5173 with instant hot-module reload.*

---

## 🗄️ Supabase PostgreSQL Setup (Optional)
To connect your own remote Supabase PostgreSQL database:
1. In ackend/.env, set:
   `env
   DATABASE_URL=postgresql+psycopg://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   `
2. Or run the complete SQL script in ackend/supabase_schema.sql directly inside the **Supabase SQL Editor**.

---

## 🛡️ Trustora Intelligence Highlights
- **0-100 Trust Score Gauge**: Multi-dimensional verification (Identity, Review Legitimacy, Safety, Operational Uptime).
- **Review Anomaly & Fraud Radar**: Continuous NLP scanning detecting sudden burst spikes or fake unverified review clusters.
- **Neighborhood Vibe Index**: Real-time evaluation of transit connectivity, safety, walkability, and local ambiance.
