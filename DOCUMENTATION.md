# GRIDWATCH AI — Energy Theft & Anomaly Detection System (ETDS)
## Comprehensive Architecture, Data Provenance, System Design & Operational Manual

---

### Executive Summary

**GRIDWATCH AI (ETDS v1.2)** is an advanced distribution intelligence dashboard prototype designed for electrical utility operators (DISCOMs / grid administrators). Its primary objective is to detect, visualize, and prioritize non-technical energy losses (electricity theft, meter bypassing, neutral manipulation, and hardware malfunction) across distribution transformers and consumer end-points.

The platform provides multi-tier visibility: from high-level grid demand monitoring across distribution zones down to individual smart meter telemetry, unsupervised anomaly scoring, and field audit dispatch workflows.

---

## 1. How the System Works (Runtime & Workflow)

The web application is built as a high-performance, single-page application (SPA) using **React 19**, **TypeScript**, **Vite 8**, **Tailwind CSS 4**, and **Recharts**.

### 1.1 Application Flow & Navigation Architecture

The site operates around a centralized state container in `src/App.tsx` coordinating three primary views:
1. **Landing & Spec Presentation View (`LandingPage.tsx`)**: High-level system overview, value proposition, and the 6-stage end-to-end detection pipeline.
2. **Interactive Utility Dashboard (7 Distinct Views)**: Controlled via the sidebar and top bar navigation:
   - **Overview (`OverviewPage.tsx`)**: Primary executive view with aggregate KPIs, 30-day demand vs expected line chart with highlighted anomaly events, risk distribution donut chart, critical alerts, and sub-station leaderboard.
   - **Consumer Analysis (`ConsumerAnalysisPage.tsx`)**: Deep dive into individual consumer meters with an interactive 0-100 risk score dial, five risk factor breakdowns, 12-month historical vs baseline demand chart, and AI diagnostic explanations. Includes quick demo preset buttons (`C-10482`, `C-08721`, `C-19382`, etc.).
   - **Anomaly Detection (`AnomalyDetectionPage.tsx`)**: Scatter plot plotting Expected Consumption ($X$-axis) against Actual Consumption ($Y$-axis) across 500 consumers. Outliers deviating below the ideal $y=x$ line represent anomalous under-reporting. Features risk filter pills (`ALL`, `HIGH`, `MEDIUM`, `LOW`, `NORMAL`).
   - **Area Intelligence (`AreaIntelligencePage.tsx`)**: Macro grid topology map showing 8 major sub-stations across Bengaluru (Whitefield, Marathahalli, Electronic City, etc.) connected with topological feeder lines. Selecting an area displays feeder-level load mismatch ($Load_{expected} - Load_{actual}$), monetary loss, and flagged consumers in that feeder.
   - **Consumption Analytics (`ConsumptionAnalyticsPage.tsx`)**: 6 analytical charts analyzing daily demand, 12-month trends, peak vs off-peak diurnal load (e.g. night 00:00-04:00 drop ratio), loss volatility, area comparisons, and risk stratification.
   - **Alerts & Prioritization Queue (`AlertsPage.tsx`)**: Operational triage table supporting real-time search, multi-criteria filtering by Severity (`HIGH`, `MEDIUM`, `LOW`) and Audit Status (`New`, `Reviewing`, `Investigation`, `Resolved`), with in-line status mutation and direct inspection triggers.
   - **Model Insights (`ModelInsightsPage.tsx`)**: Machine learning benchmarking view comparing Supervised Random Forest, Unsupervised Isolation Forest, and Logistic Regression baseline, alongside a feature importance ranking bar chart.
3. **Contextual Drill-Down Modal (`ConsumerModal.tsx`)**: Accessible from any view (scatter plot nodes, alert rows, top bar search, or area lists) without losing context, enabling immediate inspection and field dispatch logging.

---

## 2. Data Provenance: Where Does the Data Come From?

