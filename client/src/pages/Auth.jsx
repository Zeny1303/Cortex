import React from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Auth({isModel = false}) {
    const dispatch = useDispatch()

    const handleGoogleAuth = async () => {
        try {
            const response = await signInWithPopup(auth,provider)
            let User = response.user
            let name = User.displayName
            let email = User.email
            const result = await axios.post(ServerUrl + "/api/auth/google" , {name , email} , {withCredentials:true})
            dispatch(setUserData(result.data))
        } catch (error) {
            console.log(error)
            dispatch(setUserData(null))
        }
    }

  return (
    <div className={`
      w-full 
      ${isModel ? "py-4" : "min-h-screen bg-[#171717] flex items-center justify-center px-6 py-20"}
    `}>
        <motion.div 
        initial={{opacity:0 , y:-30}} 
        animate={{opacity:1 , y:0}} 
        transition={{duration:0.6}}
        className={`
        w-full 
        ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"}
        bg-[#222222] shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-[#ffdf20]/30 relative overflow-hidden
      `}>
            {/* Background yellow subtle gradient overlay */}
            <div className='absolute -top-24 -right-24 w-48 h-48 bg-[#ffdf20]/10 rounded-full blur-3xl pointer-events-none'></div>

            <div className='flex items-center justify-center gap-3 mb-6'>
                <div className='bg-[#ffdf20] text-[#111111] p-2.5 rounded-xl shadow-[0_0_15px_rgba(255,223,32,0.3)]'>
                    <BsRobot size={20}/>
                </div>
                <h2 className='font-bold text-xl text-white tracking-tight'>
                  Cortex<span className='text-[#ffdf20]'>.AI</span>
                </h2>
            </div>

            <h1 className='text-2xl md:text-3xl font-extrabold text-center text-white leading-snug mb-4'>
                Continue with{" "}
                <span className='bg-[#ffdf20]/15 text-[#ffdf20] border border-[#ffdf20]/40 px-3.5 py-1 rounded-full inline-flex items-center gap-2 text-xl font-bold'>
                    <IoSparkles size={18}/>
                    AI Mock Interview
                </span>
            </h1>

            <p className='text-neutral-400 text-center text-sm md:text-base leading-relaxed mb-8'>
                Sign in to start AI-powered mock interviews, track your skill matrix, and receive production-grade feedback.
            </p>

            <motion.button 
            onClick={handleGoogleAuth}
            whileHover={{opacity:0.95, scale:1.02}}
            whileTap={{opacity:1, scale:0.98}}
            className='w-full flex items-center justify-center gap-3 py-3.5 bg-[#ffdf20] text-[#111111] font-bold rounded-full shadow-[0_0_20px_rgba(255,223,32,0.25)] hover:bg-[#e6c81c] transition-all cursor-pointer'>
                <FcGoogle size={22}/>
                <span>Continue with Google</span>
            </motion.button>
        </motion.div>
    </div>
  )
}

export default Auth
