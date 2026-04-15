import React from "react";

const AbstractMan = () => {
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">

      {/* FLOOR */}
      <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white opacity-40" />

      {/* MAN (LEFT) */}
      <div className="absolute bottom-[4px] left-[5%]">
        
        {/* 🔥 ROTATION WRAPPER */}
        <div
          className="origin-bottom"
          style={{
            transform: " scaleX(-1)", // adjust between 15–22deg if needed
          }}
        >
          <svg
            viewBox="0 0 550 850"
            className="w-[280px] h-auto text-white"
            style={{ fill: "currentColor" }}
          >
            {/* Head */}
            <polygon points="190,130 250,140 240,210 180,195" />

            {/* Raised Hand */}
            <polygon points="320,140 385,120 405,200 340,225" />

            {/* Upper Arm / Torso */}
            <polygon points="230,220 350,195 375,255 260,285 240,320 215,370 150,300" />

            {/* Back Leg */}
            <polygon points="150,300 90,360 40,410 80,460 120,410 180,385 215,370" />

            {/* Front Leg */}
            <polygon points="215,370 260,285 300,350 330,470 390,560 440,650 460,730 380,750 340,730 300,640 250,530" />
          </svg>
        </div>
      </div>

      {/* BALL (RIGHT) */}
      <div className="absolute bottom-[120px] right-[10%]">
        <div className="w-[50px] h-[50px] bg-white rounded-full" />
      </div>

    </div>
  );
};

export default AbstractMan;