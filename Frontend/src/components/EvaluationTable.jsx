import React from 'react';

const EvaluationTable = ({ isDarkMode, isFullPage, onViewAll }) => {
  const dummyEvaluations = [
    { id: 'INT-34291', role: 'Software Engineer', difficulty: 'Medium', score: 85, date: 'Mar 8, 2026' },
    { id: 'INT-81923', role: 'Frontend Dev', difficulty: 'Easy', score: 92, date: 'Mar 5, 2026' },
    { id: 'INT-55102', role: 'Backend Dev', difficulty: 'Hard', score: 78, date: 'Feb 28, 2026' },
  ];

  return (
    <div className={`overflow-hidden rounded-2xl shadow-sm border transition-colors duration-300 ${
      isDarkMode ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-100'
    }`}>
      <div className={`px-6 py-5 border-b flex justify-between items-center ${isDarkMode ? 'border-[#2d2d2d]' : 'border-gray-100'}`}>
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Evaluation Reports
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
              <th className="px-6 py-4 font-medium">Interview ID</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Difficulty</th>
              <th className="px-6 py-4 font-medium">Score</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-[#2d2d2d]' : 'divide-gray-100'}`}>
            {dummyEvaluations.map((evalData) => (
              <tr key={evalData.id} className={`transition-colors hover:bg-opacity-50 ${
                isDarkMode ? 'hover:bg-[#2d2d2d]' : 'hover:bg-gray-50'
              }`}>
                <td className={`px-6 py-4 font-mono text-xs font-semibold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {evalData.id}
                </td>
                <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {evalData.role}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    evalData.difficulty === 'Easy' 
                      ? (isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700')
                      : evalData.difficulty === 'Medium'
                        ? (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700')
                        : (isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700')
                  }`}>
                    {evalData.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 bg-gray-200 rounded-full h-1.5 ${isDarkMode ? 'bg-gray-700' : ''}`}>
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${evalData.score}%` }}></div>
                    </div>
                    <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{evalData.score}%</span>
                  </div>
                </td>
                <td className={`px-6 py-4 text-gray-500 ${isDarkMode ? 'text-gray-400' : ''}`}>
                  {evalData.date}
                </td>
                <td className="px-6 py-4">
                  <button className={`font-semibold text-sm transition-all whitespace-nowrap ${
                    isFullPage 
                      ? (isDarkMode ? 'text-indigo-300 border border-indigo-500/50 px-3 py-1.5 rounded-lg hover:bg-indigo-900/40' : 'text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50') 
                      : (isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700')
                  }`}>
                    {isFullPage ? 'View Detailed Report' : 'View Report'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFullPage && (
        <div className={`px-6 py-4 border-t flex items-center justify-between ${isDarkMode ? 'border-[#2d2d2d]' : 'border-gray-100'}`}>
          <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Showing 1 to 3 of 12 evaluations</span>
          <div className="flex gap-2">
            <button className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${isDarkMode ? 'bg-[#2d2d2d] text-gray-400 hover:bg-[#3d3d3d]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Previous</button>
            <button className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${isDarkMode ? 'bg-[#2d2d2d] text-gray-400 hover:bg-[#3d3d3d]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationTable;
