from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from app.routers import subscriber, user, newsletter, event
from app.db.database import Base, engine
from app.core.config import settings
from app.core.rate_limiting import limiter

app = FastAPI(
    title = "SyncUp",
    description = "An Newsletter Service API",
    openapi_tags = False,
    version = "0.0.1",
    contact = {
        "name": "API Support",
        "url": "https://github.com/AlifHossain27",
        "email": "alifh044@gmail.com"
    }
)

app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please try again later."},
        headers={"Access-Control-Allow-Origin": settings.FRONTEND_URL},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

Base.metadata.create_all(bind=engine)


app.include_router(subscriber.subscriber_router, prefix="/api", tags=["Subscribers"])
app.include_router(user.user_router, prefix="/api", tags=["Users"])
app.include_router(newsletter.newsletter_router, prefix="/api", tags=["Newsletters"])
app.include_router(event.event_router, prefix="/api", tags=["Events"])