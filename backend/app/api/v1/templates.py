from fastapi import APIRouter
from typing import List, Dict, Any
from app.schemas.dataset import DatasetConfig, Domain, Region, TableConfig

router = APIRouter()

# Hardcoded templates for now. In a real app, these would come from the database.
TEMPLATES = [
    {
        "id": "tpl-001",
        "name": "Blinkit Sales",
        "description": "Quick commerce 10-minute delivery dataset with orders, riders, and inventory.",
        "domain": Domain.ecommerce,
        "icon": "shopping-cart",
        "config": {
            "domain": Domain.ecommerce.value,
            "region": Region.india.value,
            "row_count": 50000,
            "dirty_percentage": 2.0,
            "tables": [
                {"name": "Orders", "include": True, "custom_columns": []},
                {"name": "Customers", "include": True, "custom_columns": []},
                {"name": "DeliveryPartners", "include": True, "custom_columns": []},
                {"name": "DarkStores", "include": True, "custom_columns": []}
            ]
        }
    },
    {
        "id": "tpl-002",
        "name": "Hospital Management",
        "description": "Comprehensive healthcare dataset with patients, doctors, appointments, and billing.",
        "domain": Domain.healthcare,
        "icon": "activity",
        "config": {
            "domain": Domain.healthcare.value,
            "region": Region.usa.value,
            "row_count": 10000,
            "dirty_percentage": 5.0,
            "tables": []
        }
    },
    {
        "id": "tpl-003",
        "name": "Bank Transactions",
        "description": "High-volume transaction data suitable for fraud detection and financial modeling.",
        "domain": Domain.banking,
        "icon": "credit-card",
        "config": {
            "domain": Domain.banking.value,
            "region": Region.uk.value,
            "row_count": 100000,
            "dirty_percentage": 1.0,
            "tables": []
        }
    }
]

@router.get("/", response_model=List[Dict[str, Any]])
async def list_templates():
    return TEMPLATES

@router.get("/{template_id}", response_model=Dict[str, Any])
async def get_template(template_id: str):
    for tpl in TEMPLATES:
        if tpl["id"] == template_id:
            return tpl
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Template not found")
