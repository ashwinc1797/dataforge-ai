import pandas as pd
import numpy as np
import uuid
from typing import Dict
from faker import Faker
from datetime import timedelta

from app.schemas.dataset import PowerBIConfig
from app.services.generator.region_data import get_locale_for_region

class PowerBIGenerator:
    def __init__(self, config: PowerBIConfig):
        self.config = config
        self.locale = get_locale_for_region(config.region)
        self.faker = Faker(self.locale)

    def generate(self) -> Dict[str, pd.DataFrame]:
        dfs = {}
        
        # 1. DimDate
        if self.config.include_dim_date:
            start = pd.to_datetime('2020-01-01')
            end = pd.to_datetime('today')
            dates = pd.date_range(start, end)
            
            dim_date = pd.DataFrame({
                "DateKey": dates.strftime('%Y%m%d').astype(int),
                "FullDate": dates.date,
                "Year": dates.year,
                "Quarter": dates.quarter,
                "QuarterName": 'Q' + dates.quarter.astype(str),
                "Month": dates.month,
                "MonthName": dates.strftime('%B'),
                "Day": dates.day,
                "DayOfWeek": dates.dayofweek + 1,
                "DayName": dates.strftime('%A'),
                "IsWeekend": dates.dayofweek.isin([5, 6]).astype(int)
            })
            dfs["DimDate"] = dim_date

        # 2. DimCustomer
        customer_keys = []
        if self.config.include_dim_customer:
            n_customers = min(self.config.row_count // 5, 5000)
            dim_customer = pd.DataFrame({
                "CustomerKey": range(1, n_customers + 1),
                "CustomerAlternateKey": [str(uuid.uuid4()) for _ in range(n_customers)],
                "FullName": [self.faker.name() for _ in range(n_customers)],
                "Email": [self.faker.email() for _ in range(n_customers)],
                "City": [self.faker.city() for _ in range(n_customers)],
                "StateProvince": [self.faker.state() for _ in range(n_customers)],
                "Country": [self.config.region.value for _ in range(n_customers)]
            })
            customer_keys = dim_customer["CustomerKey"].tolist()
            dfs["DimCustomer"] = dim_customer

        # 3. DimProduct
        product_keys = []
        if self.config.include_dim_product:
            n_products = min(self.config.row_count // 20, 500)
            dim_product = pd.DataFrame({
                "ProductKey": range(1, n_products + 1),
                "ProductAlternateKey": [f"PRD-{i}" for i in range(1, n_products + 1)],
                "ProductName": [self.faker.word().title() + " " + self.faker.word().title() for _ in range(n_products)],
                "Category": np.random.choice(["Electronics", "Clothing", "Home", "Sports", "Toys"], n_products),
                "StandardCost": np.round(np.random.uniform(5.0, 500.0, n_products), 2),
                "ListPrice": np.zeros(n_products) # computed next
            })
            dim_product["ListPrice"] = np.round(dim_product["StandardCost"] * np.random.uniform(1.2, 2.5, n_products), 2)
            product_keys = dim_product["ProductKey"].tolist()
            dfs["DimProduct"] = dim_product

        # 4. DimStore
        store_keys = []
        if self.config.include_dim_store:
            n_stores = min(self.config.row_count // 100, 50)
            if n_stores < 1: n_stores = 1
            dim_store = pd.DataFrame({
                "StoreKey": range(1, n_stores + 1),
                "StoreName": [f"Store {self.faker.city()}" for _ in range(n_stores)],
                "StoreType": np.random.choice(["Supermarket", "Convenience", "Boutique"], n_stores)
            })
            store_keys = dim_store["StoreKey"].tolist()
            dfs["DimStore"] = dim_store

        # 5. FactSales
        if self.config.include_fact_sales:
            n_sales = self.config.row_count
            
            # Fallbacks if dims weren't generated
            c_keys = customer_keys if customer_keys else [1]
            p_keys = product_keys if product_keys else [1]
            s_keys = store_keys if store_keys else [1]
            
            # Get valid dates
            valid_dates = dim_date["DateKey"].tolist() if "DimDate" in dfs else [20230101]
            
            fact_sales = pd.DataFrame({
                "SalesKey": range(1, n_sales + 1),
                "DateKey": np.random.choice(valid_dates, n_sales),
                "CustomerKey": np.random.choice(c_keys, n_sales),
                "ProductKey": np.random.choice(p_keys, n_sales),
                "StoreKey": np.random.choice(s_keys, n_sales),
                "OrderQuantity": np.random.randint(1, 10, n_sales),
                "UnitPrice": np.zeros(n_sales), # Will fill by joining
                "SalesAmount": np.zeros(n_sales)
            })
            
            # Fill UnitPrice from DimProduct if it exists to maintain consistency
            if "DimProduct" in dfs:
                # Map prices
                price_map = dict(zip(dfs["DimProduct"]["ProductKey"], dfs["DimProduct"]["ListPrice"]))
                fact_sales["UnitPrice"] = fact_sales["ProductKey"].map(price_map)
            else:
                fact_sales["UnitPrice"] = np.round(np.random.uniform(10, 100, n_sales), 2)
                
            fact_sales["SalesAmount"] = fact_sales["OrderQuantity"] * fact_sales["UnitPrice"]
            dfs["FactSales"] = fact_sales
            
        return dfs
