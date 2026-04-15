import React from "react";
import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon, isDarkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group ${
        isDarkMode
          ? "bg-[#1a1a1a] border-white/10 hover:border-indigo-500/30"
          : "bg-white border-gray-200 hover:border-indigo-300"
      }`}
    >
      {/* 🔥 Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-indigo-500/10 blur-2xl" />

      {/* 🔥 CONTENT */}
      <div className="relative flex items-center justify-between mb-4">
        {/* ICON */}
        <div
          className={`p-3 rounded-xl ${
            isDarkMode
              ? "bg-indigo-500/10 text-indigo-400"
              : "bg-indigo-100 text-indigo-600"
          }`}
        >
          {icon}
        </div>

        {/* Optional trend badge (future use) */}
        {/* <span className="text-xs text-green-400">+12%</span> */}
      </div>

      {/* TEXT */}
      <div className="relative space-y-1">
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {title}
        </p>

        <h3
          className={`text-2xl md:text-3xl font-bold tracking-tight ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </h3>
      </div>

      {/* 🔥 bottom accent line */}
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-500 group-hover:w-full transition-all duration-300" />
    </motion.div>
  );
};

export default StatsCard;