from fastapi import APIRouter, HTTPException
import uuid
from datetime import datetime
import pandas as pd

from app.schemas.dataset import MLDatasetConfig, TimeSeriesConfig, PowerBIConfig, GenerationResponse
from app.services.generator.ml_generator import MLGenerator
from app.services.generator.timeseries_generator import TimeSeriesGenerator
from app.services.generator.powerbi_generator import PowerBIGenerator
from app.services.quality_service import calculate_quality

# Reference the shared in-memory job store
from app.api.v1.datasets import GENERATION_JOBS

router = APIRouter()

@router.post("/ml", response_model=GenerationResponse)
async def generate_ml_dataset(config: MLDatasetConfig):
    try:
        generator = MLGenerator(config)
        generated_data = generator.generate()
        
        quality_report = calculate_quality(generated_data)
        job_id = str(uuid.uuid4())
        
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
            domain="ML",
            region=config.region,
            row_count=config.row_count,
            tables_generated=list(generated_data.keys()),
            quality_report=quality_report,
            preview=preview,
            created_at=datetime.utcnow()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/timeseries", response_model=GenerationResponse)
async def generate_timeseries(config: TimeSeriesConfig):
    try:
        generator = TimeSeriesGenerator(config)
        generated_data = generator.generate()
        
        quality_report = calculate_quality(generated_data)
        job_id = str(uuid.uuid4())
        
        GENERATION_JOBS[job_id] = {
            "data": generated_data,
            "config": config.dict(),
            "quality": quality_report
        }
        
        preview = {}
        for name, df in generated_data.items():
            df_preview = df.head(100).replace({pd.NA: None, float('nan'): None})
            # Convert timestamp to string for JSON serialization
            if "Timestamp" in df_preview.columns:
                 df_preview["Timestamp"] = df_preview["Timestamp"].astype(str)
            preview[name] = df_preview.to_dict(orient="records")

        return GenerationResponse(
            job_id=job_id,
            status="completed",
            domain="TimeSeries",
            region="Global",
            row_count=config.periods,
            tables_generated=list(generated_data.keys()),
            quality_report=quality_report,
            preview=preview,
            created_at=datetime.utcnow()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/powerbi", response_model=GenerationResponse)
async def generate_powerbi(config: PowerBIConfig):
    try:
        generator = PowerBIGenerator(config)
        generated_data = generator.generate()
        
        quality_report = calculate_quality(generated_data)
        job_id = str(uuid.uuid4())
        
        GENERATION_JOBS[job_id] = {
            "data": generated_data,
            "config": config.dict(),
            "quality": quality_report
        }
        
        preview = {}
        for name, df in generated_data.items():
            df_preview = df.head(100).replace({pd.NA: None, float('nan'): None})
            if "FullDate" in df_preview.columns:
                 df_preview["FullDate"] = df_preview["FullDate"].astype(str)
            preview[name] = df_preview.to_dict(orient="records")

        return GenerationResponse(
            job_id=job_id,
            status="completed",
            domain="PowerBI",
            region=config.region,
            row_count=config.row_count,
            tables_generated=list(generated_data.keys()),
            quality_report=quality_report,
            preview=preview,
            created_at=datetime.utcnow()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
