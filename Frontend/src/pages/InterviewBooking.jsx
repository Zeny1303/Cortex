import React, { useState } from 'react';
import DifficultySelector from '../components/DifficultySelector';
import PackSelector from '../components/PackSelector';
import BookingSummary from '../components/BookingSummary';
import BookingNavbar from '../layout/BookingNavbar';
import { useTheme } from '../context/ThemeContext';

const InterviewBooking = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [difficulty, setDifficulty] = useState('Medium');
  
  const packs = [
    { title: 'Starter Pack', questions: 2, price: 9, isPopular: false },
    { title: 'Standard Pack', questions: 3, price: 15, isPopular: true },
    { title: 'Pro Pack', questions: 5, price: 20, isPopular: false }
  ];
  
  const [selectedPack, setSelectedPack] = useState(packs[1]);
  const [interviewId, setInterviewId] = useState(null);

  const handleConfirmBooking = () => {
    const newId = `INT-${Math.floor(10000 + Math.random() * 90000)}`;
    setInterviewId(newId);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      
      {/* Top Navbar specifically for booking */}
      <BookingNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Header Container */}
      <div className={`pt-16 pb-12 px-6 text-center ${isDarkMode ? 'bg-[#1a1a1a] border-b border-[#2d2d2d]' : 'bg-white border-b border-gray-200'}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">AI Interview</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Level up your coding skills with our advanced AI interviewer. Choose your difficulty, pick a question pack, and start practicing in a realistic mock interview environment.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Selectors */}
          <div className="lg:col-span-8 space-y-2">
            
            {/* Section 1: Difficulty */}
            <DifficultySelector 
              difficulty={difficulty} 
              setDifficulty={setDifficulty} 
              isDarkMode={isDarkMode} 
            />
            
            {/* Section 2: Packs */}
            <PackSelector 
              selectedPack={selectedPack} 
              setSelectedPack={setSelectedPack} 
              isDarkMode={isDarkMode} 
              packs={packs}
            />

          </div>

          {/* Right Column: Summary Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <BookingSummary 
                difficulty={difficulty}
                selectedPack={selectedPack}
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                interviewId={interviewId}
                onConfirm={handleConfirmBooking}
              />
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default InterviewBooking;
