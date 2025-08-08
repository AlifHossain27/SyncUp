import traceback
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.schemas.newsletter_schemas import NewsletterCreate, NewsletterUpdate, NewsletterSchema
from app.services.newsletter_service import (
    create_newsletter,
    update_newsletter,
    retrieve_newsletter_by_slug,
    retrieve_draft_newsletters,
    delete_newsletter
)
from app.services.user_service import CurrentUser, get_current_user
from app.schemas.user_schemas import TokenData
from app.exceptions.handler import (
    NotFoundException,
    ConflictException,
    EntityTooLargeException,
    BadRequestException
)


newsletter_router = APIRouter()

@newsletter_router.post("/newsletter/create/", response_model=NewsletterSchema, status_code=201)
async def create_newsletter_route(newsletter: NewsletterCreate, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    try:
        return create_newsletter(newsletter=newsletter, db=db)
    except (NotFoundException, ConflictException, BadRequestException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException()
    
@newsletter_router.get("/newsletter/{slug}/", response_model=NewsletterSchema, status_code=200)
async def retrieve_newsletter_route(slug: str, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    try:
        return retrieve_newsletter_by_slug(slug=slug, db=db)
    except (NotFoundException, BadRequestException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException()
    
@newsletter_router.get("/newsletters/drafts/", response_model=List[NewsletterSchema], status_code=200)
async def get_draft_newsletters_route(db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    try:
        return retrieve_draft_newsletters(db=db)
    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException()
    
@newsletter_router.patch("/newsletter/{slug}/", response_model=NewsletterSchema, status_code=201)
async def update_newsletter_route(slug: str, newsletter: NewsletterUpdate, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    try:
        return update_newsletter(slug=slug, newsletter=newsletter, db=db)
    except (NotFoundException, ConflictException, BadRequestException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException()
    
@newsletter_router.delete("/newsletter/{uuid}/", status_code=204)
async def delete_newsletter_route(uuid: UUID, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    try:
        delete_newsletter(uuid=uuid, db=db)
    except (NotFoundException, ConflictException, BadRequestException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException()