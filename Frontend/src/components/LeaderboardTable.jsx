import React from 'react';

const LeaderboardTable = ({ isDarkMode, isFullPage, onViewAll }) => {
  const dummyLeaderboard = [
    { rank: 1, user: 'Alex Walker', score: 98, interviewsCompleted: 45, isCurrentUser: false },
    { rank: 2, user: 'Sarah Jenkins', score: 96, interviewsCompleted: 38, isCurrentUser: false },
    { rank: 3, user: 'Michael Chen', score: 94, interviewsCompleted: 52, isCurrentUser: false },
    { rank: 4, user: 'KD (You)', score: 92, interviewsCompleted: 15, isCurrentUser: true },
    { rank: 5, user: 'Emily Davis', score: 91, interviewsCompleted: 27, isCurrentUser: false },
  ];

  return (
    <div className={`overflow-hidden rounded-2xl shadow-sm border transition-colors duration-300 ${
      isDarkMode ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-100'
    }`}>
      <div className={`px-6 py-5 border-b flex justify-between items-center ${isDarkMode ? 'border-[#2d2d2d]' : 'border-gray-100'}`}>
        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          <svg className={`w-5 h-5 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v8l9-11h-7z"></path></svg>
          Leaderboard
        </h3>
        {!isFullPage && onViewAll && (
          <button onClick={onViewAll} className={`text-sm font-semibold transition-colors ${
            isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
          }`}>
            View All
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className={`text-xs uppercase ${
            isDarkMode ? 'bg-[#161616] text-gray-500' : 'bg-gray-50 text-gray-500'
          }`}>
            <tr>
              <th className="px-6 py-4 font-medium w-16">Rank</th>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium text-center">Score</th>
              <th className="px-6 py-4 font-medium text-center">Interviews Completed</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-[#2d2d2d]' : 'divide-gray-100'}`}>
            {dummyLeaderboard.map((item) => (
              <tr 
                key={item.rank} 
                className={`transition-colors ${
                  item.isCurrentUser 
                    ? (isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50') 
                    : (isDarkMode ? 'hover:bg-[#2d2d2d]' : 'hover:bg-gray-50')
                }`}
              >
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                    item.rank === 1 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : item.rank === 2 
                        ? 'bg-gray-200 text-gray-700' 
                        : item.rank === 3 
                          ? 'bg-orange-100 text-orange-800'
                          : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                  }`}>
                    {item.rank}
                  </span>
                </td>
                <td className={`px-6 py-4 font-semibold flex items-center gap-3 ${
                  item.isCurrentUser 
                    ? (isDarkMode ? 'text-indigo-300' : 'text-indigo-700') 
                    : (isDarkMode ? 'text-gray-300' : 'text-gray-900')
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white ${
                    item.isCurrentUser ? 'bg-indigo-600' : 'bg-gray-400'
                  }`}>
                    {item.user.charAt(0)}
                  </div>
                  {item.user}
                </td>
                <td className={`px-6 py-4 text-center font-bold ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {item.score}
                </td>
                <td className={`px-6 py-4 text-center font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {item.interviewsCompleted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFullPage && (
        <div className={`px-6 py-4 border-t flex items-center justify-between ${isDarkMode ? 'border-[#2d2d2d]' : 'border-gray-100'}`}>
          <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Showing 1 to 5 of 50 entries</span>
          <div className="flex gap-2">
            <button className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${isDarkMode ? 'bg-[#2d2d2d] text-gray-400 hover:bg-[#3d3d3d]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Previous</button>
            <button className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${isDarkMode ? 'bg-[#2d2d2d] text-gray-400 hover:bg-[#3d3d3d]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;
