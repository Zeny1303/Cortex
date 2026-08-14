import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../App'
import { FaArrowLeft } from 'react-icons/fa'

function InterviewHistory() {
    const [interviews, setInterviews] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true })
                setInterviews(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getMyInterviews()
    }, [])

    return (
        <div className='min-h-screen bg-[#171717] text-white py-12 px-6 selection:bg-[#ffdf20] selection:text-[#111111]'>
            <div className='w-full max-w-5xl mx-auto'>
                <div className='mb-10 flex items-center justify-between'>
                    <button
                        onClick={() => navigate("/")}
                        className='p-3.5 rounded-full bg-[#222222] border border-[#ffdf20]/30 text-[#ffdf20] hover:bg-[#ffdf20] hover:text-[#111111] transition-all shadow-md cursor-pointer'>
                        <FaArrowLeft size={18} />
                    </button>

                    <div className='text-center w-full'>
                        <h1 className='text-3xl md:text-5xl font-extrabold text-white tracking-tight'>
                            Interview <span className='text-[#ffdf20]'>History</span>
                        </h1>
                        <p className='text-neutral-400 mt-2 text-sm md:text-base'>
                            Review past mock interview sessions, scores, and performance feedback.
                        </p>
                    </div>
                    <div className='w-12'></div>
                </div>

                {interviews.length === 0 ? (
                    <div className='bg-[#222222] border border-neutral-800 p-12 rounded-3xl text-center shadow-xl'>
                        <p className='text-neutral-400 text-lg mb-6'>
                            No interview history found yet. Ready to practice?
                        </p>
                        <button onClick={()=>navigate("/interview")} className='bg-[#ffdf20] text-[#111111] font-bold px-8 py-3 rounded-full hover:bg-[#e6c81c] transition-all shadow-[0_0_15px_rgba(255,223,32,0.3)]'>
                            Start First Interview
                        </button>
                    </div>
                ) : (
                    <div className='grid gap-5'>
                        {interviews.map((item, index) => (
                            <div key={index}
                            onClick={()=>navigate(`/report/${item._id}`)}
                             className='bg-[#222222] p-6 rounded-3xl shadow-xl hover:shadow-[0_0_25px_rgba(255,223,32,0.15)] transition-all duration-300 cursor-pointer border border-neutral-800 hover:border-[#ffdf20]/50 group'>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-[#ffdf20] transition-colors">
                                            {item.role}
                                        </h3>

                                        <p className="text-neutral-400 text-sm mt-1">
                                            {item.experience} • <span className='text-neutral-300'>{item.mode} Mode</span>
                                        </p>

                                        <p className="text-xs text-neutral-500 mt-2 font-mono">
                                            {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-6'>
                                        {/* SCORE */}
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-[#ffdf20]">
                                                {item.finalScore || 0}<span className='text-neutral-500 text-base font-normal'>/10</span>
                                            </p>
                                            <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                                                Score
                                            </p>
                                        </div>

                                        {/* STATUS BADGE */}
                                        <span
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                                item.status === "completed"
                                                    ? "bg-[#ffdf20]/15 text-[#ffdf20] border-[#ffdf20]/40"
                                                    : "bg-amber-500/15 text-amber-400 border-amber-500/40"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default InterviewHistory
