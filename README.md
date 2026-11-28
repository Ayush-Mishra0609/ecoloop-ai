# ♻️ EcoLoop AI – E-Waste Recovery & Reuse Intelligence

<p align="center">
  <strong>Making Every Device Count.</strong>
</p>

<p align="center">
  An AI-powered platform for electronic waste identification, device condition assessment, intelligent recovery recommendations, and environmental impact tracking.
</p>

---

## 🌍 About EcoLoop AI

Electronic waste is one of the fastest-growing waste streams worldwide. Many discarded electronic devices still contain reusable components, repairable hardware, and valuable recyclable materials.

**EcoLoop AI** is an AI-powered e-waste management platform designed to promote sustainable electronic waste recovery through Artificial Intelligence and Machine Learning.

The platform enables users to upload images of electronic devices, automatically classify them using a deep learning model, analyze their physical and functional condition, and receive intelligent recommendations for reuse, repair, or recycling.

By combining computer vision, Generative AI, and environmental impact estimation, EcoLoop AI aims to extend the lifecycle of electronic products, reduce unnecessary disposal, and encourage a circular economy.

## ✨ Key Features

### 1. AI-Powered E-Waste Classification
- Upload images of electronic devices for automated classification.
- Identify electronic waste using a trained MobileNetV2 model.
- Display predicted device categories and classification confidence.
- Allow manual correction of predicted categories.
- Support seven electronic waste categories.

**Supported Categories:**

| Category | Description |
|---|---|
| Battery | Electronic batteries |
| Cable | Electronic cables and wires |
| Keyboard | Computer keyboards |
| Laptop | Laptop computers |
| Mobile | Smartphones and mobile devices |
| Mouse | Computer mice |
| PCB | Printed Circuit Boards |

### 2. Gemini-Powered Device Analysis
- Analyze device condition and functional status.
- Generate descriptions of hardware-related issues.
- Identify potential software-related problems.
- Evaluate battery health and physical damage information.
- Generate additional descriptions of device conditions.
- Provide AI-assisted device health assessment.

### 3. Intelligent Recovery Recommendations

EcoLoop AI evaluates device conditions and recommends one of three recovery pathways.

| Recovery Pathway | Purpose |
|---|---|
| ♻️ Reuse | Encourage continued use or resale of functional devices. |
| 🔧 Repair | Identify devices that may be restored through repairs. |
| 🌱 Recycle | Recommend responsible material recovery for devices unsuitable for reuse or repair. |

### 4. Recovery Value Estimation
- Estimate the potential monetary value of electronic devices.
- Consider device category, condition, and recovery pathway.
- Display estimated recovery value on the dashboard.

*Recovery values are indicative estimates and are not guaranteed resale prices.*

### 5. Environmental Impact Tracking
- Estimate CO₂e emissions avoided through device recovery.
- Calculate cumulative environmental impact.
- Display total estimated CO₂ savings.
- Encourage sustainable recovery practices.

### 6. Interactive Dashboard

The dashboard provides a centralized overview of the user's sustainability contribution.

**Dashboard Components:**
- Total Devices Analyzed
- Working Devices
- Estimated Recovery Value
- CO₂ Saved
- Recovery Distribution
- Environmental Impact
- Recent Device Analyses

### 7. Device History
- Maintain records of analyzed electronic devices.
- Review previously analyzed devices.
- Access stored classification and recovery information.

### 8. Recovery Centre Discovery
- Search for nearby e-waste recovery centres.
- Discover potential recycling and recovery facilities.
- Use map-based location discovery.
- Retrieve location information through OpenStreetMap services.

### 9. User Settings and Global Dark Mode
- Profile information interface.
- Notification preferences.
- Privacy and security information.
- Light and dark appearance modes.
- Global theme management using React Context API.
- Persistent theme preference using browser localStorage.

---

## 🧠 Machine Learning Model

EcoLoop AI uses **MobileNetV2**, a convolutional neural network architecture, for image-based electronic waste classification.

### Dataset

The model was trained using the **E-Tadweer Image Dataset (ETID)**.

| Dataset Split | Number of Images |
|---|---:|
| Training | 4,388 |
| Validation | 940 |
| Testing | 941 |
| **Total** | **6,269** |

### Model Performance

| Evaluation Metric | Result |
|---|---:|
| Test Accuracy | **97.66%** |

The model was evaluated using:
- Accuracy
- Precision
- Recall
- F1-Score
- Classification Report

The model supports seven electronic waste categories: Battery, Cable, Keyboard, Laptop, Mobile, Mouse, and PCB.

*Note: The reported accuracy represents the recorded evaluation on the held-out test dataset, not a guarantee of real-world classification accuracy.*

---

## 🏗️ System Architecture

EcoLoop AI follows a client-server architecture integrating a React frontend, FastAPI backend, machine learning services, Gemini AI, and Supabase.

```text
                    USER
                      |
                      v
              REACT + VITE FRONTEND
                      |
                      v
                FASTAPI BACKEND
                      |
             +--------+--------+
             |                 |
             v                 v
       MOBILENETV2          GEMINI AI
       CLASSIFICATION      DEVICE ANALYSIS
             |                 |
             +--------+--------+
                      |
                      v
              DEVICE ASSESSMENT
                      |
                      v
             RECOVERY RECOMMENDATION
                      |
             +--------+--------+
             |        |        |
             v        v        v
           REUSE    REPAIR   RECYCLE
             |        |        |
             +--------+--------+
                      |
                      v
             ENVIRONMENTAL IMPACT
               & VALUE ESTIMATION
                      |
                      v
              SUPABASE DATABASE
                      |
                      v
             DASHBOARD & HISTORY
```

