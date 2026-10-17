import pandas as pd
import numpy as np
from typing import Dict, List, Any
from app.schemas.dataset import QualityReport


def calculate_quality(dfs: Dict[str, pd.DataFrame]) -> QualityReport:
    """
    Computes a data quality report for a set of generated DataFrames.
    """
    if not dfs:
        return QualityReport(
            total_rows=0,
            total_columns=0,
            missing_value_percentage=0.0,
            duplicate_row_percentage=0.0,
            outlier_percentage=0.0,
            date_format_issues=0,
            text_format_issues=0,
            invalid_email_count=0,
            quality_score=100.0,
            issues=[]
        )

    total_rows = 0
    total_cols = 0
    total_missing = 0
    total_cells = 0
    total_duplicates = 0
    total_outliers = 0
    total_numeric_cells = 0
    total_emails_checked = 0
    invalid_email_count = 0
    date_format_issues_count = 0
    text_format_issues_count = 0
    
    issues = []

    for name, df in dfs.items():
        rows, cols = df.shape
        total_rows += rows
        total_cols += cols
        
        cells_in_df = rows * cols
        total_cells += cells_in_df
        
        # Missing values
        missing_in_df = df.isna().sum().sum() + (df == "").sum().sum() + (df == "None").sum().sum()
        total_missing += missing_in_df
        if missing_in_df > 0:
            issues.append({"table": name, "issue": f"Contains {missing_in_df} missing values"})

        # Duplicates
        duplicates_in_df = df.duplicated().sum()
        total_duplicates += duplicates_in_df
        if duplicates_in_df > 0:
             issues.append({"table": name, "issue": f"Contains {duplicates_in_df} duplicate rows"})
             
        # Outliers (simple z-score approach on numeric cols)
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            col_cells = len(df[col])
            total_numeric_cells += col_cells
            
            if col_cells > 0:
                mean = df[col].mean()
                std = df[col].std()
                if pd.notna(std) and std > 0:
                    z_scores = np.abs((df[col] - mean) / std)
                    outliers = (z_scores > 3).sum()
                    total_outliers += outliers
                    if outliers > 0:
                        issues.append({"table": name, "column": col, "issue": f"Found {outliers} potential outliers"})

        # Invalid emails (basic check)
        string_cols = df.select_dtypes(include=['object', 'string']).columns
        email_cols = [c for c in string_cols if 'email' in c.lower()]
        for col in email_cols:
            col_cells = df[col].dropna().astype(str)
            total_emails_checked += len(col_cells)
            invalid = col_cells[~col_cells.str.contains(r'^[\w\.-]+@[\w\.-]+\.\w+$', regex=True)].count()
            invalid_email_count += invalid
            if invalid > 0:
                 issues.append({"table": name, "column": col, "issue": f"Found {invalid} invalid email addresses"})

        # Date format issues
        date_cols = [c for c in string_cols if 'date' in c.lower() or 'time' in c.lower()]
        for col in date_cols:
            col_cells = df[col].dropna().astype(str)
            invalid = col_cells[~col_cells.str.match(r'^\d{4}-\d{2}-\d{2}')].count()
            date_format_issues_count += invalid
            if invalid > 0:
                 issues.append({"table": name, "column": col, "issue": f"Found {invalid} non-standard date formats"})

        # Text format issues (typos / noise)
        text_cols = [c for c in string_cols if c not in email_cols and c not in date_cols]
        for col in text_cols:
            col_cells = df[col].dropna().astype(str)
            invalid = col_cells[col_cells.str.contains(r'[#@\$!\?]', regex=True)].count()
            text_format_issues_count += invalid
            if invalid > 0:
                 issues.append({"table": name, "column": col, "issue": f"Found {invalid} text formatting issues or typos"})


    # Calculate percentages
    missing_pct = (total_missing / total_cells * 100) if total_cells > 0 else 0
    duplicate_pct = (total_duplicates / total_rows * 100) if total_rows > 0 else 0
    outlier_pct = (total_outliers / total_numeric_cells * 100) if total_numeric_cells > 0 else 0
    
    # Base score is 100, deduct points for issues
    score = 100.0 - (missing_pct * 1.5) - (duplicate_pct * 2.0) - (outlier_pct * 1.0)
    
    if total_emails_checked > 0:
         email_error_rate = (invalid_email_count / total_emails_checked * 100)
         score -= email_error_rate
         
    # Deduct points for newly detected issues
    if date_format_issues_count > 0:
         score -= min(10.0, (date_format_issues_count / total_cells * 100))
    if text_format_issues_count > 0:
         score -= min(10.0, (text_format_issues_count / total_cells * 100))
         
    score = max(0.0, min(100.0, score)) # Clamp between 0 and 100
    
    return QualityReport(
        total_rows=total_rows,
        total_columns=total_cols,
        missing_value_percentage=round(missing_pct, 2),
        duplicate_row_percentage=round(duplicate_pct, 2),
        outlier_percentage=round(outlier_pct, 2),
        date_format_issues=int(date_format_issues_count),
        text_format_issues=int(text_format_issues_count),
        invalid_email_count=int(invalid_email_count),
        quality_score=round(score, 1),
        issues=issues
    )
