import { useEffect, useState } from "react";

const Hero = () => {
  const fullText = "Finally. No boring LeetCode grinding.";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[index]);
        setIndex(index + 1);
      }, 40);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <section className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-6">

      <div className="text-center max-w-4xl">

        {/* MAIN HEADLINE */}
        <h1 className="text-[48px] md:text-[72px] font-extrabold text-white leading-tight tracking-tight font-[Space_Grotesk] animate-slideUpFade">
          YOUR AI TECHNICAL INTERVIEWER
        </h1>

        {/* SUBHEADLINE (TYPEWRITER) */}
        <h2 className="mt-6 text-xl md:text-2xl font-medium text-[#3B82F6] font-[Space_Grotesk]">
          {displayText}
          <span className="animate-pulse">|</span>
        </h2>

        {/* DESCRIPTION */}
        <p className="mt-6 text-gray-400 text-lg leading-relaxed">
          Simulate real technical interviews with a real-time duplex voice
          pipeline and a live collaborative Monaco code editor. Practice like
          it actually matters.
        </p>

      </div>
    </section>
  );
};

export default Hero;