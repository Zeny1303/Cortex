# PrepSync — AI-Powered Mock Interview Platform

> A full-stack platform for practicing coding interviews with AI-powered interviewers, real-time collaborative code editors, slot booking, and performance analytics.

---

## 🚀 Project Status

| Layer | Tech | Status |
|---|---|---|
| Frontend | React + Vite | ✅ Running |
| Backend | FastAPI (Python) | ✅ Running |
| Database | MongoDB | ✅ Connected |
| Real-time | WebSocket | ✅ Active |
| Auth | JWT Tokens | ✅ Working |

---

## 🌐 URLs & Ports

| Service | URL |
|---|---|
| **Frontend Dev Server** | `http://localhost:5173` |
| **Backend API** | `http://localhost:8000` |
| **API Docs (Swagger)** | `http://localhost:8000/docs` |
| **API Docs (Redoc)** | `http://localhost:8000/redoc` |
| **MongoDB Local** | `mongodb://localhost:27017` |

---

## 🗄️ Database Configuration

| Key | Value |
|---|---|
| **Database Name** | `prepdb` |
| **Questions Collection** | `questions` |
| **Users Collection** | `users` |
| **Interviews Collection** | `interviews` |
| **Slots Collection** | `slots` |

---

## ⚙️ Environment Variables

Create a `.env` file inside `Backend/` with:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/prepdb

# JWT Authentication
JWT_SECRET=your_super_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7

# MongoDB Pool
MAX_CONNECTIONS_COUNT=10
MIN_CONNECTIONS_COUNT=1
```

> ⚠️ Never commit `.env` to Git. It is already listed in `.gitignore`.

---

## 📁 Project Structure

```
PrepSync/
├── Frontend/                   # React + Vite frontend
│   └── src/
│       ├── pages/              # All UI pages (Dashboard, Auth, Interview, etc.)
│       ├── components/         # Reusable components (CodeEditor, VideoPanel, etc.)
│       ├── layout/             # Navbar, Sidebar, BookingNavbar
│       ├── context/            # AuthContext, ThemeContext (global state)
│       ├── services/           # authService.js (API calls)
│       └── app.js              # Routes definition
│
└── Backend/                    # FastAPI backend
    ├── app/
    │   ├── routers/            # API route definitions
    │   ├── controllers/        # Business logic
    │   ├── models/             # MongoDB document schemas
    │   ├── services/           # Core services (AI, auth, code exec)
    │   ├── middleware/         # JWT auth middleware
    │   ├── websocket/          # WebSocket handlers
    │   ├── config/             # Settings (env vars)
    │   ├── database/           # MongoDB connection
    │   └── utils/              # Room storage, cleanup utils
    ├── data/
    │   └── questions.json      # Blind 75 questions dataset (23 questions)
    ├── scripts/
    │   ├── validate_questions.py  # Validates & auto-fixes questions.json
    │   ├── seed_questions.py      # Seeds questions into MongoDB
    │   └── verify_questions.py   # Verifies DB after seeding
    └── main.py                 # FastAPI app entry point
```

---

## ✅ Features Built (v1.0)

### 🔐 Authentication
- User Signup & Login with JWT tokens
- Password hashing with bcrypt
- Global auth state via React `AuthContext`
- `authService.js` handles all auth API calls
- Token stored in localStorage, auto-loaded on page refresh

### 🏠 Landing Page
- Hero section (scrollable)
- College showcase grid with logos and event counts
- Modern footer with contact info and social links

### 📊 Dashboard
- Dynamically rendered user stats (from JWT)
- Stats cards component
- Sidebar navigation

### 👤 Profile & Settings
- Profile view and edit page
- Dark / Light theme toggle via `ThemeContext`
- Settings page with preferences

### 📅 Interview Booking
- Browse available time slots
- Book an interview slot
- Booking summary confirmation

### 🎯 Interview Flow (End-to-End)
1. **Setup** — Select interview pack and difficulty
2. **Permission Check** — Camera & microphone permission
3. **Countdown** — Pre-interview countdown timer
4. **Live Room** — Real-time interview session
5. **Completion** — Post-interview summary

### 💻 Live Interview Room
- Real-time **collaborative code editor** (WebSocket)
- **WebRTC video panel** for face-to-face
- AI Interviewer panel with question prompts
- Code state persisted per room

### 🤖 AI Interviewer (Backend)
- `ai_engine.py` — Drives AI interview flow
- `question_engine.py` — Generates DSA questions
- `answer_evaluator.py` — Evaluates submitted answers
- `code_executor.py` — Executes code submissions

### 📋 My Interviews
- View past interview history
- Leaderboard and performance rankings
- Evaluation table with scores

### 🗃️ Questions Dataset (NEW)
- **23 Blind 75 questions** seeded into MongoDB
- All questions have: `_id`, `title`, `difficulty`, `category`, `tags`, `description`, `starter_code` (Python), `test_cases` (4+ per question)
- Validation, seeding, and verification scripts ready

---

## 🔌 API Endpoints

| Prefix | Description |
|---|---|
| `POST /api/auth/signup` | Register new user |
| `POST /api/auth/login` | Login, returns JWT |
| `GET  /api/user/me` | Get current user profile |
| `GET  /api/slots` | List available interview slots |
| `POST /api/slots/book` | Book a slot |
| `GET  /api/interview` | Get interview sessions |
| `POST /api/code/run` | Execute code submission |
| `WS   /ws/{room_id}` | Collaborative code editor WebSocket |
| `WS   /ws/interview` | AI interview WebSocket |

---

## 🚀 Running the Project

### Backend
```bash
cd Backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

### Seed Questions to MongoDB
```bash
cd Backend
python scripts/validate_questions.py   # validate dataset first
python scripts/seed_questions.py       # seed into MongoDB
python scripts/verify_questions.py     # verify DB
```

---

## 📦 Dependencies

### Backend (Key)
| Package | Purpose |
|---|---|
| `fastapi` | Web framework |
| `motor` | Async MongoDB driver |
| `pymongo` | MongoDB driver |
| `python-jose` | JWT token handling |
| `bcrypt` | Password hashing |
| `pydantic-settings` | Settings via .env |
| `websockets` | WebSocket support |

### Frontend (Key)
| Package | Purpose |
|---|---|
| `react` | UI framework |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP requests |
| `vite` | Build tool / dev server |

---

## 👥 Contributors

| Name | Role |
|---|---|
| PrepSync Team | Full Stack Development |

---

## 📌 Next Steps (Planned)
- [ ] Add full Blind 75 question set (75 questions)
- [ ] AI answer evaluation via LLM API
- [ ] User progress tracking per question
- [ ] Question difficulty adaptive engine
- [ ] Email notifications for booked interviews
- [ ] Admin dashboard for slot management
