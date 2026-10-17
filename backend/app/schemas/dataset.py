from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime
from enum import Enum


class Domain(str, Enum):
    retail = "Retail"
    ecommerce = "Ecommerce"
    healthcare = "Healthcare"
    banking = "Banking"
    insurance = "Insurance"
    hr = "HR"
    education = "Education"
    telecom = "Telecom"
    manufacturing = "Manufacturing"
    logistics = "Logistics"
    real_estate = "Real Estate"
    hospitality = "Hospitality"
    finance = "Finance"
    marketing = "Marketing"


class Region(str, Enum):
    india = "India"
    usa = "USA"
    uk = "UK"
    canada = "Canada"
    australia = "Australia"
    uae = "UAE"
    singapore = "Singapore"
    germany = "Germany"


class ColumnType(str, Enum):
    integer = "Integer"
    float_ = "Float"
    text = "Text"
    boolean = "Boolean"
    date = "Date"
    email = "Email"
    phone = "Phone"
    currency = "Currency"
    categorical = "Categorical"
    uuid = "UUID"


class CustomColumn(BaseModel):
    name: str
    type: ColumnType
    min_val: Optional[float] = None
    max_val: Optional[float] = None
    categories: Optional[List[str]] = None
    nullable: bool = False
    null_percentage: float = 0.0


class TableConfig(BaseModel):
    name: str
    include: bool = True
    custom_columns: List[CustomColumn] = []
    row_count: Optional[int] = None  # Override global row_count per table


class DatasetConfig(BaseModel):
    domain: Domain
    region: Region
    row_count: int = Field(1000, ge=100, le=10000000)
    column_count: Optional[int] = Field(None, ge=1, le=1000)
    dirty_percentage: float = Field(0.0, ge=0.0, le=100.0)
    tables: List[TableConfig] = []
    include_all_tables: bool = True
    job_name: Optional[str] = None


class QualityReport(BaseModel):
    total_rows: int
    total_columns: int
    missing_value_percentage: float
    duplicate_row_percentage: float
    outlier_percentage: float
    date_format_issues: int
    text_format_issues: int
    invalid_email_count: int
    quality_score: float
    issues: List[Dict[str, Any]] = []


class GenerationResponse(BaseModel):
    job_id: str
    status: str
    domain: str
    region: str
    row_count: int
    tables_generated: List[str]
    quality_report: Optional[QualityReport] = None
    preview: Optional[Dict[str, List[Dict]]] = None
    created_at: datetime


class MLTaskType(str, Enum):
    classification = "Classification"
    regression = "Regression"
    clustering = "Clustering"
    timeseries = "Time Series"


class MLScenario(str, Enum):
    customer_churn = "Customer Churn"
    loan_default = "Loan Default"
    fraud_detection = "Fraud Detection"
    employee_attrition = "Employee Attrition"
    house_price = "House Price Prediction"
    sales_forecasting = "Sales Forecasting"
    insurance_cost = "Insurance Cost Prediction"
    customer_segmentation = "Customer Segmentation"
    stock_prices = "Stock Prices"
    retail_sales = "Retail Sales"
    website_traffic = "Website Traffic"
    iot_sensors = "IoT Sensors"


class MLDatasetConfig(BaseModel):
    task_type: MLTaskType
    scenario: MLScenario
    row_count: int = Field(1000, ge=100, le=10000000)
    column_count: Optional[int] = Field(None, ge=1, le=1000)
    region: Region = Region.india
    dirty_percentage: float = Field(0.0, ge=0.0, le=100.0)
    target_variable: Optional[str] = None
    include_feature_importance: bool = True
    time_frequency: Optional[Literal["H", "D", "W", "M", "Q", "Y"]] = None


class TimeSeriesConfig(BaseModel):
    metric_name: str = "value"
    frequency: Literal["H", "D", "W", "M", "Q", "Y"] = "D"
    periods: int = Field(365, ge=10, le=10000)
    start_date: str = "2020-01-01"
    trend: Literal["up", "down", "flat", "seasonal"] = "seasonal"
    noise_level: float = Field(0.1, ge=0.0, le=1.0)
    seasonality: bool = True


class PowerBIConfig(BaseModel):
    domain: Domain = Domain.retail
    region: Region = Region.india
    row_count: int = Field(10000, ge=100, le=10000000)
    include_dim_date: bool = True
    include_dim_customer: bool = True
    include_dim_product: bool = True
    include_dim_store: bool = True
    include_fact_sales: bool = True


class AIGenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=10, max_length=2000)
    user_id: Optional[str] = None

class AISchemaRequest(BaseModel):
    prompt: str = Field(..., min_length=5, max_length=2000)
    provider: Literal["openai", "anthropic", "google", "grok"] = "openai"
    api_key: str

class SchemaColumn(BaseModel):
    name: str
    datatype: str
    pk: bool = False
    nn: bool = False
    uq: bool = False
    ai: bool = False
    defaultVal: str = ""

class SchemaTable(BaseModel):
    name: str
    type: Literal["Dimension", "Fact", "Bridge"]
    columns: List[SchemaColumn]

class SchemaRelationship(BaseModel):
    source: str
    target: str
    sourceHandle: str
    targetHandle: str
    cardinality: str = "1:N"

class GeneratedSchemaResponse(BaseModel):
    tables: List[SchemaTable]
    relationships: List[SchemaRelationship]
