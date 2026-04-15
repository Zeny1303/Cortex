import { useState, useEffect, useRef, useCallback } from 'react';

const MAX_VIOLATIONS = 3;

/**
 * Tracks camera/mic violations during an interview.
 * Returns violation count, active warning, and a function to force-end.
 */
export function useViolationTracker({ camOn, micOn, onForceEnd }) {
  const [violations, setViolations]     = useState(0);
  const [warning, setWarning]           = useState(null); // { message, type }
  const prevCamRef = useRef(camOn);
  const prevMicRef = useRef(micOn);
  const warningTimerRef = useRef(null);

  const addViolation = useCallback((message, type) => {
    setViolations(prev => {
      const next = prev + 1;
      setWarning({ message: `Warning ${next}: ${message}`, type });

      // Auto-dismiss warning after 4s
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = setTimeout(() => setWarning(null), 4000);

      if (next >= MAX_VIOLATIONS && onForceEnd) {
        setTimeout(() => onForceEnd('Too many violations — interview ended automatically.'), 1500);
      }
      return next;
    });
  }, [onForceEnd]);

  // Watch for cam/mic being turned off
  useEffect(() => {
    if (prevCamRef.current && !camOn) {
      addViolation('Camera must stay on during the interview.', 'camera');
    }
    prevCamRef.current = camOn;
  }, [camOn, addViolation]);

  useEffect(() => {
    if (prevMicRef.current && !micOn) {
      addViolation('Microphone must stay on during the interview.', 'mic');
    }
    prevMicRef.current = micOn;
  }, [micOn, addViolation]);

  useEffect(() => () => clearTimeout(warningTimerRef.current), []);

  return { violations, warning, maxViolations: MAX_VIOLATIONS };
}
