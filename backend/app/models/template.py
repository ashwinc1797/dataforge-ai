from sqlalchemy import Column, String, DateTime, JSON, Text, Boolean
from sqlalchemy.sql import func
import uuid
from app.core.database import Base


class Template(Base):
    __tablename__ = "templates"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    domain = Column(String, nullable=False)
    icon = Column(String, nullable=True)
    tags = Column(JSON, nullable=True)
    config = Column(JSON, nullable=False)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
