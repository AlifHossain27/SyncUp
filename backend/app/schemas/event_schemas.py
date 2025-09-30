from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from enum import Enum
from uuid import UUID

class EventStatusEnum(str, Enum):
    upcoming = "upcoming"
    recent = "recent"

class EventBase(BaseModel):
    title: str
    desc: str
    event_date: datetime
    start: str
    end: str
    location: str
    link: str
    

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    pass

class EventSchema(EventBase):
    uuid: UUID
    status: EventStatusEnum
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
