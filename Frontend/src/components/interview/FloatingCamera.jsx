import React, { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Minimize2 } from 'lucide-react';
import { useCameraContext } from '../../context/CameraContext';

/**
 * Draggable floating camera widget — uses shared CameraContext.
 */
export default function FloatingCamera() {
  const { videoRef, camOn, micOn, error, ready, toggleCam, toggleMic } = useCameraContext();
  const [minimized, setMinimized] = useState(false);
  const [pos, setPos] = useState({ x: null, y: null }); // null = CSS default
  const dragging = useRef(false);
  const offset   = useRef({ x: 0, y: 0 });
  const elRef    = useRef(null);

  const onMouseDown = (e) => {
    if (e.target.closest('button')) return; // don't drag on button clicks
    dragging.current = true;
    const rect = elRef.current.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      setPos({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const style = pos.x !== null
    ? { position: 'fixed', left: pos.x, top: pos.y, bottom: 'auto', right: 'auto' }
    : { position: 'fixed', bottom: '1.5rem', right: '1.5rem' };

  return (
    <div
      ref={elRef}
      style={{ ...style, zIndex: 50, cursor: 'grab', userSelect: 'none' }}
      onMouseDown={onMouseDown}
      className={`border-2 border-black dark:border-white bg-black shadow-lg
                  transition-all duration-200
                  ${minimized ? 'w-14 h-14' : 'w-44 h-36'}`}
    >
      {minimized ? (
        /* Minimized pill */
        <button
          onClick={() => setMinimized(false)}
          className="w-full h-full flex items-center justify-center
                     hover:bg-white/10 transition-colors duration-150"
          title="Expand camera"
        >
          <Video size={18} strokeWidth={2} className="text-white" />
        </button>
      ) : (
        <>
          {/* Video feed */}
          <div className="relative w-full h-full overflow-hidden">
            <video
              ref={videoRef}
              autoPlay muted playsInline
              className={`w-full h-full object-cover transition-opacity duration-300
                          ${ready && camOn ? 'opacity-100' : 'opacity-0'}`}
            />
            {(!ready || !camOn) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <VideoOff size={16} strokeWidth={2} className="text-white/40" />
              </div>
            )}

            {/* Controls overlay */}
            <div className="absolute bottom-0 left-0 right-0 flex border-t border-white/20">
              <button
                onClick={toggleMic}
                className={`flex-1 flex items-center justify-center py-1.5
                            text-[8px] font-black uppercase tracking-widest
                            transition-colors duration-150
                            ${micOn ? 'text-white/60 hover:bg-white/10' : 'bg-swiss-accent text-white'}`}
                title={micOn ? 'Mute' : 'Unmute'}
              >
                {micOn ? <Mic size={9} strokeWidth={2.5} /> : <MicOff size={9} strokeWidth={2.5} />}
              </button>
              <button
                onClick={toggleCam}
                className={`flex-1 flex items-center justify-center py-1.5 border-l border-white/20
                            text-[8px] font-black uppercase tracking-widest
                            transition-colors duration-150
                            ${camOn ? 'text-white/60 hover:bg-white/10' : 'bg-swiss-accent text-white'}`}
                title={camOn ? 'Hide cam' : 'Show cam'}
              >
                {camOn ? <Video size={9} strokeWidth={2.5} /> : <VideoOff size={9} strokeWidth={2.5} />}
              </button>
              <button
                onClick={() => setMinimized(true)}
                className="flex items-center justify-center px-2 border-l border-white/20
                           text-white/40 hover:bg-white/10 transition-colors duration-150"
                title="Minimize"
              >
                <Minimize2 size={9} strokeWidth={2.5} />
              </button>
            </div>

            {/* Live indicator */}
            {ready && camOn && (
              <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-swiss-accent animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-widest text-white/70">Live</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
