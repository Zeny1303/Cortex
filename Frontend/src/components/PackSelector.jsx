import React from 'react';

const PackSelector = ({ selectedPack, setSelectedPack, isDarkMode, packs }) => {
  return (
    <div className="mb-10">
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        Choose Your Pack
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packs.map((pack) => {
          const isSelected = selectedPack?.title === pack.title;
          
          return (
            <div 
              key={pack.title}
              onClick={() => setSelectedPack(pack)}
              className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 shadow-sm border-2 flex flex-col items-center text-center ${
                isSelected 
                  ? isDarkMode
                    ? 'bg-[#1e1e1e] border-indigo-500 shadow-indigo-500/10'
                    : 'bg-white border-indigo-500 shadow-indigo-100'
                  : isDarkMode
                    ? 'bg-[#1e1e1e] border-[#2d2d2d] hover:border-[#3e3e42]'
                    : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
              }`}
            >
              {pack.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                    isDarkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className={`font-bold text-xl mb-2 mt-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {pack.title}
              </h3>
              
              <div className="my-4">
                <span className={`text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ₹{pack.price}
                </span>
              </div>
              
              <ul className={`text-sm space-y-3 mb-6 flex-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li className="flex items-center justify-center space-x-2">
                  <svg className={`w-4 h-4 ${isSelected ? 'text-indigo-500' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>{pack.questions} coding questions</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <svg className={`w-4 h-4 ${isSelected ? 'text-indigo-500' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Detailed AI Feedback</span>
                </li>
              </ul>
              
              <button 
                className={`w-full py-2.5 rounded-lg font-semibold transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : isDarkMode
                      ? 'bg-[#2d2d2d] text-gray-300 hover:bg-[#3e3e42]'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {isSelected ? 'Selected' : 'Select'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PackSelector;
