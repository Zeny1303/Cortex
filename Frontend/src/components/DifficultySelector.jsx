import React from 'react';

const DifficultySelector = ({ difficulty, setDifficulty, isDarkMode }) => {
  const options = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="mb-10">
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        Select Difficulty
      </h2>
      <div className="flex flex-col sm:flex-row gap-4">
        {options.map((opt) => {
          const isSelected = difficulty === opt;
          return (
            <button
              key={opt}
              onClick={() => setDifficulty(opt)}
              className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-200 shadow-sm border-2 ${
                isSelected
                  ? isDarkMode 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-indigo-500/20' 
                    : 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : isDarkMode
                    ? 'bg-[#1e1e1e] border-[#2d2d2d] text-gray-400 hover:border-[#3e3e42]'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultySelector;