### Application Workflow

1. User registers or logs into the application.
2. User uploads an electronic device image.
3. MobileNetV2 predicts the device category.
4. User can confirm or correct the predicted category.
5. Gemini AI assists with device condition analysis.
6. Hardware and software issues are assessed.
7. A recovery pathway is recommended.
8. Environmental impact is estimated.
9. Device information is stored in Supabase.
10. Dashboard and history display the saved information.

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js 19 |
| Build Tool | Vite |
| Styling | CSS |
| Routing | React Router DOM |
| Icons | Lucide React |
| Charts | Recharts |
| Maps | Leaflet, React Leaflet |
| Backend | Python, FastAPI |
| Machine Learning | TensorFlow, MobileNetV2 |
| Generative AI | Google Gemini API |
| Database | PostgreSQL |
| Backend-as-a-Service | Supabase |
| Authentication | Supabase Auth |
| Image Storage | Supabase Storage |
| Recovery Centre Search | OpenStreetMap Nominatim and Overpass APIs |
| Version Control | Git and GitHub |

---

## 📁 Project Structure

```text
ecoloop-ai/
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbox.jsx
│   │   │   └── RecoveryMap.jsx
│   │   │
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Providers.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── dashboardService.js
│   │   │   ├── deviceService.js
│   │   │   ├── providerService.js
│   │   │   └── supabase.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   ├── carbon_service.py
│   │   │   ├── gemini_service.py
│   │   │   ├── prediction_service.py
│   │   │   ├── provider_service.py
│   │   │   └── recovery_service.py
│   │   │
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── ml/
│   ├── models/
│   │   ├── class_names.json
│   │   └── class_names_final.json
│   │
│   └── scripts/
│       ├── train.py
│       ├── train_final.py
│       ├── fine_tune.py
│       ├── fine_tune_final.py
│       ├── evaluate.py
│       ├── predict.py
│       ├── prepare_dataset.py
│       ├── split_dataset.py
│       └── test_final.py
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## ⚙️ Installation and Setup

Follow these instructions to run EcoLoop AI locally.

### Prerequisites

Make sure you have installed:

- Node.js and npm
- Python 3.12 (or a version compatible with the backend dependencies)
- Git
- A Supabase account
- A Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/Ayush-Mishra0609/ecoloop-ai.git

cd ecoloop-ai
```

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Replace the placeholder values with your Supabase project credentials.

Start the frontend development server:

```bash
npm run dev
```

The frontend will generally be available at:

```text
http://localhost:5173
```

### 3. Backend Setup

Open another terminal and navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

**Windows:**

```bash
venv\Scripts\activate
```

**Linux / macOS:**

```bash
source venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` directory:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Start the FastAPI server from inside the `backend` directory:

```bash
uvicorn app.main:app --reload
```

Backend API documentation:

```text
http://localhost:8000/docs
```

### 4. Supabase Configuration

EcoLoop AI uses Supabase for authentication, PostgreSQL database storage, and image storage.

Configure the following in your Supabase project:

- Supabase project URL.
- Supabase publishable/anon key as required by your project configuration.
- User authentication.
- PostgreSQL `devices` table.
- Private storage bucket named `device-images`.
- Appropriate database permissions and Row Level Security policies.

The frontend expects device records to be associated with the authenticated user's ID.

**Important:** The database schema and storage policies must be configured in Supabase separately. Do not expose service-role keys or database passwords in frontend code.

### 5. Machine Learning Model Setup

The trained model files are excluded from Git to avoid committing large binary files.

Place the required trained model artifact in the expected location configured by the backend prediction service.

The model class mapping files are available in:

```text
ml/models/
```

Check the prediction service configuration before running inference.

---

## 🔌 Backend API Endpoints

The current FastAPI application exposes the following main endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend root endpoint |
| GET | `/health` | Health check |
| GET | `/api/providers/search` | Search for recovery centres |
| POST | `/api/devices/analyze` | Analyze an uploaded device image |

Interactive API documentation is available through FastAPI Swagger UI:

```text
http://localhost:8000/docs
```

---

## 🌱 Environmental Impact

EcoLoop AI encourages environmentally responsible electronic waste management by promoting:

- Reuse of functional electronic devices.
- Repair of damaged but recoverable electronics.
- Recycling of devices unsuitable for reuse.
- Recovery of valuable electronic materials.
- Awareness of estimated CO₂e emissions avoided.

The platform aims to make sustainable electronic waste recovery more accessible and understandable.

---

## 🚀 Future Scope

Potential future enhancements include:

- AI-powered resale value prediction.
- Doorstep e-waste collection requests.
- Integration with authorized recycling partners.
- Advanced device health diagnostics.
- Improved battery and component damage recognition.
- Personalized sustainability analytics.
- Admin dashboard for managing users and recovery centres.
- Advanced environmental impact forecasting.
- Persistent user notification and profile
