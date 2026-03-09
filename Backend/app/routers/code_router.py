from fastapi import APIRouter
from app.schemas.interview_schema import CodeExecutionRequest, CodeExecutionResponse
from app.services.code_executor import code_executor

router = APIRouter()

@router.post("/execute", response_model=CodeExecutionResponse)
async def execute_code(payload: CodeExecutionRequest):
    """
    Executes the submitted code snippet.
    """
    result = await code_executor.execute(language=payload.language, code=payload.code)
    
    return CodeExecutionResponse(
        output=result["output"],
        error=result["error"],
        execution_time_ms=result["execution_time_ms"]
    )
