import React from "react";
import { motion } from "framer-motion";

const LeaderboardTable = ({ isDarkMode, isFullPage, onViewAll }) => {
  const dummyLeaderboard = [
    { rank: 1, user: "Alex Walker", score: 98, interviewsCompleted: 45, isCurrentUser: false },
    { rank: 2, user: "Sarah Jenkins", score: 96, interviewsCompleted: 38, isCurrentUser: false },
    { rank: 3, user: "Michael Chen", score: 94, interviewsCompleted: 52, isCurrentUser: false },
    { rank: 4, user: "KD (You)", score: 92, interviewsCompleted: 15, isCurrentUser: true },
    { rank: 5, user: "Emily Davis", score: 91, interviewsCompleted: 27, isCurrentUser: false },
  ];

  const getRankStyle = (rank) => {
    if (rank === 1) return "bg-yellow-400 text-black shadow-lg shadow-yellow-400/30";
    if (rank === 2) return "bg-gray-300 text-black";
    if (rank === 3) return "bg-orange-400 text-black";
    return isDarkMode ? "text-gray-400" : "text-gray-500";
  };
  const Podium = ({ data, isDarkMode }) => {
  const [first, second, third] = data.slice(0, 3);

  const Card = ({ user, rank, height, highlight }) => (
    <div className="flex flex-col items-center justify-end">
      
      {/* avatar */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white mb-2 ${
        highlight ? "bg-yellow-500" : "bg-gray-500"
      }`}>
        {user.user.charAt(0)}
      </div>

      {/* name */}
      <p className="text-xs text-center mb-1">{user.user}</p>

      {/* block */}
      <div
        className={`w-16 ${height} rounded-t-xl flex items-center justify-center font-bold ${
          rank === 1
            ? "bg-yellow-400 text-black"
            : rank === 2
            ? "bg-gray-300 text-black"
            : "bg-orange-400 text-black"
        }`}
      >
        {rank}
      </div>
    </div>
  );

  return (
    <div className="flex items-end justify-center gap-6 py-6">

      {/* 2nd */}
      <Card user={second} rank={2} height="h-20" />

      {/* 1st */}
      <Card user={first} rank={1} height="h-28" highlight />

      {/* 3rd */}
      <Card user={third} rank={3} height="h-16" />

    </div>
  );
};
  return (
    <div className={`rounded-2xl border overflow-hidden ${
      isDarkMode ? "bg-[#1e1e1e] border-[#2d2d2d]" : "bg-white border-gray-200"
    }`}>

      {/* HEADER */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-gray-200/10">
        <h3 className={`text-lg font-bold flex items-center gap-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}>
          🏆 Leaderboard
        </h3>

        {!isFullPage && onViewAll && (
          <button
            onClick={onViewAll}
            className="text-indigo-500 text-sm font-semibold hover:underline"
          >
            View All
          </button>
        )}
      </div>

      {/* LIST STYLE (NOT TABLE → more modern) */}
      <div className="divide-y divide-gray-200/10">

        {dummyLeaderboard.map((item, i) => (
          <motion.div
            key={item.rank}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.01 }}
            className={`flex items-center justify-between px-6 py-4 transition-all ${
              item.isCurrentUser
                ? (isDarkMode ? "bg-indigo-900/30 border-l-4 border-indigo-500" : "bg-indigo-50 border-l-4 border-indigo-500")
                : (isDarkMode ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-50")
            }`}
          >

            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">

              {/* RANK */}
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${getRankStyle(item.rank)}`}>
                {item.rank <= 3 ? "🏆" : item.rank}
              </div>

              {/* USER */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm ${
                  item.isCurrentUser ? "bg-indigo-600" : "bg-gray-500"
                }`}>
                  {item.user.charAt(0)}
                </div>

                <div>
                  <p className={`font-semibold ${
                    item.isCurrentUser
                      ? "text-indigo-400"
                      : (isDarkMode ? "text-gray-200" : "text-gray-900")
                  }`}>
                    {item.user}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.interviewsCompleted} interviews
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE (SCORE) */}
            <div className="text-right">
              <p className={`text-lg font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                {item.score}
              </p>
              <p className="text-xs text-gray-500">Score</p>
            </div>

          </motion.div>
        ))}

      </div>

      {/* FOOTER */}
      {isFullPage && (
        <div className="px-6 py-4 flex justify-between text-sm text-gray-500 border-t border-gray-200/10">
          <span>Showing top 5</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-gray-200/20">Prev</button>
            <button className="px-3 py-1 rounded bg-gray-200/20">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;