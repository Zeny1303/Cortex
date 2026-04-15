"""
Run this BEFORE starting the server to catch all config issues.
python diagnose.py
"""
import os, sys, importlib, subprocess, socket
from pathlib import Path

RED   = "\033[91m"; GREEN = "\033[92m"; YELLOW = "\033[93m"
BOLD  = "\033[1m";  RESET = "\033[0m"

def ok(m):   print(f"  {GREEN}✓{RESET} {m}")
def err(m):  print(f"  {RED}✗ {m}{RESET}")
def warn(m): print(f"  {YELLOW}⚠ {m}{RESET}")
def hdr(m):  print(f"\n{BOLD}{m}\n{'─'*45}{RESET}")

print(f"\n{BOLD}Cortex — Pre-flight Diagnostics{RESET}")

# ── 1. Working directory ─────────────────────────────────────────
hdr("1 · Working directory")
cwd = Path.cwd()
print(f"  CWD: {cwd}")
if (cwd / "app" / "main.py").exists():
    ok("app/main.py found — correct directory")
else:
    err("app/main.py NOT found")
    err("You must run this from the Backend/ folder")
    err(f"  Try: cd Backend  then  python diagnose.py")

# ── 2. .env file ─────────────────────────────────────────────────
hdr("2 · .env file")
env_path = cwd / ".env"
if not env_path.exists():
    err(".env file missing!")
    err("Create Backend/.env with these keys:")
    print("""
    MONGO_URI=mongodb://localhost:27017
    JWT_SECRET=some_long_random_string_here
    JWT_ALGORITHM=HS256
    JWT_EXPIRATION_DAYS=7
    GROQ_API_KEY=your_groq_key
    AI_MODEL=llama-3.1-8b-instant
    STT_PROVIDER=assemblyai
    ASSEMBLYAI_API_KEY=your_assemblyai_key
    TTS_PROVIDER=polly
    AWS_ACCESS_KEY=your_aws_key
    AWS_SECRET_KEY=your_aws_secret
    AWS_REGION=us-east-1
    """)
else:
    ok(".env found")
    required = ["MONGO_URI","JWT_SECRET","GROQ_API_KEY","ASSEMBLYAI_API_KEY",
                "AWS_ACCESS_KEY","AWS_SECRET_KEY","AWS_REGION"]
    lines = env_path.read_text()
    for key in required:
        if key in lines and f"{key}=" in lines:
            val = [l for l in lines.splitlines() if l.startswith(f"{key}=")]
            v = val[0].split("=",1)[1].strip() if val else ""
            if v and v not in ("your_groq_key","your_aws_key","your_aws_secret","your_assemblyai_key"):
                ok(f"  {key} = set")
            else:
                warn(f"  {key} = looks like placeholder — update it")
        else:
            err(f"  {key} = MISSING from .env")

# ── 3. Python packages ───────────────────────────────────────────
hdr("3 · Required packages")
pkgs = ["fastapi","uvicorn","motor","pydantic_settings","jose",
        "passlib","groq","boto3","httpx","websockets","assemblyai"]
for pkg in pkgs:
    try:
        m = importlib.import_module(pkg.replace("-","_"))
        ver = getattr(m, "__version__", "?")
        ok(f"{pkg} ({ver})")
    except ImportError:
        err(f"{pkg}  ← NOT INSTALLED  →  pip install {pkg}")

# ── 4. Port 8000 ─────────────────────────────────────────────────
hdr("4 · Port 8000")
s = socket.socket()
result = s.connect_ex(("localhost", 8000))
s.close()
if result == 0:
    warn("Something already listening on port 8000 — is server already running?")
else:
    ok("Port 8000 is free — ready to start")

# ── 5. MongoDB reachability ──────────────────────────────────────
hdr("5 · MongoDB (localhost:27017)")
s2 = socket.socket()
r2 = s2.connect_ex(("localhost", 27017))
s2.close()
if r2 == 0:
    ok("MongoDB is reachable on port 27017")
else:
    err("MongoDB NOT reachable on port 27017")
    err("Start MongoDB:  mongod --dbpath C:/data/db")
    err("Or use Atlas — update MONGO_URI in .env")

# ── 6. Questions seeded? ─────────────────────────────────────────
hdr("6 · Questions data")
if (cwd / "data" / "questions.json").exists():
    ok("data/questions.json found")
    seed = cwd / "scripts" / "seed_questions.py"
    if seed.exists():
        ok("seed_questions.py found — run it if DB is empty")
    else:
        warn("scripts/seed_questions.py not found")
else:
    err("data/questions.json NOT found")

# ── 7. Correct uvicorn command ───────────────────────────────────
hdr("7 · Correct startup command")
print(f"  {GREEN}From your Backend/ folder, run:{RESET}")
print(f"  {BOLD}  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000{RESET}")
print()
print(f"  {RED}NOT:{RESET} uvicorn main:app  (wrong)")
print(f"  {RED}NOT:{RESET} python app/main.py  (won't work)")

print(f"\n{BOLD}Diagnostics complete.{RESET}\n")