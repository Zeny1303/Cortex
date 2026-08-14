# InterviewIQ 🚀 - AI-Powered Mock Interview Platform

InterviewIQ is a full-stack, AI-driven mock interview application built using the MERN stack (MongoDB, Express.js, React, Node.js). It enables candidates to prepare for job interviews through AI-generated questions tailored to their resume, targeted role, experience level, and interview mode. The platform evaluates responses in real-time, providing scores and detailed feedback on Confidence, Communication, and Correctness, along with PDF performance report downloads and credit top-ups via Razorpay.

---

## 🌟 Key Features

- 📄 **Smart Resume Parsing**: Upload PDF resumes to automatically extract role, experience, key skills, and projects using `pdfjs-dist` and OpenRouter AI.
- 🎯 **Tailored Question Generation**: Generates 5 structured interview questions with progressive difficulty (Easy → Medium → Hard).
- ⏱️ **Real-Time Timed Interviews**: Interactive timer for each question with smooth mode selection.
- 🤖 **AI-Powered Evaluation**: Evaluates answers across 3 key metrics:
  - **Confidence** (0-10)
  - **Communication** (0-10)
  - **Correctness** (0-10)
  - **Constructive Feedback** (short 10-15 word human-like critique)
- 📊 **Comprehensive Analytics & PDF Export**: Detailed performance dashboards using Recharts and downloadable PDF reports generated via `jsPDF`.
- 🔐 **Firebase Authentication**: Quick and secure sign-in using Google OAuth via Firebase Auth.
- 💳 **Credit & Payment System**: Integrated with Razorpay for purchasing interview credits to unlock mock interview sessions.
- 📜 **Interview History**: Track performance progress across past mock interviews over time.

---

## 🏗️ Tech Stack & Architecture

### **Frontend (`/client`)**
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4, Motion (Framer Motion), React Icons
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing**: React Router v7
- **Authentication**: Firebase Authentication (`firebase/auth`)
- **Data Visualization**: Recharts, React Circular Progressbar
- **PDF Generation**: `jspdf`, `jspdf-autotable`
- **HTTP Client**: Axios

### **Backend (`/server`)**
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express v5
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: OpenRouter API (`openai/gpt-4o-mini` model)
- **Authentication**: JWT stored in HTTP-Only Cookies (`jsonwebtoken`, `cookie-parser`)
- **File Upload & PDF Extraction**: Multer, `pdfjs-dist`
- **Payment Processing**: Razorpay Node.js SDK with HMAC SHA256 signature verification

---

## 📋 Prerequisites & System Requirements

Before running the project locally, ensure you have installed:

- **Node.js**: `v18.0.0` or higher (`v20+` recommended)
- **npm**: `v9.0.0` or higher
- **MongoDB**: A local MongoDB database or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.
- **Third-Party API Accounts & Credentials**:
  1. **OpenRouter API Key**: Obtain from [OpenRouter.ai](https://openrouter.ai/) for AI question generation and grading.
  2. **Firebase Project**: Create a project in [Firebase Console](https://console.firebase.google.com/) and enable Google Auth.
  3. **Razorpay Account**: Obtain API Key ID & Key Secret from [Razorpay Dashboard](https://dashboard.razorpay.com/) (Test mode is sufficient).

---

## ⚙️ Environment Configuration

You need to create `.env` files in both the `server` and `client` directories.

### 1. Server Environment (`server/.env`)

Create a `.env` file inside the `server/` directory:

```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 2. Client Environment (`client/.env`)

Create a `.env` file inside the `client/` directory:

```env
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 🚀 Getting Started / How to Run

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd 3.interviewIQ
```

### Step 2: Set Up & Start Backend (`server`)

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `server/.env` as shown in the section above.
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:8000` (or your configured `PORT`) and connect to MongoDB.*

---

### Step 3: Set Up & Start Frontend (`client`)

1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `client/.env` as shown in the section above.
4. Start the Vite frontend dev server:
   ```bash
   npm run dev
   ```
   *The client application will run at `http://localhost:5173`.*

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/google` | Google Auth user registration / login | No |
| **GET** | `/api/auth/logout` | Clear authentication session cookie | Yes |
| **GET** | `/api/user/me` | Fetch logged-in user details & credits balance | Yes |
| **POST** | `/api/interview/analyze-resume` | Upload & parse resume PDF file | Yes |
| **POST** | `/api/interview/generate-questions` | Generate 5 AI questions based on profile (Deducts 50 credits) | Yes |
| **POST** | `/api/interview/submit-answer` | Submit answer for question scoring & AI feedback | Yes |
| **POST** | `/api/interview/finish` | Calculate final scores and mark interview as completed | Yes |
| **GET** | `/api/interview/my-interviews` | Fetch all historical interviews for current user | Yes |
| **GET** | `/api/interview/report/:id` | Fetch full report and performance breakdown for an interview | Yes |
| **POST** | `/api/payment/create-order` | Generate Razorpay payment order for credit purchase | Yes |
| **POST** | `/api/payment/verify` | Verify Razorpay payment signature & credit user account | Yes |

---

## 🛠️ Folder Structure

```
3.interviewIQ/
├── client/                     # React 19 Frontend (Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Brand logos & graphics
│   │   ├── components/         # UI components (Steps 1-3, AuthModal, Navbar, Footer, Timer)
│   │   ├── pages/              # App Pages (Home, Auth, InterviewPage, History, Report, Pricing)
│   │   ├── redux/              # Redux slices & store setup
│   │   ├── utils/              # Firebase initialization & helper functions
│   │   ├── App.jsx             # Routes & layout wrapper
│   │   └── main.jsx            # Application entry point
│   ├── .env                    # Frontend environment variables
│   ├── package.json            # Client dependencies
│   └── vite.config.js          # Vite configuration
│
└── server/                     # Express.js Backend
    ├── config/                 # Database connection & JWT helper
    ├── controllers/            # Route controllers (Auth, Interview, Payment, User)
    ├── middlewares/            # Auth middleware
    ├── models/                 # Mongoose schemas (User, Interview, Payment)
    ├── routes/                 # API routes definitions
    ├── services/               # External services (OpenRouter AI, Razorpay)
    ├── index.js                # Server entry point
    ├── .env                    # Server environment variables
    └── package.json            # Server dependencies
```

---

## 📄 License

This project is open-source and available under the [ISC License](LICENSE).
