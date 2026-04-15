import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Camera, Mic, Wifi, Check, X, Loader } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

function FlowBar({ step }) {
  const steps = ['Setup', 'Permissions', 'Countdown', 'Interview'];
  return (
    <div className="border-b-2 border-black dark:border-white flex items-stretch h-14 bg-white dark:bg-black sticky top-0 z-40">
      <a href="/"
        className="flex items-center px-6 border-r-2 border-black dark:border-white
                   font-black text-sm uppercase tracking-widest
                   hover:bg-black hover:text-white
                   dark:hover:bg-white dark:hover:text-black
                   transition-colors duration-150">
        CORTEX
      </a>
      <div className="flex items-stretch overflow-x-auto">
        {steps.map((s, i) => {
          const done    = i < step;
          const current = i === step;
          return (
            <div key={s}
              className={`flex items-center px-5 border-r-2 border-black dark:border-white text-[10px] font-black uppercase tracking-widest
                ${current ? 'bg-black dark:bg-white text-white dark:text-black' : done ? 'bg-swiss-muted dark:bg-white/5 text-black/40 dark:text-white/40' : 'bg-white dark:bg-black text-black/20 dark:text-white/20'}`}>
              <span className={`mr-2 ${current ? 'text-swiss-accent' : ''}`}>
                {String(i + 1).padStart(2, '0')}.
              </span>
              {s}
            </div>
          );
        })}
      </div>
      <div className="ml-auto">
        <ThemeToggle variant="minimal" />
      </div>
    </div>
  );
}

function StatusCell({ status }) {
  if (status === 'pending') return (
    <div className="w-7 h-7 border-2 border-black/20 dark:border-white/20 flex items-center justify-center">
      <div className="w-2 h-2 bg-black/20 dark:bg-white/20" />
    </div>
  );
  if (status === 'checking') return (
    <div className="w-7 h-7 border-2 border-black dark:border-white flex items-center justify-center">
      <Loader size={12} strokeWidth={3} className="animate-spin" />
    </div>
  );
  if (status === 'ok') return (
    <div className="w-7 h-7 border-2 border-black dark:border-white bg-black dark:bg-white flex items-center justify-center">
      <Check size={12} strokeWidth={3} className="text-white dark:text-black" />
    </div>
  );
  return (
    <div className="w-7 h-7 border-2 border-swiss-accent bg-swiss-accent flex items-center justify-center">
      <X size={12} strokeWidth={3} className="text-white" />
    </div>
  );
}

