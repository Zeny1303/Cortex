from typing import List

class AIEngine:
    def __init__(self):
        # We would initialize OpenAI/Gemini clients here
        pass

    async def generate_response(self, transcript: List[dict]) -> str:
        """
        Receives the entire conversation history and returns the AI response.
        """
        # Mocking the AI response for now
        last_message = ""
        for msg in reversed(transcript):
            if msg["role"] == "user":
                last_message = msg["content"]
                break
                
        if "hello" in last_message.lower() or "hi" in last_message.lower():
            return "Hello! I am ready to begin your technical interview. Let's start with a simple coding problem."
            
        return "That's an interesting approach. Could you implement it in the code editor so we can see how it works?"
        
ai_engine = AIEngine()
