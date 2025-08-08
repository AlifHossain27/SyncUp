from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone
from app.schemas.newsletter_schemas import NewsletterCreate, NewsletterUpdate, NewsletterSchema
from app.models.newsletter_model import Newsletter
from app.exceptions.handler import (
    ConflictException,
    NotFoundException
)

def create_newsletter(newsletter: NewsletterCreate, db: Session) -> NewsletterSchema:
    if db.query(Newsletter).filter(Newsletter.slug == newsletter.slug).first():
        raise ConflictException(f"Newsletter with title {newsletter.title} already exists")
    db_newsletter = Newsletter(**newsletter.model_dump())
    if newsletter.status == "published":
        newsletter.published_at = datetime.now(tz = timezone.utc)

    db.add(db_newsletter)
    db.commit()
    db.refresh(db_newsletter)

    return db_newsletter

def retrieve_newsletter_by_slug(slug: str, db: Session) -> NewsletterSchema:
    db_newsletter = db.query(Newsletter).filter(Newsletter.slug == slug).first()
    if not db_newsletter:
        raise NotFoundException(f"Newsletter with slug: {slug} not found")
    
    return db_newsletter

def retrieve_draft_newsletters(db: Session) -> NewsletterSchema:
    drafts = db.query(Newsletter).filter(Newsletter.status == "draft").all()
    return drafts

def update_newsletter(slug: str, newsletter: NewsletterUpdate, db: Session) -> NewsletterSchema:
    db_newsletter = db.query(Newsletter).filter(Newsletter.slug == slug).first()
    if not db_newsletter:
        raise NotFoundException(f"Newsletter with slug: {slug} not found")
    
    db_newsletter.title = newsletter.title
    db_newsletter.content = newsletter.content
    db_newsletter.slug = newsletter.slug
    db_newsletter.thumbnail = newsletter.thumbnail
    db_newsletter.status = newsletter.status

    if db_newsletter.status == "published" and db_newsletter.published_at is None:
        db_newsletter.published_at = datetime.now(tz = timezone.utc)
    db.commit()
    db.refresh(db_newsletter)
    return db_newsletter

def delete_newsletter(uuid: UUID, db: Session) -> None:
    db_newsletter = db.query(Newsletter).filter(Newsletter.uuid == uuid).first()
    if not db_newsletter:
        raise NotFoundException(f"Newsletter with UUID: {uuid} not found")

    db.delete(db_newsletter)
    db.commit()
    return None