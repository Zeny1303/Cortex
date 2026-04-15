from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class CreateSlot(BaseModel):
    startTime: datetime
    endTime: datetime
    duration: int
    skills: List[str]


class SlotResponse(BaseModel):
    id: str
    createdBy: str
    startTime: datetime
    endTime: datetime
    duration: int
    skills: List[str]
    isBooked: bool
    bookedBy: Optional[str] = None
    roomId: Optional[str] = None
    created_at: datetime


class BookSlotResponse(BaseModel):
    message: str
    slot: SlotResponse


class CancelSlotResponse(BaseModel):
    message: str


class CreatedAndBookedResponse(BaseModel):
    created: List[SlotResponse]
    booked: List[SlotResponse]