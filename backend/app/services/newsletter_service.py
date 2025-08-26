import traceback
from sqlalchemy.orm import Session
from sqlalchemy import desc
from uuid import UUID
from typing import List
from datetime import datetime, timezone
from app.core.config import settings
from app.services.subscriber_service import retrieve_all_emails
from app.schemas.newsletter_schemas import NewsletterCreate, NewsletterUpdate, NewsletterSchema
from app.models.newsletter_model import Newsletter
from app.exceptions.handler import (
    ConflictException,
    NotFoundException,
    BadRequestException
)
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def create_newsletter(newsletter: NewsletterCreate, db: Session) -> NewsletterSchema:
    if db.query(Newsletter).filter(Newsletter.slug == newsletter.slug).first():
        raise ConflictException(f"Newsletter with title {newsletter.title} already exists")
    db_newsletter = Newsletter(**newsletter.model_dump())
    if newsletter.status == "published":
        send_email(subject=newsletter.title, html_content=newsletter.content, recipients=retrieve_all_emails(db=db))
        db_newsletter.published_at = datetime.now(tz = timezone.utc)


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

def retrieve_archive_newsletters(db: Session) -> NewsletterSchema:
    archive = db.query(Newsletter).filter(Newsletter.status == "published").order_by(desc(Newsletter.published_at)).all()
    return archive

def update_newsletter(slug: str, newsletter: NewsletterUpdate, db: Session) -> NewsletterSchema:
    db_newsletter = db.query(Newsletter).filter(Newsletter.slug == slug).first()
    if not db_newsletter:
        raise NotFoundException(f"Newsletter with slug: {slug} not found")
    
    db_newsletter.title = newsletter.title
    db_newsletter.content = newsletter.content
    db_newsletter.slug = newsletter.slug
    db_newsletter.thumbnail = newsletter.thumbnail
    db_newsletter.status = newsletter.status

    if newsletter.status == "published" and db_newsletter.published_at is None:
        send_email(subject=newsletter.title, html_content=newsletter.content, recipients=retrieve_all_emails(db=db))
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

def send_email(subject: str, html_content: str, recipients: List[str]):
    wrapped_html = f"""
    <html>
        <head></head>
        <body style="margin:0; padding:0; background-color:#ffefef;">
            <div style="background-color:#ffefef; padding: 20px;">
                {html_content}
            </div>
        </body>
    </html>
    """
    print("📨 Sending emails . . .")

    try:
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.ADMIN_EMAIL, settings.SMTP_PASSWORD)

            for recipient in recipients:
                msg = MIMEMultipart()
                msg["From"] = settings.ADMIN_EMAIL
                msg["To"] = recipient
                msg["Subject"] = subject
                msg.attach(MIMEText(wrapped_html, "html"))

                server.sendmail(settings.ADMIN_EMAIL, recipient, msg.as_string())

    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException()
