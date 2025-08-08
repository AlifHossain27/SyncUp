from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from enum import Enum
from uuid import UUID

class StatusEnum(str, Enum):
    draft = "draft"
    published = "published"

class NewsletterBase(BaseModel):
    title: str
    content: str
    status: StatusEnum
    slug: str
    

class NewsletterCreate(NewsletterBase):
    thumbnail: Optional[str] = None

class NewsletterUpdate(NewsletterBase):
    title: Optional[str] = None
    content: Optional[str] = None
    status: Optional[StatusEnum] = None
    thumbnail: Optional[str] = None

class NewsletterSchema(NewsletterBase):
    uuid: UUID
    thumbnail: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
