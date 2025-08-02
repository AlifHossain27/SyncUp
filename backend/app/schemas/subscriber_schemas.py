from pydantic import BaseModel, EmailStr, ConfigDict
from uuid import UUID
from datetime import datetime

class SubscriberBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    department: str

class SubscriberCreate(SubscriberBase):
    pass

class SubscriberSchema(SubscriberBase):
    uuid: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)