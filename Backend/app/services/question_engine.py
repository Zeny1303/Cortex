class QuestionEngine:
    def __init__(self):
        pass

    async def generate_question(self, role: str, language: str) -> dict:
        """
        Generates an initial question based on the role and language.
        """
        # Mocked question output
        return {
            "title": "Two Sum",
            "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            "difficulty": "Easy",
            "language": language
        }

question_engine = QuestionEngine()
