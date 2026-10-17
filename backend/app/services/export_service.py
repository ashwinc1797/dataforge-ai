import pandas as pd
from typing import Dict, Optional
import os
import sqlite3
from io import BytesIO, StringIO
import zipfile


class ExportService:
    @staticmethod
    def export_csv(dfs: Dict[str, pd.DataFrame]) -> BytesIO:
        buffer = BytesIO()
        if len(dfs) == 1:
            # Single file
            df = list(dfs.values())[0]
            buffer.write(df.to_csv(index=False).encode('utf-8'))
        else:
            # Multiple files -> ZIP
            with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
                for name, df in dfs.items():
                    csv_str = df.to_csv(index=False)
                    zf.writestr(f"{name}.csv", csv_str)
        buffer.seek(0)
        return buffer

    @staticmethod
    def export_excel(dfs: Dict[str, pd.DataFrame]) -> BytesIO:
        buffer = BytesIO()
        with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
            for name, df in dfs.items():
                # Sheet names can't exceed 31 chars
                safe_name = name[:31]
                df.to_excel(writer, sheet_name=safe_name, index=False)
        buffer.seek(0)
        return buffer

    @staticmethod
    def export_json(dfs: Dict[str, pd.DataFrame]) -> BytesIO:
        buffer = BytesIO()
        if len(dfs) == 1:
            df = list(dfs.values())[0]
            buffer.write(df.to_json(orient='records', date_format='iso').encode('utf-8'))
        else:
            with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
                for name, df in dfs.items():
                    json_str = df.to_json(orient='records', date_format='iso')
                    zf.writestr(f"{name}.json", json_str)
        buffer.seek(0)
        return buffer

    @staticmethod
    def export_parquet(dfs: Dict[str, pd.DataFrame]) -> BytesIO:
        buffer = BytesIO()
        if len(dfs) == 1:
            df = list(dfs.values())[0]
            df.to_parquet(buffer, engine='pyarrow', index=False)
        else:
            with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
                for name, df in dfs.items():
                    pq_buffer = BytesIO()
                    df.to_parquet(pq_buffer, engine='pyarrow', index=False)
                    zf.writestr(f"{name}.parquet", pq_buffer.getvalue())
        buffer.seek(0)
        return buffer

    @staticmethod
    def export_sql(dfs: Dict[str, pd.DataFrame]) -> BytesIO:
        buffer = BytesIO()
        sql_content = StringIO()
        
        for name, df in dfs.items():
            # Basic CREATE TABLE
            sql_content.write(f"-- Table: {name}\n")
            sql_content.write(f"CREATE TABLE {name} (\n")
            
            col_defs = []
            for col in df.columns:
                dtype = df[col].dtype
                if pd.api.types.is_integer_dtype(dtype):
                    sql_type = "INT"
                elif pd.api.types.is_float_dtype(dtype):
                    sql_type = "FLOAT"
                elif pd.api.types.is_bool_dtype(dtype):
                    sql_type = "BOOLEAN"
                elif pd.api.types.is_datetime64_any_dtype(dtype):
                    sql_type = "TIMESTAMP"
                else:
                    sql_type = "VARCHAR(255)"
                    
                col_defs.append(f"    {col} {sql_type}")
                
            sql_content.write(",\n".join(col_defs))
            sql_content.write("\n);\n\n")
            
            # INSERT statements
            sql_content.write(f"-- Data for {name}\n")
            for _, row in df.iterrows():
                vals = []
                for val in row:
                    if pd.isna(val):
                        vals.append("NULL")
                    elif isinstance(val, (int, float, bool)):
                        vals.append(str(val))
                    else:
                        # Escape quotes
                        safe_val = str(val).replace("'", "''")
                        vals.append(f"'{safe_val}'")
                        
                sql_content.write(f"INSERT INTO {name} VALUES ({', '.join(vals)});\n")
            sql_content.write("\n")
            
        buffer.write(sql_content.getvalue().encode('utf-8'))
        buffer.seek(0)
        return buffer

    @staticmethod
    def export_sqlite(dfs: Dict[str, pd.DataFrame]) -> BytesIO:
        # Create a temporary file since sqlite needs a real path to work easily
        import tempfile
        fd, path = tempfile.mkstemp(suffix='.db')
        os.close(fd)
        
        try:
            conn = sqlite3.connect(path)
            for name, df in dfs.items():
                # Store object types as strings
                df_to_sql = df.copy()
                for col in df_to_sql.columns:
                    if df_to_sql[col].dtype == 'object':
                        df_to_sql[col] = df_to_sql[col].astype(str)
                df_to_sql.to_sql(name, conn, if_exists='replace', index=False)
            conn.close()
            
            with open(path, 'rb') as f:
                buffer = BytesIO(f.read())
            return buffer
        finally:
            if os.path.exists(path):
                os.remove(path)
