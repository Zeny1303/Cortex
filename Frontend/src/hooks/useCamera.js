import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Manages camera + mic stream for the interview.
 * Returns refs and state needed by VideoPanel.
 */
export function useCamera() {
  const videoRef   = useRef(null);
  const streamRef  = useRef(null);

  const [camOn,  setCamOn]  = useState(false);
  const [micOn,  setMicOn]  = useState(false);
  const [error,  setError]  = useState(null);
  const [ready,  setReady]  = useState(false);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCamOn(true);
      setMicOn(true);
      setReady(true);
      setError(null);
    } catch (err) {
      setError(err.message || 'Camera/mic access denied');
      setReady(false);
    }
  }, []);

  const toggleCam = useCallback(() => {
    if (!streamRef.current) return;
    streamRef.current.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setCamOn((p) => !p);
  }, []);

  const toggleMic = useCallback(() => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setMicOn((p) => !p);
  }, []);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCamOn(false);
    setMicOn(false);
    setReady(false);
  }, []);

  // Auto-start on mount
  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  return { videoRef, camOn, micOn, error, ready, toggleCam, toggleMic, start };
}
