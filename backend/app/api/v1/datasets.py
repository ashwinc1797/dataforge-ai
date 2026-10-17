from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import Dict, Any, List
import pandas as pd
import uuid
from datetime import datetime

from app.schemas.dataset import DatasetConfig, GenerationResponse, QualityReport
from pydantic import BaseModel
from app.services.generator.base_generator import BaseGenerator
from app.services.quality_service import calculate_quality

GENERATION_JOBS: Dict[str, Dict[str, Any]] = {}

class ReorderRequest(BaseModel):
    table_name: str
    columns: List[str]

router = APIRouter()

def process_generation(job_id: str, config: DatasetConfig):
    try:
        generator = BaseGenerator(config)
        generated_data = generator.generate_all()
        quality_report = calculate_quality(generated_data)
        
        preview = {}
        for name, df in generated_data.items():
            df_preview = df.head(100).replace({pd.NA: None, float('nan'): None})
            preview[name] = df_preview.to_dict(orient="records")
            
        GENERATION_JOBS[job_id].update({
            "status": "completed",
            "data": generated_data,
            "quality": quality_report,
            "preview": preview,
            "tables_generated": list(generated_data.keys()),
            "completed_at": datetime.utcnow()
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        GENERATION_JOBS[job_id].update({
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.utcnow()
        })

@router.post("/generate", response_model=GenerationResponse)
async def generate_dataset(config: DatasetConfig, background_tasks: BackgroundTasks):
    try:
        job_id = str(uuid.uuid4())
        
        GENERATION_JOBS[job_id] = {
            "status": "processing",
            "config": config,
            "created_at": datetime.utcnow(),
            "data": {},
            "quality": None,
            "preview": {},
            "tables_generated": []
        }
        
        background_tasks.add_task(process_generation, job_id, config)
        
        # We will return empty for required fields but status will be "processing"
        return GenerationResponse(
            job_id=job_id,
            status="processing",
            domain=config.domain,
            region=config.region,
            row_count=config.row_count,
            tables_generated=[],
            quality_report=QualityReport(
                total_rows=0,
                total_columns=0,
                missing_value_percentage=0.0,
                duplicate_row_percentage=0.0,
                outlier_percentage=0.0,
                date_format_issues=0,
                text_format_issues=0,
                invalid_email_count=0,
                quality_score=0.0,
                issues=[]
            ),
            preview={},
            created_at=GENERATION_JOBS[job_id]["created_at"]
        )
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Generation failed to start: {str(e)}")

@router.get("/{job_id}/status")
async def get_job_status(job_id: str):
    if job_id not in GENERATION_JOBS:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = GENERATION_JOBS[job_id]
    return {
        "job_id": job_id,
        "status": job["status"],
        "error": job.get("error"),
        "tables_generated": job.get("tables_generated", []),
        "quality_report": job.get("quality"),
        "preview": job.get("preview", {})
    }

@router.get("/{job_id}/preview")
async def get_dataset_preview(job_id: str):
    if job_id not in GENERATION_JOBS:
        raise HTTPException(status_code=404, detail="Job not found")
        
    job = GENERATION_JOBS[job_id]
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail="Job is not completed yet")
        
    return job["preview"]

@router.get("/{job_id}/quality", response_model=QualityReport)
async def get_dataset_quality(job_id: str):
    if job_id not in GENERATION_JOBS:
        raise HTTPException(status_code=404, detail="Job not found")
        
    job = GENERATION_JOBS[job_id]
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail="Job is not completed yet")
        
    return job["quality"]

@router.post("/{job_id}/reorder_columns")
async def reorder_dataset_columns(job_id: str, request: ReorderRequest):
    if job_id not in GENERATION_JOBS:
        raise HTTPException(status_code=404, detail="Job not found")
        
    job = GENERATION_JOBS[job_id]
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail="Job is not completed yet")
        
    if request.table_name not in job["data"]:
        raise HTTPException(status_code=404, detail=f"Table {request.table_name} not found")
        
    df = job["data"][request.table_name]
    
    if set(request.columns) != set(df.columns):
        raise HTTPException(status_code=400, detail="Provided columns do not match existing table columns")
        
    job["data"][request.table_name] = df[request.columns]
    
    # Re-generate preview to match new column order
    df_preview = job["data"][request.table_name].head(100).replace({pd.NA: None, float('nan'): None})
    job["preview"][request.table_name] = df_preview.to_dict(orient="records")
    
    return {"status": "success", "message": "Columns reordered successfully"}
