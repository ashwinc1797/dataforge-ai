from sqlalchemy import Column, String, DateTime, Integer, Float, JSON, ForeignKey, Text
from sqlalchemy.sql import func
import uuid
from app.core.database import Base


class GenerationJob(Base):
    __tablename__ = "generation_jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    job_name = Column(String, nullable=True)
    domain = Column(String, nullable=False)
    region = Column(String, nullable=False)
    row_count = Column(Integer, nullable=False)
    dirty_percentage = Column(Float, default=0.0)
    config = Column(JSON, nullable=False)
    status = Column(String, default="pending")  # pending, running, completed, failed
    quality_score = Column(Float, nullable=True)
    quality_report = Column(JSON, nullable=True)
    file_paths = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)


class SavedDataset(Base):
    __tablename__ = "saved_datasets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    job_id = Column(String, ForeignKey("generation_jobs.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
