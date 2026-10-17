import pandas as pd
import numpy as np
from typing import Dict, Any
from faker import Faker
import uuid

from app.schemas.dataset import MLDatasetConfig, MLTaskType, MLScenario
from app.services.generator.region_data import get_locale_for_region, get_currency_for_region
from app.services.generator.dirty_data import inject_dirty_data

class MLGenerator:
    def __init__(self, config: MLDatasetConfig):
        self.config = config
        self.locale = get_locale_for_region(config.region)
        self.faker = Faker(self.locale)
        self.currency = get_currency_for_region(config.region)

    def _generate_churn_dataset(self) -> pd.DataFrame:
        n = self.config.row_count
        data = {
            "CustomerID": [str(uuid.uuid4()) for _ in range(n)],
            "Age": np.random.randint(18, 80, n),
            "Gender": np.random.choice(["Male", "Female"], n),
            "TenureMonths": np.random.randint(1, 72, n),
            "MonthlyCharges": np.round(np.random.uniform(20.0, 120.0, n), 2),
            "TotalCharges": np.zeros(n), # Calculated later
            "ContractType": np.random.choice(["Month-to-month", "One year", "Two year"], n, p=[0.5, 0.3, 0.2]),
            "InternetService": np.random.choice(["Fiber optic", "DSL", "No"], n, p=[0.4, 0.4, 0.2]),
            "TechSupport": np.random.choice(["Yes", "No", "No internet service"], n),
        }
        
        df = pd.DataFrame(data)
        df["TotalCharges"] = df["MonthlyCharges"] * df["TenureMonths"] + np.random.uniform(-50, 50, n)
        df["TotalCharges"] = np.round(df["TotalCharges"].clip(lower=0), 2)
        
        # Determine churn based on some logic to introduce feature importance
        churn_prob = np.zeros(n)
        churn_prob += np.where(df["ContractType"] == "Month-to-month", 0.3, 0.0)
        churn_prob += np.where(df["TenureMonths"] < 12, 0.2, 0.0)
        churn_prob += np.where(df["MonthlyCharges"] > 80, 0.1, 0.0)
        churn_prob += np.where(df["TechSupport"] == "No", 0.15, 0.0)
        
        # Add random noise
        churn_prob += np.random.uniform(0, 0.2, n)
        churn_prob = np.clip(churn_prob, 0, 1)
        
        df["Churn"] = np.where(churn_prob > 0.5, "Yes", "No")
        return df

    def _generate_house_price_dataset(self) -> pd.DataFrame:
        n = self.config.row_count
        data = {
            "HouseID": [str(uuid.uuid4()) for _ in range(n)],
            "SquareFeet": np.random.randint(800, 5000, n),
            "Bedrooms": np.random.randint(1, 6, n),
            "Bathrooms": np.random.choice([1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0], n),
            "YearBuilt": np.random.randint(1950, 2024, n),
            "LotSizeAcres": np.round(np.random.uniform(0.1, 5.0, n), 2),
            "NeighborhoodRating": np.random.randint(1, 11, n),
            "DistanceToCityCenterKm": np.round(np.random.uniform(1.0, 50.0, n), 1),
        }
        df = pd.DataFrame(data)
        
        # Calculate price based on features
        base_price = 100000
        price = base_price + (df["SquareFeet"] * 150) + (df["NeighborhoodRating"] * 20000)
        price += (df["Bedrooms"] * 10000) + (df["Bathrooms"] * 15000)
        price -= (df["DistanceToCityCenterKm"] * 2000)
        price += (df["YearBuilt"] - 1950) * 1000
        
        # Add noise
        noise = np.random.normal(0, 50000, n)
        price += noise
        
        df["Price"] = np.round(price.clip(lower=50000), 2)
        return df

    def _generate_customer_segmentation(self) -> pd.DataFrame:
        n = self.config.row_count
        
        # Create 3 distinct clusters implicitly
        cluster_assignment = np.random.randint(0, 3, n)
        
        income = np.zeros(n)
        spending_score = np.zeros(n)
        age = np.zeros(n)
        
        for i in range(n):
            if cluster_assignment[i] == 0: # Young, low income, high spend
                age[i] = np.random.randint(18, 30)
                income[i] = np.random.randint(20000, 40000)
                spending_score[i] = np.random.randint(70, 100)
            elif cluster_assignment[i] == 1: # Middle age, high income, high spend
                age[i] = np.random.randint(30, 50)
                income[i] = np.random.randint(80000, 150000)
                spending_score[i] = np.random.randint(60, 95)
            else: # Older, mixed income, low spend
                age[i] = np.random.randint(50, 80)
                income[i] = np.random.randint(30000, 100000)
                spending_score[i] = np.random.randint(10, 40)
                
        data = {
            "CustomerID": [str(uuid.uuid4()) for _ in range(n)],
            "Age": age.astype(int),
            "AnnualIncome": income,
            "SpendingScore": spending_score.astype(int),
            "Profession": [self.faker.job() for _ in range(n)],
            "FamilySize": np.random.randint(1, 6, n)
        }
        
        return pd.DataFrame(data)

    def generate(self) -> Dict[str, pd.DataFrame]:
        df = None
        
        if self.config.scenario == MLScenario.customer_churn:
            df = self._generate_churn_dataset()
        elif self.config.scenario == MLScenario.house_price:
            df = self._generate_house_price_dataset()
        elif self.config.scenario == MLScenario.customer_segmentation:
            df = self._generate_customer_segmentation()
        else:
            # Fallback generic generator
            df = self._generate_generic_dataset()
            
        if self.config.column_count and len(df.columns) < self.config.column_count:
            num_to_add = self.config.column_count - len(df.columns)
            for i in range(num_to_add):
                df[f"ExtraFeature_{i+1}"] = np.random.normal(0, 1, len(df))
                
        if self.config.dirty_percentage > 0:
            df = inject_dirty_data(df, self.config.dirty_percentage)
            
        # Naming the table based on scenario
        table_name = str(self.config.scenario.value).replace(" ", "")
        return {table_name: df}

    def _generate_generic_dataset(self) -> pd.DataFrame:
        n = self.config.row_count
        data = {
            "ID": [str(uuid.uuid4()) for _ in range(n)],
            "Feature1": np.random.normal(0, 1, n),
            "Feature2": np.random.uniform(10, 100, n),
            "Feature3": np.random.choice(["A", "B", "C"], n),
        }
        
        if self.config.task_type == MLTaskType.classification:
            data["Target"] = np.where(data["Feature1"] > 0, 1, 0)
        elif self.config.task_type == MLTaskType.regression:
            data["Target"] = data["Feature1"] * 10 + data["Feature2"] * 0.5 + np.random.normal(0, 2, n)
            
        return pd.DataFrame(data)
