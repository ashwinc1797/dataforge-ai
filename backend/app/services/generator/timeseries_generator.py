import pandas as pd
import numpy as np
from typing import Dict
from app.schemas.dataset import TimeSeriesConfig
from app.services.generator.dirty_data import inject_dirty_data

class TimeSeriesGenerator:
    def __init__(self, config: TimeSeriesConfig, dirty_percentage: float = 0.0):
        self.config = config
        self.dirty_percentage = dirty_percentage

    def generate(self) -> Dict[str, pd.DataFrame]:
        # Generate Date Range
        dates = pd.date_range(
            start=self.config.start_date, 
            periods=self.config.periods, 
            freq=self.config.frequency
        )
        
        n = self.config.periods
        t = np.arange(n)
        
        # Base value
        base = 100.0
        
        # Trend
        if self.config.trend == "up":
            trend_component = t * 0.5
        elif self.config.trend == "down":
            trend_component = -t * 0.5
        else:
            trend_component = np.zeros(n)
            
        # Seasonality
        if self.config.seasonality:
            # Assume annual seasonality (rough approximation based on freq)
            if self.config.frequency == "D":
                period_len = 365.25
            elif self.config.frequency == "W":
                period_len = 52
            elif self.config.frequency == "M":
                period_len = 12
            elif self.config.frequency == "H":
                period_len = 24
            else:
                period_len = 10 # generic
                
            seasonal_component = 20 * np.sin(2 * np.pi * t / period_len)
        else:
            seasonal_component = np.zeros(n)
            
        # Noise
        noise_component = np.random.normal(0, 5 * self.config.noise_level, n)
        
        # Combine
        values = base + trend_component + seasonal_component + noise_component
        
        # Ensure non-negative if it makes sense for metric (most metrics are >= 0)
        values = np.clip(values, 0, None)
        
        df = pd.DataFrame({
            "Timestamp": dates,
            self.config.metric_name: values
        })
        
        if self.dirty_percentage > 0:
            df = inject_dirty_data(df, self.dirty_percentage)
            
        return {"TimeSeriesData": df}
