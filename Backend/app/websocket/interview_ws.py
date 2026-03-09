from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
from app.services.ai_engine import ai_engine
import json

router = APIRouter()

class InterviewConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # In memory transcript storage for demonstration
        self.transcripts: Dict[str, list] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
            self.transcripts[session_id] = []
        self.active_connections[session_id].append(websocket)

    def disconnect(self, websocket: WebSocket, session_id: str):
        if session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]
                # Option to clear transcripts or save to DB

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str, session_id: str):
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                await connection.send_text(message)

manager = InterviewConnectionManager()

@router.websocket("/ws/interview/{session_id}")
async def interview_websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)

            if payload.get("type") == "user_message":
                user_content = payload.get("content", "")
                
                # Save user message
                manager.transcripts[session_id].append({
                    "role": "user",
                    "content": user_content
                })

                # Broadcast user message
                await manager.broadcast(json.dumps({
                    "type": "message",
                    "role": "user",
                    "content": user_content
                }), session_id)

                # Process AI Response
                ai_response = await ai_engine.generate_response(manager.transcripts[session_id])
                
                # Save AI message
                manager.transcripts[session_id].append({
                    "role": "ai",
                    "content": ai_response
                })

                # Broadcast AI response
                await manager.broadcast(json.dumps({
                    "type": "message",
                    "role": "ai",
                    "content": ai_response
                }), session_id)

            elif payload.get("type") == "code_update":
                # Handle live code collaboration syncing if needed
                code = payload.get("code", "")
                await manager.broadcast(json.dumps({
                    "type": "code_update",
                    "code": code
                }), session_id)

    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
        print(f"Client disconnected from interview session: {session_id}")
