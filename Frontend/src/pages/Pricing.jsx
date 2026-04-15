import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Zap, CreditCard, Calendar } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useBooking, INTERVIEW_TYPES } from '../context/BookingContext';
import {
  useUsage,
  SUBSCRIPTION_PLANS,
  PAY_PER_USE_PRICE_INR,
  FREE_INTERVIEWS_TOTAL,
} from '../context/UsageContext';

function SectionLabel({ num, label }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">{num}.</span>
      <span className="text-xs font-black uppercase tracking-widest text-black dark:text-white">{label}</span>
      <div className="flex-1 h-px bg-black dark:bg-white" />
    </div>
  );
}

export default function Pricing() {
  const navigate = useNavigate();
  const { booking } = useBooking();
  const { usage, canStartInterview, activatePlan, usePayPerUse } = useUsage();

  const [activatingPlan, setActivatingPlan] = useState(null);

  const selectedType = INTERVIEW_TYPES.find(t => t.id === booking.type);

  // Guard: if no type selected, redirect to step 1
  React.useEffect(() => {
    if (!booking.type) navigate('/select-type', { replace: true });
  }, [booking.type, navigate]);

  if (!booking.type) return null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStartFree = () => {
    navigate('/interview/session');
  };

  const handlePayPerUse = () => {
    // TODO: open Razorpay/Stripe modal
    // For now, simulate payment success
    usePayPerUse();
    navigate('/interview/session');
  };

  const handleSubscribe = (planId) => {
    setActivatingPlan(planId);
    // TODO: open payment gateway
    // Simulate instant activation for now
    setTimeout(() => {
      activatePlan(planId);
      setActivatingPlan(null);
      navigate('/interview/session');
    }, 800);
  };

  // ── Subscription status ───────────────────────────────────────────────────
  const hasSub = usage.subscription && new Date(usage.subscription.expiryDate) >= new Date();
  const subPlan = hasSub ? SUBSCRIPTION_PLANS.find(p => p.id === usage.subscription.plan) : null;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white swiss-noise relative flex flex-col">

      {/* Top bar */}
      <div className="border-b-2 border-black dark:border-white flex items-stretch h-14 sticky top-0 bg-white dark:bg-black z-40">
        <a href="/"
          className="flex items-center px-6 border-r-2 border-black dark:border-white
                     font-black text-sm uppercase tracking-widest
                     hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
                     transition-colors duration-150">
          CORTEX
        </a>

        {/* Breadcrumb */}
        <div className="flex items-stretch overflow-x-auto">
          {['Type', 'Access', 'Interview'].map((s, i) => (
            <div key={s}
              className={`flex items-center px-5 border-r-2 border-black dark:border-white
                          text-[10px] font-black uppercase tracking-widest
                          ${i === 1
                            ? 'bg-black dark:bg-white text-white dark:text-black'
                            : i === 0
                              ? 'bg-swiss-muted dark:bg-white/5 text-black/40 dark:text-white/40'
                              : 'bg-white dark:bg-black text-black/20 dark:text-white/20'}`}>
              <span className={`mr-2 ${i === 1 ? 'text-swiss-accent' : ''}`}>
                {String(i + 1).padStart(2, '0')}.
              </span>
              {s}
            </div>
          ))}
        </div>

        <div className="ml-auto flex items-stretch">
          <button
            onClick={() => navigate('/select-type')}
            className="flex items-center px-6 border-l-2 border-black dark:border-white
                       text-xs font-black uppercase tracking-widest
                       hover:bg-swiss-muted dark:hover:bg-white/10 transition-colors duration-150"
          >
            ← Back
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Page header */}
      <div className="border-b-2 border-black dark:border-white px-6 lg:px-12 py-8 swiss-grid-pattern bg-swiss-muted dark:bg-white/5">
        <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
          Step 02 / 03 — {selectedType?.label}
        </span>
        <h1 className="mt-2 font-black uppercase tracking-tighter leading-none text-[clamp(2.5rem,6vw,5rem)]">
          CHOOSE<br />YOUR ACCESS.
        </h1>
      </div>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">

        {/* Left: pricing options */}
        <div className="lg:col-span-8 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white">

          {/* ── 01. Free Tier ── */}
          <div className="border-b-2 border-black dark:border-white p-6 lg:p-10">
            <SectionLabel num="01" label="Free Usage" />

            <div className={`border-2 flex items-center justify-between p-6
              ${usage.freeInterviewsLeft > 0
                ? 'border-black dark:border-white'
                : 'border-black/20 dark:border-white/20 opacity-50'}`}>
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 border-2 border-black dark:border-white flex items-center justify-center flex-shrink-0">
                  <Zap size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight">Free Interviews</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mt-0.5">
                    {FREE_INTERVIEWS_TOTAL} total · one-time · all types
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-3xl font-black tracking-tighter">
                    {usage.freeInterviewsLeft}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                    remaining
                  </p>
                </div>
                <button
                  onClick={handleStartFree}
                  disabled={usage.freeInterviewsLeft === 0}
                  className="h-12 px-6 flex items-center gap-2
                             bg-black dark:bg-white text-white dark:text-black
                             text-xs font-black uppercase tracking-widest
                             border-2 border-black dark:border-white
                             hover:bg-swiss-accent hover:border-swiss-accent
                             dark:hover:bg-swiss-accent dark:hover:border-swiss-accent dark:hover:text-white
                             disabled:opacity-30 disabled:cursor-not-allowed
                             transition-colors duration-150"
                >
                  Start Free
                  <ArrowRight size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>

          {/* ── 02. Pay-per-use ── */}
          <div className="border-b-2 border-black dark:border-white p-6 lg:p-10">
            <SectionLabel num="02" label="Pay Per Interview" />

            <div className="border-2 border-black dark:border-white flex items-center justify-between p-6">
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 border-2 border-black dark:border-white flex items-center justify-center flex-shrink-0">
                  <CreditCard size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight">Single Interview</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mt-0.5">
                    No commitment · instant access · any type
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-3xl font-black tracking-tighter">
                    ₹{PAY_PER_USE_PRICE_INR}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                    per interview
                  </p>
                </div>
                <button
                  onClick={handlePayPerUse}
                  className="h-12 px-6 flex items-center gap-2
                             bg-black dark:bg-white text-white dark:text-black
                             text-xs font-black uppercase tracking-widest
                             border-2 border-black dark:border-white
                             hover:bg-swiss-accent hover:border-swiss-accent
                             dark:hover:bg-swiss-accent dark:hover:border-swiss-accent dark:hover:text-white
                             transition-colors duration-150"
                >
                  Pay & Start
                  <ArrowRight size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>

          {/* ── 03. Subscription Plans ── */}
          <div className="p-6 lg:p-10">
            <SectionLabel num="03" label="Subscription Plans" />

            <div className="border-2 border-black dark:border-white">
              {SUBSCRIPTION_PLANS.map((plan, i) => {
                const isActive = hasSub && usage.subscription.plan === plan.id;
                const isLoading = activatingPlan === plan.id;
                const isLast = i === SUBSCRIPTION_PLANS.length - 1;

                return (
                  <div
                    key={plan.id}
                    className={`flex items-center justify-between p-5
                      ${!isLast ? 'border-b-2 border-black dark:border-white' : ''}
                      ${plan.bestValue ? 'bg-black dark:bg-white text-white dark:text-black' : ''}
                      ${isActive && !plan.bestValue ? 'bg-swiss-muted dark:bg-white/5' : ''}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-10 h-10 border-2 flex items-center justify-center flex-shrink-0
                        ${plan.bestValue ? 'border-white dark:border-black' : 'border-black dark:border-white'}`}>
                        <Calendar size={16} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black uppercase tracking-tight">
                            {plan.label}
                          </span>
                          {plan.bestValue && (
                            <span className="text-[10px] font-black uppercase tracking-widest
                                             px-2 py-0.5 bg-swiss-accent text-white">
                              Best Value 🔥
                            </span>
                          )}
                          {isActive && (
                            <span className="text-[10px] font-black uppercase tracking-widest
                                             px-2 py-0.5 border border-current opacity-60">
                              Active
                            </span>
                          )}
                        </div>
                        <p className={`text-xs font-bold uppercase tracking-widest mt-0.5
                          ${plan.bestValue ? 'text-white/60 dark:text-black/60' : 'text-black/40 dark:text-white/40'}`}>
                          {plan.interviewsPerMonth} interviews/month
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-2xl font-black tracking-tighter">
                          ₹{plan.priceINR}
                        </p>
                        <p className={`text-[10px] font-black uppercase tracking-widest
                          ${plan.bestValue ? 'text-white/50 dark:text-black/50' : 'text-black/40 dark:text-white/40'}`}>
                          ₹{Math.round(plan.priceINR / plan.durationMonths)}/mo
                        </p>
                      </div>

                      {isActive ? (
                        <button
                          onClick={() => navigate('/interview/session')}
                          className={`h-12 px-6 flex items-center gap-2
                                     text-xs font-black uppercase tracking-widest
                                     border-2 transition-colors duration-150
                                     ${plan.bestValue
                                       ? 'border-white dark:border-black bg-swiss-accent text-white hover:bg-white hover:text-black'
                                       : 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black hover:bg-swiss-accent hover:border-swiss-accent'}`}
                        >
                          Start Interview
                          <ArrowRight size={14} strokeWidth={3} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSubscribe(plan.id)}
                          disabled={!!activatingPlan}
                          className={`h-12 px-6 flex items-center gap-2
                                     text-xs font-black uppercase tracking-widest
                                     border-2 transition-colors duration-150
                                     disabled:opacity-40 disabled:cursor-not-allowed
                                     ${plan.bestValue
                                       ? 'border-white dark:border-black text-white dark:text-black hover:bg-swiss-accent hover:border-swiss-accent hover:text-white'
                                       : 'border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'}`}
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin" />
                          ) : (
                            <>Subscribe <ArrowRight size={14} strokeWidth={3} /></>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: usage summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-14 p-6 lg:p-8 swiss-dots bg-swiss-muted dark:bg-white/5">
            <SectionLabel num="04" label="Your Usage" />

            {/* Current status */}
            <div className="border-2 border-black dark:border-white bg-white dark:bg-black mb-6">

              {/* Free credits */}
              <div className="px-5 py-4 border-b-2 border-black dark:border-white">
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-1">
                  Free Interviews
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black tracking-tighter">
                    {usage.freeInterviewsLeft}
                    <span className="text-sm font-bold text-black/30 dark:text-white/30 ml-1">
                      / {FREE_INTERVIEWS_TOTAL}
                    </span>
                  </p>
                  {usage.freeInterviewsLeft === 0 && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-swiss-accent">
                      Exhausted
                    </span>
                  )}
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 bg-black/10 dark:bg-white/10">
                  <div
                    className="h-full bg-black dark:bg-white transition-all duration-300"
                    style={{ width: `${(usage.freeInterviewsLeft / FREE_INTERVIEWS_TOTAL) * 100}%` }}
                  />
                </div>
              </div>

              {/* Subscription status */}
              <div className="px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">
                  Subscription
                </p>
                {hasSub ? (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-black uppercase tracking-tight">
                        {subPlan?.label} Plan
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-swiss-accent">
                        Active
                      </span>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">
                      {usage.subscription.usedThisMonth} / {usage.subscription.interviewsPerMonth} used this month
                    </p>
                    {/* Monthly usage bar */}
                    <div className="h-1.5 bg-black/10 dark:bg-white/10">
                      <div
                        className="h-full bg-swiss-accent transition-all duration-300"
                        style={{
                          width: `${(usage.subscription.usedThisMonth / usage.subscription.interviewsPerMonth) * 100}%`
                        }}
                      />
                    </div>
                    <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30">
                      Expires {new Date(usage.subscription.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </>
                ) : (
                  <p className="text-xs font-bold uppercase tracking-widest text-black/30 dark:text-white/30">
                    No active subscription
                  </p>
                )}
              </div>
            </div>

            {/* Selected type reminder */}
            <div className="border-2 border-black dark:border-white bg-white dark:bg-black">
              <div className="px-5 py-3 border-b-2 border-black dark:border-white">
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                  Interview Type
                </p>
              </div>
              <div className="px-5 py-3">
                <p className="text-sm font-black uppercase tracking-tight text-swiss-accent">
                  {selectedType?.label}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mt-0.5">
                  {selectedType?.desc}
                </p>
              </div>
            </div>

            {/* Quick start if already has access */}
            {canStartInterview && (
              <button
                onClick={() => navigate('/interview/session')}
                className="mt-6 w-full h-14 flex items-center justify-between px-5
                           bg-swiss-accent text-white text-sm font-black uppercase tracking-widest
                           border-2 border-swiss-accent
                           hover:bg-black hover:border-black
                           dark:hover:bg-white dark:hover:text-black dark:hover:border-white
                           transition-colors duration-150"
              >
                <span>Start Interview Now</span>
                <ArrowRight size={16} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
