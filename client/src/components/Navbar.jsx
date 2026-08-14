import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';

function Navbar() {
    const {userData} = useSelector((state)=>state.user)
    const [showCreditPopup,setShowCreditPopup] = useState(false)
    const [showUserPopup,setShowUserPopup] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showAuth, setShowAuth] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.get(ServerUrl + "/api/auth/logout" , {withCredentials:true})
            dispatch(setUserData(null))
            setShowCreditPopup(false)
            setShowUserPopup(false)
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='bg-[#171717] flex justify-center px-4 pt-6 sticky top-0 z-40'>
        <motion.div 
        initial={{opacity:0 , y:-40}}
        animate={{opacity:1 , y:0}}
        transition={{duration: 0.3}}
        className='w-full max-w-6xl bg-[#222222]/90 backdrop-blur-md rounded-[24px] shadow-2xl border border-[#ffdf20]/30 px-8 py-4 flex justify-between items-center relative'>
            <Link to='/' className='flex items-center gap-3 cursor-pointer group'>
                <div className='bg-[#ffdf20] text-[#111111] p-2.5 rounded-xl shadow-[0_0_15px_rgba(255,223,32,0.3)] transition-transform group-hover:scale-105'>
                    <BsRobot size={20}/>
                </div>
                <h1 className='font-bold hidden md:block text-xl tracking-tight text-white group-hover:text-[#ffdf20] transition-colors'>
                    Cortex<span className='text-[#ffdf20]'>.AI</span>
                </h1>
            </Link>

            <div className='flex items-center gap-6 relative'>
                <div className='relative'>
                    <button onClick={()=>{
                        if(!userData){
                            setShowAuth(true)
                            return;
                        }
                        setShowCreditPopup(!showCreditPopup);
                        setShowUserPopup(false)
                    }} className='flex items-center gap-2 bg-[#171717] border border-[#ffdf20]/40 text-[#ffdf20] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#ffdf20] hover:text-[#111111] transition-all shadow-inner'>
                        <BsCoin size={18}/>
                        <span>{userData?.credits || 0} Credits</span>
                    </button>

                    {showCreditPopup && (
                        <div className='absolute right-[-20px] mt-3 w-64 bg-[#262626] shadow-2xl border border-[#ffdf20]/40 rounded-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2'>
                            <p className='text-sm text-neutral-300 mb-4'>Need more credits for AI mock interviews?</p>
                            <button onClick={()=>{
                                setShowCreditPopup(false)
                                navigate("/pricing")
                            }} className='w-full bg-[#ffdf20] text-[#111111] font-bold py-2.5 rounded-xl text-sm hover:bg-[#e6c81c] transition-all shadow-[0_0_15px_rgba(255,223,32,0.2)]'>
                                Buy More Credits
                            </button>
                        </div>
                    )}
                </div>

                <div className='relative'>
                    <button
                    onClick={()=>{
                         if(!userData){
                            setShowAuth(true)
                            return;
                        }
                        setShowUserPopup(!showUserPopup);
                        setShowCreditPopup(false)
                    }} className='w-10 h-10 bg-[#ffdf20] text-[#111111] rounded-full flex items-center justify-center font-extrabold shadow-[0_0_12px_rgba(255,223,32,0.3)] hover:scale-105 transition-transform'>
                        {userData ? userData?.name.slice(0,1).toUpperCase() : <FaUserAstronaut size={18}/>}
                    </button>

                    {showUserPopup && (
                        <div className='absolute right-0 mt-3 w-52 bg-[#262626] shadow-2xl border border-[#ffdf20]/40 rounded-2xl p-4 z-50'>
                            <p className='text-sm font-bold text-[#ffdf20] mb-2 truncate border-b border-neutral-800 pb-2'>{userData?.name}</p>

                            <button onClick={()=>{
                                setShowUserPopup(false)
                                navigate("/history")
                            }} className='w-full text-left text-sm py-2 hover:text-[#ffdf20] text-neutral-300 font-medium transition-colors'>
                                Interview History
                            </button>
                            <button onClick={handleLogout} 
                            className='w-full text-left text-sm py-2 flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-colors'>
                                <HiOutlineLogout size={16}/>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>

        {showAuth && <AuthModel onClose={()=>setShowAuth(false)}/>}
    </div>
  )
}

export default Navbar
