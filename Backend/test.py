import asyncio
import websockets

# Paste your token here after running the PowerShell command above
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjliZDg4NDhlZjRlNzY5Mzg2YmFhNjY0IiwiZW1haWwiOiJoZWFsdGhjaGVja19jb3J0ZXhAZ21haWwuY29tIiwiZXhwIjoxNzc0NjM3MDgyfQ.a9yPtFE5wCZzcMng4_r9O4qXKWBCTLDCMOPgpPPg9Sg"

async def test():
    url = f"ws://localhost:8000/ws/interview/test-voice-123?token={TOKEN}"
    print("Connecting...")
    async with websockets.connect(url, open_timeout=10) as ws:
        print("Connected — waiting up to 30s for audio...")
        try:
            msg = await asyncio.wait_for(ws.recv(), timeout=30)
            print(f"SUCCESS — Received {len(msg)} bytes of audio")
        except asyncio.TimeoutError:
            print("TIMEOUT — no audio received in 30s")

asyncio.run(test())