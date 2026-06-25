from pydantic import BaseModel, EmailStr, ConfigDict
from uuid import UUID
from enum import Enum
from datetime import datetime

class SubscriberTypeEnum(str, Enum):
    general = "General"
    alumni = "Alumni"
    faculty = "Faculty"
    oca = "OCA"

class SubscriberBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    department: str
    subscriber_type: SubscriberTypeEnum = SubscriberTypeEnum.general

class SubscriberCreate(SubscriberBase):
    pass

class SubscriberSchema(SubscriberBase):
    uuid: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)