from typing import Dict, List, Any
from app.schemas.dataset import Domain, ColumnType, CustomColumn

# Mapping of Domain -> Tables -> Columns
DOMAIN_SCHEMA_MAP: Dict[Domain, Dict[str, List[CustomColumn]]] = {
    Domain.retail: {
        "Customers": [
            CustomColumn(name="CustomerID", type=ColumnType.uuid),
            CustomColumn(name="Name", type=ColumnType.text),
            CustomColumn(name="Email", type=ColumnType.email),
            CustomColumn(name="Phone", type=ColumnType.phone),
            CustomColumn(name="City", type=ColumnType.text),
            CustomColumn(name="State", type=ColumnType.text),
            CustomColumn(name="PostalCode", type=ColumnType.text),
            CustomColumn(name="RegistrationDate", type=ColumnType.date),
        ],
        "Products": [
            CustomColumn(name="ProductID", type=ColumnType.uuid),
            CustomColumn(name="ProductName", type=ColumnType.text),
            CustomColumn(name="Category", type=ColumnType.categorical, categories=["Electronics", "Apparel", "Home", "Beauty", "Sports"]),
            CustomColumn(name="Price", type=ColumnType.currency, min_val=10, max_val=5000),
            CustomColumn(name="Cost", type=ColumnType.currency, min_val=5, max_val=3000),
            CustomColumn(name="StockQuantity", type=ColumnType.integer, min_val=0, max_val=1000),
        ],
        "Stores": [
            CustomColumn(name="StoreID", type=ColumnType.uuid),
            CustomColumn(name="StoreName", type=ColumnType.text),
            CustomColumn(name="City", type=ColumnType.text),
            CustomColumn(name="State", type=ColumnType.text),
            CustomColumn(name="OpenDate", type=ColumnType.date),
            CustomColumn(name="SquareFootage", type=ColumnType.integer, min_val=1000, max_val=50000),
        ],
        "Employees": [
            CustomColumn(name="EmployeeID", type=ColumnType.uuid),
            CustomColumn(name="StoreID", type=ColumnType.uuid), # Foreign Key concept
            CustomColumn(name="Name", type=ColumnType.text),
            CustomColumn(name="Role", type=ColumnType.categorical, categories=["Manager", "Cashier", "Sales Associate", "Stock Clerk"]),
            CustomColumn(name="HireDate", type=ColumnType.date),
            CustomColumn(name="HourlyRate", type=ColumnType.currency, min_val=15, max_val=50),
        ],
        "Orders": [
            CustomColumn(name="OrderID", type=ColumnType.uuid),
            CustomColumn(name="CustomerID", type=ColumnType.uuid),
            CustomColumn(name="StoreID", type=ColumnType.uuid),
            CustomColumn(name="EmployeeID", type=ColumnType.uuid),
            CustomColumn(name="OrderDate", type=ColumnType.date),
            CustomColumn(name="TotalAmount", type=ColumnType.currency, min_val=10, max_val=10000),
            CustomColumn(name="PaymentMethod", type=ColumnType.categorical, categories=["Credit Card", "Cash", "Debit Card", "Mobile Pay"]),
        ],
        "OrderItems": [
            CustomColumn(name="OrderItemID", type=ColumnType.uuid),
            CustomColumn(name="OrderID", type=ColumnType.uuid),
            CustomColumn(name="ProductID", type=ColumnType.uuid),
            CustomColumn(name="Quantity", type=ColumnType.integer, min_val=1, max_val=20),
            CustomColumn(name="UnitPrice", type=ColumnType.currency, min_val=10, max_val=5000),
        ]
    },
    Domain.ecommerce: {
        "Users": [
             CustomColumn(name="UserID", type=ColumnType.uuid),
             CustomColumn(name="FullName", type=ColumnType.text),
             CustomColumn(name="Email", type=ColumnType.email),
             CustomColumn(name="SignupDate", type=ColumnType.date),
             CustomColumn(name="SubscriptionTier", type=ColumnType.categorical, categories=["Free", "Premium", "Pro"]),
        ],
        "Products": [
            CustomColumn(name="ProductID", type=ColumnType.uuid),
            CustomColumn(name="Name", type=ColumnType.text),
            CustomColumn(name="Brand", type=ColumnType.text),
            CustomColumn(name="Category", type=ColumnType.categorical, categories=["Electronics", "Fashion", "Home", "Books", "Toys"]),
            CustomColumn(name="Price", type=ColumnType.currency, min_val=1, max_val=2000),
            CustomColumn(name="Rating", type=ColumnType.float_, min_val=1.0, max_val=5.0),
        ],
        "Transactions": [
             CustomColumn(name="TransactionID", type=ColumnType.uuid),
             CustomColumn(name="UserID", type=ColumnType.uuid),
             CustomColumn(name="ProductID", type=ColumnType.uuid),
             CustomColumn(name="Timestamp", type=ColumnType.date),
             CustomColumn(name="Amount", type=ColumnType.currency, min_val=1, max_val=2000),
             CustomColumn(name="Status", type=ColumnType.categorical, categories=["Success", "Failed", "Pending", "Refunded"]),
        ],
        "Reviews": [
            CustomColumn(name="ReviewID", type=ColumnType.uuid),
            CustomColumn(name="ProductID", type=ColumnType.uuid),
            CustomColumn(name="UserID", type=ColumnType.uuid),
            CustomColumn(name="Rating", type=ColumnType.integer, min_val=1, max_val=5),
            CustomColumn(name="ReviewText", type=ColumnType.text),
            CustomColumn(name="Date", type=ColumnType.date),
        ]
    },
    Domain.healthcare: {
         "Patients": [
             CustomColumn(name="PatientID", type=ColumnType.uuid),
             CustomColumn(name="Name", type=ColumnType.text),
             CustomColumn(name="DOB", type=ColumnType.date),
             CustomColumn(name="Gender", type=ColumnType.categorical, categories=["Male", "Female", "Other"]),
             CustomColumn(name="BloodType", type=ColumnType.categorical, categories=["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
             CustomColumn(name="ContactNumber", type=ColumnType.phone),
         ],
         "Doctors": [
             CustomColumn(name="DoctorID", type=ColumnType.uuid),
             CustomColumn(name="Name", type=ColumnType.text),
             CustomColumn(name="Specialty", type=ColumnType.categorical, categories=["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "General Practice"]),
             CustomColumn(name="YearsOfExperience", type=ColumnType.integer, min_val=1, max_val=40),
         ],
         "Appointments": [
             CustomColumn(name="AppointmentID", type=ColumnType.uuid),
             CustomColumn(name="PatientID", type=ColumnType.uuid),
             CustomColumn(name="DoctorID", type=ColumnType.uuid),
             CustomColumn(name="Date", type=ColumnType.date),
             CustomColumn(name="Status", type=ColumnType.categorical, categories=["Scheduled", "Completed", "Cancelled", "No Show"]),
             CustomColumn(name="Diagnosis", type=ColumnType.text),
         ]
    },
    Domain.banking: {
        "Customers": [
            CustomColumn(name="CustomerID", type=ColumnType.uuid),
            CustomColumn(name="Name", type=ColumnType.text),
            CustomColumn(name="DOB", type=ColumnType.date),
            CustomColumn(name="Address", type=ColumnType.text),
            CustomColumn(name="CreditScore", type=ColumnType.integer, min_val=300, max_val=850),
        ],
        "Accounts": [
            CustomColumn(name="AccountID", type=ColumnType.uuid),
            CustomColumn(name="CustomerID", type=ColumnType.uuid),
            CustomColumn(name="AccountType", type=ColumnType.categorical, categories=["Checking", "Savings", "Credit", "Loan"]),
            CustomColumn(name="Balance", type=ColumnType.currency, min_val=-5000, max_val=100000),
            CustomColumn(name="OpenedDate", type=ColumnType.date),
        ],
        "Transactions": [
            CustomColumn(name="TransactionID", type=ColumnType.uuid),
            CustomColumn(name="AccountID", type=ColumnType.uuid),
            CustomColumn(name="TransactionType", type=ColumnType.categorical, categories=["Deposit", "Withdrawal", "Transfer", "Payment"]),
            CustomColumn(name="Amount", type=ColumnType.currency, min_val=1, max_val=50000),
            CustomColumn(name="Date", type=ColumnType.date),
        ]
    },
    # Add other domains briefly or define default generic fallback
}

def get_tables_for_domain(domain: Domain) -> Dict[str, List[CustomColumn]]:
    # Return defined schema or generic fallback
    if domain in DOMAIN_SCHEMA_MAP:
        return DOMAIN_SCHEMA_MAP[domain]
    
    # Generic fallback
    return {
        "Entities": [
            CustomColumn(name="ID", type=ColumnType.uuid),
            CustomColumn(name="Name", type=ColumnType.text),
            CustomColumn(name="Category", type=ColumnType.categorical, categories=["A", "B", "C"]),
            CustomColumn(name="Value", type=ColumnType.float_, min_val=0.0, max_val=100.0),
            CustomColumn(name="CreatedAt", type=ColumnType.date),
        ]
    }
