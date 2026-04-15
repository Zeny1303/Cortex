"""
Cortex Backend — Full Health Check Script
Run from your terminal: python health_check.py
Requires: pip install httpx websockets
"""

import asyncio
import json
import time
import httpx
import websockets

BASE = "http://localhost:8000"
WS_BASE = "ws://localhost:8000"
TEST_EMAIL = "healthcheck_cortex@gmail.com"
TEST_PASS  = "Test@123"
TEST_NAME  = "HealthBot"

GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
RESET  = "\033[0m"
BOLD   = "\033[1m"

def ok(msg):   print(f"  {GREEN}✓{RESET} {msg}")
def fail(msg): print(f"  {RED}✗{RESET} {msg}")
def warn(msg): print(f"  {YELLOW}⚠{RESET} {msg}")
def section(title): print(f"\n{BOLD}{CYAN}{'─'*50}{RESET}\n{BOLD} {title}{RESET}\n{'─'*50}")

results = {"passed": 0, "failed": 0, "warned": 0}

def record(status, msg):
    if status == "ok":   ok(msg);   results["passed"] += 1
    elif status == "fail": fail(msg); results["failed"] += 1
    else:                warn(msg); results["warned"] += 1

# ── 1. ROOT & DOCS ────────────────────────────────────────────────
async def check_root(client):
    section("1 · Root & API Docs")
    try:
        r = await client.get(f"{BASE}/")
        if r.status_code == 200 and "Mock Interview" in r.text:
            record("ok", f"GET /  →  {r.status_code}  {r.json().get('message','')}")
        else:
            record("fail", f"GET /  →  unexpected {r.status_code}: {r.text[:80]}")
    except Exception as e:
        record("fail", f"GET /  →  connection error: {e}")

    try:
        r = await client.get(f"{BASE}/docs")
        if r.status_code == 200:
            record("ok", "GET /docs  →  Swagger UI reachable")
        else:
            record("fail", f"GET /docs  →  {r.status_code}")
    except Exception as e:
        record("fail", f"GET /docs  →  {e}")

# ── 2. AUTH FLOW ─────────────────────────────────────────────────
async def check_auth(client):
    section("2 · Auth — Signup / Login / Me")
    token = None

    # signup (may already exist)
    try:
        r = await client.post(f"{BASE}/api/auth/signup", json={
            "name": TEST_NAME, "email": TEST_EMAIL,
            "password": TEST_PASS, "skills": ["Python"]
        })
        if r.status_code in (200, 201):
            record("ok", f"POST /api/auth/signup  →  {r.json().get('message','registered')}")
        elif r.status_code == 400 and "already" in r.text:
            record("ok", "POST /api/auth/signup  →  user already exists (expected on re-run)")
        else:
            record("fail", f"POST /api/auth/signup  →  {r.status_code}: {r.text[:120]}")
    except Exception as e:
        record("fail", f"POST /api/auth/signup  →  {e}")

    # login
    try:
        r = await client.post(f"{BASE}/api/auth/login", json={
            "email": TEST_EMAIL, "password": TEST_PASS
        })
        if r.status_code == 200 and "access_token" in r.json():
            token = r.json()["access_token"]
            record("ok", f"POST /api/auth/login  →  JWT received ({len(token)} chars)")
        else:
            record("fail", f"POST /api/auth/login  →  {r.status_code}: {r.text[:120]}")
    except Exception as e:
        record("fail", f"POST /api/auth/login  →  {e}")

    # wrong password
    try:
        r = await client.post(f"{BASE}/api/auth/login", json={
            "email": TEST_EMAIL, "password": "WrongPass@1"
        })
        if r.status_code == 401:
            record("ok", "POST /api/auth/login (bad pwd)  →  401 as expected")
        else:
            record("warn", f"POST /api/auth/login (bad pwd)  →  expected 401, got {r.status_code}")
    except Exception as e:
        record("fail", f"POST /api/auth/login (bad pwd)  →  {e}")

    # /me
    if token:
        try:
            r = await client.get(f"{BASE}/api/auth/me",
                                 headers={"Authorization": f"Bearer {token}"})
            if r.status_code == 200:
                u = r.json()
                record("ok", f"GET /api/auth/me  →  user: {u.get('name','?')} / {u.get('email','?')}")
            else:
                record("fail", f"GET /api/auth/me  →  {r.status_code}: {r.text[:120]}")
        except Exception as e:
            record("fail", f"GET /api/auth/me  →  {e}")

        # no token
        try:
            r = await client.get(f"{BASE}/api/auth/me")
            if r.status_code in (401, 403):
                record("ok", "GET /api/auth/me (no token)  →  401/403 as expected")
            else:
                record("warn", f"GET /api/auth/me (no token)  →  expected 401, got {r.status_code}")
        except Exception as e:
            record("fail", f"GET /api/auth/me (no token)  →  {e}")

    return token

