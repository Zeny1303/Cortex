import React, { useState } from "react";

const BorderGlow = ({
  children,
  glowColor = "124 58 237",
  borderRadius = 20,
  glowRadius = 60,
  glowIntensity = 1,
  colors = ["#7c3aed", "#22d3ee"],
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        borderRadius: borderRadius,
        position: "relative",
        overflow: "hidden",
      }}
      className="group"
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: `radial-gradient(${glowRadius}px at ${position.x}px ${position.y}px, rgba(${glowColor},${glowIntensity}) 0%, transparent 80%)`,
        }}
      />

      {/* Border gradient */}
      <div
        className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition"
        style={{
          background: `linear-gradient(120deg, ${colors.join(",")})`,
          filter: "blur(20px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BorderGlow;