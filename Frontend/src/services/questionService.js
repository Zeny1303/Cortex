/**
 * questionService.js
 * Handles all API calls to the /api/questions backend endpoints.
 */

import { API_URL } from '../config';

const BASE = `${API_URL}/api/questions`;

/**
 * Fetch random questions by difficulty.
 * @param {string} difficulty  "easy" | "medium" | "hard"
 * @param {number} count       Number of questions to fetch (1–20)
 * @returns {Promise<Array>}   Array of sanitized question objects
 */
export async function fetchRandomQuestions(difficulty = 'medium', count = 2) {
  const params = new URLSearchParams({ difficulty, count });
  const res = await fetch(`${BASE}/random?${params}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to fetch questions (${res.status})`);
  }

  return res.json();
}

/**
 * Fetch a single question by its _id.
 * @param {string} questionId   snake_case _id e.g. "two_sum"
 * @returns {Promise<Object>}   Sanitized question object
 */
export async function fetchQuestionById(questionId) {
  const res = await fetch(`${BASE}/${questionId}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Question not found (${res.status})`);
  }

  return res.json();
}

/**
 * Fetch the question list index (lightweight — no description/starter_code).
 * @param {string|null} difficulty  Optional filter
 * @param {string|null} category    Optional filter
 * @returns {Promise<Array>}
 */
export async function fetchQuestionList(difficulty = null, category = null) {
  const params = new URLSearchParams();
  if (difficulty) params.append('difficulty', difficulty);
  if (category)   params.append('category', category);

  const res = await fetch(`${BASE}/?${params}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to fetch question list (${res.status})`);
  }

  return res.json();
}