### 2.1 Current Implementation (Prototype / Mock Data Engine)

All data consumed by the dashboard is generated locally within `src/data/mockData.ts`. **There is no active external database (PostgreSQL/MongoDB) or live REST/GraphQL backend connected in this repository.**

The data is assembled through two mechanisms:

1. **Curated Case Studies (`KEY_CONSUMERS`)**:
   Handcrafted high-fidelity consumer profiles designed to demonstrate canonical energy theft patterns:
   - **C-10482 (Sri Krishna Residency, Whitefield)**: Residential consumer showing a sustained **-67.2%** deviation below expected baseline, high night anomaly score, and ₹18,500 estimated monthly loss.
   - **C-08721 (Verma Cold Storage, Marathahalli)**: Commercial 3-phase connection with **-58.1%** consumption drop during non-operational night hours while transformer voltage remained stable (characteristic of meter bypass).
   - **C-19382 (Apex Fabrication, Electronic City)**: Industrial feeder with **-31.9%** peer deviation and sudden load shift.
   - **C-04912 (Greenwoods Apartment B-402, Whitefield)**: Residential connection with zero night-time usage despite active registered occupancy (suspected shunt injection / neutral disconnect).
   - **C-15209 (Metro Plaza Bakers, HSR Layout)**: Commercial profile showing a gradual 24-month negative drift (-32.0%) indicative of CT (Current Transformer) ratio mismatch or aging hardware degradation.

2. **Procedural Synthetic Generation Engine (`generateConsumersDataset`)**:
   Generates 495 additional consumers (bringing total dataset to 500) using parameterized statistical distributions:
   - **Risk Brackets**: ~15 High Risk, 25 Medium Risk, 60 Low Risk, and 400 Normal consumers.
   - **Consumption Scaling**: Industrial (base $\times 2.5$), Commercial (base $\times 1.5$), Residential (base $150-600\text{ kWh}$).
   - **Deviation Injection**:
     - *High Risk*: -50% to -80% deviation, anomaly scores 0.82 to 0.98.
     - *Medium Risk*: -25% to -49% deviation, anomaly scores 0.60 to 0.81.
     - *Low Risk*: -10% to -24% deviation, anomaly scores 0.35 to 0.59.
     - *Normal*: -6% to +6% deviation, anomaly scores 0.00 to 0.34.
   - **12-Month Longitudinal Generator (`generateMonthlyHistory`)**: Incorporates seasonal indices (elevated cooling demand in Apr–Jul) and injects drops in the final 3 months for anomalous accounts.

---

## 3. Data Classification: What Data is Real vs What is Fake?

| Data Dimension | Status | Classification & Details |
| :--- | :--- | :--- |
| **Consumer Names, IDs & Addresses** | **Synthetic (Fake)** | Names like "Sri Krishna Residency", "Verma Cold Storage", and "Sunrise Villa" are procedurally generated for privacy and academic simulation. |
| **Meter Readings (kWh values)** | **Simulated** | Calculated via mathematical formula: $Actual = Expected \times (1 + \frac{Deviation\%}{100})$. Reflects genuine theft patterns, but is not pulled from physical meters. |
| **KPI Aggregate Counters** | **Mock Display Constants** | "24,860 Total Consumers" and "42 Monitored Areas" in the KPI header are static presentation constants. The in-memory client dataset contains 500 consumers across 8 areas. |
| **Grid Topology & Feeder Names** | **Real Names, Simulated Topology** | Neighborhoods (Whitefield, Electronic City, HSR Layout, etc.) are real geographical zones in Bengaluru, India. Feeder coordinates $(x, y)$ and interconnecting SVG lines are stylized schematic approximations. |
| **Financial Loss Figures (₹ INR)** | **Heuristic Calculation** | Loss is estimated based on unmetered kWh multiplied by average commercial/residential slab tariffs ($\approx ₹7.5 - ₹10\text{ per kWh}$). |
| **ML Model Performance Metrics** | **Benchmark Presentation** | The 94.2% accuracy, 91.7% precision, and feature importance bars (32% consumption deviation, etc.) represent offline ML training results from historical research datasets, hardcoded for demonstration. |
| **Interactive State & Logic** | **100% Real Code** | Search indexing, multi-factor filtering, scatter plot re-rendering, status updates (`Reviewing` $\rightarrow$ `Investigation`), and dynamic line calculations are authentic client-side TypeScript logic. |
| **Date & Time Clocks** | **Real Local Clock** | The TopBar clock dynamically queries the local browser system time in Indian Standard Time (IST). |

