from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone
from app.schemas.subscriber_schemas import SubscriberCreate, SubscriberSchema
from app.models.subscriber_model import Subscriber
from app.exceptions.handler import (
    ConflictException,
    NotFoundException
)

def create_subscriber(subscriber: SubscriberCreate, db: Session) -> SubscriberSchema:
    if db.query(Subscriber).filter(Subscriber.email == subscriber.email).first():
        raise ConflictException(f"Subscriber with email {subscriber.email} already exists")
    db_subscriber = Subscriber(**subscriber.model_dump())

    db.add(db_subscriber)
    db.commit()
    db.refresh(db_subscriber)

    return db_subscriber

def retrieve_subscribers(db: Session, skip: int = 0, limit: int = None):
    query = db.query(Subscriber).offset(skip)
    if limit is not None:
        query = query.limit(limit)
    return query.all()

def retrieve_subscriber_by_uuid(uuid: UUID, db: Session) -> SubscriberSchema:
    db_subscriber = db.query(Subscriber).filter(Subscriber.uuid == uuid).first()
    if db_subscriber is None:
        raise NotFoundException(f"Subscriber with UID {uuid} not found")
    return db_subscriber

def update_subscriber(uuid: UUID, updated_attributes: SubscriberCreate, db: Session) -> SubscriberSchema:
    db_subscriber = db.query(Subscriber).filter(Subscriber.uuid == uuid).first()
    if db_subscriber is None:
        raise NotFoundException(f"Subscriber with UID {uuid} not found")
    if db_subscriber.email != updated_attributes.email:
        if db.query(Subscriber).filter(Subscriber.email == updated_attributes.email).first():
            raise ConflictException(f"Subscriber with email {updated_attributes.email} already exists")
    
    db_subscriber.first_name = updated_attributes.first_name
    db_subscriber.last_name = updated_attributes.last_name
    db_subscriber.email = updated_attributes.email
    db_subscriber.department = updated_attributes.department
    db_subscriber.updated_at = datetime.now(tz = timezone.utc)

    db.commit()
    db.refresh(db_subscriber)

    return db_subscriber

def delete_subscriber(uuid: UUID, db: Session):
    subscriber = db.query(Subscriber).filter(Subscriber.uuid == uuid).first()
    if subscriber is None:
        raise NotFoundException(f"Subscriber with UID {uuid} not found")
    
    db.delete(subscriber)
    db.commit()

    return {"success": True, "message": f"Subscriber with UID {uuid} deleted successfully"}
