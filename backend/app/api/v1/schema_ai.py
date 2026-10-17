from fastapi import APIRouter, HTTPException
import litellm
import json

from app.schemas.dataset import AISchemaRequest, GeneratedSchemaResponse

router = APIRouter()

@router.post("/generate", response_model=GeneratedSchemaResponse)
async def generate_schema_from_prompt(request: AISchemaRequest):
    if not request.api_key:
        raise HTTPException(status_code=400, detail="API key is required.")
        
    schema_definition = GeneratedSchemaResponse.model_json_schema()
    
    system_prompt = f"""
You are an expert database architect.
Generate a relational database schema based on the user's request.
You MUST return ONLY a valid JSON object. Do not include markdown formatting like ```json.

The JSON object MUST perfectly validate against this JSON Schema:
{json.dumps(schema_definition, indent=2)}

Guidelines:
1. Categorize tables as 'Dimension', 'Fact', or 'Bridge'.
2. Ensure each table has a primary key (pk=true).
3. Ensure relationships correctly link a source table to a target table using their specific columns.
4. The 'sourceHandle' property MUST be exact format: '<ColumnName>-source'
5. The 'targetHandle' property MUST be exact format: '<ColumnName>-target'
6. For datatypes, use standard SQL types like VARCHAR(255), INT, DECIMAL(10,2), UUID, DATETIME, DATE.
7. Return exactly 3 to 6 tables unless the user requests otherwise.
"""
    
    model_mapping = {
        "openai": "gpt-4o-mini",
        "anthropic": "anthropic/claude-3-5-sonnet-20240620",
        "google": "gemini/gemini-1.5-flash",
        "grok": "xai/grok-beta",
        "groq": "groq/llama3-70b-8192"
    }
    
    model_name = model_mapping.get(request.provider, "gpt-4o-mini")
    
    try:
        completion_args = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.prompt}
            ],
            "api_key": request.api_key,
            "temperature": 0.7
        }
        
        if request.provider == "openai":
            completion_args["response_format"] = {"type": "json_object"}

        response = await litellm.acompletion(**completion_args)
        
        result_json = response.choices[0].message.content.strip()
        if result_json.startswith("```json"):
            result_json = result_json[7:]
        elif result_json.startswith("```"):
            result_json = result_json[3:]
        if result_json.endswith("```"):
            result_json = result_json[:-3]
        result_json = result_json.strip()
        
        return GeneratedSchemaResponse.model_validate_json(result_json)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
