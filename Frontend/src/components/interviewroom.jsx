import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { WS_URL } from '../config';

const InterviewRoom = ({ roomId }) => {
  const [code, setCode] = useState('// Welcome to the interview room!\n');
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  
  const ws = useRef(null);
  const editorRef = useRef(null);
  const isRemoteChange = useRef(false);

  useEffect(() => {
    // Connect to WebSocket server
    const websocketUrl = `${WS_URL}/ws/${roomId}`;
    ws.current = new WebSocket(websocketUrl);

    ws.current.onopen = () => {
      setConnectionStatus('Connected');
      // Announce presence to the room
      ws.current.send(JSON.stringify({ type: 'join-room' }));
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'initial-code':
            if (data.code) {
              isRemoteChange.current = true;
              setCode(data.code);
            }
            break;
            
          case 'code-change':
            // Only update if it's different from current state
            setCode((prevCode) => {
              if (prevCode !== data.code) {
                isRemoteChange.current = true;
                return data.code;
              }
              return prevCode;
            });
            break;
            
          case 'peer-connected':
            console.log('A peer joined the room');
            break;
            
          default:
            break;
        }
      } catch (err) {
        console.error('Failed to parse websocket message', err);
      }
    };

    ws.current.onclose = () => {
      setConnectionStatus('Disconnected');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setConnectionStatus('Error');
    };

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [roomId]);

  // Handle local editor changes
  const handleEditorChange = useCallback((value) => {
    // Avoid broadcasting back remote changes
    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      return;
    }

    setCode(value);
    
    // Broadcast change to other peers
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: 'code-change',
          code: value,
        })
      );
    }
  }, []);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-gray-100 font-sans">
      
      {/* Top action bar */}
      <div className="flex justify-between items-center px-5 py-3 bg-gray-800 border-b border-gray-700 shadow-sm">
        <div>
          <h2 className="m-0 text-lg font-bold text-white tracking-wide">Interview Room: <span className="text-blue-400 font-mono">{roomId}</span></h2>
          <span className={`text-xs ml-1 flex items-center gap-1 ${
            connectionStatus === 'Connected' ? 'text-green-400' : 
            connectionStatus === 'Disconnected' ? 'text-red-500' : 'text-yellow-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'Connected' ? 'bg-green-400' : 
              connectionStatus === 'Disconnected' ? 'bg-red-500' : 'bg-yellow-400'
            }`}></div>
            {connectionStatus}
          </span>
        </div>
        
        {/* Mock Controls */}
        <div className="flex gap-3">
          <button className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors border border-gray-600">End Session</button>
        </div>
      </div>

      {/* Main Workspace Area (Video + Editor) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Video Panel */}
        <div className="w-1/3 min-w-[300px] max-w-[500px] flex flex-col border-r border-gray-700 bg-gray-850 p-4 gap-4 overflow-y-auto">
          
          <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Participants</div>
          
          {/* Main Remote Video Mock */}
          <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow flex items-center justify-center">
            {/* Replace this div with an actual <video> tag later */}
            <div className="flex flex-col items-center opacity-50">
               <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
               <span>Waiting for remote video...</span>
            </div>
            {/* Host nametag */}
            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs">Interviewer</div>
          </div>

          {/* Local Video Mock */}
          <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow flex items-center justify-center">
            <div className="flex flex-col items-center opacity-50">
               <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <span className="text-sm">Local Camera Off</span>
            </div>
             <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs">You</div>
          </div>
          
        </div>

        {/* Right Side: Shared Code Editor */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">index.js</span>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                wordWrap: "on",
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                padding: { top: 16 }
              }}
            />
          </div>
        </div>

      </div>

      {/* Bottom Area: Chat Panel */}
      <div className="h-64 border-t border-gray-700 bg-gray-800 flex flex-col">
          <div className="px-4 py-2 bg-gray-900 border-b border-gray-700 text-sm font-semibold flex items-center gap-2">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
             Room Chat
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
             <div className="text-center text-xs text-gray-500 mb-2">Welcome to the interview chat. Say hello!</div>
             
             {/* Mock message */}
             <div className="self-start bg-gray-700 rounded-lg rounded-tl-none px-4 py-2 text-sm max-w-[80%]">
                <span className="text-xs text-blue-400 block mb-1">System</span>
                WebSocket connection {connectionStatus.toLowerCase()}.
             </div>
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-gray-900 border-t border-gray-700 flex gap-2">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Send
            </button>
          </div>
      </div>
      
    </div>
  );
};

export default InterviewRoom;
