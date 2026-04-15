from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SlotCreate(BaseModel):
    startTime: datetime
    endTime: datetime
    duration: int
    skills: List[str]
    createdBy: str          # ⚠️ security issue — should come from JWT, not request body

class SlotResponse(SlotCreate):
    id: str
    isBooked: bool
    bookedBy: Optional[str] = None
    roomId: Optional[str] = None
    created_at: datetime