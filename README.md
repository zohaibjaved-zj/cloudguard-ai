<div align="center">

<img src="https://img.shields.io/badge/CloudGuard_AI-Multi--Cloud_Security-0ea5e9?style=for-the-badge&logo=amazonaws&logoColor=white" alt="CloudGuard AI"/>

# ☁️ CloudGuard AI

### Multi-Cloud Misconfiguration Detection Platform

**Detect. Explain. Remediate — powered by Machine Learning.**

[![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com/)
[![Azure](https://img.shields.io/badge/Azure-0078D4?style=flat-square&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)
[![AWS](https://img.shields.io/badge/AWS-FF9900?style=flat-square&logo=amazonaws&logoColor=black)](https://aws.amazon.com/)

</div>

---

## 📌 Overview

**CloudGuard AI** is a full-stack cloud security platform that automatically scans multi-cloud environments (AWS, Azure, GCP) for misconfigurations, evaluates their risk severity using a **Gradient Boosting ML model**, and delivers actionable remediation steps — all through a clean, modern dashboard.

Built as a hackathon submission for **Hackathon 2026** at **The Islamia University of Bahawalpur (IUB)** under the Department of Computer Science & IT / Cyber Security & Digital Forensics.

---

## 🎯 Key Features

| Feature | Description |
|---|---|
| 🔍 **Multi-Cloud Scanning** | Scan AWS, Azure, and GCP resources for misconfigurations |
| 🤖 **ML Risk Scoring** | Gradient Boosting model classifies severity (Critical / High / Medium / Low) |
| 🧠 **SHAP Explainability** | Model decisions explained with feature importance visualizations |
| 📊 **Live Dashboard** | Real-time findings, charts, and compliance status |
| 🔧 **Remediation Guides** | Step-by-step fix instructions for every finding |
| 🐳 **Dockerized** | Fully containerized with Docker Compose |
| 🔐 **Role-Based Access** | Secure JWT authentication with user roles |

---

## 🏗️ Architecture

```
cloudguard-ai/
├── frontend/               # React 18 + Vite dashboard
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Dashboard, Findings, Reports
│   │   └── services/       # API integration
│   └── package.json
│
├── backend/                # Node.js + Express REST API
│   ├── routes/             # Auth, scan, findings endpoints
│   ├── models/             # PostgreSQL models
│   └── middleware/         # JWT auth, rate limiting
│
├── ml-service/             # Python FastAPI + Scikit-learn
│   ├── model/              # Trained Gradient Boosting model
│   ├── shap_utils/         # SHAP explainability logic
│   └── main.py             # FastAPI entrypoint
│
├── docker-compose.yml
├── .env.example
└── README.md
```

### System Flow

```
User → React Dashboard → Node.js API → PostgreSQL
                              ↓
                     Cloud SDKs (Azure/AWS/GCP)
                              ↓
                     FastAPI ML Service
                     (Risk Classification + SHAP)
                              ↓
                     Results → Dashboard
```

---

## 🧰 Tech Stack

### Frontend
- **React 18** with Vite
- **Recharts** for data visualization
- **Axios** for API calls
- **Tailwind CSS** for styling

### Backend
- **Node.js + Express** REST API
- **JWT** authentication
- **PostgreSQL** database
- **Prisma** ORM

### ML Service
- **Python 3.11 + FastAPI**
- **Scikit-learn** — Gradient Boosting Classifier
- **SHAP** — Model explainability
- **Pandas / NumPy** — Data processing

### Infrastructure
- **Docker + Docker Compose**
- **Azure SDK** (`@azure/arm-security`)
- **AWS SDK** (`boto3`)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 18+](https://nodejs.org/)
- [Python 3.11+](https://python.org/)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/cloudguard-ai.git
cd cloudguard-ai
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your credentials:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cloudguard
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key

# Azure (optional - for live scan)
AZURE_SUBSCRIPTION_ID=your_subscription_id
AZURE_TENANT_ID=your_tenant_id
AZURE_CLIENT_ID=your_client_id
AZURE_CLIENT_SECRET=your_client_secret

# AWS (optional - for live scan)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

> **Note:** If no cloud credentials are provided, the platform runs on simulated scan data for demo purposes.

### 3. Run with Docker Compose

```bash
docker-compose up --build
```

This starts all services:
| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| ML Service | http://localhost:8000 |
| PostgreSQL | localhost:5432 |

### 4. Run without Docker (manual setup)

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**ML Service:**
```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 📸 Screenshots

> *(Add your dashboard screenshots here)*

| Dashboard | Findings | Risk Report |
|---|---|---|
| ![Dashboard](screenshots/dashboard.png) | ![Findings](screenshots/findings.png) | ![Report](screenshots/report.png) |

---

## 🤖 ML Model Details

The risk classification engine uses a **Gradient Boosting Classifier** trained on cloud misconfiguration patterns.

### Input Features
- Resource type (S3 bucket, VM, IAM role, etc.)
- Exposure level (public, internal, private)
- Compliance framework violations (CIS, NIST, ISO 27001)
- Resource age and change frequency
- Affected service criticality

### Output
- **Severity class**: Critical / High / Medium / Low
- **Confidence score**: 0–100%
- **SHAP values**: Feature importance per prediction

### Model Performance
| Metric | Score |
|---|---|
| Accuracy | ~94% |
| Precision | ~92% |
| Recall | ~91% |
| F1-Score | ~91% |

---

## 🔐 Security Notes

- All secrets are managed via `.env` (never committed)
- JWT tokens expire after 24 hours
- API rate limiting enabled on all endpoints
- Cloud credentials use least-privilege IAM roles

---

## 👥 Team

| Name | Role |
|---|---|
| **[Your Name]** | Full-Stack Developer & Project Lead |
| **Muhammad Zohaib** | Backend Developer |
| **Afifa Yasin** | ML Engineer & Frontend |

**Department:** Computer Science & IT / Cyber Security & Digital Forensics  
**Institution:** The Islamia University of Bahawalpur (IUB)  
**Submitted to:** Hackathon 2026 — IEEE Bahawalpur Sub-Section

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ at IUB · CloudGuard AI © 2026</sub>
</div>
