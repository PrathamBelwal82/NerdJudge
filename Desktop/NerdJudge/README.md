# CodingMonkeys (NerdJudge)

Web-based online judge for competitive programming practice. Students register, browse problems, code in the browser, run against custom input, and submit for automatic grading. Built with **React**, **Express**, and **MongoDB**.

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| **Node.js** 18+ and **npm** | [nodejs.org](https://nodejs.org/) |
| **MongoDB** | MongoDB Atlas (cloud) **or** local MongoDB via Docker / Homebrew |
| **Compilers** (for Run / Submit) | `gcc`, `g++`, `javac` + `java`, `python3` on your PATH |

### Install compilers (macOS)

```bash
# C / C++
xcode-select --install
# or: brew install gcc

# Java
brew install openjdk
# Add to PATH if needed (Homebrew prints instructions after install)

# Python (often pre-installed)
python3 --version
```

### Install compilers (Ubuntu / Debian)

```bash
sudo apt update
sudo apt install -y build-essential default-jdk python3
```

---

## Quick start (recommended)

From the project root (`NerdJudge/`):

### 1. Install dependencies

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 2. Configure environment

**Backend** — create or edit `backend/.env`:

```env
PORT=8000
SECRET_KEY=your_long_random_secret_here
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/nerdjudge?retryWrites=true&w=majority

# Optional: comma-separated frontend URLs (defaults include localhost:5173)
CLIENT_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Frontend** — create or edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

> Do not commit real database passwords or secrets. Keep `.env` files local (they are listed in `.gitignore`).

### 3. Run backend and frontend together

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:5173 |
| Backend API | http://localhost:8000 |

Open the frontend URL in your browser, register a new account, and start solving problems.

---

## Run services separately

Useful when you only want to restart one side.

**Terminal 1 — backend**

```bash
cd backend
npm install
npm start
```

**Terminal 2 — frontend**

```bash
cd frontend
npm install
npm run dev
```

---

## MongoDB options

### Option A: MongoDB Atlas (cloud)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and copy the connection string.
3. Under **Network Access**, allow your IP (or `0.0.0.0/0` for development only).
4. Set `MONGODB_URI` in `backend/.env` to your connection string.

Test the connection:

```bash
cd backend
npm run atlas:debug
```

### Option B: Local MongoDB with Docker

```bash
# From project root
docker compose up -d
```

Then in `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/nerdjudge
```

Start the backend with `npm start` (in `backend/`).

### Option C: Demo mode (no MongoDB)

For a quick UI walkthrough without a database, set in `backend/.env`:

```env
USE_IN_MEMORY=true
```

Restart the backend. Data is stored in memory only and resets when the server stops. **Not for production.**

---

## Production build (frontend)

```bash
cd frontend
npm run build
npm run preview
```

Serve the `frontend/dist` folder behind a static host and point `VITE_API_BASE_URL` at your deployed API.

---

## Project structure

```
NerdJudge/
??? backend/          # Express API, auth, problems, code execution
??? frontend/         # React + Vite SPA
??? report_assets/    # Screenshots for project report / slides
??? scripts/          # Report and presentation generators
??? docker-compose.yml
??? package.json      # Root script: npm run dev (both apps)
```

---

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| **Cannot reach server** on login | Ensure backend is running on port 8000 and `VITE_API_BASE_URL` matches. |
| **MongoDB connection failed** | Check `MONGODB_URI`, Atlas IP allowlist, and username/password. Run `npm run atlas:debug` in `backend/`. |
| **CORS errors** | Add your frontend URL to `CLIENT_ORIGINS` in `backend/.env`. |
| **Run / Submit fails** | Install `gcc`, `g++`, `javac`, `java`, and `python3`; restart the backend. |
| **Port 5173 in use** | Stop the other process or change the port in `frontend/package.json` (`vite --port ...`). |

---

## Scripts (optional)

| Command | Location | Purpose |
|---------|----------|---------|
| `npm run dev` | Root | Start backend + frontend concurrently |
| `npm start` | `backend/` | API only |
| `npm run dev` | `frontend/` | UI only |
| `npm run atlas:debug` | `backend/` | Test MongoDB connection |
| `python3 scripts/build_codingmonkeys_presentation.py` | Root | Generate project presentation |

---

## License

Academic major project — Chandigarh Group of Colleges, Landran (BCA 2025–2026).
