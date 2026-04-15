import React from "react";
import { motion } from "framer-motion";

const EvaluationTable = ({ isDarkMode, isFullPage, onViewAll }) => {
  const dummyEvaluations = [
    { id: "INT-34291", role: "Software Engineer", difficulty: "Medium", score: 85, date: "Mar 8, 2026" },
    { id: "INT-81923", role: "Frontend Dev", difficulty: "Easy", score: 92, date: "Mar 5, 2026" },
    { id: "INT-55102", role: "Backend Dev", difficulty: "Hard", score: 78, date: "Feb 28, 2026" },
  ];

  const latest = dummyEvaluations[0];

  const getDifficultyStyle = (difficulty) => {
    if (difficulty === "Easy") return "bg-green-500/10 text-green-400";
    if (difficulty === "Medium") return "bg-blue-500/10 text-blue-400";
    return "bg-red-500/10 text-red-400";
  };

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isDarkMode ? "bg-[#1e1e1e] border-[#2d2d2d]" : "bg-white border-gray-200"
      }`}
    >
      {/* HEADER */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-gray-200/10">
        <h3 className={`text-lg font-bold ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}>
          Evaluation Reports
        </h3>

        {!isFullPage && onViewAll && (
          <button
            onClick={onViewAll}
            className="text-indigo-500 text-sm font-semibold hover:underline"
          >
            See More
          </button>
        )}
      </div>

      {/* 🔥 OVERVIEW MODE → ONLY LATEST */}
      {!isFullPage ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          className={`p-6 flex items-center justify-between ${
            isDarkMode ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-50"
          }`}
        >
          {/* LEFT */}
          <div className="space-y-1">
            <p className={`font-mono text-xs ${
              isDarkMode ? "text-indigo-400" : "text-indigo-600"
            }`}>
              {latest.id}
            </p>

            <h4 className={`font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              {latest.role}
            </h4>

            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyStyle(latest.difficulty)}`}>
                {latest.difficulty}
              </span>

              <span className="text-xs text-gray-500">{latest.date}</span>
            </div>
          </div>

          {/* RIGHT (SCORE) */}
          <div className="text-right">
            <p className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              {latest.score}%
            </p>

            <button className="text-indigo-500 text-sm font-semibold mt-1 hover:underline">
              View Report →
            </button>
          </div>
        </motion.div>
      ) : (
        /* 🔥 FULL PAGE TABLE (UNCHANGED BUT CLEANED) */
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`${isDarkMode ? "bg-[#161616] text-gray-500" : "bg-gray-50 text-gray-500"}`}>
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200/10">
              {dummyEvaluations.map((evalData, i) => (
                <motion.tr
                  key={evalData.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={isDarkMode ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-50"}
                >
                  <td className="px-6 py-4 text-indigo-500 font-mono text-xs">{evalData.id}</td>
                  <td className="px-6 py-4 font-medium">{evalData.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyStyle(evalData.difficulty)}`}>
                      {evalData.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">{evalData.score}%</td>
                  <td className="px-6 py-4 text-gray-500">{evalData.date}</td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-500 font-semibold text-sm hover:underline">
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FOOTER */}
      {isFullPage && (
        <div className="px-6 py-4 border-t text-sm text-gray-500 flex justify-between">
          <span>Showing all evaluations</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-200/20 rounded">Prev</button>
            <button className="px-3 py-1 bg-gray-200/20 rounded">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationTable;