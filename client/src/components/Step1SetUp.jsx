import React from 'react'
import { motion } from "motion/react"
import {
    FaUserTie,
    FaBriefcase,
    FaFileUpload,
    FaMicrophoneAlt,
    FaChartLine,
} from "react-icons/fa";
import { useState } from 'react';
import axios from "axios"
import { ServerUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function Step1SetUp({ onStart }) {
    const {userData}= useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);


    const handleUploadResume = async () => {
        if (!resumeFile || analyzing) return;
        setAnalyzing(true)

        const formdata = new FormData()
        formdata.append("resume", resumeFile)

        try {
            const result = await axios.post(ServerUrl + "/api/interview/resume", formdata, { withCredentials: true })

            console.log(result.data)

            setRole(result.data.role || "");
            setExperience(result.data.experience || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");
            setAnalysisDone(true);

            setAnalyzing(false);

        } catch (error) {
            console.log(error)
            setAnalyzing(false);
        }
    }

    const handleStart = async () => {
        setLoading(true)
        try {
           const result = await axios.post(ServerUrl + "/api/interview/generate-questions" , {role, experience, mode , resumeText, projects, skills } , {withCredentials:true}) 
           console.log(result.data)
           if(userData){
            dispatch(setUserData({...userData , credits:result.data.creditsLeft}))
           }
           setLoading(false)
           onStart(result.data)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='min-h-screen flex items-center justify-center bg-[#171717] px-4 py-12'>

            <div className='w-full max-w-6xl bg-[#222222] rounded-3xl shadow-2xl border border-neutral-800 grid md:grid-cols-2 overflow-hidden'>

                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className='relative bg-[#1c1c1c] p-10 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-neutral-800'>

                    <div className='absolute top-0 left-0 w-32 h-32 bg-[#ffdf20]/10 rounded-full blur-3xl pointer-events-none'></div>

                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight">
                        Start Your AI <span className='text-[#ffdf20]'>Interview</span>
                    </h2>

                    <p className="text-neutral-400 mb-10 text-sm md:text-base leading-relaxed">
                        Practice real engineering & behavioral scenarios powered by AI intelligence. Improve technical depth, confidence, and system design articulation.
                    </p>

                    <div className='space-y-4'>
                        {[
                            {
                                icon: <FaUserTie className="text-[#ffdf20] text-xl" />,
                                text: "Choose Role & Experience Level",
                            },
                            {
                                icon: <FaMicrophoneAlt className="text-[#ffdf20] text-xl" />,
                                text: "Smart Real-time Voice Interview",
                            },
                            {
                                icon: <FaChartLine className="text-[#ffdf20] text-xl" />,
                                text: "Detailed Performance Analytics",
                            },
                        ].map((item, index) => (
                            <motion.div key={index}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.15 }}
                                whileHover={{ scale: 1.02 }}
                                className='flex items-center space-x-4 bg-[#262626] border border-neutral-800 p-4 rounded-2xl shadow-md cursor-pointer hover:border-[#ffdf20]/40 transition-all'>
                                {item.icon}
                                <span className='text-neutral-200 font-medium text-sm md:text-base'>{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="p-10 md:p-12 bg-[#222222]">

                    <h2 className='text-2xl md:text-3xl font-extrabold text-white mb-8 tracking-tight'>
                        Interview <span className='text-[#ffdf20]'>Setup</span>
                    </h2>

                    <div className='space-y-6'>
                        <div className='relative'>
                            <FaUserTie className='absolute top-4 left-4 text-[#ffdf20]' />
                            <input type='text' placeholder='Enter target role (e.g. Frontend Engineer)'
                                className='w-full pl-12 pr-4 py-3.5 bg-[#171717] text-white placeholder-neutral-500 border border-neutral-800 rounded-xl focus:border-[#ffdf20] outline-none transition-all'
                                onChange={(e) => setRole(e.target.value)} value={role} />
                        </div>

                        <div className='relative'>
                            <FaBriefcase className='absolute top-4 left-4 text-[#ffdf20]' />
                            <input type='text' placeholder='Experience (e.g. 2 years)'
                                className='w-full pl-12 pr-4 py-3.5 bg-[#171717] text-white placeholder-neutral-500 border border-neutral-800 rounded-xl focus:border-[#ffdf20] outline-none transition-all'
                                onChange={(e) => setExperience(e.target.value)} value={experience} />
                        </div>

                        <select value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className='w-full py-3.5 px-4 bg-[#171717] text-white border border-neutral-800 rounded-xl focus:border-[#ffdf20] outline-none transition-all cursor-pointer'>
                            <option value="Technical">Technical Interview</option>
                            <option value="HR">HR Interview</option>
                        </select>

                        {!analysisDone && (
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                onClick={() => document.getElementById("resumeUpload").click()}
                                className='border-2 border-dashed border-neutral-700 hover:border-[#ffdf20] rounded-2xl p-8 text-center cursor-pointer bg-[#171717]/60 hover:bg-[#171717] transition-all'>
                                <FaFileUpload className='text-4xl mx-auto text-[#ffdf20] mb-3' />
                                <input type="file"
                                    accept="application/pdf"
                                    id="resumeUpload"
                                    className='hidden'
                                    onChange={(e) => setResumeFile(e.target.files[0])} />
                                <p className='text-neutral-300 font-medium text-sm'>
                                    {resumeFile ? resumeFile.name : "Click to upload resume PDF (Optional)"}
                                </p>

                                {resumeFile && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUploadResume()
                                        }}
                                        className='mt-4 bg-[#ffdf20] text-[#111111] font-bold px-6 py-2.5 rounded-xl hover:bg-[#e6c81c] transition-all shadow-[0_0_15px_rgba(255,223,32,0.25)] text-sm cursor-pointer'>
                                        {analyzing ? "Analyzing Resume..." : "Analyze Resume"}
                                    </motion.button>
                                )}
                            </motion.div>
                        )}

                        {analysisDone && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='bg-[#171717] border border-[#ffdf20]/30 rounded-2xl p-5 space-y-4'>
                                <h3 className='text-base font-bold text-[#ffdf20]'>
                                    Resume Analysis Result
                                </h3>

                                {projects.length > 0 && (
                                    <div>
                                        <p className='font-medium text-neutral-300 text-sm mb-1'>Projects:</p>
                                        <ul className='list-disc list-inside text-neutral-400 text-sm space-y-1'>
                                            {projects.map((p, i) => (
                                                <li key={i}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {skills.length > 0 && (
                                    <div>
                                        <p className='font-medium text-neutral-300 text-sm mb-2'>Skills:</p>
                                        <div className='flex flex-wrap gap-2'>
                                            {skills.map((s, i) => (
                                                <span key={i} className='bg-[#ffdf20]/15 text-[#ffdf20] border border-[#ffdf20]/30 px-3 py-1 rounded-full text-xs font-semibold'>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        <motion.button
                            onClick={handleStart}
                            disabled={!role || !experience || loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full disabled:bg-neutral-800 disabled:text-neutral-600 bg-[#ffdf20] hover:bg-[#e6c81c] text-[#111111] py-4 rounded-full text-lg font-bold transition duration-300 shadow-[0_0_20px_rgba(255,223,32,0.3)] cursor-pointer mt-4'>
                            {loading ? "Starting Interview..." : "Start Interview"}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default Step1SetUp
