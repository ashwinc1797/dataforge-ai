from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas.export import ExportRequest

# We need to access the in-memory store from datasets router
from app.api.v1.datasets import GENERATION_JOBS
from app.services.export_service import ExportService

router = APIRouter()


def _process_export(job_id: str, format: str, table_name: str = None):
    if job_id not in GENERATION_JOBS:
        raise HTTPException(status_code=404, detail="Job not found or expired")
        
    job_data = GENERATION_JOBS[job_id]["data"]
    
    # Filter if specific table requested
    if table_name:
        if table_name not in job_data:
            raise HTTPException(status_code=404, detail=f"Table {table_name} not found in this dataset")
        job_data = {table_name: job_data[table_name]}
        
    try:
        buffer = None
        media_type = ""
        filename = ""
        
        is_multi = len(job_data) > 1 and format not in ["sqlite", "sql", "excel"]
        
        if format == "csv":
            buffer = ExportService.export_csv(job_data)
            media_type = "application/zip" if is_multi else "text/csv"
            ext = "zip" if is_multi else "csv"
            filename = f"dataset_{job_id}.{ext}"
            
        elif format == "excel":
            buffer = ExportService.export_excel(job_data)
            media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            filename = f"dataset_{job_id}.xlsx"
            
        elif format == "json":
            buffer = ExportService.export_json(job_data)
            media_type = "application/zip" if is_multi else "application/json"
            ext = "zip" if is_multi else "json"
            filename = f"dataset_{job_id}.{ext}"
            
        elif format == "parquet":
            buffer = ExportService.export_parquet(job_data)
            media_type = "application/zip" if is_multi else "application/octet-stream"
            ext = "zip" if is_multi else "parquet"
            filename = f"dataset_{job_id}.{ext}"
            
        elif format == "sql":
            buffer = ExportService.export_sql(job_data)
            media_type = "application/sql"
            filename = f"dataset_{job_id}.sql"
            
        elif format == "sqlite":
            buffer = ExportService.export_sqlite(job_data)
            media_type = "application/x-sqlite3"
            filename = f"dataset_{job_id}.db"
            
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported format: {format}")
            
        return StreamingResponse(
            iter([buffer.getvalue()]),
            media_type=media_type,
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")


@router.post("")
@router.post("/")
async def export_dataset_post(request: ExportRequest):
    return _process_export(request.job_id, request.format, request.table_name)


@router.get("")
@router.get("/")
async def export_dataset_get(job_id: str, format: str = "csv", table_name: str = None):
    return _process_export(job_id, format, table_name)
