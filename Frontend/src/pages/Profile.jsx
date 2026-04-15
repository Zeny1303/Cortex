import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const DIFF_STYLE = {
  Easy:   'bg-swiss-muted border-black text-black',
  Medium: 'bg-black text-white border-black',
  Hard:   'bg-swiss-accent text-white border-swiss-accent',
};

const RECENT = [
  { id: 'INT-34291', role: 'Software Engineer', difficulty: 'Medium', score: 85, date: 'Mar 8, 2026' },
  { id: 'INT-81923', role: 'Frontend Dev',       difficulty: 'Easy',   score: 92, date: 'Mar 5, 2026' },
  { id: 'INT-55102', role: 'Backend Dev',        difficulty: 'Hard',   score: 78, date: 'Feb 28, 2026' },
];

const STATS = [
  { label: 'Interviews',  value: '15'     },
  { label: 'Avg Score',   value: '92%'    },
  { label: 'Best Score',  value: '98%'    },
  { label: 'Streak',      value: '4 Days' },
];

function SectionLabel({ num, label }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">{num}.</span>
      <span className="text-xs font-black uppercase tracking-widest text-black dark:text-white">{label}</span>
      <div className="flex-1 h-px bg-black dark:bg-white" />
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    fullName: 'Alex Walker',
    email:    'alex@example.com',
    username: 'alexw',
    bio:      'Software Engineer passionate about frontend development and AI.',
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((p) => ({
        ...p,
        fullName: user.name  || p.fullName,
        email:    user.email || p.email,
      }));
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white swiss-noise relative flex flex-col">

      {/* Top bar */}
      <div className="border-b-2 border-black dark:border-white flex items-stretch h-14 bg-white dark:bg-black sticky top-0 z-40">
        <a href="/"
          className="flex items-center px-6 border-r-2 border-black dark:border-white
                     font-black text-sm uppercase tracking-widest
                     hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
                     transition-colors duration-150">
          CORTEX
        </a>
        <div className="flex items-center px-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
            / Profile
          </span>
        </div>
        <div className="ml-auto flex items-stretch">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 border-l-2 border-black dark:border-white
                       text-[10px] font-black uppercase tracking-widest
                       hover:bg-swiss-muted dark:hover:bg-white/10 transition-colors duration-150"
          >
            <LayoutDashboard size={13} strokeWidth={2.5} />
            Dashboard
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 px-5 border-l-2 border-black dark:border-white
                       text-[10px] font-black uppercase tracking-widest
                       hover:bg-swiss-muted dark:hover:bg-white/10 transition-colors duration-150"
          >
            <Settings size={13} strokeWidth={2.5} />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 border-l-2 border-black dark:border-white
                       text-[10px] font-black uppercase tracking-widest
                       hover:bg-swiss-accent hover:text-white transition-colors duration-150"
          >
            <LogOut size={13} strokeWidth={2.5} />
            Logout
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Hero: avatar + name */}
      <div className="border-b-2 border-black dark:border-white grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white
                        px-6 lg:px-16 py-12 swiss-grid-pattern">
          <div className="flex items-end gap-8">
            <div className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center
                            text-4xl font-black border-2 border-black dark:border-white flex-shrink-0">
              {formData.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">Profile</span>
              <h1 className="mt-1 font-black uppercase tracking-tighter leading-none text-[clamp(2rem,5vw,4rem)]">
                {formData.fullName.split(' ')[0].toUpperCase()}<br />
                {formData.fullName.split(' ').slice(1).join(' ').toUpperCase()}
              </h1>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 grid grid-cols-2">
          {STATS.map((s, i) => (
            <div key={s.label}
              className={`group p-6 hover:bg-swiss-accent transition-colors duration-150 cursor-default
                ${i % 2 === 0 ? 'border-r-2 border-black dark:border-white' : ''}
                ${i < 2 ? 'border-b-2 border-black dark:border-white' : ''}
                ${i === 0 ? 'border-t-2 lg:border-t-0 border-black dark:border-white' : ''}`}>
              <div className="text-2xl font-black tracking-tighter leading-none group-hover:text-white transition-colors duration-150">
                {s.value}
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 group-hover:text-white/70 transition-colors duration-150">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 border-b-2 border-black dark:border-white">

        {/* Left: edit form */}
        <div className="lg:col-span-5 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white p-6 lg:p-12">
          <SectionLabel num="01" label="Personal Information" />
          <form onSubmit={handleSave}>
            <div className="border-2 border-black dark:border-white mb-6">
              {[
                { key: 'fullName', label: 'Full Name',     type: 'text'  },
                { key: 'email',    label: 'Email Address', type: 'email' },
                { key: 'username', label: 'Username',      type: 'text'  },
              ].map(({ key, label, type }, i, arr) => (
                <div key={key} className={`${i < arr.length - 1 ? 'border-b-2 border-black dark:border-white' : ''}`}>
                  <label className="block px-5 pt-4 text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full px-5 pb-4 pt-1 bg-transparent text-sm font-bold text-black dark:text-white
                               focus:outline-none focus:bg-swiss-muted dark:focus:bg-white/5 transition-colors duration-150"
                  />
                </div>
              ))}
              <div className="border-t-2 border-black dark:border-white">
                <label className="block px-5 pt-4 text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-5 pb-4 pt-1 bg-transparent text-sm font-bold text-black dark:text-white resize-none
                             focus:outline-none focus:bg-swiss-muted dark:focus:bg-white/5 transition-colors duration-150"
                />
              </div>
            </div>
            <button
              type="submit"
              className="h-12 px-8 flex items-center gap-3
                         bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest
                         border-2 border-black dark:border-white
                         hover:bg-swiss-accent hover:border-swiss-accent dark:hover:bg-swiss-accent dark:hover:border-swiss-accent dark:hover:text-white
                         transition-colors duration-150"
            >
              {saved ? 'Saved ✓' : <>Save Changes <ArrowRight size={14} strokeWidth={3} /></>}
            </button>
          </form>
        </div>

        {/* Right: recent interviews */}
        <div className="lg:col-span-7 p-6 lg:p-12">
          <SectionLabel num="02" label="Recent Interviews" />
          <div className="border-2 border-black dark:border-white">
            <div className="grid grid-cols-12 border-b-2 border-black dark:border-white bg-swiss-muted dark:bg-white/5">
              {['ID', 'Role', 'Diff', 'Score', 'Date', ''].map((h, i) => (
                <div key={h}
                  className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40
                    ${i === 0 ? 'col-span-2' : i === 1 ? 'col-span-3' : i === 2 ? 'col-span-2' : i === 3 ? 'col-span-2' : i === 4 ? 'col-span-2' : 'col-span-1'}`}>
                  {h}
                </div>
              ))}
            </div>
            {RECENT.map((item, i) => (
              <div key={item.id}
                className={`grid grid-cols-12 items-center hover:bg-swiss-muted dark:hover:bg-white/10 transition-colors duration-150
                  ${i < RECENT.length - 1 ? 'border-b-2 border-black dark:border-white' : ''}`}>
                <div className="col-span-2 px-4 py-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-swiss-accent">{item.id}</span>
                </div>
                <div className="col-span-3 px-4 py-4">
                  <span className="text-xs font-black uppercase tracking-tight">{item.role}</span>
                </div>
                <div className="col-span-2 px-4 py-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 border-2 ${DIFF_STYLE[item.difficulty]}`}>
                    {item.difficulty}
                  </span>
                </div>
                <div className="col-span-2 px-4 py-4">
                  <span className="text-lg font-black tracking-tighter">{item.score}%</span>
                </div>
                <div className="col-span-2 px-4 py-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">{item.date}</span>
                </div>
                <div className="col-span-1 px-4 py-4">
                  <button className="text-[10px] font-black uppercase tracking-widest hover:text-swiss-accent transition-colors duration-150">→</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-2 border-black dark:border-white swiss-dots bg-swiss-muted dark:bg-white/5">
            <div className="px-6 py-4 border-b-2 border-black dark:border-white">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">Account Details</span>
            </div>
            {[
              ['Email',   formData.email],
              ['Plan',    'Pro'],
              ['Joined',  'Feb 2026'],
              ['Status',  'Active'],
            ].map(([k, v], i, arr) => (
              <div key={k}
                className={`flex justify-between px-6 py-4 ${i < arr.length - 1 ? 'border-b-2 border-black dark:border-white' : ''}`}>
                <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">{k}</span>
                <span className="text-[10px] font-black uppercase tracking-widest">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