---

## 4. System Design & Architectural Blueprint

### 4.1 Current Frontend Prototype Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER / CLIENT                           │
├────────────────────────────────────────────────────────────────────────┤
│  TopBar (Global Search, Clock, Notification Center, Brand Navigation)  │
├───────────────────┬────────────────────────────────────────────────────┤
│  Sidebar          │  Active Page Viewport                              │
│  - Overview       │  - OverviewPage (Recharts Line, Donut, KPI Grid)   │
│  - Consumer Ana.  │  - ConsumerAnalysisPage (Gauge, 5 Risk Cards, Line)│
│  - Anomaly Det.   │  - AnomalyDetectionPage (Scatter Plot, Pipeline)   │
│  - Area Intel.    │  - AreaIntelligencePage (Node Grid, Feeder Info)   │
│  - Analytics      │  - ConsumptionAnalyticsPage (6 Analytics Charts)   │
│  - Alerts Queue   │  - AlertsPage (Triage Table, Status Updater)       │
│  - Model Insights │  - ModelInsightsPage (Benchmarking & Features)     │
│  - Specs/Landing  │  - LandingPage (Specs & 6 Pipeline Stages)         │
├───────────────────┴────────────────────────────────────────────────────┤
│  ConsumerModal (Global contextual overlay triggered from any view)     │
├────────────────────────────────────────────────────────────────────────┤
│  In-Memory Mock State Layer (`src/data/mockData.ts`)                   │
│  - ALL_CONSUMERS (500 records)  - MOCK_AREAS (8 sub-stations)         │
│  - MOCK_ALERTS (7 active items) - MOCK_30DAY_CONSUMPTION               │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Target Enterprise Production Architecture (How to Connect to Live Grid)

