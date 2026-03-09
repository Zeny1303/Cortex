import React from 'react';

const StatsCard = ({ title, value, icon, isDarkMode }) => {
  return (
    <div className={`p-6 rounded-2xl shadow-sm border transition-colors duration-300 flex items-center gap-4 ${
      isDarkMode ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-100'
    }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
      }`}>
        {icon}
      </div>
      <div>
        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {title}
        </p>
        <p className={`text-2xl font-extrabold mt-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
