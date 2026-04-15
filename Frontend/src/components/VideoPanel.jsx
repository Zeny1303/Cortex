import React from 'react';
import { Video, VideoOff, Mic, MicOff, AlertTriangle } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';

export default function VideoPanel() {
  const { videoRef, camOn, micOn, error, ready, toggleCam, toggleMic } = useCamera();

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2
                      border-b-2 border-black bg-swiss-muted flex-shrink-0">
        <div className="flex items-center gap-2">
          <Video size={12} strokeWidth={2.5} className="text-black/60" />
          <span className="text-[10px] font-black uppercase tracking-widest">Camera</span>
        </div>
        {ready && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-swiss-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-swiss-accent">
              Live
            </span>
          </div>
        )}
      </div>

      {/* Video area */}
      <div className="flex-1 relative bg-black overflow-hidden">

        {/* Real camera feed */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-300
                      ${ready && camOn ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Placeholder when cam is off or not ready */}
        {(!ready || !camOn) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-swiss-muted">
            {error ? (
              <>
                <AlertTriangle size={20} strokeWidth={2} className="text-swiss-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-swiss-accent text-center px-4">
                  {error}
                </span>
              </>
            ) : (
              <>
                <VideoOff size={20} strokeWidth={2} className="text-black/30" />
                <span className="text-[10px] font-black uppercase tracking-widest text-black/30">
                  Camera off
                </span>
              </>
            )}
          </div>
        )}

        {/* Mic-off warning overlay */}
        {ready && !micOn && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5
                          bg-swiss-accent text-white px-2 py-1">
            <MicOff size={10} strokeWidth={2.5} />
            <span className="text-[9px] font-black uppercase tracking-widest">Mic off</span>
          </div>
        )}

        {/* Controls — always visible at bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex border-t-2 border-black bg-white">
          <button
            onClick={toggleMic}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2
                        text-[9px] font-black uppercase tracking-widest border-r-2 border-black
                        transition-colors duration-150
                        ${micOn
                          ? 'hover:bg-swiss-muted'
                          : 'bg-swiss-accent text-white hover:bg-black'}`}
            title={micOn ? 'Mute microphone' : 'Unmute microphone'}
          >
            {micOn
              ? <Mic size={11} strokeWidth={2.5} />
              : <MicOff size={11} strokeWidth={2.5} />}
            {micOn ? 'Mic' : 'Muted'}
          </button>
          <button
            onClick={toggleCam}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2
                        text-[9px] font-black uppercase tracking-widest
                        transition-colors duration-150
                        ${camOn
                          ? 'hover:bg-swiss-muted'
                          : 'bg-swiss-accent text-white hover:bg-black'}`}
            title={camOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {camOn
              ? <Video size={11} strokeWidth={2.5} />
              : <VideoOff size={11} strokeWidth={2.5} />}
            {camOn ? 'Cam' : 'Off'}
          </button>
        </div>
      </div>
    </div>
  );
}
