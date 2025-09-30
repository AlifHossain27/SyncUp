from sqlalchemy.orm import Session
from sqlalchemy import desc
from uuid import UUID
from typing import List
from datetime import datetime, timezone
from app.core.config import settings
from app.schemas.event_schemas import EventCreate, EventUpdate, EventSchema
from app.models.event_model import Event, EventStatusEnum
from app.exceptions.handler import (
    ConflictException,
    NotFoundException,
    BadRequestException
)

def create_event(event: EventCreate, db: Session) -> EventSchema:
    db_event = Event(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def retrieve_events(db: Session, skip: int = 0, limit: int = None) -> List[EventSchema]:
    sync_event_statuses(db)
    query = db.query(Event).offset(skip)
    if limit is not None:
        query = query.limit(limit)
    return query.all()

def retrieve_upcoming_events(db: Session, skip: int = 0, limit: int = None) -> List[EventSchema]:
    sync_event_statuses(db)
    query = db.query(Event).filter(Event.status == EventStatusEnum.upcoming).order_by(desc(Event.created_at)).offset(skip)
    if limit is not None:
        query = query.limit(limit)
    return query.all()

def retrieve_recent_events(db: Session, skip: int = 0, limit: int = None) -> List[EventSchema]:
    sync_event_statuses(db)
    query = db.query(Event).filter(Event.status == EventStatusEnum.recent).order_by(desc(Event.created_at)).offset(skip)
    if limit is not None:
        query = query.limit(limit)
    return query.all()

def update_event(uuid: UUID, updated_attributes: EventUpdate, db: Session) -> EventSchema:
    db_event = db.query(Event).filter(Event.uuid == uuid).first()
    if db_event is None:
        raise NotFoundException(f"Event with UID {uuid} not found")
    
    db_event.title = updated_attributes.title
    db_event.desc = updated_attributes.desc
    db_event.event_date = updated_attributes.event_date
    db_event.start = updated_attributes.start
    db_event.end = updated_attributes.end
    db_event.location = updated_attributes.location
    db_event.link = updated_attributes.link

    db.commit()
    db.refresh(db_event)

    return db_event

def delete_event(uuid: UUID, db: Session):
    event = db.query(Event).filter(Event.uuid == uuid).first()
    if event is None:
        raise NotFoundException(f"Event with UID {uuid} not found")

    db.delete(event)
    db.commit()

    return {"success": True, "message": f"Event with UID {uuid} deleted successfully"}

def sync_event_statuses(db: Session):
    now = datetime.now(timezone.utc)


    db.query(Event).filter(Event.event_date < now, Event.status != EventStatusEnum.recent).update(
        {Event.status: EventStatusEnum.recent}, synchronize_session=False
    )


    db.query(Event).filter(Event.event_date >= now, Event.status != EventStatusEnum.upcoming).update(
        {Event.status: EventStatusEnum.upcoming}, synchronize_session=False
    )

    db.commit()