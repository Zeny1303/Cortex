from uuid import uuid4
from bson import ObjectId
from fastapi import HTTPException
from datetime import datetime


async def create_slot(slot_data, current_user, db):  # ← current_user added
    slots_collection = db["slots"]

    new_slot = {
        "createdBy": str(current_user["_id"]),  # ← from JWT, not request body
        "startTime": slot_data.startTime,
        "endTime": slot_data.endTime,
        "duration": slot_data.duration,
        "skills": slot_data.skills,
        "isBooked": False,
        "bookedBy": None,
        "roomId": None,
        "created_at": datetime.utcnow()
    }

    result = await slots_collection.insert_one(new_slot)
    created_slot = await slots_collection.find_one({"_id": result.inserted_id})

    return {
        "id": str(created_slot["_id"]),
        "createdBy": created_slot["createdBy"],
        "startTime": created_slot["startTime"],
        "endTime": created_slot["endTime"],
        "duration": created_slot["duration"],
        "skills": created_slot["skills"],
        "isBooked": created_slot["isBooked"],
        "bookedBy": created_slot["bookedBy"],
        "roomId": created_slot["roomId"],
        "created_at": created_slot["created_at"]
    }


async def get_all_slots(db):
    slots_collection = db["slots"]
    slots_cursor = slots_collection.find()
    slots = await slots_cursor.to_list(length=100)

    return [
        {
            "id": str(slot["_id"]),
            "createdBy": slot["createdBy"],
            "startTime": slot["startTime"],
            "endTime": slot["endTime"],
            "duration": slot["duration"],
            "skills": slot["skills"],
            "isBooked": slot["isBooked"],
            "bookedBy": slot["bookedBy"],
            "roomId": slot["roomId"],
            "created_at": slot["created_at"]
        }
        for slot in slots
    ]


async def book_slot(slot_id, current_user, db):
    slots_collection = db["slots"]

    slot = await slots_collection.find_one({"_id": ObjectId(slot_id)})

    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")

    if slot["isBooked"]:
        raise HTTPException(status_code=400, detail="Slot already booked")

    if slot["createdBy"] == str(current_user["_id"]):
        raise HTTPException(status_code=400, detail="You cannot book your own slot")

    slot["isBooked"] = True
    slot["bookedBy"] = str(current_user["_id"])
    slot["roomId"] = str(uuid4())

    await slots_collection.update_one(
        {"_id": ObjectId(slot_id)},
        {"$set": slot}
    )

    return {
        "message": "Slot booked successfully",
        "slot": slot
    }


async def get_available_slots(db):
    slots_collection = db["slots"]

    slots = await slots_collection.find({"isBooked": False}).to_list(None)

    for slot in slots:
        slot["id"] = str(slot["_id"])
        slot["_id"] = str(slot["_id"])

    return slots


async def get_my_booked_slots(current_user, db):
    slots_collection = db["slots"]

    slots = await slots_collection.find({
        "bookedBy": str(current_user["_id"])
    }).to_list(None)

    for slot in slots:
        slot["id"] = str(slot["_id"])
        slot["_id"] = str(slot["_id"])

    return slots


async def cancel_slot(slot_id, current_user, db):
    slots_collection = db["slots"]

    slot = await slots_collection.find_one({"_id": ObjectId(slot_id)})

    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")

    if slot["createdBy"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized")

    await slots_collection.delete_one({"_id": ObjectId(slot_id)})

    return {"message": "Slot cancelled successfully"}


async def get_created_and_booked_slots(current_user, db):
    slots_collection = db["slots"]
    user_id = str(current_user["_id"])

    created_cursor = slots_collection.find({"createdBy": user_id})
    created_slots = await created_cursor.to_list(None)

    booked_cursor = slots_collection.find({"bookedBy": user_id})
    booked_slots = await booked_cursor.to_list(None)

    def serialize(slot):
        slot["id"] = str(slot["_id"])
        slot["_id"] = str(slot["_id"])
        return slot

    return {
        "created": [serialize(s) for s in created_slots],
        "booked":  [serialize(s) for s in booked_slots]
    }