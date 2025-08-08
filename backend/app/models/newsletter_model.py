from sqlalchemy import Column, String, Text, DateTime, Enum, func
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base
import uuid
import enum

class StatusEnum(str, enum.Enum):
    draft = "draft"
    published = "published"

class Newsletter(Base):
    __tablename__ = "newsletters"

    uuid = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    title = Column(String, unique=True, nullable=False)
    content = Column(Text, nullable=False)
    status = Column(Enum(StatusEnum), default=StatusEnum.draft, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    thumbnail = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)