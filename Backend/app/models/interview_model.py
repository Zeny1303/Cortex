from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class MessageModel(BaseModel):
    role: str  # 'system', 'ai', 'user'
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class InterviewSessionModel(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str
    status: str = "active"  # 'active', 'completed'
    language: str = "python"
    role_applied: str = "Software Engineer"
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    transcript: List[MessageModel] = []
    current_code: str = ""
    feedback: Optional[dict] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
