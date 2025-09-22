import traceback
from sqlalchemy.orm import Session
from sqlalchemy import desc
from uuid import UUID
from typing import List
from datetime import datetime, timezone
from app.core.config import settings
from app.services.subscriber_service import retrieve_all_emails
from app.services.newsletter_styling import make_email_safe_html
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
        db_newsletter.published_at = datetime.now(tz = timezone.utc)
        send_email(thumbnail=newsletter.thumbnail, subject=newsletter.title, html_content=newsletter.content, slug=newsletter.slug, published_at=db_newsletter.published_at, recipients=retrieve_all_emails(db=db))


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
        db_newsletter.published_at = datetime.now(tz = timezone.utc)
        send_email(thumbnail=newsletter.thumbnail, subject=newsletter.title, html_content=newsletter.content, slug=newsletter.slug, published_at=db_newsletter.published_at, recipients=retrieve_all_emails(db=db))
        

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

def send_email(thumbnail: str, subject: str, html_content: str, slug: str, published_at: datetime, recipients: List[str]):
    pub_date_str = published_at.strftime("%B %d, %Y") if published_at else ""

    header_html = f"""
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
      <tr>
        <td style="text-align:left; width:50%;"></td>
        <td style="text-align:right; width:50%; font-size:12px; color:#777;">
          {pub_date_str}
          {f' | <a href="{settings.FRONTEND_URL}/newsletter/{slug}" style="color:#0b6e99; text-decoration:none;">Read Online</a>' if slug else ""}
        </td>
      </tr>
      <tr>
        <td colspan="2" style="text-align:center; padding-top:15px;">
          <h1 style="font-size:24px; font-weight:bold; margin:0; color:#333;">{subject}</h1>
          {f'<img src="{thumbnail}" alt="Thumbnail" style="max-width:100%; height:auto; border-radius:6px; margin-top:12px;" />' if thumbnail else ""}
        </td>
      </tr>
    </table>
    """


    full_html = header_html + html_content

    wrapped_html = make_email_safe_html(full_html)
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
