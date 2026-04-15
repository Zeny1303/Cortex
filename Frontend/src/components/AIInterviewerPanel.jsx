import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WS_URL } from '../config';
import VoiceRecorder from './VoiceRecorder';
import AudioPlayer from './AudioPlayer';
import { Wifi, WifiOff, Mic, Volume2, Cpu } from 'lucide-react';

/* ─── AI state machine ──────────────────────────────────── */
// idle → listening → processing → speaking → idle
const AI_STATES = {
  idle:       { label: 'Ready',       icon: Wifi,    color: 'text-black/40'      },
  listening:  { label: 'Listening',   icon: Mic,     color: 'text-black'         },
  processing: { label: 'Processing',  icon: Cpu,     color: 'text-black'         },
  speaking:   { label: 'Speaking',    icon: Volume2, color: 'text-swiss-accent'  },
};

/* ─── Waveform bars (CSS-only, no canvas) ───────────────── */
function Waveform({ active }) {
  return (
    <div className="flex items-center gap-0.5 h-5">
      {[3, 5, 8, 5, 10, 7, 4, 9, 6, 3, 7, 5].map((h, i) => (
        <div
          key={i}
          className={`w-0.5 bg-black transition-all duration-150
            ${active ? 'opacity-100' : 'opacity-20'}`}
          style={{
            height: active ? `${h * 2}px` : '4px',
            animationDelay: `${i * 60}ms`,
            animation: active ? `waveBar 0.8s ease-in-out ${i * 60}ms infinite alternate` : 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.0); }
        }
      `}</style>
    </div>
  );
}

const DIFF_STYLE = {
  easy:   'bg-swiss-muted text-black border-black',
  medium: 'bg-black text-white border-black',
  hard:   'bg-swiss-accent text-white border-swiss-accent',
};

/**
 * AIInterviewerPanel
 * Props:
 *   question       {object}  — current question object
 *   currentIndex   {number}
 *   totalQuestions {number}
 *   sessionId      {string}  — voice WS session id
 */
export default function AIInterviewerPanel({
  question       = null,
  currentIndex   = 0,
  totalQuestions = 0,
  sessionId,
}) {
  const [aiState, setAiState]       = useState('idle');
  const [isConnected, setConnected] = useState(false);
  const [isRecording, setRecording] = useState(false);

  const wsRef          = useRef(null);
  const audioPlayerRef = useRef(null);

  const diffStyle = DIFF_STYLE[question?.difficulty?.toLowerCase()] || DIFF_STYLE.medium;

  /* ── WebSocket for voice pipeline ─────────────────────── */
  useEffect(() => {
    if (!sessionId) {
      console.warn('🚨 [AIPanel] No sessionId — cannot connect WebSocket');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('🚨 [AIPanel] No token — cannot connect WebSocket');
      return;
    }

    const wsUrl = `${WS_URL}/ws/interview/${sessionId}?token=${token}`;
    console.log('[AIPanel] Connecting to WebSocket:', wsUrl.replace(token, token.slice(0, 8) + '…'));
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen  = () => {
      console.log('[AIPanel] WebSocket connected');
      setConnected(true);
      setAiState('idle');
    };

    ws.onclose = (event) => {
      console.log('[AIPanel] WebSocket closed', { code: event.code, reason: event.reason });
      setConnected(false);
      setAiState('idle');
    };

    ws.onerror = (error) => {
      console.error('[AIPanel] WebSocket error', error);
      setConnected(false);
    };

    ws.onmessage = async (event) => {
      // ── Binary frame = MP3 audio from TTS ──────────────────
      if (event.data instanceof Blob) {
        const buf = await event.data.arrayBuffer();
        if (buf.byteLength > 0 && audioPlayerRef.current) {
          console.log('[AIPanel] Playing audio:', buf.byteLength, 'bytes');
          setAiState('speaking');
          audioPlayerRef.current.playAudioSegment(buf);
        }
        return;
      }

      // ── Text frame = JSON control event ────────────────────
      if (typeof event.data === 'string') {
        let msg;
        try {
          msg = JSON.parse(event.data);
        } catch {
          console.warn('[AIPanel] Non-JSON text frame:', event.data);
          return;
        }

        console.log('[AIPanel] Event:', msg.event, msg);

        switch (msg.event) {
          case 'connected':
            console.log('[AIPanel] Server confirmed connection, candidate:', msg.candidate_name);
            break;
          case 'greeting_text':
          case 'ai_text':
            // Text is available — audio will follow as a binary frame
            break;
          case 'user_text':
            console.log('[AIPanel] Transcript:', msg.text);
            break;
          case 'processing':
            setAiState('processing');
            break;
          case 'silence':
            // No speech detected — reset to idle
            setAiState('idle');
            break;
          case 'tts_unavailable':
            // TTS failed but we have text — reset to idle
            console.warn('[AIPanel] TTS unavailable, text only:', msg.text);
            setAiState('idle');
            break;
          case 'error':
            console.error('[AIPanel] Server error:', msg.message);
            setAiState('idle');
            break;
          case 'end':
            setAiState('idle');
            break;
          default:
            break;
        }
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [sessionId]);

  /* ── Audio chunk handler ───────────────────────────────── */
  // Sends the complete audio blob to the backend over WebSocket.
  // Uses a ref so it never goes stale inside VoiceRecorder callbacks.
  const handleAudioChunk = useCallback((buf) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn('[AIPanel] Cannot send audio — WebSocket not open (state:', ws?.readyState, ')');
      return;
    }
    console.log('[AIPanel] Sending audio chunk:', buf.byteLength, 'bytes');
    setAiState('processing');
    ws.send(buf);
  }, []);  // wsRef is a ref — safe to omit from deps

  /* ── Recording state → AI state sync ──────────────────── */
  // Use a ref to track previous recording state to avoid stale closure
  const prevRecordingRef = useRef(false);
  useEffect(() => {
    if (isRecording && !prevRecordingRef.current) {
      setAiState('listening');
    }
    prevRecordingRef.current = isRecording;
  }, [isRecording]);

  /* ── Playback complete callback ────────────────────────── */
  const handlePlaybackComplete = useCallback(() => {
    setAiState('idle');
  }, []);

  const stateInfo = AI_STATES[aiState];
  const StateIcon = stateInfo.icon;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5
                      border-b-2 border-black bg-swiss-muted flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-black text-white flex items-center justify-center
                          text-[9px] font-black flex-shrink-0">
            AI
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">
              AI Interviewer
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isConnected
                ? <Wifi    size={9} strokeWidth={2.5} className="text-black/50" />
                : <WifiOff size={9} strokeWidth={2.5} className="text-swiss-accent" />}
              <span className={`text-[9px] font-bold uppercase tracking-widest
                ${isConnected ? 'text-black/50' : 'text-swiss-accent'}`}>
                {isConnected ? 'Connected' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* AI state indicator */}
        <div className="flex items-center gap-2">
          <Waveform active={aiState === 'listening' || aiState === 'speaking'} />
          <div className="flex items-center gap-1.5">
            <StateIcon size={10} strokeWidth={2.5} className={stateInfo.color} />
            <span className={`text-[9px] font-black uppercase tracking-widest ${stateInfo.color}`}>
              {stateInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* ── Voice controls ─────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2
                      border-b-2 border-black bg-white flex-shrink-0">
        <AudioPlayer ref={audioPlayerRef} onPlaybackComplete={handlePlaybackComplete} />
        {isConnected ? (
          <VoiceRecorder
            isRecording={isRecording}
            setIsRecording={setRecording}
            onAudioChunk={handleAudioChunk}
          />
        ) : (
          <span className="text-[9px] font-bold uppercase tracking-widest text-black/30">
            Voice unavailable
          </span>
        )}
      </div>

      {/* ── Question display ───────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {!question && (
          <div className="p-5">
            <div className="border-2 border-black p-4 bg-swiss-muted swiss-dots">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 animate-pulse">
                Loading question...
              </p>
            </div>
          </div>
        )}

        {question && (
          <div className="p-4 space-y-3">

            {/* AI prompt bubble */}
            <div className="flex gap-2 items-start">
              <div className="w-5 h-5 bg-black text-white flex items-center justify-center
                              text-[8px] font-black flex-shrink-0 mt-0.5">AI</div>
              <div className="border-2 border-black p-3 bg-swiss-muted flex-1 text-[10px]
                              leading-relaxed text-black/70">
                Here's your coding challenge. Read carefully, then explain your approach
                before writing code.
              </div>
            </div>

            {/* Question card */}
            <div className="border-2 border-black bg-white">

              {/* Title + difficulty */}
              <div className="flex items-start justify-between gap-3 px-4 py-3 border-b-2 border-black">
                <h2 className="text-sm font-black uppercase tracking-tight leading-tight">
                  {question.title}
                </h2>
                <span className={`text-[9px] font-black uppercase tracking-widest
                                  px-2 py-1 border-2 flex-shrink-0 ${diffStyle}`}>
                  {question.difficulty}
                </span>
              </div>

              {/* Tags */}
              {question.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b-2 border-black">
                  {question.tags.map((tag) => (
                    <span key={tag}
                      className="text-[9px] font-black uppercase tracking-widest
                                 bg-swiss-muted border border-black/20 px-2 py-0.5">
                      {tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="px-4 py-3">
                <p className="text-xs leading-relaxed text-black/80 whitespace-pre-wrap">
                  {question.description}
                </p>
              </div>

              {/* Examples from starter code hint */}
              {question.starter_code?.python && (
                <div className="border-t-2 border-black px-4 py-3 bg-swiss-muted">
                  <p className="text-[9px] font-black uppercase tracking-widest text-black/40 mb-2">
                    Starter (Python)
                  </p>
                  <pre className="text-[10px] font-mono text-black/70 whitespace-pre-wrap leading-relaxed">
                    {question.starter_code.python}
                  </pre>
                </div>
              )}
            </div>

            {/* Question counter */}
            {totalQuestions > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex gap-1">
                  {Array.from({ length: totalQuestions }).map((_, i) => (
                    <div key={i}
                      className={`w-5 h-1.5 border border-black transition-colors duration-150
                        ${i === currentIndex ? 'bg-black' : 'bg-white'}`}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">
                  {currentIndex + 1} of {totalQuestions}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
