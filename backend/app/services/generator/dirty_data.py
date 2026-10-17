import pandas as pd
import numpy as np
import random
from typing import List

def introduce_missing_values(df: pd.DataFrame, percentage: float, columns: List[str] = None):
    if percentage <= 0 or df.empty:
        return df
    
    cols_to_affect = columns if columns else df.columns.tolist()
    if not cols_to_affect:
        return df
        
    num_rows = len(df)
    missing_indicators = [None, np.nan, ""]
    
    for col in cols_to_affect:
        num_missing = int(num_rows * (percentage / 100.0))
        if num_missing > 0:
            indices = np.random.choice(num_rows, size=num_missing, replace=False)
            df.loc[indices, col] = np.random.choice(missing_indicators, size=num_missing)
            
    return df

def introduce_duplicates(df: pd.DataFrame, percentage: float):
    if percentage <= 0 or df.empty:
        return df
        
    dup_count = int(len(df) * (percentage / 100.0))
    if dup_count == 0:
        return df
        
    rows_to_duplicate = df.sample(n=dup_count, replace=True)
    return pd.concat([df, rows_to_duplicate], ignore_index=True)

def introduce_typos(df: pd.DataFrame, percentage: float, columns: List[str]):
    if percentage <= 0 or not columns or df.empty:
        return df
        
    # Apply to a fraction of rows for typos
    for col in columns:
        if df[col].dtype != 'object':
            continue
            
        num_typos = int(len(df) * (percentage / 100.0) * 0.5)
        if num_typos == 0:
            continue
            
        indices = np.random.choice(len(df), size=num_typos, replace=False)
        
        # We can't perfectly vectorize string permutations without custom apply, but we can do it efficiently
        # Since string manipulation is complex, we use apply only on the selected indices (which is much faster than full loop)
        def add_typo(val):
            val = str(val)
            if len(val) > 3 and val not in ["None", "nan", ""]:
                if random.choice([True, False]):
                    idx = random.randint(0, len(val) - 2)
                    return val[:idx] + val[idx+1] + val[idx] + val[idx+2:]
                else:
                    idx = random.randint(0, len(val) - 1)
                    return val[:idx] + random.choice(['#', '@', '$', '!', '?']) + val[idx+1:]
            return val
            
        # Extract subset, apply typo, and reassign
        df.loc[indices, col] = df.loc[indices, col].apply(add_typo)
                
    return df

def introduce_outliers(df: pd.DataFrame, percentage: float, numeric_columns: List[str]):
    if percentage <= 0 or not numeric_columns or df.empty:
        return df
        
    for col in numeric_columns:
        if not pd.api.types.is_numeric_dtype(df[col]):
            continue
            
        num_outliers = int(len(df) * (percentage / 100.0) * 0.2)
        if num_outliers == 0:
            continue
            
        indices = np.random.choice(len(df), size=num_outliers, replace=False)
        
        col_mean = df[col].mean()
        col_std = df[col].std()
        
        if pd.isna(col_std) or col_std == 0:
            col_std = col_mean * 0.1 if col_mean != 0 else 100
            
        # Vectorized outlier generation
        multipliers = np.random.uniform(5, 10, size=num_outliers) * np.random.choice([1, -1], size=num_outliers)
        outlier_values = col_mean + (multipliers * col_std)
        df.loc[indices, col] = outlier_values
            
    return df

def introduce_invalid_emails(df: pd.DataFrame, percentage: float, email_columns: List[str]):
    if percentage <= 0 or not email_columns or df.empty:
        return df
        
    invalid_patterns = ["@gmail", "user@.com", "user@domain", "user@domain..com"]
    
    for col in email_columns:
        num_invalid = int(len(df) * (percentage / 100.0))
        if num_invalid == 0:
            continue
            
        indices = np.random.choice(len(df), size=num_invalid, replace=False)
        
        def break_email(val):
            val = str(val)
            if "@" in val:
                return val.split("@")[0] + random.choice(invalid_patterns)
            return val
            
        df.loc[indices, col] = df.loc[indices, col].apply(break_email)
                
    return df

def introduce_date_format_issues(df: pd.DataFrame, percentage: float, date_columns: List[str]):
    if percentage <= 0 or not date_columns or df.empty:
        return df
        
    formats = ["%d-%m-%Y", "%Y/%m/%d", "%b %d %Y"]
    
    for col in date_columns:
        num_issues = int(len(df) * (percentage / 100.0))
        if num_issues == 0:
            continue
            
        indices = np.random.choice(len(df), size=num_issues, replace=False)
        
        def break_date(val):
            if pd.notna(val) and val != "":
                try:
                    dt = pd.to_datetime(val)
                    return dt.strftime(random.choice(formats))
                except:
                    pass
            return val
            
        df.loc[indices, col] = df.loc[indices, col].apply(break_date)
                    
    return df

def inject_dirty_data(df: pd.DataFrame, percentage: float, config: List[dict] = None) -> pd.DataFrame:
    if percentage <= 0 or df.empty:
        return df
        
    df_dirty = df.copy()
    
    numeric_cols = df_dirty.select_dtypes(include=[np.number]).columns.tolist()
    string_cols = df_dirty.select_dtypes(include=['object', 'string']).columns.tolist()
    
    email_cols = [c for c in string_cols if 'email' in c.lower()]
    date_cols = [c for c in df_dirty.columns if 'date' in c.lower() or 'time' in c.lower()]
    
    df_dirty = introduce_missing_values(df_dirty, percentage)
    df_dirty = introduce_duplicates(df_dirty, percentage * 0.5)
    df_dirty = introduce_typos(df_dirty, percentage, string_cols)
    df_dirty = introduce_outliers(df_dirty, percentage, numeric_cols)
    df_dirty = introduce_invalid_emails(df_dirty, percentage, email_cols)
    df_dirty = introduce_date_format_issues(df_dirty, percentage, date_cols)
    
    # Fast shuffle
    df_dirty = df_dirty.sample(frac=1).reset_index(drop=True)
    
    return df_dirty
