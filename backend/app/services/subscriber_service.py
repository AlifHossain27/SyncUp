import os
import pandas as pd
from io import BytesIO
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone
from app.core.config import settings
from fastapi import UploadFile, File
from app.schemas.subscriber_schemas import SubscriberCreate, SubscriberSchema
from app.models.subscriber_model import Subscriber
from app.exceptions.handler import (
    ConflictException,
    NotFoundException,
    BadRequestException
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

def retrieve_all_emails(db: Session) -> list[str]:
    emails = db.query(Subscriber.email).all()
    return [email[0] for email in emails]

async def process_subscribers_upload(file: UploadFile, db: Session):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)

    try:
        with open(file_path, "wb") as f:
            f.write(await file.read())

        if file.filename.endswith(".csv"):
            df = pd.read_csv(file_path)
        elif file.filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(file_path)
        else:
            raise BadRequestException("Unsupported file format")

        df.columns = df.columns.str.strip().str.lower()

        required_cols = {"first_name", "last_name", "email", "department"}
        if not required_cols.issubset(df.columns):
            raise BadRequestException("File must contain first_name, last_name, email, department")

        df.drop_duplicates(subset=["email"], inplace=True)

        subscribers = []
        for _, row in df.iterrows():
            subscriber_data = SubscriberCreate(
                first_name=str(row["first_name"]).strip(),
                last_name=str(row["last_name"]).strip(),
                email=str(row["email"]).strip(),
                department=str(row["department"]).strip()
            )
            try:
                from app.services.subscriber_service import create_subscriber
                subscriber = create_subscriber(subscriber_data, db)
                subscribers.append(subscriber)
            except ConflictException:
                continue

        return {
            "success": True,
            "imported": len(subscribers),
            "total_rows": len(df),
            "file_saved": file_path
        }

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)