<div align="center">

<img src="https://img.shields.io/badge/CloudGuard_AI-Multi--Cloud_Security-0ea5e9?style=for-the-badge&logo=amazonaws&logoColor=white" alt="CloudGuard AI"/>

# 🛡️ CloudGuard AI

### Multi-Cloud Misconfiguration Scanner Platform

**Scan. Score. Fix — powered by Machine Learning.**

[![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js_20-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com/)
[![AWS](https://img.shields.io/badge/AWS-FF9900?style=flat-square&logo=amazonaws&logoColor=black)](https://aws.amazon.com/)
[![Azure](https://img.shields.io/badge/Azure-0078D4?style=flat-square&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)
[![GCP](https://img.shields.io/badge/GCP-4285F4?style=flat-square&logo=googlecloud&logoColor=white)](https://cloud.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## 📌 Overview

**CloudGuard AI** is a full-stack, open-source cloud security platform that automatically detects misconfigurations across **AWS**, **Azure**, and **Google Cloud Platform** simultaneously — through a single unified interface.

Every finding is:
- Scored by a **Gradient Boosting ML model** trained on 5,000 synthetic security records
- Automatically mapped to **CIS Benchmarks**, **NIST 800-53**, and **SOC2**
- Paired with **exact CLI commands** to fix the issue immediately

> Built and submitted at **IEEE Hackathon 2026** — The Islamia University of Bahawalpur (IUB), Department of Cyber Security & Digital Forensics.

> ⚠️ **68% of all cloud breaches are caused by misconfiguration — not hackers.** CloudGuard AI was built to change that.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Multi-Cloud Scanning** | Scan AWS, Azure, and GCP simultaneously from one dashboard |
| 🧠 **AI Risk Scoring** | Gradient Boosting model assigns risk score 0–100 per finding |
| 🔧 **Auto Remediation** | Exact CLI commands and portal steps for every finding type |
| 📋 **Compliance Mapping** | Auto-tagged to CIS Benchmarks, NIST 800-53, and SOC2 |
| 📄 **Report Export** | One-click PDF, HTML, CSV, and JSON security reports |
| 🔔 **Alert Management** | Custom alert rules with severity and provider filters |
| 📊 **Live Dashboard** | KPI cards, 30-day trend charts, cross-provider comparison |
| 🐳 **Dockerized** | Full platform runs with a single command |
| 🔐 **JWT Authentication** | Secure token-based auth with Helmet.js and rate limiting |

---

## ✅ Live Test Results

> Tested on a **real Microsoft Azure subscription** — April 28, 2026.

```
Scan Duration:  < 8 seconds
Total Findings: 3
```

| Severity | Service | Resource | Finding |
|---|---|---|---|
| 🔴 CRITICAL | Storage | `cloudpenteststore` | Public blob access enabled |
| 🟠 HIGH | Network | `OpenNSG` | NSG allows all inbound traffic from any source |
| 🟡 MEDIUM | Storage | `cloudpenteststore` | TLS version below 1.2 |

---

## 🏗️ Architecture

<details>
<summary><b>Project Structure</b></summary>

```
cloudguard-ai/
│
├── 📄 docker-compose.yml               # One-command full stack deployment
├── 📄 README.md
├── 📄 LICENSE
│
├── 📁 backend/                         # Node.js Express API
│   ├── 📄 server.js                    # App entry point
│   ├── 📄 .env                         # Environment variables
│   ├── 📁 middleware/
│   │   ├── 📄 auth.js                  # JWT authentication
│   │   └── 📄 validateKeys.js          # Credential validation
│   ├── 📁 routes/
│   │   ├── 📄 aws.js                   # POST /api/aws/scan
│   │   ├── 📄 azure.js                 # POST /api/azure/scan
│   │   ├── 📄 gcp.js                   # POST /api/gcp/scan
│   │   ├── 📄 analytics.js             # Dashboard + report endpoints
│   │   └── 📄 alerts.js                # Alert feed + rules
│   ├── 📁 services/
│   │   ├── 📄 awsScanner.js            # AWS SDK — IAM, S3, EC2
│   │   ├── 📄 azureScanner.js          # Azure SDK — Storage, NSG
│   │   ├── 📄 gcpScanner.js            # GCP SDK — Cloud Storage
│   │   ├── 📄 complianceMapper.js      # CIS / NIST / SOC2 mapping
│   │   ├── 📄 alertEngine.js           # Alert rule evaluation
│   │   └── 📄 dbService.js             # PostgreSQL operations
│   ├── 📁 ml/
│   │   └── 📄 mlClient.js              # ML service HTTP client
│   └── 📁 db/
│       └── 📄 schema.sql               # Database schema
│
├── 📁 ml-service/                      # Python FastAPI ML Service
│   ├── 📄 main.py                      # FastAPI entry point
│   ├── 📄 requirements.txt
│   ├── 📁 data/
│   │   └── 📄 synthetic_findings.py    # 5,000 training records
│   ├── 📁 models/
│   │   └── 📄 train_model.py           # GBClassifier + GBRegressor
│   ├── 📁 routers/
│   │   └── 📄 predict.py               # POST /predict endpoint
│   └── 📁 saved_models/
│       ├── 📄 classifier.joblib        # Trained at Docker build time
│       └── 📄 regressor.joblib         # Trained at Docker build time
│
└── 📁 frontend/                        # React 18 SPA
    ├── 📄 index.html
    ├── 📄 vite.config.js
    └── 📁 src/
        ├── 📄 App.jsx                  # Router + layout
        ├── 📁 services/
        │   └── 📄 api.js               # Axios instance
        ├── 📁 components/
        │   ├── 📄 Navbar.jsx
        │   └── 📄 ExportReport.jsx     # PDF/HTML/CSV/JSON export
        └── 📁 pages/
            ├── 📄 Home.jsx             # Scan form + results
            ├── 📄 Dashboard.jsx        # KPI + charts
            ├── 📄 Comparison.jsx       # Cross-provider radar
            ├── 📄 Alerts.jsx           # Alert feed + rules
            └── 📄 About.jsx            # Project info
```

</details>

### System Flow

```
User (Browser)
      │
      ▼
React Frontend (:5173)
      │
      │  POST /api/{provider}/scan
      ▼
Node.js Express API (:5000)
      │                    │
      │                    │ SQL queries
      ▼                    ▼
Cloud SDKs          PostgreSQL (:5432)
AWS / Azure / GCP   scans, findings,
      │             alerts, rules
      │ raw findings
      ▼
Python FastAPI ML Service (:8000)
GBClassifier + GBRegressor
Risk Score 0–100 + Risk Label
      │
      │ enriched findings
      ▼
Node.js API → saves to DB → returns to Frontend
      │
      ▼
React Dashboard renders results
PDF / HTML / CSV / JSON export
```

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 + Vite 5.4, Recharts, Lucide React, Axios |
| **Backend** | Node.js 20 + Express 4.18, jsonwebtoken, Helmet.js, express-rate-limit, pg |
| **ML Service** | Python 3.11 + FastAPI 0.104, scikit-learn 1.3, Joblib, Uvicorn |
| **Database** | PostgreSQL 16 Alpine — `scans`, `findings`, `alerts`, `alert_rules` |
| **Cloud SDKs** | AWS SDK v3, @azure/identity v4 + arm-*, @google-cloud/storage v7 |
| **Infrastructure** | Docker + Docker Compose v3, private `cloudguard_net` bridge network |

---

## 🔍 Security Checks

<details>
<summary><b>AWS — 6 Checks</b></summary>

- IAM password policy (MFA, length, complexity, expiration)
- IAM access key rotation (90-day threshold)
- S3 public access block configuration
- S3 server-side encryption (SSE-S3 / SSE-KMS)
- S3 versioning status
- EC2 security groups open to `0.0.0.0/0` on ports 22, 3389, 3306, 5432, 27017

</details>

<details>
<summary><b>Azure — 4 Checks</b></summary>

- Storage account HTTPS-only enforcement
- Public blob access setting
- Minimum TLS version (must be TLS 1.2)
- NSG rules allowing all inbound traffic from any source

</details>

<details>
<summary><b>GCP — 3 Checks</b></summary>

- Cloud Storage public IAM bindings (`allUsers` / `allAuthenticatedUsers`)
- Uniform bucket-level access
- Object versioning

</details>

---

## 📋 Compliance Mapping

| Check Type | CIS | NIST 800-53 | SOC2 |
|---|---|---|---|
| S3 Public Access | CIS 2.1.1 | AC-3 | CC6.1 |
| S3 Encryption | CIS 2.1.3 | SC-28 | CC6.7 |
| S3 Versioning | CIS 2.1.4 | CP-9 | A1.2 |
| IAM Password Policy | CIS 1.8 | IA-5 | CC6.1 |
| Access Key Rotation | CIS 1.14 | IA-5 | CC6.1 |
| EC2 Security Groups | CIS 5.2 | SC-7 | CC6.6 |
| Azure HTTPS | CIS 3.1 | SC-8 | CC6.7 |
| Azure Blob Access | CIS 3.5 | AC-3 | CC6.1 |
| Azure NSG | CIS 6.1 | SC-7 | CC6.6 |
| Azure TLS | CIS 3.7 | SC-8 | CC6.7 |
| GCP Public IAM | CIS 5.1 | AC-3 | CC6.1 |
| GCP Uniform Access | CIS 5.2 | AC-6 | CC6.3 |

---

## 🤖 ML Model

### Training Data
- **5,000 synthetic records** generated by `synthetic_findings.py`, based on real-world misconfiguration patterns

### Features
`provider` · `service` · `severity` (ordinal 0–3) · `public_exposure` · `encryption` · `mfa_enabled` · `resource_count`

### Models
| Model | Purpose |
|---|---|
| **GBClassifier** | Predicts risk label with confidence % |
| **GBRegressor** | Predicts continuous risk score 0–100 |

> Both models train automatically during `docker-compose up --build`. No manual training required.

### Sample Prediction Output

```json
{
  "risk_score": 87.3,
  "risk_label": "CRITICAL",
  "confidence": 0.94,
  "feature_contributions": {
    "public_exposure": 0.45,
    "severity": 0.32,
    "service": 0.13,
    "encryption": 0.10
  },
  "recommendations": [
    "Disable public blob access immediately",
    "Enable private endpoint for storage account"
  ]
}
```

---

## 🚀 Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/cloudguard-ai.git
cd cloudguard-ai
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your values:

```env
PORT=5000
JWT_SECRET=your-secret-key-change-this

DB_HOST=cloudguard_db
DB_PORT=5432
DB_NAME=cloudguard
DB_USER=cloudguard
DB_PASSWORD=cloudguard123

ML_SERVICE_URL=http://cloudguard_ml:8000
```

> **Note:** Cloud credentials are not required to run the platform. If none are provided at scan time, the platform uses simulated findings for demo purposes.

### 3. Start the platform

```bash
docker-compose up --build
```

### 4. Open in your browser

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| ML Service | http://localhost:8000 |
| Health Check | http://localhost:5000/health |

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API info |
| `GET` | `/health` | Health check |
| `POST` | `/api/aws/scan` | Trigger AWS scan |
| `POST` | `/api/azure/scan` | Trigger Azure scan |
| `POST` | `/api/gcp/scan` | Trigger GCP scan |
| `GET` | `/api/analytics/dashboard` | KPI + charts data |
| `GET` | `/api/analytics/comparison` | Cross-provider data |
| `GET` | `/api/analytics/report/:provider` | Export data |
| `GET` | `/api/alerts` | Alert feed + rules |
| `POST` | `/api/alerts/rules` | Create alert rule |
| `DELETE` | `/api/alerts/rules/:id` | Delete alert rule |

---

## 🔐 Security

- Cloud credentials are **never stored** in the database — they exist only in memory during the scan request
- JWT tokens expire after 24 hours
- Helmet.js applies CSP, HSTS, and X-Frame-Options headers
- Rate limiting on all scan and auth endpoints
- PostgreSQL and ML service are isolated within the Docker network and not exposed externally

---

## 🛠️ Troubleshooting

<details>
<summary><b>Backend not starting</b></summary>

```bash
docker-compose down --remove-orphans
docker system prune -f
docker-compose up --build
```

</details>

<details>
<summary><b>Container name conflict</b></summary>

```bash
docker rm -f cloudguard_db cloudguard_api cloudguard_ml cloudguard_ui
docker-compose up --build
```

</details>

<details>
<summary><b>Check container logs</b></summary>

```bash
docker logs cloudguard_api --tail 50
docker logs cloudguard_ml  --tail 50
docker logs cloudguard_db  --tail 50
docker logs cloudguard_ui  --tail 50
```

</details>

<details>
<summary><b>Frontend not loading</b></summary>

Try `http://127.0.0.1:5173` instead of `localhost`.

</details>

---

## 👥 Team 

 **Muhammad Zohaib** , 
 **Afifa Yasin** 
---

## 🗺️ Roadmap

- [ ] Real AWS SDK live scanning
- [ ] Real GCP SDK live scanning
- [ ] Scheduled automated scans (node-cron)
- [ ] Email notifications via nodemailer
- [ ] Kubernetes security scanning
- [ ] Terraform / CloudFormation IaC scanning
- [ ] Multi-user RBAC support
- [ ] Slack and PagerDuty integrations

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

🛡️ **CloudGuard AI — Cloud Security. For Everyone**

</div>
