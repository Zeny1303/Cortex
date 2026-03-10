import os
import json
import logging
from typing import List, Dict, Any
from groq import AsyncGroq
from app.config.settings import settings

logger = logging.getLogger(__name__)

async def _get_groq_client() -> AsyncGroq:
    # Use GROQ_API_KEY per user request
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        logger.error("GROQ_API_KEY environment variable is not set.")
        raise ValueError("GROQ_API_KEY is missing from the environment")
    return AsyncGroq(api_key=api_key)

async def generate_intro() -> str:
    """Returns greeting for interview start."""
    try:
        client = await _get_groq_client()
        system_prompt = (
            "You are an expert technical interviewer. "
            "Generate a brief, welcoming, and professional introductory greeting "
            "to start a software engineering mock interview. Keep it under 2 sentences."
        )
        model = settings.AI_MODEL if hasattr(settings, 'AI_MODEL') else "llama3-8b-8192"
        response = await client.chat.completions.create(
            messages=[{"role": "system", "content": system_prompt}],
            model=model,
            temperature=0.7,
            max_tokens=100
        )
        if response.choices and response.choices[0].message.content:
            return response.choices[0].message.content.strip()
        return "Hello! I am your AI interviewer today. Let's get started with your mock interview."
    except Exception as e:
        logger.error(f"Error generating intro: {e}", exc_info=True)
        return "Hello! I am your AI interviewer today. Let's get started with your mock interview."


async def ask_followup(question: str, candidate_answer: str, conversation_history: List[Dict[str, str]]) -> str:
    """Generate next interviewer question."""
    try:
        client = await _get_groq_client()
        
        history_text = "\n".join(
            [f"Interviewer: {turn.get('question', '')}\nCandidate: {turn.get('answer', '')}" for turn in conversation_history]
        )
        
        system_prompt = (
            "You are a senior software engineer conducting a coding interview. "
            "Based on the original question, the candidate's latest answer, and the conversation history, "
            "ask a single, short professional follow-up question. "
            "Focus on: approach clarity, time complexity, edge cases, and optimization. "
            "Do not provide feedback; solely focus on asking the next question."
        )
        
        user_prompt = (
            f"Conversation History:\n{history_text}\n\n"
            f"Current Question: {question}\n"
            f"Candidate's Answer: {candidate_answer}"
        )

        model = settings.AI_MODEL if hasattr(settings, 'AI_MODEL') else "llama3-8b-8192"
        response = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model=model,
            temperature=0.7,
            max_tokens=150
        )
        if response.choices and response.choices[0].message.content:
            return response.choices[0].message.content.strip()
        return "Could you elaborate more on your previous point?"
    except Exception as e:
        logger.error(f"Error generating follow-up question: {e}", exc_info=True)
        return "Could you elaborate more on your previous point?"


async def evaluate_answer(question: str, candidate_answer: str) -> str:
    """Return reasoning feedback."""
    try:
        client = await _get_groq_client()
        
        system_prompt = (
            "You are an expert technical interviewer evaluating a candidate's answer. "
            "Provide constructive feedback, highlighting what was done well and what "
            "could be improved. Explain the reasoning clearly and concisely."
        )
        
        user_prompt = (
            f"Question: {question}\n"
            f"Answer: {candidate_answer}"
        )

        model = settings.AI_MODEL if hasattr(settings, 'AI_MODEL') else "llama3-8b-8192"
        response = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model=model,
            temperature=0.3,
            max_tokens=300
        )
        if response.choices and response.choices[0].message.content:
            return response.choices[0].message.content.strip()
        return "I was unable to fully evaluate that answer at the moment."
    except Exception as e:
        logger.error(f"Error evaluating answer: {e}", exc_info=True)
        return "I was unable to fully evaluate that answer at the moment."


async def generate_final_report(conversation_history: List[Dict[str, str]], test_results: Dict[str, Any]) -> Dict[str, Any]:
    """Return structured report: strengths, weaknesses, score, recommendation."""
    raw_output = ""
    try:
        client = await _get_groq_client()
        
        history_text = "\n".join(
            [f"Q: {turn.get('question', '')}\nA: {turn.get('answer', '')}" for turn in conversation_history]
        )
        
        system_prompt = (
            "You are an expert technical interviewer generating a final assessment report. "
            "Analyze the conversation history and test results provided. "
            "Return a strictly valid JSON object with the following schema:\n"
            "{\n"
            '  "strengths": ["list of strings"],\n'
            '  "weaknesses": ["list of strings"],\n'
            '  "score": integer out of 100,\n'
            '  "recommendation": "A short summary paragraph"\n'
            "}\n"
            "Do not output markdown code blocks (like ```json), just the raw JSON."
        )
        
        user_prompt = (
            f"Conversation History:\n{history_text}\n\n"
            f"Test Results:\n{json.dumps(test_results)}\n"
        )

        model = settings.AI_MODEL if hasattr(settings, 'AI_MODEL') else "llama3-8b-8192"
        response = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model=model,
            temperature=0.2, # Low temperature for more structured JSON output
            max_tokens=600,
            response_format={"type": "json_object"}
        )
        
        if response.choices and response.choices[0].message.content:
            raw_output = response.choices[0].message.content.strip()
            return json.loads(raw_output)
        else:
            return _fallback_report()
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse final report JSON: {e}\nRaw Output: {raw_output}")
        return _fallback_report()
    except Exception as e:
        logger.error(f"Error generating final report: {e}", exc_info=True)
        return _fallback_report()


def _fallback_report() -> Dict[str, Any]:
    return {
        "strengths": ["Attempted the interview prompts."],
        "weaknesses": ["Unable to process detailed metrics due to service error."],
        "score": 0,
        "recommendation": "Incomplete evaluation. Please review the raw transcript."
    }
