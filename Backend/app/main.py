from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routers import auth_router, user_router, slot_router, interview_router, code_router, question_router
from app.websocket.connection_manager import manager
from app.utils.room_storage import save_code, load_code
from app.utils.cleanup_rooms import cleanup_rooms
from app.routers import voice_interview_router          # ← voice router only

from app.database.mongodb import connect_to_mongo, close_mongo_connection
import asyncio

# ---------------------------
# Application Lifespan
# ---------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    asyncio.create_task(cleanup_scheduler())
    yield
    await close_mongo_connection()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------
# Register REST API Routers
# ---------------------------

app.include_router(auth_router.router,      prefix="/api/auth")
app.include_router(user_router.router,      prefix="/api/user")
app.include_router(slot_router.router,      prefix="/api/slots")
app.include_router(interview_router.router, prefix="/api/interview")
app.include_router(code_router.router,      prefix="/api/code")
app.include_router(question_router.router,  prefix="/api/questions")

# Register Voice Interview WebSocket Router (STT → LLM → TTS pipeline)
# NOTE: interview_ws.router removed — it was intercepting /ws/interview/{session_id}
app.include_router(voice_interview_router.router)


# ---------------------------
# Root Endpoint
# ---------------------------

@app.get("/")
def home():
    return {"message": "Mock Interview Platform Backend Running "}


# ---------------------------
# WebSocket — Code Collaboration Room
# ---------------------------

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):

    await manager.connect(websocket, room_id)
    existing_code = load_code(room_id)

    await websocket.send_json({
        "type": "initial-code",
        "code": existing_code
    })

    try:
        while True:
            data = await websocket.receive_json()
            event_type = data.get("type")

            if event_type == "join-room":
                await manager.broadcast(room_id, {"type": "peer-connected"})

            elif event_type == "signal":
                await manager.broadcast(room_id, {
                    "type": "signal",
                    "signalData": data.get("signalData")
                })

            elif event_type == "code-change":
                code = data.get("code")
                save_code(room_id, code)
                await manager.broadcast(room_id, {
                    "type": "code-change",
                    "code": code
                })

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        print(f"User disconnected from room {room_id}")


# ---------------------------
# Room Cleanup Scheduler
# ---------------------------

async def cleanup_scheduler():
    while True:
        cleanup_rooms()
        await asyncio.sleep(3600)