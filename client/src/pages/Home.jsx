import React from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthModel from '../components/AuthModel';
import maleVideo from "../assets/videos/male-ai.mp4";
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from '../components/Footer';

function Home() {
  const { userData } = useSelector((state) => state.user)
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-[#171717] text-white flex flex-col selection:bg-[#ffdf20] selection:text-[#111111]'>
      <Navbar />

      <div className='flex-1 px-6 py-16 md:py-24'>
        <div className='max-w-6xl mx-auto'>

          {/* Hero Top Badge */}
          <div className='flex justify-center mb-8'>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className='bg-[#ffdf20]/10 border border-[#ffdf20]/40 text-[#ffdf20] text-xs md:text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(255,223,32,0.15)]'>
              <HiSparkles size={18} className="text-[#ffdf20]" />
              <span>AI Powered Smart Interview Platform</span>
            </motion.div>
          </div>

          {/* Hero Header */}
          <div className='text-center mb-24'>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-white'>
              Practice Interviews with{" "}
              <span className='relative inline-block mt-2 md:mt-0'>
                <span className='bg-[#ffdf20] text-[#111111] px-6 py-1.5 rounded-full font-black shadow-[0_0_25px_rgba(255,223,32,0.4)]'>
                  AI Intelligence
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className='text-neutral-400 mt-8 max-w-2xl mx-auto text-base md:text-xl leading-relaxed'>
              Role-based mock interviews with smart follow-ups, adaptive difficulty, and real-time production-grade evaluation.
            </motion.p>

            <div className='flex flex-wrap justify-center gap-5 mt-10'>
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return;
                  }
                  navigate("/interview")
                }}
                whileHover={{ opacity: 0.95, scale: 1.04 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className='bg-[#ffdf20] text-[#111111] font-bold px-10 py-3.5 rounded-full hover:bg-[#e6c81c] transition-all shadow-[0_0_20px_rgba(255,223,32,0.3)] text-base cursor-pointer'>
                Start Interview
              </motion.button>

              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return;
                  }
                  navigate("/history")
                }}
                whileHover={{ opacity: 0.95, scale: 1.04 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className='border border-[#ffdf20]/40 text-white font-semibold px-10 py-3.5 rounded-full hover:bg-[#ffdf20]/10 hover:border-[#ffdf20] transition-all text-base cursor-pointer'>
                View History
              </motion.button>
            </div>
          </div>

          {/* Product Overview Showcase (Inspired by Coder's Gyan Browser Showcase & Live Interview UI) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className='mb-32'>
            <div className='text-center mb-8'>
              <span className='font-mono text-xs text-[#ffdf20] uppercase tracking-widest font-semibold bg-[#ffdf20]/10 border border-[#ffdf20]/30 px-3.5 py-1.5 rounded-full inline-block mb-3'>
                Product Overview
              </span>
              <h2 className='text-3xl md:text-5xl font-extrabold text-white tracking-tight'>
                Experience the Live <span className='text-[#ffdf20]'>AI Interview Workspace</span>
              </h2>
            </div>

            {/* Outer Browser Window Frame (Coder's Gyan Style) */}
            <div className='w-full bg-[#1c1c1c] border border-neutral-800 rounded-3xl p-3 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-xl'>
              
              {/* Browser Window Header */}
              <div className='flex items-center justify-between px-4 pb-3 border-b border-neutral-800/80 mb-4'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full bg-red-500/80'></div>
                  <div className='w-3 h-3 rounded-full bg-amber-500/80'></div>
                  <div className='w-3 h-3 rounded-full bg-emerald-500/80'></div>
                </div>

                {/* Mock Address Bar */}
                <div className='bg-[#121212] border border-neutral-800 text-neutral-400 text-xs px-6 py-1.5 rounded-full flex items-center gap-2 font-mono max-w-sm w-full justify-center'>
                  <span className='text-emerald-400 text-[10px]'>🔒</span>
                  <span className='truncate'>https://cortex.ai/session/demo</span>
                </div>

                <div className='w-12'></div>
              </div>

              {/* Inner Live Interview Mock UI (Image 1 replica) */}
              <div className='bg-[#141414] rounded-2xl border border-neutral-800/90 p-4 sm:p-6 lg:p-8 grid lg:grid-cols-12 gap-6 items-start'>
                
                {/* Left Panel: AI Avatar + Greeting + Status + Timer */}
                <div className='lg:col-span-5 space-y-5'>
                  {/* AI Avatar Frame */}
                  <div className='relative rounded-2xl overflow-hidden border border-[#ffdf20]/30 shadow-[0_0_20px_rgba(255,223,32,0.12)] bg-[#1c1c1c] aspect-video flex items-center justify-center'>
                    <video 
                      src={maleVideo} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className='w-full h-full object-cover' 
                    />
                    <div className='absolute bottom-3 left-3 bg-[#121212]/80 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-700 text-xs font-semibold text-white flex items-center gap-2 z-10'>
                      <span className='w-2 h-2 rounded-full bg-emerald-400 animate-ping'></span>
                      AI Interviewer Active
                    </div>
                  </div>

                  {/* Subtitle / AI Greeting Box */}
                  <div className='bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-4.5 shadow-inner'>
                    <p className='text-neutral-200 text-xs sm:text-sm font-medium leading-relaxed'>
                      "Hi Sneha, it's great to meet you today. I hope you're feeling confident and ready for your technical evaluation."
                    </p>
                  </div>

                  {/* Timer & Status Box */}
                  <div className='bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-5 space-y-4'>
                    <div className='flex justify-between items-center text-xs font-bold uppercase tracking-wider'>
                      <span className='text-neutral-400'>INTERVIEW STATUS</span>
                      <span className='bg-[#ffdf20]/15 text-[#ffdf20] border border-[#ffdf20]/40 px-3 py-1 rounded-full text-[11px] animate-pulse'>
                        AI Speaking
                      </span>
                    </div>

                    <div className='h-px bg-neutral-800'></div>

                    <div className='flex justify-center py-2'>
                      <div className='w-20 h-20 rounded-full border-4 border-[#ffdf20] flex items-center justify-center font-bold text-white text-xl shadow-[0_0_20px_rgba(255,223,32,0.3)] bg-[#121212]'>
                        60s
                      </div>
                    </div>

                    <div className='h-px bg-neutral-800'></div>

                    <div className='grid grid-cols-2 gap-4 text-center'>
                      <div>
                        <span className='text-xl font-black text-[#ffdf20] block'>1</span>
                        <span className='text-[10px] text-neutral-400 font-bold uppercase tracking-wider'>CURRENT QS</span>
                      </div>
                      <div>
                        <span className='text-xl font-black text-white block'>5</span>
                        <span className='text-[10px] text-neutral-400 font-bold uppercase tracking-wider'>TOTAL QS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: AI Smart Session Workspace */}
                <div className='lg:col-span-7 bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-5 sm:p-7 flex flex-col justify-between space-y-6 min-h-[440px]'>
                  <div>
                    <h3 className='text-xl sm:text-2xl font-extrabold text-white mb-4'>
                      AI Smart <span className='text-[#ffdf20]'>Interview Session</span>
                    </h3>

                    {/* Question Bubble */}
                    <div className='bg-[#141414] border border-[#ffdf20]/30 rounded-xl p-4 mb-4'>
                      <span className='text-xs font-bold text-[#ffdf20] uppercase tracking-wider block mb-1'>Question 1 of 5</span>
                      <p className='text-sm text-neutral-200 font-semibold leading-relaxed'>
                        "Could you explain how React handles state updates under the hood and how key reconciliation optimizes DOM rendering?"
                      </p>
                    </div>

                    {/* Textarea Response Area */}
                    <textarea 
                      readOnly 
                      value="React uses a virtual DOM to batch state updates efficiently. When setState is called, React triggers a re-render phase..." 
                      className='w-full bg-[#141414] border border-neutral-800 rounded-2xl p-4 text-sm text-neutral-300 outline-none resize-none min-h-[140px] font-medium leading-relaxed' 
                    />
                  </div>

                  {/* Bottom Controls: Yellow Mic Button + Yellow Submit Button */}
                  <div className='flex items-center gap-4 pt-2'>
                    <button className='w-13 h-13 rounded-full bg-[#ffdf20] text-[#111111] flex items-center justify-center shadow-[0_0_15px_rgba(255,223,32,0.3)] shrink-0 font-bold'>
                      <BsMic size={22} />
                    </button>

                    <button 
                      onClick={() => {
                        if (!userData) {
                          setShowAuth(true);
                        } else {
                          navigate("/interview");
                        }
                      }}
                      className='flex-1 bg-[#ffdf20] hover:bg-[#e6c81c] text-[#111111] font-black py-4 px-6 rounded-2xl shadow-[0_0_25px_rgba(255,223,32,0.35)] transition-all text-center text-sm sm:text-base cursor-pointer'>
                      Submit Answer
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Redesigned 3 Step Cards Section (Inspired by Reference Design) */}
          <div className='relative mb-32'>
            
            {/* Cards Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-stretch relative z-10'>
              {
                [
                  {
                    icon: <BsRobot size={24} />,
                    step: "STEP 01",
                    title: "Role & Experience Selection",
                    desc: "AI adjusts interview depth and difficulty dynamically based on your target role."
                  },
                  {
                    icon: <BsMic size={24} />,
                    step: "STEP 02",
                    title: "Smart Voice Interview",
                    desc: "Dynamic, contextual follow-up questions tailored to your live audio responses."
                  },
                  {
                    icon: <BsClock size={24} />,
                    step: "STEP 03",
                    title: "Timer-Based Simulation",
                    desc: "Simulate real engineering interview pressure with accurate time constraints."
                  }
                ].map((item, index) => (
                  <React.Fragment key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                      whileHover={{ y: -6 }}
                      className='relative bg-[#181818]/95 backdrop-blur-xl rounded-[32px] border border-[#ffdf20]/30 shadow-[0_0_35px_rgba(0,0,0,0.8)] hover:border-[#ffdf20] hover:shadow-[0_0_35px_rgba(255,223,32,0.25)] transition-all duration-300 p-8 sm:p-10 pt-12 text-center flex flex-col items-center justify-between min-h-[280px]'>
                      
                      {/* Top Icon Badge (Overlapping border) */}
                      <div className='absolute -top-7 left-1/2 -translate-x-1/2 bg-[#121212] border border-[#ffdf20] text-[#ffdf20] w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,223,32,0.4)]'>
                        {item.icon}
                      </div>

                      <div className='w-full pt-3'>
                        {/* Step Tag */}
                        <span className='text-xs text-[#ffdf20] font-black tracking-[0.2em] uppercase mb-3 block'>
                          {item.step}
                        </span>

                        {/* Step Title */}
                        <h3 className='text-xl md:text-2xl font-extrabold text-white mb-3 leading-snug tracking-tight'>
                          {item.title}
                        </h3>

                        {/* Small Accent Line Divider */}
                        <div className='w-8 h-0.5 bg-[#ffdf20] mx-auto mb-4 opacity-80 rounded-full shadow-[0_0_8px_rgba(255,223,32,0.5)]'></div>

                        {/* Step Description */}
                        <p className='text-sm text-neutral-400 leading-relaxed max-w-xs mx-auto font-normal'>
                          {item.desc}
                        </p>
                      </div>

                    </motion.div>

                    {/* Mobile Downward Yellow Arrow between steps */}
                    {index < 2 && (
                      <div className="flex lg:hidden justify-center my-2 filter drop-shadow-[0_0_10px_rgba(255,217,26,0.6)]">
                        <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90 w-12 h-auto">
                          <path
                            d="M8 20H100"
                            stroke="#FFD91A"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <path
                            d="M86 8L100 20L86 32"
                            stroke="#FFD91A"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                ))
              }
            </div>

            {/* Connecting Yellow Arrows between Steps (Desktop Only Overlay) */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none z-20">
              {/* Arrow between Card 1 & Card 2 */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[33.3%] -translate-x-1/2 flex items-center justify-center">
                <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 xl:w-28 h-auto filter drop-shadow-[0_0_10px_rgba(255,217,26,0.6)]">
                  <path
                    d="M8 20H100"
                    stroke="#FFD91A"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M86 8L100 20L86 32"
                    stroke="#FFD91A"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Arrow between Card 2 & Card 3 */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[66.7%] -translate-x-1/2 flex items-center justify-center">
                <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 xl:w-28 h-auto filter drop-shadow-[0_0_10px_rgba(255,217,26,0.6)]">
                  <path
                    d="M8 20H100"
                    stroke="#FFD91A"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M86 8L100 20L86 32"
                    stroke="#FFD91A"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

          </div>

          {/* AI Capabilities Section */}
          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-3xl md:text-5xl font-extrabold text-center mb-16 text-white tracking-tight'>
              Advanced AI{" "}
              <span className="text-[#ffdf20]">Capabilities</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-8'>
              {
                [
                  {
                    image: evalImg,
                    icon: <BsBarChart size={22} />,
                    title: "AI Answer Evaluation",
                    desc: "Evaluates technical accuracy, communication clarity, and problem-solving depth."
                  },
                  {
                    image: resumeImg,
                    icon: <BsFileEarmarkText size={22} />,
                    title: "Resume-Based Interview",
                    desc: "Extracts project details and asks deep questions tailored specifically to your resume."
                  },
                  {
                    image: pdfImg,
                    icon: <BsFileEarmarkText size={22} />,
                    title: "Downloadable PDF Report",
                    desc: "Comprehensive feedback report with key strengths, gaps, and improvement insights."
                  },
                  {
                    image: analyticsImg,
                    icon: <BsBarChart size={22} />,
                    title: "History & Analytics",
                    desc: "Track long-term progression with performance history and topic-wise metrics."
                  }
                ].map((item, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className='bg-[#222222] border border-neutral-800 hover:border-[#ffdf20]/50 rounded-3xl p-8 shadow-2xl hover:shadow-[0_0_25px_rgba(255,223,32,0.1)] transition-all'>
                    <div className='flex flex-col md:flex-row items-center gap-8'>
                      <div className='w-full md:w-1/2 flex justify-center bg-[#171717]/60 p-4 rounded-2xl border border-neutral-800/80'>
                        <img src={item.image} alt={item.title} className='w-full h-auto object-contain max-h-56' />
                      </div>

                      <div className='w-full md:w-1/2'>
                        <div className='bg-[#ffdf20]/15 border border-[#ffdf20]/30 text-[#ffdf20] w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-[0_0_10px_rgba(255,223,32,0.2)]'>
                          {item.icon}
                        </div>
                        <h3 className='font-bold mb-3 text-xl text-white'>{item.title}</h3>
                        <p className='text-neutral-400 text-sm leading-relaxed'>{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </div>

          {/* Interview Modes Section */}
          <div className='mb-24'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-3xl md:text-5xl font-extrabold text-center mb-16 text-white tracking-tight'>
              Multiple Interview{" "}
              <span className="text-[#ffdf20]">Modes</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-8'>
              {
                [
                  {
                    img: hrImg,
                    title: "HR Interview Mode",
                    desc: "Behavioral questions, situational judgment, and communication clarity."
                  },
                  {
                    img: techImg,
                    title: "Technical Mode",
                    desc: "Deep technical questions, DSA concepts, architecture, and coding logic."
                  },
                  {
                    img: confidenceImg,
                    title: "Confidence Detection",
                    desc: "Real-time speech pacing, tone, and delivery confidence analysis."
                  },
                  {
                    img: creditImg,
                    title: "Credit System",
                    desc: "Flexible credits for unlocking mock interviews on demand."
                  }
                ].map((mode, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="bg-[#222222] border border-neutral-800 hover:border-[#ffdf20]/50 rounded-3xl p-8 shadow-2xl hover:shadow-[0_0_25px_rgba(255,223,32,0.1)] transition-all">

                    <div className='flex items-center justify-between gap-6'>
                      <div className="w-1/2">
                        <h3 className="font-bold text-xl mb-3 text-white">
                          {mode.title}
                        </h3>

                        <p className="text-neutral-400 text-sm leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>

                      <div className="w-1/2 flex justify-end bg-[#171717]/60 p-4 rounded-2xl border border-neutral-800/80">
                        <img
                          src={mode.img}
                          alt={mode.title}
                          className="w-28 h-28 object-contain"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </div>

        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      <Footer/>
    </div>
  )
}

export default Home
