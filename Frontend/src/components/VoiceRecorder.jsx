import React, { useState, useRef, useEffect } from 'react';

const VoiceRecorder = ({ onAudioChunk, isRecording, setIsRecording }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Cleanup function when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Use timeSlice (e.g., 2000ms) to chunk audio at regular intervals or send on stop
      // For this implementation, we will chunk every 3 seconds to stream to the backend
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && onAudioChunk) {
          // Convert Blob to ArrayBuffer/Bytes to send over WebSocket
          const buffer = await event.data.arrayBuffer();
          onAudioChunk(buffer);
        }
      };

      recorder.start(3000); // Send chunk every 3 seconds
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        onClick={toggleRecording}
        className={`px-6 py-3 rounded-full font-semibold text-white shadow-md transition-all duration-300 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isRecording ? '⏹ Stop & Send Audio' : '🎙 Start Answering'}
      </button>
      {isRecording && (
        <span className="text-sm text-gray-400 mt-2">
          Recording... (Sending chunks every 3s)
        </span>
      )}
    </div>
  );
};

export default VoiceRecorder;
