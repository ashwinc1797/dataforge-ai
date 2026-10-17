from pydantic import BaseModel
from typing import Literal, Optional


class ExportRequest(BaseModel):
    job_id: str
    format: Literal["csv", "excel", "json", "parquet", "sql", "sqlite"]
    table_name: Optional[str] = None  # export single table, None = all tables
