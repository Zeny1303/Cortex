import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

const AudioPlayer = forwardRef(({ onPlaybackComplete }, ref) => {
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize standard Web Audio API context
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContextClass();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    playAudioSegment: async (audioBufferData) => {
      // audioBufferData is expected to be an ArrayBuffer from the WebSocket
      if (!audioContextRef.current || !audioBufferData || audioBufferData.byteLength === 0) return;

      try {
        setIsPlaying(true);

        // Required for browsers that suspend AudioContext until user interaction
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        // Decode the MP3/audio bytes from the backend
        // Make a copy of the buffer as decodeAudioData mutates it sometimes
        const bufferCopy = audioBufferData.slice(0); 
        const decodedData = await audioContextRef.current.decodeAudioData(bufferCopy);
        
        // Stop any currently playing audio from this component
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            sourceNodeRef.current.disconnect();
        }

        // Create buffer source
        const source = audioContextRef.current.createBufferSource();
        source.buffer = decodedData;
        source.connect(audioContextRef.current.destination);
        
        source.onended = () => {
          setIsPlaying(false);
          if (onPlaybackComplete) {
              onPlaybackComplete();
          }
        };

        sourceNodeRef.current = source;
        source.start(0);

      } catch (err) {
        console.error("Error decoding or playing audio:", err);
        setIsPlaying(false);
      }
    },
    stopAudio: () => {
        if (sourceNodeRef.current) {
            try {
                sourceNodeRef.current.stop();
            } catch (e) {
                // Ignore if already stopped
            }
            setIsPlaying(false);
        }
    }
  }));

  return (
    <div className="flex items-center space-x-2 my-2">
      {isPlaying ? (
        <span className="flex items-center text-sm text-green-500">
          <span className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          AI is speaking...
        </span>
      ) : (
        <span className="text-sm text-gray-500">AI is listening...</span>
      )}
    </div>
  );
});

export default AudioPlayer;
