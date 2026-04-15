import React from "react";

const SkeletonCard = ({ isDarkMode }) => {
  return (
    <div
      className={`animate-pulse p-6 rounded-2xl border ${
        isDarkMode
          ? "bg-[#1a1a1a] border-white/10"
          : "bg-gray-100 border-gray-200"
      }`}
    >
      {/* icon placeholder */}
      <div className="w-10 h-10 rounded-lg bg-gray-400/30 mb-4"></div>

      {/* title */}
      <div className="h-3 w-24 bg-gray-400/30 rounded mb-2"></div>

      {/* value */}
      <div className="h-6 w-16 bg-gray-400/40 rounded"></div>
    </div>
  );
};

export default SkeletonCard;