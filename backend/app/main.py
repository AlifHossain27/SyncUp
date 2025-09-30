from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import subscriber, user, newsletter, event
from app.db.database import Base, engine

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

Base.metadata.create_all(bind=engine)


app.include_router(subscriber.subscriber_router, prefix="/api", tags=["Subscribers"])
app.include_router(user.user_router, prefix="/api", tags=["Users"])
app.include_router(newsletter.newsletter_router, prefix="/api", tags=["Newsletters"])
app.include_router(event.event_router, prefix="/api", tags=["Events"])