export default function InterviewPermissions() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const interviewId = location.state?.interviewId || `INT-${Math.floor(Math.random() * 90000) + 10000}`;
  const questions   = location.state?.questions   || [];
  const sessionId   = location.state?.sessionId   || null;

  // 🚨 VALIDATION: Redirect if critical data is missing
  React.useEffect(() => {
    if (!sessionId || !questions || questions.length === 0) {
      console.error('❌ Missing sessionId or questions in InterviewPermissions');
      alert('Session data is missing. Redirecting to setup...');
      navigate('/interview/setup', { replace: true });
    }
  }, [sessionId, questions, navigate]);

  const [camStatus, setCamStatus] = useState('pending');
  const [micStatus, setMicStatus] = useState('pending');
  const [netStatus, setNetStatus] = useState('checking');

  useEffect(() => {
    let mounted = true;
    setTimeout(() => {
      if (mounted) setNetStatus(navigator.onLine ? 'ok' : 'error');
    }, 900);
    return () => { mounted = false; };
  }, []);

  const requestCamera = async () => {
    setCamStatus('checking');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      s.getTracks().forEach((t) => t.stop());
      setCamStatus('ok');
    } catch {
      setCamStatus('error');
    }
  };

  const requestMic = async () => {
    setMicStatus('checking');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach((t) => t.stop());
      setMicStatus('ok');
    } catch {
      setMicStatus('error');
    }
  };

  const allClear = camStatus === 'ok' && micStatus === 'ok' && netStatus === 'ok';

  const checks = [
    {
      key:    'camera',
      icon:   <Camera size={16} strokeWidth={2.5} />,
      label:  'Camera Access',
      status: camStatus,
      sub: camStatus === 'pending'   ? null
         : camStatus === 'checking'  ? 'Requesting access...'
         : camStatus === 'ok'        ? 'Connected successfully'
         :                             'Access denied — check browser settings',
      action: camStatus === 'pending' ? { label: 'Enable Camera', fn: requestCamera } : null,
    },
    {
      key:    'mic',
      icon:   <Mic size={16} strokeWidth={2.5} />,
      label:  'Microphone Access',
      status: micStatus,
      sub: micStatus === 'pending'   ? null
         : micStatus === 'checking'  ? 'Requesting access...'
         : micStatus === 'ok'        ? 'Connected successfully'
         :                             'Access denied — check browser settings',
      action: micStatus === 'pending' ? { label: 'Enable Microphone', fn: requestMic } : null,
    },
    {
      key:    'net',
      icon:   <Wifi size={16} strokeWidth={2.5} />,
      label:  'Network Connection',
      status: netStatus,
      sub: netStatus === 'checking' ? 'Checking connection...'
         : netStatus === 'ok'       ? 'Connection stable'
         :                            'No internet connection detected',
      action: null,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white swiss-noise relative flex flex-col">
      <FlowBar step={1} />

      {/* Page header */}
      <div className="border-b-2 border-black dark:border-white px-6 lg:px-16 py-10 swiss-grid-pattern bg-swiss-muted dark:bg-white/5">
        <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
          02. Permissions
        </span>
        <h1 className="mt-2 font-black uppercase tracking-tighter leading-none
                       text-[clamp(2.5rem,6vw,5rem)]">
          SYSTEM<br />CHECK.
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">

        {/* Left: checks */}
        <div className="lg:col-span-7 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white p-6 lg:p-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">01.</span>
            <span className="text-xs font-black uppercase tracking-widest">Device Checks</span>
            <div className="flex-1 h-px bg-black dark:bg-white" />
          </div>

          <div className="border-2 border-black dark:border-white">
            {checks.map((c, i) => (
              <div key={c.key}
                className={`flex items-center justify-between px-6 py-5
                  ${i < checks.length - 1 ? 'border-b-2 border-black dark:border-white' : ''}
                  ${c.status === 'ok' ? 'bg-swiss-muted dark:bg-white/5' : 'bg-white dark:bg-black'}`}>

                <div className="flex items-center gap-5">
                  {/* Icon cell */}
                  <div className={`w-10 h-10 border-2 flex items-center justify-center flex-shrink-0
                    ${c.status === 'ok'    ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                    : c.status === 'error' ? 'border-swiss-accent text-swiss-accent'
                    :                        'border-black dark:border-white text-black dark:text-white'}`}>
                    {c.icon}
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-tight text-black dark:text-white">{c.label}</p>
                    {c.sub && (
                      <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5
                        ${c.status === 'error' ? 'text-swiss-accent' : 'text-black/40 dark:text-white/40'}`}>
                        {c.sub}
                      </p>
                    )}
                    {c.action && (
                      <button
                        onClick={c.action.fn}
                        className="mt-1 text-[10px] font-black uppercase tracking-widest
                                   underline hover:text-swiss-accent transition-colors duration-150"
                      >
                        {c.action.label} →
                      </button>
                    )}
                  </div>
                </div>

                <StatusCell status={c.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: CTA */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex-1 p-6 lg:p-16 swiss-dots bg-swiss-muted dark:bg-white/5 flex flex-col justify-between">
            <div>
              <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
                02. Status
              </span>

              {/* Progress indicators */}
              <div className="mt-6 space-y-0 border-2 border-black dark:border-white bg-white dark:bg-black">
                {checks.map((c, i) => (
                  <div key={c.key}
                    className={`flex items-center justify-between px-5 py-3
                      ${i < checks.length - 1 ? 'border-b-2 border-black dark:border-white' : ''}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                      {c.label}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest
                      ${c.status === 'ok'       ? 'text-black dark:text-white'
                      : c.status === 'error'    ? 'text-swiss-accent'
                      : c.status === 'checking' ? 'text-black/40 dark:text-white/40'
                      :                           'text-black/20 dark:text-white/20'}`}>
                      {c.status === 'ok'       ? '✓ OK'
                     : c.status === 'error'    ? '✗ Failed'
                     : c.status === 'checking' ? '...'
                     :                           'Pending'}
                    </span>
                  </div>
                ))}
              </div>

              {!allClear && (
                <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">
                  Enable all devices to continue.
                </p>
              )}
            </div>

            <button
              onClick={() => navigate('/interview/countdown', { state: { interviewId, questions, sessionId } })}
              disabled={!allClear}
              className="mt-10 w-full h-14 flex items-center justify-between px-6
                         bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest
                         border-2 border-black dark:border-white
                         hover:bg-swiss-accent hover:border-swiss-accent
                         dark:hover:bg-swiss-accent dark:hover:border-swiss-accent dark:hover:text-white
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-colors duration-150"
            >
              <span>Start Interview</span>
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
