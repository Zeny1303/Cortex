import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import Navbar from '../layout/Navbar';
import { useTheme } from '../context/ThemeContext';

const MyInterviews = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Dummy logic for search/filtering
  const [searchTerm, setSearchTerm] = useState('');

  const allInterviews = [
    { id: 'INT-34291', role: 'Software Engineer', difficulty: 'Medium', score: 85, date: 'Mar 8, 2026', status: 'Completed' },
    { id: 'INT-81923', role: 'Frontend Dev', difficulty: 'Easy', score: 92, date: 'Mar 5, 2026', status: 'Completed' },
    { id: 'INT-55102', role: 'Backend Dev', difficulty: 'Hard', score: 78, date: 'Feb 28, 2026', status: 'Completed' },
    { id: 'INT-99210', role: 'Full Stack Dev', difficulty: 'Medium', score: null, date: 'Mar 10, 2026', status: 'Scheduled' },
    { id: 'INT-12034', role: 'Data Scientist', difficulty: 'Hard', score: 65, date: 'Feb 15, 2026', status: 'Completed' },
    { id: 'INT-76342', role: 'UI/UX Designer', difficulty: 'Easy', score: 95, date: 'Feb 10, 2026', status: 'Completed' },
  ];

  const filtered = allInterviews.filter(inv => inv.id.toLowerCase().includes(searchTerm.toLowerCase()) || inv.role.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#FAFAFA]'}`}>
      <Sidebar isDarkMode={isDarkMode} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 md:px-10 lg:px-12">
          <div className="max-w-6xl mx-auto space-y-8 pb-12">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
              <div>
                <h1 className={`text-3xl font-extrabold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  My Interviews
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Review all your past evaluation reports and upcoming scheduled sessions.
                </p>
              </div>
              <button 
                onClick={() => navigate('/booking')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-md transition-all transform hover:-translate-y-0.5 ${
                  isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                Book New Interview
              </button>
            </div>

            {/* Filter / Search Bar */}
            <div className="relative max-w-md">
              <span className={`absolute inset-y-0 left-0 flex items-center pl-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input
                type="text"
                placeholder="Search by ID or Role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                  isDarkMode ? 'bg-[#1e1e1e] border-[#333] text-white focus:bg-[#252525]' : 'bg-white border-gray-200 text-gray-900 focus:bg-gray-50'
                }`}
              />
            </div>

            {/* Interviews Table */}
            <div className={`overflow-hidden rounded-2xl shadow-sm border transition-colors ${
              isDarkMode ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-100'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={`text-xs uppercase tracking-wider ${isDarkMode ? 'bg-[#161616] text-gray-500' : 'bg-gray-50 text-gray-500'}`}>
                    <tr>
                      <th className="px-6 py-5 font-bold">Interview ID</th>
                      <th className="px-6 py-5 font-bold">Role</th>
                      <th className="px-6 py-5 font-bold">Difficulty</th>
                      <th className="px-6 py-5 font-bold">Status</th>
                      <th className="px-6 py-5 font-bold">Score</th>
                      <th className="px-6 py-5 font-bold">Date</th>
                      <th className="px-6 py-5 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-[#2d2d2d]' : 'divide-gray-100'}`}>
                    {filtered.map((item) => (
                      <tr key={item.id} className={`transition-colors hover:bg-opacity-50 ${isDarkMode ? 'hover:bg-[#2d2d2d]' : 'hover:bg-gray-50'}`}>
                        <td className={`px-6 py-5 font-mono text-xs font-semibold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{item.id}</td>
                        <td className={`px-6 py-5 font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{item.role}</td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold text-center inline-block w-20 ${
                            item.difficulty === 'Easy' ? (isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700')
                            : item.difficulty === 'Medium' ? (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700')
                            : (isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700')
                          }`}>{item.difficulty}</span>
                        </td>
                        <td className="px-6 py-5">
                          {item.status === 'Completed' ? (
                            <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                              Completed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-amber-500 font-medium">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
                              Scheduled
                            </span>
                          )}
                        </td>
                        <td className={`px-6 py-5 font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {item.score ? `${item.score}%` : '—'}
                        </td>
                        <td className={`px-6 py-5 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.date}</td>
                        <td className="px-6 py-5 text-right">
                          <button className={`text-sm font-semibold transition-colors px-4 py-2 rounded-lg border ${
                            isDarkMode ? 'border-gray-700 text-indigo-400 hover:bg-[#333] hover:text-white' : 'border-gray-200 text-indigo-600 hover:bg-gray-50 hover:text-indigo-800'
                          }`}>
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filtered.length === 0 && (
                  <div className="py-12 text-center text-gray-500">
                    No interviews found matching your search.
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default MyInterviews;
