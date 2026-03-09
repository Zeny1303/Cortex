from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class StartInterviewRequest(BaseModel):
    language: str
    role_applied: str

class StartInterviewResponse(BaseModel):
    session_id: str
    message: str

class EndInterviewRequest(BaseModel):
    session_id: str

class EndInterviewResponse(BaseModel):
    message: str
    feedback_summary: dict

class CodeExecutionRequest(BaseModel):
    language: str
    code: str

class CodeExecutionResponse(BaseModel):
    output: str
    error: Optional[str] = None
    execution_time_ms: float