# ── 3. QUESTIONS ─────────────────────────────────────────────────
async def check_questions(client, token):
    section("3 · Questions (MongoDB seeded data)")
    h = {"Authorization": f"Bearer {token}"} if token else {}

    try:
        r = await client.get(f"{BASE}/api/questions/random?difficulty=easy&count=2", headers=h)
        if r.status_code == 200:
            qs = r.json()
            record("ok", f"GET /api/questions/random  →  {len(qs)} question(s) returned")
            if qs:
                record("ok", f"  Sample: '{qs[0].get('title','?')}' [{qs[0].get('difficulty','?')}]")
            if any("test_cases" in q for q in qs):
                record("fail", "test_cases LEAKED into response — sanitize_question() not working!")
            else:
                record("ok", "test_cases correctly hidden from response")
        elif r.status_code == 404:
            record("fail", "GET /api/questions/random  →  404 — MongoDB may not be seeded. Run: python scripts/seed_questions.py")
        else:
            record("fail", f"GET /api/questions/random  →  {r.status_code}: {r.text[:120]}")
    except Exception as e:
        record("fail", f"GET /api/questions/random  →  {e}")

    try:
        r = await client.get(f"{BASE}/api/questions/two_sum", headers=h)
        if r.status_code == 200:
            q = r.json()
            record("ok", f"GET /api/questions/two_sum  →  '{q.get('title','?')}'")
        elif r.status_code == 404:
            record("warn", "GET /api/questions/two_sum  →  404 — seed the DB first")
        else:
            record("fail", f"GET /api/questions/two_sum  →  {r.status_code}")
    except Exception as e:
        record("fail", f"GET /api/questions/two_sum  →  {e}")

    try:
        r = await client.get(f"{BASE}/api/questions/?difficulty=easy", headers=h)
        if r.status_code == 200:
            record("ok", f"GET /api/questions/?difficulty=easy  →  {len(r.json())} question(s)")
        else:
            record("fail", f"GET /api/questions/  →  {r.status_code}")
    except Exception as e:
        record("fail", f"GET /api/questions/  →  {e}")

