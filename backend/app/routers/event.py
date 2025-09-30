import traceback
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.schemas.event_schemas import EventCreate, EventUpdate, EventSchema
from app.services.event_service import (
    create_event,
    retrieve_events,
    retrieve_upcoming_events,
    retrieve_recent_events,
    update_event,
    delete_event
)
from app.services.user_service import CurrentUser, get_current_user
from app.schemas.user_schemas import TokenData
from app.exceptions.handler import (
    NotFoundException,
    ConflictException,
    EntityTooLargeException,
    BadRequestException
)

event_router = APIRouter()

@event_router.post("/event/create/", response_model=EventSchema, status_code=201)
async def create_event_route(event: EventCreate, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    try:
        return create_event(event=event, db=db)
    except (NotFoundException, ConflictException, BadRequestException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc(e))
        raise BadRequestException()
    
@event_router.get("/events/", response_model=list[EventSchema], status_code=200)
async def get_event_route(skip: int = 0, limit: int | None = None, db: Session = Depends(get_db)):
    try:
        return retrieve_events(db=db, skip=skip, limit=limit)
    except Exception as error:
        print(traceback.format_exc())
        raise BadRequestException
    
@event_router.get("/events/upcoming/", response_model=list[EventSchema], status_code=200)
async def get_upcoming_event_route(skip: int = 0, limit: int | None = None, db: Session = Depends(get_db)):
    try:
        return retrieve_upcoming_events(db=db, skip=skip, limit=limit)
    except Exception as error:
        print(traceback.format_exc(error))
        raise BadRequestException
    
@event_router.get("/events/recent/", response_model=list[EventSchema], status_code=200)
async def get_recent_event_route(skip: int = 0, limit: int | None = None, db: Session = Depends(get_db)):
    try:
        return retrieve_recent_events(db=db, skip=skip, limit=limit)
    except Exception as error:
        print(traceback.format_exc(error))
        raise BadRequestException
    
@event_router.patch("/event/{uuid}/", response_model=EventSchema, status_code=201)
async def update_event_route(uuid: UUID, event: EventUpdate, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    try:
        return update_event(uuid=uuid, updated_attributes=event, db=db)
    except (NotFoundException, ConflictException, BadRequestException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc(e))
        raise BadRequestException()
    
@event_router.delete("/event/{uuid}/", status_code=204)
async def delete_event_route(uuid: UUID, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    try:
        delete_event(uuid=uuid, db=db)
        return {"detail": "Event deleted successfully"}
    except (NotFoundException, BadRequestException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc(e))
        raise BadRequestException()