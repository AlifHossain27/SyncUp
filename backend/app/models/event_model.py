from sqlalchemy import Column, String, Text, DateTime, Enum, func
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base
import uuid
import enum

class EventStatusEnum(str, enum.Enum):
    upcoming = "upcoming"
    recent = "recent"

class Event(Base):
    __tablename__ = "events"

    uuid = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    title = Column(String, nullable=False)
    desc = Column(Text, nullable=False)
    status = Column(Enum(EventStatusEnum), default=EventStatusEnum.upcoming, nullable=False)
    event_date = Column(DateTime(timezone=True))
    start = Column(String, nullable=False)
    end = Column(String, nullable=False)
    location = Column(String, nullable=False)
    link = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