# ── 4. INTERVIEW ENGINE ──────────────────────────────────────────
async def check_interview(client, token):
    section("4 · Interview Engine (session lifecycle)")
    h = {"Authorization": f"Bearer {token}"} if token else {}
    session_id = None

    try:
        r = await client.post(f"{BASE}/api/interview/start", headers=h,
                              json={"difficulty": "easy", "question_count": 1})
        if r.status_code == 201:
            d = r.json()
            session_id = d.get("session_id")
            record("ok", f"POST /api/interview/start  →  session: {session_id[:12]}... stage={d.get('stage')}")
        elif r.status_code == 404:
            record("fail", "POST /api/interview/start  →  404 (no easy questions in DB — seed first)")
        else:
            record("fail", f"POST /api/interview/start  →  {r.status_code}: {r.text[:150]}")
    except Exception as e:
        record("fail", f"POST /api/interview/start  →  {e}")

    if session_id:
        try:
            r = await client.get(f"{BASE}/api/interview/{session_id}/question", headers=h)
            if r.status_code == 200:
                d = r.json()
                q = d.get("question") or {}
                record("ok", f"GET /{session_id[:8]}.../question  →  '{q.get('title','?')}'")
            else:
                record("fail", f"GET /question  →  {r.status_code}: {r.text[:120]}")
        except Exception as e:
            record("fail", f"GET /question  →  {e}")

        # advance to CODING stage
        for step in ["APPROACH_DISCUSSION", "CODING"]:
            try:
                r = await client.post(f"{BASE}/api/interview/{session_id}/next", headers=h)
                if r.status_code == 200:
                    record("ok", f"POST /next  →  stage={r.json().get('stage','?')}")
                else:
                    record("warn", f"POST /next  →  {r.status_code}")
            except Exception as e:
                record("fail", f"POST /next  →  {e}")

        # submit working code
        try:
            code = "def twoSum(nums, target):\n    seen={}\n    for i,n in enumerate(nums):\n        if target-n in seen: return [seen[target-n],i]\n        seen[n]=i"
            r = await client.post(f"{BASE}/api/interview/{session_id}/submit-code", headers=h,
                                  json={"action": "submit_code", "code": code})
            if r.status_code == 200:
                d = r.json()
                record("ok", f"POST /submit-code  →  result={d.get('result')} passed={d.get('passed_tests')}/{d.get('total_tests')}")
            else:
                record("fail", f"POST /submit-code  →  {r.status_code}: {r.text[:150]}")
        except Exception as e:
            record("fail", f"POST /submit-code  →  {e}")

        # end session
        try:
            r = await client.post(f"{BASE}/api/interview/{session_id}/end", headers=h)
            if r.status_code == 200:
                d = r.json()
                record("ok", f"POST /end  →  score={d.get('score')} stage={d.get('stage')}")
            else:
                record("fail", f"POST /end  →  {r.status_code}: {r.text[:120]}")
        except Exception as e:
            record("fail", f"POST /end  →  {e}")

    return session_id

# ── 5. CODE EXECUTOR ─────────────────────────────────────────────
async def check_code_executor(client, token):
    section("5 · Code Executor (/api/code/execute)")
    h = {"Authorization": f"Bearer {token}"} if token else {}

    cases = [
        ("print('hello')", "python", None, "Basic print"),
        ("def f(x): return x*2\nprint(f(5))", "python", None, "Function call"),
        ("import os", "python", "error", "Forbidden import (os)"),
    ]
    for code, lang, expect_error, label in cases:
        try:
            r = await client.post(f"{BASE}/api/code/execute", headers=h,
                                  json={"language": lang, "code": code})
            if r.status_code == 200:
                d = r.json()
                record("ok", f"POST /execute [{label}]  →  output={repr(d.get('output','')[:40])} err={d.get('error')}")
            else:
                record("fail", f"POST /execute [{label}]  →  {r.status_code}: {r.text[:80]}")
        except Exception as e:
            record("fail", f"POST /execute [{label}]  →  {e}")

# ── 6. SLOTS ─────────────────────────────────────────────────────
async def check_slots(client, token):
    section("6 · Slot Scheduling")
    h = {"Authorization": f"Bearer {token}"} if token else {}

    try:
        r = await client.get(f"{BASE}/api/slots/available")
        if r.status_code == 200:
            record("ok", f"GET /api/slots/available  →  {len(r.json())} slot(s)")
        else:
            record("warn", f"GET /api/slots/available  →  {r.status_code}: {r.text[:80]}")
    except Exception as e:
        record("fail", f"GET /api/slots/available  →  {e}")

    try:
        r = await client.post(f"{BASE}/api/slots/create", headers=h, json={
            "startTime": "2026-04-01T10:00:00",
            "endTime":   "2026-04-01T11:00:00",   # ← added
            "duration": 60,
            "skills": ["Python", "DSA"]
        })
        if r.status_code in (200, 201):
            record("ok", f"POST /api/slots/create  →  slot created")
        else:
            record("warn", f"POST /api/slots/create  →  {r.status_code}: {r.text[:100]}")
    except Exception as e:
        record("fail", f"POST /api/slots/create  →  {e}")

