from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas.export import ExportRequest

# We need to access the in-memory store from datasets router
from app.api.v1.datasets import GENERATION_JOBS
from app.services.export_service import ExportService

router = APIRouter()


@router.post("/")
async def export_dataset(request: ExportRequest):
    if request.job_id not in GENERATION_JOBS:
        raise HTTPException(status_code=404, detail="Job not found or expired")
        
    job_data = GENERATION_JOBS[request.job_id]["data"]
    
    # Filter if specific table requested
    if request.table_name:
        if request.table_name not in job_data:
            raise HTTPException(status_code=404, detail=f"Table {request.table_name} not found in this dataset")
        job_data = {request.table_name: job_data[request.table_name]}
        
    try:
        buffer = None
        media_type = ""
        filename = ""
        
        is_multi = len(job_data) > 1 and request.format not in ["sqlite", "sql", "excel"]
        
        if request.format == "csv":
            buffer = ExportService.export_csv(job_data)
            media_type = "application/zip" if is_multi else "text/csv"
            ext = "zip" if is_multi else "csv"
            filename = f"dataset_export.{ext}"
            
        elif request.format == "excel":
            buffer = ExportService.export_excel(job_data)
            media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            filename = "dataset_export.xlsx"
            
        elif request.format == "json":
            buffer = ExportService.export_json(job_data)
            media_type = "application/zip" if is_multi else "application/json"
            ext = "zip" if is_multi else "json"
            filename = f"dataset_export.{ext}"
            
        elif request.format == "parquet":
            buffer = ExportService.export_parquet(job_data)
            media_type = "application/zip" if is_multi else "application/octet-stream"
            ext = "zip" if is_multi else "parquet"
            filename = f"dataset_export.{ext}"
            
        elif request.format == "sql":
            buffer = ExportService.export_sql(job_data)
            media_type = "application/sql"
            filename = "dataset_export.sql"
            
        elif request.format == "sqlite":
            buffer = ExportService.export_sqlite(job_data)
            media_type = "application/x-sqlite3"
            filename = "dataset.db"
            
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported format: {request.format}")
            
        return StreamingResponse(
            iter([buffer.getvalue()]),
            media_type=media_type,
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")
