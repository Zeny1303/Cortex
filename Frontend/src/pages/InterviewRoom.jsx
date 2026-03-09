import React from 'react';
import { useParams } from 'react-router-dom';
import InterviewNavbar from '../components/InterviewNavbar';
import VideoPanel from '../components/VideoPanel';
import AIInterviewerPanel from '../components/AIInterviewerPanel';
import CodeEditor from '../components/CodeEditor';

const InterviewRoom = () => {
  const { interviewId } = useParams();

  return (
    <div className="h-screen w-full flex flex-col bg-[#0a0a0a] text-gray-300 font-sans overflow-hidden">
      <InterviewNavbar interviewId={interviewId} />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col lg:flex-row p-2 gap-2 overflow-hidden h-[calc(100vh-73px)]">
        
        {/* Left Side: Conversation & Video (Takes ~40% width) */}
        <div className="w-full lg:w-5/12 flex flex-col gap-2 h-full min-h-0">
          {/* Top: Live Conversation (flex-1 so it takes most of the space) */}
          <div className="flex-[3] min-h-0 rounded-xl overflow-hidden shadow-sm border border-gray-800 bg-[#1e1e1e]">
            <AIInterviewerPanel />
          </div>
          
          {/* Bottom: User Video (Fixed smaller ratio) */}
          <div className="flex-[2] min-h-0 rounded-xl overflow-hidden shadow-sm border border-gray-800 bg-[#1e1e1e]">
            <VideoPanel />
          </div>
        </div>
        
        {/* Right Side: Code Editor Only (Takes ~60% width) */}
        <div className="w-full lg:w-7/12 h-full flex flex-col min-h-0">
          <div className="flex-1 border border-gray-800 rounded-xl overflow-hidden shadow-sm min-h-0 bg-[#1e1e1e] flex flex-col">
            <CodeEditor />
            
            {/* Bottom Action Bar for Editor side */}
            <div className="mt-auto flex flex-shrink-0 justify-end items-center bg-[#2d2d2d] px-4 py-3 border-t border-gray-800">
              <button className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-md font-medium hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-md flex items-center space-x-2 text-sm">
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
};

export default InterviewRoom;
