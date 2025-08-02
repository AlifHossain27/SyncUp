import traceback
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.schemas.subscriber_schemas import SubscriberCreate, SubscriberSchema
from app.services.subscriber_service import (
    create_subscriber,
    update_subscriber,
    retrieve_subscribers,
    retrieve_subscriber_by_uuid,
    delete_subscriber
)
from app.exceptions.handler import (
    NotFoundException,
    ConflictException,
    EntityTooLargeException,
    BadRequestException
)


subscriber_router = APIRouter()

@subscriber_router.post("/subscriber/create/", response_model=SubscriberSchema, status_code=201)
async def create_subscriber_route(subscriber: SubscriberCreate, db: Session = Depends(get_db)):
    try:
        return create_subscriber(subscriber=subscriber, db=db)
    except (NotFoundException, ConflictException, BadRequestException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException()

@subscriber_router.get("/subscribers/", response_model=list[SubscriberSchema], status_code=200)
async def get_subscribers_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    try:
        return retrieve_subscribers(db=db, skip=skip, limit=limit)
    except Exception as error:
        print(traceback.format_exc())
        raise BadRequestException
    
@subscriber_router.get("/subscriber/{uuid}/", response_model=SubscriberSchema, status_code=200)
async def get_subscriber_route(uuid: UUID, db: Session = Depends(get_db)):
    try:
        return retrieve_subscriber_by_uuid(uuid=uuid, db=db)
    except (NotFoundException, BadRequestException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException
    
@subscriber_router.patch("/subscriber/{uuid}/", response_model=SubscriberCreate, status_code=201)
async def update_subscriber_route(uuid: UUID, subscriber: SubscriberCreate, db: Session = Depends(get_db)):
    try:
        return update_subscriber(uuid=uuid, updated_attributes=subscriber, db=db)
    except (NotFoundException, ConflictException, BadRequestException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException()
    
@subscriber_router.delete("/subscriber/{uuid}/", status_code=204)
async def delete_subscriber_route(uuid: UUID, db: Session = Depends(get_db)):
    try:
        delete_subscriber(uuid=uuid, db=db)
        return {"detail": "Subscriber deleted successfully"}
    except (NotFoundException, BadRequestException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException()
        