import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Countdown timer for the interview session.
 * @param {number} initialSeconds  Total seconds (default 45 min)
 * @returns {{ display, secondsLeft, isWarning, isExpired, reset }}
 */
export function useInterviewTimer(initialSeconds = 45 * 60) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => setSecondsLeft(initialSeconds), [initialSeconds]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return {
    display,
    secondsLeft,
    isWarning: secondsLeft <= 5 * 60 && secondsLeft > 0,  // last 5 min
    isExpired: secondsLeft === 0,
    reset,
  };
}
