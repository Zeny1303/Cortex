from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class UserModel(BaseModel):
    name: str
    email: EmailStr
    password_hash: str
    skills: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_verified: bool = False
    interview_history: List[dict] = []
    total_score: int = 0
    reset_token: Optional[str] = None
    reset_token_expiry: Optional[datetime] = None
    
    model_config = ConfigDict(populate_by_name=True)
