import React, { useRef, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';

/**
 * VoiceRecorder
 *
 * Records a complete candidate answer and sends the full audio blob
 * via onAudioChunk once the user stops recording.
 *
 * Key fixes vs previous version:
 * 1. Stream tracks are stopped INSIDE onstop (after MediaRecorder has
 *    flushed all data) — not before — so the final chunk is never lost.
 * 2. All collected chunks are merged into one ArrayBuffer in onstop and
 *    sent as a single binary frame. The backend expects one complete audio
 *    blob per turn, not a stream of small chunks.
 * 3. mimeType falls back gracefully when audio/webm is unsupported.
 */
const VoiceRecorder = ({ onAudioChunk, isRecording, setIsRecording }) => {
  const mediaRecorderRef = useRef(null);
  const streamRef        = useRef(null);
  const chunksRef        = useRef([]);   // accumulate all Blob chunks here

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      // Pick the best supported mimeType
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : '';   // let the browser choose

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      // Collect chunks as they arrive (no timeslice = one chunk on stop, which is fine)
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // onstop fires AFTER the final ondataavailable — safe to merge + send here
      recorder.onstop = async () => {
        // Stop mic tracks now that the recorder has finished
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }

        const chunks = chunksRef.current;
        chunksRef.current = [];

        if (chunks.length === 0) {
          console.warn('[VoiceRecorder] No audio chunks collected');
          return;
        }

        // Merge all chunks into one Blob then convert to ArrayBuffer
        const blob = new Blob(chunks, { type: chunks[0].type || 'audio/webm' });
        console.log(`[VoiceRecorder] Sending ${blob.size} bytes of audio`);

        try {
          const buf = await blob.arrayBuffer();
          if (buf.byteLength > 0 && onAudioChunk) {
            onAudioChunk(buf);
          }
        } catch (err) {
          console.error('[VoiceRecorder] Failed to convert blob to ArrayBuffer:', err);
        }
      };

      recorder.start();   // no timeslice — one clean blob on stop
      setIsRecording(true);
    } catch (err) {
      console.error('[VoiceRecorder] Microphone access error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      // stop() triggers ondataavailable (final flush) then onstop
      mediaRecorderRef.current.stop();
    }
    // NOTE: stream tracks are stopped inside onstop, not here
    setIsRecording(false);
  };

  const toggle = () => (isRecording ? stopRecording() : startRecording());

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 h-8 px-4
                  text-[10px] font-black uppercase tracking-widest border-2
                  transition-colors duration-150
                  ${isRecording
                    ? 'bg-swiss-accent border-swiss-accent text-white hover:bg-black hover:border-black'
                    : 'bg-white border-black text-black hover:bg-black hover:text-white'}`}
      title={isRecording ? 'Stop recording' : 'Start answering'}
    >
      {isRecording
        ? <><Square size={10} strokeWidth={3} /> Stop</>
        : <><Mic    size={10} strokeWidth={2.5} /> Answer</>}
    </button>
  );
};

export default VoiceRecorder;
