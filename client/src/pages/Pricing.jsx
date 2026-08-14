import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react";
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch()

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
      isFeatured: true,
    },
  ];

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)

      const amount =  
      plan.id === "basic" ? 100 :
      plan.id === "pro" ? 500 : 0;

      const result = await axios.post(ServerUrl + "/api/payment/order" , {
        planId: plan.id,
        amount: amount,
        credits: plan.credits,
      },{withCredentials:true})
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "Cortex.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,

        handler:async function (response) {
          const verifypay = await axios.post(ServerUrl + "/api/payment/verify" ,response , {withCredentials:true})
          dispatch(setUserData(verifypay.data.user))

          alert("Payment Successful 🎉 Credits Added!");
          navigate("/")
        },
        theme:{
          color: "#ffdf20",
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

      setLoadingPlan(null);
    } catch (error) {
     console.log(error)
     setLoadingPlan(null);
    }
  }

  return (
    <div className='min-h-screen bg-[#141414] text-white py-16 px-6 relative overflow-hidden selection:bg-[#ffdf20] selection:text-[#111111]'>
      
      {/* Dynamic Background SVG Wave Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none stroke-neutral-500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pricing-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pricing-grid)" />
      </svg>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ffdf20]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className='max-w-6xl mx-auto relative z-10'>
        {/* Header Bar */}
        <div className='mb-14 flex items-center justify-between'>
          <button onClick={() => navigate("/")} className='p-3.5 rounded-full bg-[#1e1e1e] border border-neutral-800 text-[#ffdf20] hover:bg-[#ffdf20] hover:text-[#111111] transition-all shadow-md cursor-pointer'>
            <FaArrowLeft size={18} />
          </button>

          <div className="text-center w-full">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Choose Your <span className='text-[#ffdf20]'>Plan</span>
            </h1>
            <p className="text-neutral-400 mt-3 text-base md:text-lg">
              Flexible credit packages to power your mock interview sessions.
            </p>
          </div>
          <div className='w-12'></div>
        </div>

        {/* Handwriting Callout Annotation for Featured Plan */}
        <div className='hidden md:flex justify-end max-w-6xl pr-12 mb-2'>
          <div className="font-['Caveat',cursive] text-[#ffdf20] text-2xl font-bold flex items-center gap-2 animate-bounce">
            <span>Start from here</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto'>
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id

            return (
              <motion.div key={plan.id}
                whileHover={!plan.default && { scale: 1.02 }}
                onClick={() => !plan.default && setSelectedPlan(plan.id)}
                className={`relative rounded-3xl p-8 transition-all duration-300 border flex flex-col justify-between
                  ${plan.isFeatured
                    ? "border-2 border-[#ffdf20] shadow-[0_0_40px_rgba(255,223,32,0.25)] bg-[#1c1c1c] md:-mt-4 md:mb-4 z-20"
                    : isSelected
                    ? "border-[#ffdf20]/80 bg-[#1c1c1c] shadow-2xl"
                    : "border-neutral-800 bg-[#181818] hover:border-neutral-700 shadow-xl"
                  }
                  ${plan.default ? "cursor-default opacity-85" : "cursor-pointer"}
                `}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-6 right-6 bg-[#ffdf20] text-[#111111] font-black text-xs px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,223,32,0.4)] uppercase tracking-wider">
                    {plan.badge}
                  </div>
                )}

                {/* Default Tag */}
                {plan.default && (
                  <div className="absolute top-6 right-6 bg-neutral-800 text-neutral-400 text-xs px-3.5 py-1 rounded-full border border-neutral-700 font-medium">
                    Default
                  </div>
                )}

                <div>
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-4">
                    <span className="text-4xl md:text-5xl font-black text-[#ffdf20] tracking-tight">
                      {plan.price}
                    </span>
                    <p className="text-neutral-400 text-sm mt-1 font-medium">
                      {plan.credits} Credits Included
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-neutral-400 mt-4 text-sm leading-relaxed border-b border-neutral-800 pb-5">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <div className="mt-6 space-y-3.5 text-left">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <FaCheckCircle className="text-[#ffdf20] text-sm shrink-0" />
                        <span className="text-neutral-300 text-sm font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {!plan.default &&
                  <button
                    disabled={loadingPlan === plan.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSelected) {
                        setSelectedPlan(plan.id)
                      } else {
                        handlePayment(plan)
                      }
                    }} 
                    className={`w-full mt-8 py-3.5 rounded-xl font-bold transition-all shadow-md cursor-pointer ${
                      plan.isFeatured || isSelected
                        ? "bg-[#ffdf20] text-[#111111] hover:bg-[#e6c81c] shadow-[0_0_20px_rgba(255,223,32,0.35)]"
                        : "bg-transparent text-white border border-[#ffdf20]/60 hover:bg-[#ffdf20] hover:text-[#111111]"
                    }`}>
                    {loadingPlan === plan.id
                      ? "Processing..."
                      : isSelected || plan.isFeatured
                        ? "Proceed to Pay"
                        : "Select Plan"}
                  </button>
                }
              </motion.div>
            )
          })}
        </div>

        {/* Handwriting Guarantees Callout Banner */}
        <div className="text-center font-['Caveat',cursive] text-[#ffdf20] text-2xl font-bold mt-12 flex flex-wrap justify-center items-center gap-8">
          <span>✓ 100% Money Back Guarantee</span>
          <span>✓ Instant Credits Addition</span>
          <span>✓ 24/7 AI Interview Access</span>
        </div>
      </div>
    </div>
  )
}

export default Pricing
