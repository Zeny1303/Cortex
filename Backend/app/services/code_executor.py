import asyncio

class CodeExecutor:
    def __init__(self):
        pass

    async def execute(self, language: str, code: str) -> dict:
        """
        Executes code safely. In production this should use Docker/isolate.
        """
        # Mocked execution for safety
        await asyncio.sleep(0.5)

        if "SyntaxError" in code:
            return {
                "output": "",
                "error": "SyntaxError: invalid syntax",
                "execution_time_ms": 10.5
            }
            
        return {
            "output": f"Executed successfully in {language}\nTest Case 1: Passed\nTest Case 2: Passed",
            "error": None,
            "execution_time_ms": 45.2
        }

code_executor = CodeExecutor()
