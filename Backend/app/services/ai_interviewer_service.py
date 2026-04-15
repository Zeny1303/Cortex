"""
ai_interviewer_service.py

All Groq LLM calls for the voice interview pipeline.

Changes vs original
-------------------
* ask_followup  — history now includes the AI's own previous responses
  (ai_response field), giving the model full conversational context.
* System prompts tightened for concise spoken-word responses (no markdown,
  no bullet points — output is read aloud by Polly).
* _build_history_text() is a shared helper so every function formats history
  consistently.
* Groq client is created once per function call but the async context is
  light enough that this is fine; swap for a module-level singleton if you
  measure contention.
"""

import json
import logging
from typing import Any, Dict, List

from groq import AsyncGroq

from app.config.settings import settings

logger = logging.getLogger(__name__)

# ── Model selection ───────────────────────────────────────────────────────────

def _model() -> str:
    return getattr(settings, "AI_MODEL", None) or "llama3-8b-8192"


# ── Groq client factory ───────────────────────────────────────────────────────

async def _get_groq_client() -> AsyncGroq:
    api_key = settings.GROQ_API_KEY
    if not api_key:
        logger.error("GROQ_API_KEY is not set.")
        raise ValueError("GROQ_API_KEY missing from environment")
    return AsyncGroq(api_key=api_key)


# ── Shared history formatter ──────────────────────────────────────────────────

def _build_history_text(conversation_history: List[Dict[str, str]]) -> str:
    """
    Render full conversation history as a readable transcript.

    Each turn stores:
        { "question": str, "answer": str, "ai_response": str }

    We include all three fields so the model has complete context of what it
    already asked, what the candidate answered, and what it said next.
    """
    lines = []
    for turn in conversation_history:
        q = turn.get("question", "").strip()
        a = turn.get("answer", "").strip()
        r = turn.get("ai_response", "").strip()
        if q:
            lines.append(f"Interviewer: {q}")
        if a:
            lines.append(f"Candidate:   {a}")
        if r:
            lines.append(f"Interviewer: {r}")
    return "\n".join(lines)


# ── Public API ────────────────────────────────────────────────────────────────

async def generate_intro() -> str:
    """
    Generate a short, spoken welcome message to kick off the interview.
    Kept under 2 sentences so Polly can synthesise it quickly.
    """
    system_prompt = (
        "You are a professional technical interviewer starting a mock software "
        "engineering interview over voice. Generate a warm, concise greeting — "
        "maximum two sentences. Do NOT use markdown, bullet points, or lists. "
        "Your output will be read aloud, so write naturally spoken English only."
    )
    try:
        client = await _get_groq_client()
        resp = await client.chat.completions.create(
            model=_model(),
            messages=[{"role": "system", "content": system_prompt}],
            temperature=0.7,
            max_tokens=80,
        )
        text = resp.choices[0].message.content.strip() if resp.choices else ""
        return text or "Welcome to your mock interview. I'm your AI interviewer — let's get started."
    except Exception as exc:
        logger.error("[AI] generate_intro failed: %s", exc, exc_info=True)
        return "Welcome to your mock interview. I'm your AI interviewer — let's get started."