To transition this prototype into a full-scale industrial utility deployment, the following backend and IoT infrastructure must be integrated:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. GRID EDGE & PHYSICAL ASSETS                                         │
│    • Smart Meters (AMI / AMR via DLMS/COSEM, cellular NB-IoT / 4G)     │
│    • Distribution Transformers (DT Smart Metering & Modbus RTUs)       │
│    • Substation SCADA & RTUs                                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Automated 15-min Telemetry
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. INGESTION & DATA STREAMING LAYER                                    │
│    • Head-End System (HES) & Meter Data Management System (MDMS)       │
│    • Apache Kafka / Redpanda Cluster (Partitioned by Substation/Feeder)│
│    • Apache Flink / Spark Streaming (Data cleaning, window aggregation)│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Cleaned Telemetry Stream
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. PERSISTENCE & STORAGE TIER                                          │
│    • Time-Series DB: TimescaleDB / InfluxDB (15-min granular interval) │
│    • Relational DB: PostgreSQL (Consumer metadata, billing history)    │
│    • Data Lake: AWS S3 / MinIO (Raw historical parquet files)          │
│    • Cache: Redis (Active session alerts, feeder aggregate stats)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Feature Vectors & Historical Data
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. MACHINE LEARNING & ANOMALY INFERENCE PIPELINE                       │
│    • Baseline Load Forecaster: Prophet / NeuralProphet / PatchTST      │
│    • Unsupervised Detector: Isolation Forest & Autoencoder             │
│    • Supervised Classifier: XGBoost / LightGBM (Trained on field audits│
│    • Energy Balance Engine: $Loss = Energy_{DT} - \sum Energy_{Meters}$ │
│    • Model Registry & Tracking: MLflow / Kubeflow                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Scored Anomalies & Enriched Alerts
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 5. APPLICATION BACKEND & API GATEWAY                                   │
│    • FastAPI / NestJS Backend (Async REST & WebSockets for live push)  │
│    • Role-Based Access Control (RBAC): SuperAdmin, Analyst, Field Crew │
│    • Celery / Temporal Worker: Scheduled batch anomaly scoring runs    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JSON API & WebSocket Telemetry
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 6. FRONTEND PRESENTATION & FIELD OPERATIONS                            │
│    • GRIDWATCH AI React Dashboard (Current System)                     │
│    • Field Operations Mobile App (React Native): GPS verification,     │
│      offline tamper evidence photo capture, digital audit signature.   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Mathematical Formulations of Key Theft Detection Metrics

### 5.1 Energy Balance Deviation (Feeder Level)
$$\Delta E_{feeder} = E_{injected}^{DT} - \sum_{i=1}^{N} E_{consumed}^{meter\_i} - L_{technical}^{calc}$$
Where:
- $E_{injected}^{DT}$: Total energy delivered by the Distribution Transformer.
- $\sum E_{consumed}^{meter\_i}$: Sum of all individual consumer metered loads downstream.
- $L_{technical}^{calc}$: Theoretical line loss based on conductor impedance and distance.
- When $\Delta E_{feeder} > \text{threshold}$, non-technical loss (theft) is flagged.

### 5.2 Consumer Consumption Deviation Index
$$\text{Deviation}_{\%} = \left( \frac{E_{actual} - E_{baseline}}{E_{baseline}} \right) \times 100$$
Where $E_{baseline}$ is computed via historical seasonal rolling averages adjusted for cooling degree days (CDD).

### 5.3 Diurnal Night-Time Ratio Anomaly
$$\text{Ratio}_{night} = \frac{\int_{01:00}^{05:00} P(t) \, dt}{\int_{00:00}^{24:00} P(t) \, dt}$$
Significant discrepancies between daytime and night-time consumption ratios compared to peer baselines reveal meter bypasses or unauthorized off-peak loads.

### 5.4 Composite Anomaly Risk Score
$$\text{Risk Score} = w_1 \cdot \text{Dev}_{cons} + w_2 \cdot \text{Var}_{hist} + w_3 \cdot \text{Ratio}_{night} + w_4 \cdot \text{Perc}_{peer} + w_5 \cdot \text{Step}_{load}$$
Weights derived from feature importance benchmarks ($w_1 = 0.32, w_2 = 0.21, w_3 = 0.16, w_4 = 0.13, w_5 = 0.10$).

---

## 6. Security, Compliance & Ethical Field Operations

1. **Academic Prototype Positioning**: As highlighted in the application's disclaimers, algorithmic predictions provide probabilistic suspicion indices. Physical inspection and statutory meter testing are required before issuing punitive demand notices.
2. **Consumer Data Privacy**: In production, consumer names and GPS coordinates must undergo pseudonymous hashing (tokenization) to prevent unauthorized profiling, adhering to Indian Digital Personal Data Protection (DPDP) Act and GDPR standards.
3. **Audit Trail Immutability**: All status transitions (`New` $\rightarrow$ `Reviewing` $\rightarrow$ `Investigation` $\rightarrow$ `Resolved`) must be recorded in an immutable audit ledger with user timestamps, preventing unauthorized dismissal of flagged cases.

---

## 7. Running the Site Locally

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or pnpm

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Build for production to verify types
npm run build

# 3. Start local development server with network exposure
npm run dev -- --host
```

- Local URL: `http://localhost:5173/`
- Network URL: Displayed in the terminal output (e.g. `http://192.168.x.x:5173/`)

