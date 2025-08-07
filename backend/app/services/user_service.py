import traceback
from datetime import datetime, timedelta, timezone
from typing import Annotated
from uuid import UUID, uuid4
from passlib.context import CryptContext
import jwt
from jwt import PyJWTError
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi import Depends, Cookie,  Response
from app.core.config import settings
from app.models.user_model import User
from app.schemas.user_schemas import Token, TokenData, UserCreate, UserUpdate, UserSchema, PasswordChange
from app.exceptions.handler import (
    UnauthorizedException,
    NotFoundException,
    BadRequestException,
    ConflictException
)


oauth2_bearer = OAuth2PasswordBearer(tokenUrl='/api/auth/token')
bycrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bycrypt_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return bycrypt_context.hash(password)

def authenticate_user(username: str, password: str, db: Session) -> User | Exception:
    user = db.query(User).filter(User.email == username).first()
    if not user or not verify_password(plain_password=password, hashed_password=user.password):
        raise UnauthorizedException("Authentication Failed! Wrong email or password")
    return user

def create_access_token(email: str, uuid: UUID, expires_delta: timedelta) -> str:
    encode = {
        'sub': email,
        'id': str(uuid),
        'exp': datetime.now(timezone.utc) + expires_delta
    }

    return jwt.encode(encode, settings.SECRET_KEY, settings.ALGORITHM)

def verify_token(token: str) -> TokenData:
    if not token or token.count('.') != 2:
        raise UnauthorizedException("Invalid token format")
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        uuid: str = payload['id']
        return TokenData(uuid=uuid)
    except PyJWTError as error:
        print(traceback.format_exc())
        raise UnauthorizedException(error)
    
def get_token_from_cookie(access_token: str | None = Cookie(None)) -> str:
    if not access_token:
        raise UnauthorizedException("Not authenticated")
    return access_token
    
def register_user(db: Session, user: UserCreate) -> UserSchema:
    if db.query(User).filter((User.email == user.email) | (User.username == user.username)).first():
        raise ConflictException("User with this email or username already exists")
    new_user = User(
        uuid = uuid4(),
        username = user.username,
        email = user.email,
        password = get_password_hash(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

def get_current_user(token: Annotated[str, Depends(get_token_from_cookie)]) -> TokenData:
    return verify_token(token)

CurrentUser = Annotated[TokenData, Depends(get_current_user)]

def login_user(data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session) -> Token:
    user = authenticate_user(data.username, data.password, db)
    if not user:
        raise UnauthorizedException()
    token = create_access_token(user.email, user.uuid, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    return Token(access_token=token, token_type='bearer')

def get_user_by_uuid(uuid: UUID, db: Session) -> UserSchema:
    user = db.query(User).filter(User.uuid == uuid).first()
    if not user:
        raise NotFoundException(f"User with ID {uuid} not found")
    return user

def update_user(uuid: UUID, updated_attributes: UserUpdate, db: Session) -> UserSchema:
    user = db.query(User).filter(User.uuid == uuid).first()
    if not user:
        raise NotFoundException(f"User with ID {uuid} not found")
    if user.email != updated_attributes.email:
        if db.query(User).filter(User.email == updated_attributes.email).first():
            raise ConflictException(f"User with email {updated_attributes.email} already exists")

    user.email = updated_attributes.email
    user.username = updated_attributes.username
    user.updated_at = datetime.now(tz = timezone.utc)

    db.commit()
    db.refresh(user)

    return user

def change_password(current_user: TokenData, new_password: PasswordChange, db: Session) -> None:
    uuid = current_user.get_uuid()
    user = get_user_by_uuid(uuid=uuid, db=db)

    if new_password.new_password == new_password.current_password:
        raise ConflictException("New password can not be the same as the old password")

    if not verify_password(new_password.current_password, user.password):
        raise UnauthorizedException("Wrong password")
    
    if new_password.new_password != new_password.new_password_confirm:
        raise BadRequestException("New password does not match confirm new password")
    
    user.password = get_password_hash(new_password.new_password)
    db.commit()

def logout_user(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True
    )