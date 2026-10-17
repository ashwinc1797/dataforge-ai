from fastapi import APIRouter, HTTPException
import uuid
from datetime import datetime
import pandas as pd

from app.schemas.dataset import AIGenerateRequest, GenerationResponse
from app.services.ai_service import AIService
from app.services.generator.base_generator import BaseGenerator
from app.services.quality_service import calculate_quality

# Reference the shared in-memory job store
from app.api.v1.datasets import GENERATION_JOBS

router = APIRouter()

@router.post("/generate", response_model=GenerationResponse)
async def generate_from_prompt(request: AIGenerateRequest):
    try:
        # 1. Parse prompt into config
        config = AIService.parse_prompt(request.prompt)
        
        # 2. Generate data
        generator = BaseGenerator(config)
        generated_data = generator.generate_all()
        
        # 3. Calculate quality
        quality_report = calculate_quality(generated_data)
        
        job_id = str(uuid.uuid4())
        
        # 4. Store
        GENERATION_JOBS[job_id] = {
            "data": generated_data,
            "config": config.dict(),
            "quality": quality_report
        }
        
        preview = {}
        for name, df in generated_data.items():
            df_preview = df.head(100).replace({pd.NA: None, float('nan'): None})
            preview[name] = df_preview.to_dict(orient="records")

        return GenerationResponse(
            job_id=job_id,
            status="completed",
            domain=config.domain.value,
            region=config.region.value,
            row_count=config.row_count,
            tables_generated=list(generated_data.keys()),
            quality_report=quality_report,
            preview=preview,
            created_at=datetime.utcnow()
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
