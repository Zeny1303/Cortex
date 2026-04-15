/**
 * interviewService.js
 * All API calls for the interview session lifecycle + code execution.
 */
import { API_URL } from '../config';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/** POST /api/code/execute — run code snippet, no test cases */
export async function executeCode(language, code) {
  const res = await fetch(`${API_URL}/api/code/execute`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ language, code }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Execution failed (${res.status})`);
  }
  return res.json(); // { output, error, execution_time_ms }
}

/** POST /api/interview/{sessionId}/submit-code — run against hidden test cases */
export async function submitCode(sessionId, code) {
  const res = await fetch(`${API_URL}/api/interview/${sessionId}/submit-code`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ action: 'submit_code', code }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Submit failed (${res.status})`);
  }
  return res.json(); // CodeSubmitResponse
}

/** POST /api/interview/{sessionId}/end */
export async function endInterview(sessionId) {
  const res = await fetch(`${API_URL}/api/interview/${sessionId}/end`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `End failed (${res.status})`);
  }
  return res.json(); // EndInterviewResponse
}

/** POST /api/interview/{sessionId}/next */
export async function nextStage(sessionId) {
  const res = await fetch(`${API_URL}/api/interview/${sessionId}/next`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Next stage failed (${res.status})`);
  }
  return res.json();
}
