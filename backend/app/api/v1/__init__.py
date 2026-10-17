from fastapi import APIRouter

from app.api.v1.datasets import router as datasets_router
from app.api.v1.export import router as export_router
from app.api.v1.ml_datasets import router as ml_router
from app.api.v1.ai_generator import router as ai_router
from app.api.v1.templates import router as templates_router
from app.api.v1.schema_ai import router as schema_ai_router

api_router = APIRouter()
api_router.include_router(datasets_router, prefix="/datasets", tags=["datasets"])
api_router.include_router(export_router, prefix="/export", tags=["export"])
api_router.include_router(ml_router, prefix="/specialized", tags=["specialized"])
api_router.include_router(ai_router, prefix="/ai", tags=["ai"])
api_router.include_router(templates_router, prefix="/templates", tags=["templates"])
api_router.include_router(schema_ai_router, prefix="/schema-ai", tags=["schema-ai"])
