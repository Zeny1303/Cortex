import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const StartInterviewCard = ({ isDarkMode }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
      className={`relative overflow-hidden p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 ${
        isDarkMode
          ? "bg-gradient-to-r from-indigo-900/40 to-blue-900/40 border-indigo-500/30"
          : "bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100"
      }`}
    >
      {/* 🔥 subtle glow layer */}
      <div className="absolute inset-0 bg-indigo-500/10 blur-2xl opacity-30 pointer-events-none" />

      {/* 🔥 CONTENT */}
      <div className="relative space-y-2 max-w-xl">
        <h3
          className={`text-2xl md:text-3xl font-bold ${
            isDarkMode ? "text-white" : "text-indigo-900"
          }`}
        >
          Start Your Next Interview
        </h3>

        <p
          className={`text-sm md:text-base leading-relaxed ${
            isDarkMode ? "text-indigo-200/90" : "text-indigo-700/80"
          }`}
        >
          Practice real interview questions with{" "}
          <span className="text-indigo-400 font-semibold">
            AI-powered feedback
          </span>
          , choose your difficulty, and{" "}
          <span className="text-indigo-400 font-semibold">
            improve with every session
          </span>.
        </p>
      </div>

      {/* 🔥 CTA BUTTON */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/interview/setup")}
        className={`relative px-8 py-3 rounded-xl font-semibold whitespace-nowrap shadow-lg transition-all ${
          isDarkMode
            ? "bg-indigo-500 text-white hover:bg-indigo-400 shadow-indigo-500/30"
            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30"
        }`}
      >
        Start Interview →
      </motion.button>
    </motion.div>
  );
};

export default StartInterviewCard;