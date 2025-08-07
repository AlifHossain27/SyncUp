import traceback
from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.rate_limiting import limiter
from app.db.deps import get_db
from app.schemas.user_schemas import UserCreate, UserSchema, Token, PasswordChange
from app.services.user_service import (
    register_user,
    login_user,
    get_user_by_uuid,
    change_password,
    update_user,
    logout_user,
    CurrentUser
)
from app.exceptions.handler import (
    NotFoundException,
    ConflictException,
    EntityTooLargeException,
    BadRequestException,
    UnauthorizedException
)


user_router = APIRouter()

@user_router.post("/auth", response_model=UserSchema, status_code=201)
@limiter.limit("5/hour")
async def register_user_route(request: Request, user: UserCreate, db: Session = Depends(get_db)):
    try:
        return register_user(user=user, db=db)
    except (NotFoundException, ConflictException, BadRequestException, UnauthorizedException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException()
    
@user_router.post("/auth/token", response_model=Token)
async def login_route(response: Response, data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    try:
        token = login_user(data=data, db=db)
        response.set_cookie(
            key="access_token",
            value=token.access_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=60 * 60 * 24,
            path="/",
        )
        return token
    except (NotFoundException, ConflictException, BadRequestException, UnauthorizedException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException()
    
@user_router.post("/auth/logout", status_code=204)
async def logout_route(response: Response):
    try:
        logout_user(response)
    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException()
    
@user_router.get("/user/me", response_model=UserSchema)
async def get_current_user_route(current_user: CurrentUser, db: Session = Depends(get_db)):
    try:
        return get_user_by_uuid(uuid=current_user.get_uuid(), db=db)
    except (NotFoundException, ConflictException, BadRequestException, UnauthorizedException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException()
    
@user_router.patch("/user/me/", response_model=UserCreate, status_code=201)
async def update_user_route(current_user: CurrentUser, user: UserCreate, db: Session = Depends(get_db)):
    try:
        uuid = current_user.get_uuid()
        return update_user(uuid=uuid, updated_attributes=user, db=db)
    except (NotFoundException, ConflictException, BadRequestException) as error:
        raise error
    except Exception as e:
        print(traceback.format_exc())
        raise BadRequestException()
    
@user_router.patch("/user/change-password", status_code=200)
async def change_password_route(new_password: PasswordChange, current_user: CurrentUser, db: Session = Depends(get_db)):
    change_password(current_user=current_user, new_password=new_password, db=db)