async def ask_followup(
    question: str,
    candidate_answer: str,
    conversation_history: List[Dict[str, str]],
) -> str:
    """
    Given what the candidate just said, generate the interviewer's next spoken
    response.  This may be a follow-up question, a probe for clarification, or
    a pivot to a new topic — whatever a real interviewer would say next.

    Args:
        question:             The question that was on the table for this turn.
        candidate_answer:     What the candidate said (STT transcript).
        conversation_history: All previous turns (question / answer / ai_response).

    Returns:
        A short, spoken-word response — typically one or two sentences.
    """
    system_prompt = (
        "You are a senior software engineer conducting a real-time voice technical interview. "
        "Your role is to guide the candidate naturally through the problem space.\n\n"
        "Rules:\n"
        "- Respond with exactly ONE question or short acknowledgement + question.\n"
        "- Maximum 2 sentences. This is voice — be concise.\n"
        "- Do NOT use markdown, bullet points, numbered lists, or code blocks.\n"
        "- Do NOT repeat what the candidate said back to them verbatim.\n"
        "- Probe for: approach clarity, time/space complexity, edge cases, trade-offs, "
        "or ask them to explain a specific part of their answer.\n"
        "- If the candidate is on the right track, acknowledge briefly and deepen.\n"
        "- If the candidate seems lost, ask a guiding question — do not give the answer."
    )

    history_text = _build_history_text(conversation_history)

    user_prompt = (
        f"Conversation so far:\n{history_text}\n\n"
        f"Current question on the table: {question}\n"
        f"Candidate just said: {candidate_answer}\n\n"
        "What do you say next as the interviewer? (spoken English only, 1-2 sentences)"
    )

    try:
        client = await _get_groq_client()
        resp = await client.chat.completions.create(
            model=_model(),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.65,
            max_tokens=120,
        )
        text = resp.choices[0].message.content.strip() if resp.choices else ""
        return text or "Could you walk me through your reasoning on that last point?"
    except Exception as exc:
        logger.error("[AI] ask_followup failed: %s", exc, exc_info=True)
        return "Could you walk me through your reasoning on that last point?"


async def evaluate_answer(question: str, candidate_answer: str) -> str:
    """
    Return constructive spoken feedback on a single answer.
    Used at the end of each coding question before moving on.
    """
    system_prompt = (
        "You are an expert technical interviewer giving brief verbal feedback. "
        "Highlight one strength and one area for improvement. "
        "Keep it under 3 sentences. No markdown, no lists — spoken English only."
    )
    user_prompt = f"Question: {question}\nCandidate answer: {candidate_answer}"

    try:
        client = await _get_groq_client()
        resp = await client.chat.completions.create(
            model=_model(),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=200,
        )
        text = resp.choices[0].message.content.strip() if resp.choices else ""
        return text or "Good effort on that one. Let's keep moving."
    except Exception as exc:
        logger.error("[AI] evaluate_answer failed: %s", exc, exc_info=True)
        return "Good effort on that one. Let's keep moving."


async def generate_final_report(
    conversation_history: List[Dict[str, str]],
    test_results: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Produce a structured JSON assessment report at the end of the session.

    Returns a dict with keys: strengths, weaknesses, score, recommendation.
    """
    system_prompt = (
        "You are an expert technical interviewer generating a final assessment. "
        "Analyse the full conversation and test results then return ONLY a valid JSON "
        "object — no markdown, no code fences — matching this exact schema:\n"
        '{"strengths": ["..."], "weaknesses": ["..."], "score": <int 0-100>, '
        '"recommendation": "..."}'
    )

    history_text = _build_history_text(conversation_history)
    user_prompt = (
        f"Full conversation transcript:\n{history_text}\n\n"
        f"Code test results: {json.dumps(test_results)}"
    )

    raw_output = ""
    try:
        client = await _get_groq_client()
        resp = await client.chat.completions.create(
            model=_model(),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            max_tokens=600,
            response_format={"type": "json_object"},
        )
        if resp.choices:
            raw_output = resp.choices[0].message.content.strip()
            return json.loads(raw_output)
        return _fallback_report()
    except json.JSONDecodeError as exc:
        logger.error("[AI] Final report JSON parse failed: %s\nRaw: %s", exc, raw_output)
        return _fallback_report()
    except Exception as exc:
        logger.error("[AI] generate_final_report failed: %s", exc, exc_info=True)
        return _fallback_report()


def _fallback_report() -> Dict[str, Any]:
    return {
        "strengths": ["Completed the interview session."],
        "weaknesses": ["Unable to generate detailed metrics due to a service error."],
        "score": 0,
        "recommendation": "Evaluation incomplete. Please review the raw transcript manually.",
    }