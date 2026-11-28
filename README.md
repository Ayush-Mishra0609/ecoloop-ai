# ♻️ EcoLoop AI – E-Waste Recovery & Reuse Intelligence

An AI-powered platform that identifies electronic waste, evaluates device conditions, recommends sustainable recovery pathways, and helps users discover the hidden value of discarded electronics.

## 🌍 About the Project

Electronic waste is one of the fastest-growing waste streams worldwide. Many electronic devices that are discarded still contain reusable components, repairable hardware, or valuable recyclable materials.

**EcoLoop AI** aims to bridge this gap through Artificial Intelligence and Machine Learning.

The platform allows users to upload images of electronic devices, identify their categories using an image classification model, assess their condition using AI-powered analysis, and receive recommendations for reuse, repair, or recycling.

The goal is to promote a circular economy by reducing electronic waste, extending device lifecycles, and encouraging responsible resource recovery.

## 🎯 Key Features

### 1. AI-Powered E-Waste Classification
- Upload images of electronic devices.
- Automatically identify the device category using a trained deep learning model.
- Display classification confidence.
- Allow users to correct the predicted category when necessary.

**Supported categories:**
- Battery
- Cable
- Keyboard
- Laptop
- Mobile
- Mouse
- PCB (Printed Circuit Board)

### 2. AI-Based Device Condition Analysis
- Analyze device condition and visible damage.
- Identify potential hardware issues.
- Identify potential software-related issues.
- Generate additional descriptions of device damage.
- Provide a device health score.

### 3. Intelligent Recovery Recommendations

EcoLoop AI recommends one of three recovery pathways:

| Pathway | Description |
|---|---|
| Reuse | Recommend reuse when a device remains functional. |
| Repair | Identify devices that may be restored through repairs. |
| Recycle | Recommend responsible material recovery for unsuitable devices. |

### 4. Recovery Value Estimation
- Estimate the potential monetary recovery value of electronic devices.
- Consider device category, condition, and recommended recovery pathway.
- Aggregate estimated recovery values on the dashboard.

*Recovery values are estimates and should not be treated as guaranteed resale prices.*

### 5. Environmental Impact Tracking
- Calculate estimated CO₂e emissions avoided.
- Display cumulative environmental impact.
- Track sustainability contributions through the dashboard.

### 6. Interactive Dashboard
The dashboard provides an overview of:
- Total devices analyzed.
- Number of working devices.
- Estimated recovery value.
- Total CO₂ savings.
- Reuse, repair, and recycling distribution.
- Recent device analyses.

### 7. Device History
Maintain records of previously analyzed electronic devices and review their classifications and recovery recommendations.

### 8. Recovery Centre Discovery
Provides an interface for discovering recovery centres and connecting users with potential e-waste recovery providers.

### 9. User Settings
- Profile information interface.
- Notification preferences.
- Light and dark appearance modes.
- Privacy and security information.
- Global theme management with persistent theme preference.

## 🧠 Machine Learning Model

EcoLoop AI uses a deep learning image classification model based on MobileNetV2.

### Dataset

The model was trained using the E-Tadweer Image Dataset (ETID).

| Dataset Split | Images |
|---|---:|
| Training | 4,388 |
| Validation | 940 |
| Testing | 941 |
| **Total** | **6,269** |

### Model Performance

| Evaluation Metric | Result |
|---|---:|
| Test Accuracy | 97.66% |

The model was evaluated using precision, recall, F1-score, and classification accuracy across the seven supported categories.

*These are results from the recorded model evaluation and should be distinguished from live production performance.*

## 🏗️ System Architecture

The project follows a client-server architecture.

```text
             USER
               |
               v
       REACT + VITE FRONTEND
               |
               v
          FASTAPI BACKEND
               |
       +-------+-------+
       |               |
       v               v
  ML CLASSIFIER    GEMINI AI
  MobileNetV2      Device Analysis
       |               |
       +-------+-------+
               |
               v
       DEVICE ASSESSMENT
               |
               v
      RECOVERY RECOMMENDATION
               |
        +------+------+ 
        |      |      |
       REUSE  REPAIR RECYCLE
               |
               v
       SUPABASE / POSTGRESQL
               |
               v
       DASHBOARD & HISTORY
```

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite |
| Styling | CSS |
| Routing | React Router DOM |
| Icons | Lucide React |
| Backend | Python, FastAPI |
| Machine Learning | TensorFlow, MobileNetV2 |
| AI Integration | Google Gemini API |
| Database | PostgreSQL through Supabase |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| Version Control | Git and GitHub |

## 📁 Project Structure

The following is a representative structure; adjust it to match the actual repository.

```text
EcoLoop-AI/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── main.py
│   ├── models/
│   ├── routers/
│   ├── services/
│   └── requirements.txt
│
├── ml/
│   ├── models/
│   └── scripts/
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js and npm
- Python 3.12 (or a version compatible with the project's dependencies)
- Git
- Supabase account
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd EcoLoop-AI
```

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file using the environment variables required by your frontend configuration.

Example:

```env
VITE_API_URL=YOUR_BACKEND_API_URL
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Start the development server:

```bash
npm run dev
```

### 3. Backend Setup

Open another terminal and navigate to the backend directory:

```bash
cd backend
```

Create and activate a Python virtual environment:

```bash
python -m venv venv
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure your backend environment variables according to the actual application configuration.

Start FastAPI:

```bash
uvicorn main:app --reload
```

The backend API documentation is generally available at:

```text
http://localhost:8000/docs
```

### 4. Database Configuration

Configure your Supabase project and provide the required credentials and database configuration.

Never commit private API keys, service-role keys, or database passwords.

## 📊 Expected Application Workflow

1. User registers or logs into EcoLoop AI.
2. User uploads an electronic device image.
3. The ML model predicts the device category.
4. Gemini assists with device condition and damage analysis.
5. The system evaluates device health.
6. A recovery pathway is recommended.
7. Recovery value and environmental impact are estimated.
8. The analysis is saved and displayed in the dashboard and history.

## 🌱 Project Impact

EcoLoop AI aims to contribute towards:

- Reducing electronic waste.
- Promoting repair and reuse over unnecessary disposal.
- Encouraging responsible e-waste recycling.
- Recovering valuable materials from discarded electronics.
- Increasing awareness about sustainable electronic consumption.

## 🚀 Future Scope

Potential future enhancements include:

- AI-powered resale price prediction.
- Location-based e-waste collection services.
- Doorstep e-waste pickup requests.
- Integration with authorized recycling partners.
- Advanced device health diagnostics.
- E-waste generation and recovery analytics.
- Admin dashboard for managing users and recovery providers.
- More advanced environmental impact estimation.

## 👨‍💻 Project Information

**Project Name:** EcoLoop AI

**Domain:** Artificial Intelligence, Machine Learning, Sustainability and E-Waste Management

**Objective:** Building an intelligent platform for electronic waste identification, condition assessment, and sustainable recovery recommendations.

## 🤝 Contributions

Contributions, suggestions, and improvements are welcome.

Feel free to fork this repository, create a feature branch, and submit a pull request.

## 📄 License

Choose and add an appropriate open-source license before distributing this project.

---

**EcoLoop AI – Making Every Device Count. ♻️**
