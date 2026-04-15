import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    title: "Register",
    desc: "Sign up and choose your interview role.",
  },
  {
    title: "Give Interview",
    desc: "Face real AI-driven interview questions.",
  },
  {
    title: "Get Feedback",
    desc: "Receive instant, actionable insights.",
  },
  {
    title: "Practice",
    desc: "Improve with adaptive follow-up questions.",
  },
  {
    title: "Confidence",
    desc: "Walk into real interviews fully prepared.",
  },
];

const HorizontalSteps = () => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  return (
    <section
      ref={ref}
      className="h-[200vh] bg-[#0a0a0f] flex items-center overflow-hidden"
    >
      <div className="sticky top-0 h-screen flex items-center">

        <motion.div
          style={{ x }}
          className="flex gap-8 px-20"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="w-[320px] h-[380px] rounded-2xl bg-gradient-to-br from-[#111] to-[#1a1a22] border border-white/10 p-6 flex flex-col justify-between shadow-xl"
            >
              {/* Step Number */}
              <div className="text-purple-400 text-sm">
                Step {i + 1}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-white text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="text-gray-400 mt-2 text-sm">
                  {step.desc}
                </p>
              </div>

              {/* Bottom glow line */}
              <div className="h-[2px] w-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-40" />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default HorizontalSteps;