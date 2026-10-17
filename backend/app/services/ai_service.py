import re
from typing import Dict, Any

from app.schemas.dataset import DatasetConfig, Domain, Region, TableConfig

class AIService:
    @staticmethod
    def parse_prompt(prompt: str) -> DatasetConfig:
        """
        Parses a natural language prompt into a DatasetConfig.
        Uses rule-based NLP as a baseline to avoid requiring API keys immediately.
        Can be extended to call OpenAI/Gemini if API keys are provided.
        """
        prompt_lower = prompt.lower()
        
        # 1. Extract Domain
        domain = Domain.retail # Default
        for d in Domain:
            if d.value.lower() in prompt_lower:
                domain = d
                break
                
        # 2. Extract Region
        region = Region.usa # Default
        for r in Region:
            if r.value.lower() in prompt_lower:
                region = r
                break
                
        # 3. Extract Row Count
        row_count = 1000
        # Look for numbers near "rows" or "records"
        match = re.search(r'(\d+)[kK]?\s*(rows|records|lines|data points)', prompt_lower)
        if match:
            num_str = match.group(1)
            # handle 'k' suffix roughly
            if 'k' in match.group(0):
                row_count = int(num_str) * 1000
            else:
                row_count = int(num_str)
        else:
            # Just look for any large number
            match = re.search(r'\b(\d{3,7})\b', prompt_lower)
            if match:
                 row_count = int(match.group(1))
                 
        # Bound row count
        row_count = max(100, min(100000, row_count))
                 
        # 4. Extract Dirty Data Percentage
        dirty_pct = 0.0
        match = re.search(r'(\d+)%\s*(dirty|messy|noise|errors)', prompt_lower)
        if match:
            dirty_pct = float(match.group(1))
            
        # 5. Extract specific tables if mentioned
        # Very basic implementation: just checking against common table names for the domain
        # In a real NLP approach, we'd use SpaCy or an LLM to extract entities.
        tables = []
        common_tables = ["customers", "orders", "products", "users", "employees", "transactions", "stores"]
        found_tables = [t.capitalize() for t in common_tables if t in prompt_lower]
        
        for t in found_tables:
            tables.append(TableConfig(name=t, include=True))
            
        return DatasetConfig(
            domain=domain,
            region=region,
            row_count=row_count,
            dirty_percentage=dirty_pct,
            tables=tables,
            include_all_tables=len(tables) == 0, # If no specific tables mentioned, include all default for domain
            job_name=f"AI Generated {domain.value} Dataset"
        )