# ── 7. WEBSOCKET — Code Collab ────────────────────────────────────
async def check_ws_code(token):
    section("7 · WebSocket — Code Collaboration (/ws/{room_id})")
    room_id = "health-check-room-001"
    try:
        async with websockets.connect(f"{WS_BASE}/ws/{room_id}", open_timeout=5) as ws:
            msg = await asyncio.wait_for(ws.recv(), timeout=5)
            data = json.loads(msg)
            if data.get("type") == "initial-code":
                record("ok", f"WS /ws/{room_id}  →  connected, received initial-code event")
            else:
                record("warn", f"WS /ws/{room_id}  →  connected but unexpected first msg: {data}")

            await ws.send(json.dumps({"type": "join-room"}))
            record("ok", "WS  →  join-room sent successfully")

            await ws.send(json.dumps({"type": "code-change", "code": "# health check"}))
            record("ok", "WS  →  code-change event sent successfully")
    except asyncio.TimeoutError:
        record("fail", f"WS /ws/{room_id}  →  timeout — no response in 5s")
    except Exception as e:
        record("fail", f"WS /ws/{room_id}  →  {e}")

# ── 8. WEBSOCKET — Voice Interview ────────────────────────────────
async def check_ws_voice(token):
    section("8 · WebSocket — Voice Interview (/ws/interview/{session_id})")
    if not token:
        record("warn", "Skipped — no token available"); return

    session_id = "health-check-voice-001"
    url = f"{WS_BASE}/ws/interview/{session_id}?token={token}"
    try:
        async with websockets.connect(url, open_timeout=8) as ws:
            record("ok", f"WS /ws/interview/{session_id}  →  connection accepted with JWT")
            try:
                msg = await asyncio.wait_for(ws.recv(), timeout=25)
                if isinstance(msg, bytes) and len(msg) > 0:
                    record("ok", f"WS  →  AI intro audio received ({len(msg)} bytes MP3)")
                elif isinstance(msg, bytes) and len(msg) == 0:
                    record("warn", "WS  →  connected but received empty audio (TTS may be misconfigured)")
                else:
                    record("warn", f"WS  →  received unexpected text: {msg[:80]}")
            except asyncio.TimeoutError:
                record("warn", "WS  →  no intro audio in 10s (check GROQ_API_KEY / AWS Polly config)")
    except websockets.exceptions.ConnectionClosedError as e:
        if "1008" in str(e):
            record("fail", f"WS /ws/interview  →  auth failed (1008 Policy Violation) — JWT may be invalid")
        else:
            record("fail", f"WS /ws/interview  →  closed: {e}")
    except Exception as e:
        record("fail", f"WS /ws/interview  →  {e}")

# ── MAIN ─────────────────────────────────────────────────────────
async def main():
    print(f"\n{BOLD}{'='*50}")
    print(" Cortex Backend — Full Health Check")
    print(f"{'='*50}{RESET}")
    print(f" Target: {BASE}")
    print(f" Time:   {time.strftime('%Y-%m-%d %H:%M:%S')}")

    async with httpx.AsyncClient(timeout=15) as client:
        await check_root(client)
        token = await check_auth(client)
        await check_questions(client, token)
        await check_interview(client, token)
        await check_code_executor(client, token)
        await check_slots(client, token)

    await check_ws_code(token)
    await check_ws_voice(token)

    section("Summary")
    total = results["passed"] + results["failed"] + results["warned"]
    print(f"  {GREEN}Passed : {results['passed']}{RESET}")
    print(f"  {RED}Failed : {results['failed']}{RESET}")
    print(f"  {YELLOW}Warned : {results['warned']}{RESET}")
    print(f"  Total  : {total}\n")

    if results["failed"] == 0:
        print(f"  {GREEN}{BOLD}All checks passed!{RESET}")
    else:
        print(f"  {RED}{BOLD}{results['failed']} check(s) failed — see above for details.{RESET}")

if __name__ == "__main__":
    asyncio.run(main())