import pandas as pd
import numpy as np
from typing import Dict, List, Any
from faker import Faker
import uuid
import random
from app.schemas.dataset import DatasetConfig, ColumnType, CustomColumn, TableConfig
from app.services.generator.domain_generator import get_tables_for_domain
from app.services.generator.region_data import get_locale_for_region, get_currency_for_region
from app.services.generator.dirty_data import inject_dirty_data


class BaseGenerator:
    def __init__(self, config: DatasetConfig):
        self.config = config
        self.locale = get_locale_for_region(config.region)
        self.faker = Faker(self.locale)
        self.currency = get_currency_for_region(config.region)
        self.generated_data: Dict[str, pd.DataFrame] = {}
        self.primary_keys: Dict[str, np.ndarray] = {}
        
        # Pre-generate mock pools for text/categorical to speed up massive generation
        self.pool_size = min(config.row_count, 10000) if config.row_count > 0 else 1000
        self.mock_pools = {}

    def get_mock_pool(self, col_name: str, col_type: ColumnType) -> np.ndarray:
        pool_key = f"{col_name}_{col_type.value}"
        if pool_key in self.mock_pools:
            return self.mock_pools[pool_key]
            
        pool = []
        for _ in range(self.pool_size):
            if col_type == ColumnType.text:
                if "name" in col_name.lower():
                    pool.append(self.faker.name())
                elif "city" in col_name.lower():
                    pool.append(self.faker.city())
                elif "state" in col_name.lower():
                    pool.append(self.faker.state())
                elif "address" in col_name.lower():
                    pool.append(self.faker.address().replace("\n", ", "))
                elif "postal" in col_name.lower() or "zip" in col_name.lower():
                    pool.append(self.faker.postcode())
                else:
                    pool.append(self.faker.word())
            elif col_type == ColumnType.email:
                pool.append(self.faker.email())
            elif col_type == ColumnType.phone:
                pool.append(self.faker.phone_number())
            elif col_type == ColumnType.date:
                pool.append(self.faker.date_between(start_date='-5y', end_date='today').isoformat())
                
        self.mock_pools[pool_key] = np.array(pool)
        return self.mock_pools[pool_key]

    def generate_table(self, table_name: str, columns: List[CustomColumn], num_rows: int) -> pd.DataFrame:
        data = {}
        
        fk_columns = [col for col in columns if col.name.endswith('ID') and col.name != f"{table_name[:-1]}ID" and col.name != f"{table_name}ID"]
        
        for col in columns:
            col_data = None
            
            # 1. Foreign Key Handling
            if col in fk_columns:
                ref_table = col.name[:-2] + "s"
                if ref_table in self.primary_keys and len(self.primary_keys[ref_table]) > 0:
                    col_data = np.random.choice(self.primary_keys[ref_table], size=num_rows)
                
            # 2. Vectorized Value Generation
            if col_data is None:
                if col.type == ColumnType.uuid:
                    # UUIDs are unique, so we can't pool them effectively.
                    col_data = np.array([str(uuid.uuid4()) for _ in range(num_rows)])
                elif col.type in [ColumnType.text, ColumnType.email, ColumnType.phone, ColumnType.date]:
                    pool = self.get_mock_pool(col.name, col.type)
                    col_data = np.random.choice(pool, size=num_rows)
                elif col.type == ColumnType.integer:
                    min_v = col.min_val if col.min_val is not None else 0
                    max_v = col.max_val if col.max_val is not None else 1000
                    col_data = np.random.randint(int(min_v), int(max_v) + 1, size=num_rows)
                elif col.type in [ColumnType.float_, ColumnType.currency]:
                    min_v = col.min_val if col.min_val is not None else 0.0
                    max_v = col.max_val if col.max_val is not None else 1000.0
                    col_data = np.round(np.random.uniform(min_v, max_v, size=num_rows), 2)
                elif col.type == ColumnType.boolean:
                    col_data = np.random.choice([True, False], size=num_rows)
                elif col.type == ColumnType.categorical:
                    cats = col.categories if col.categories else ["Category A", "Category B", "Category C"]
                    col_data = np.random.choice(cats, size=num_rows)
                else:
                    col_data = np.array([None] * num_rows)
                    
            # 3. Apply Nulls Vectorized
            if col.nullable and col.null_percentage > 0:
                null_mask = np.random.random(num_rows) < col.null_percentage
                # Convert to object array to safely hold None/NaN
                col_data = col_data.astype(object)
                col_data[null_mask] = None
                
            data[col.name] = col_data
            
        df = pd.DataFrame(data)
        
        # Store primary keys
        pk_candidates = [f"{table_name[:-1]}ID", f"{table_name}ID", "id", "ID"]
        for pk in pk_candidates:
            if pk in df.columns:
                self.primary_keys[table_name] = df[pk].values
                break
                
        return df

    def generate_all(self) -> Dict[str, pd.DataFrame]:
        domain_tables = get_tables_for_domain(self.config.domain)
        
        tables_to_generate = []
        if self.config.include_all_tables:
            for t_name, cols in domain_tables.items():
                tables_to_generate.append({
                    "name": t_name,
                    "columns": cols,
                    "row_count": self.config.row_count
                })
                
        for table_config in self.config.tables:
            if not table_config.include:
                tables_to_generate = [t for t in tables_to_generate if t["name"] != table_config.name]
                continue
                
            existing = next((t for t in tables_to_generate if t["name"] == table_config.name), None)
            merged_columns = existing["columns"] if existing else []
            merged_columns.extend(table_config.custom_columns)
            rows = table_config.row_count if table_config.row_count else self.config.row_count
            
            if existing:
                existing["columns"] = merged_columns
                existing["row_count"] = rows
            else:
                tables_to_generate.append({
                    "name": table_config.name,
                    "columns": merged_columns,
                    "row_count": rows
                })

        if self.config.column_count:
            for table in tables_to_generate:
                current_cols = len(table["columns"])
                if current_cols < self.config.column_count:
                    num_to_add = self.config.column_count - current_cols
                    for i in range(num_to_add):
                        table["columns"].append(CustomColumn(
                            name=f"CustomFeature_{i+1}",
                            type=random.choice([ColumnType.float_, ColumnType.integer, ColumnType.text])
                        ))

        for table in tables_to_generate:
            df = self.generate_table(table["name"], table["columns"], table["row_count"])
            
            if self.config.dirty_percentage > 0:
                df = inject_dirty_data(df, self.config.dirty_percentage)
                
            self.generated_data[table["name"]] = df
            
        return self.generated_data
