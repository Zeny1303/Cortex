import React from 'react';

const VideoPanel = () => {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[#3e3e42] bg-[#2d2d2d] flex justify-between items-center select-none">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="font-semibold text-gray-300 text-sm">Camera</span>
        </div>
        <div className="flex space-x-2 items-center">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Active</span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>
      
      {/* Video Content */}
      <div className="flex-1 bg-[#161616] relative group">
        {/* Placeholder for actual video stream */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#2d2d2d] border border-[#3e3e42] flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-gray-500 font-medium text-sm">Waiting for candidate...</span>
        </div>
        
        {/* Hover / Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="p-2 rounded-full bg-[#2d2d2d]/90 text-gray-200 hover:bg-[#3e3e42] hover:text-white backdrop-blur-sm transition-colors border border-[#4d4d4d]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button className="p-2 rounded-full bg-[#2d2d2d]/90 text-gray-200 hover:bg-[#3e3e42] hover:text-white backdrop-blur-sm transition-colors border border-[#4d4d4d]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPanel;
