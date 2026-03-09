from fastapi import APIRouter, HTTPException, Body
from fastapi import APIRouter, HTTPException, Body, Depends
from app.schemas.interview_schema import (
    StartInterviewRequest,
    StartInterviewResponse,
    EndInterviewRequest,
    EndInterviewResponse
)
from app.services.question_engine import question_engine
from app.services.answer_evaluator import answer_evaluator
from app.models.interview_model import InterviewSessionModel
import uuid
from datetime import datetime
from typing import Dict, Any
from app.database.mongodb import get_database

router = APIRouter()

@router.post("/create_room")
async def create_room(data: Dict[str, Any] = Body(...), db=Depends(get_database)):
    # 1. Generate unique room ID
    room_id = str(uuid.uuid4())[:8]

    # 2. Extract interviewer details using dict safer access
    interviewer_name = data.get("interviewer_name", "AI Assistant")

    # 3. Store room metadata into db via get_database injection
    interviews_collection = db["interviews"]
    
    room_data = {
        "room_id": room_id,
        "interviewer_name": interviewer_name,
        "status": "waiting",
        "created_at": datetime.utcnow() # Use actual datetime
    }
    
    await interviews_collection.insert_one(room_data)

    return {
        "room_url": f"/interview/room/{room_id}",
        "room_id": room_id
    }

@router.post("/end", response_model=EndInterviewResponse)
async def end_interview(payload: EndInterviewRequest):
    """
    Ends the interview session and triggers evaluation.
    """
    session_id = payload.session_id
    
    # Fetch transcript and code from DB
    # transcript = await db["interviews"].find_one({"session_id": session_id})
    mock_transcript = []
    mock_code = "def twoSum(self, nums, target):\n    pass"

    evaluation_result = await answer_evaluator.evaluate_answer(mock_transcript, mock_code)
    
    return EndInterviewResponse(
        message="Interview ended successfully. Feedback generated.",
        feedback_summary=evaluation_result
    )

@router.get("/question")
async def get_initial_question(language: str = "python", role: str = "Software Engineer"):
    question = await question_engine.generate_question(role, language)
    return {"question": question}
