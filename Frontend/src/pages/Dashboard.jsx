import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, CalendarPlus, Play, FileText,
  Trophy, Settings, ArrowRight, LogOut, Menu, X
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import UsageBadge from '../components/UsageBadge';

/* ─── Static data ──────────────────────────────────────────── */
const STATS = [
  { label: 'Total Interviews', value: '15' },
  { label: 'Average Score',    value: '92%' },
  { label: 'Best Score',       value: '98%' },
  { label: 'Practice Streak',  value: '4 Days' },
];

const EVALUATIONS = [
  { id: 'INT-34291', role: 'Software Engineer', difficulty: 'Medium', score: 85, date: 'Mar 8, 2026' },
  { id: 'INT-81923', role: 'Frontend Dev',       difficulty: 'Easy',   score: 92, date: 'Mar 5, 2026' },
  { id: 'INT-55102', role: 'Backend Dev',        difficulty: 'Hard',   score: 78, date: 'Feb 28, 2026' },
];

const LEADERBOARD = [
  { rank: 1, user: 'Alex Walker',    score: 98, interviews: 45, isMe: false },
  { rank: 2, user: 'Sarah Jenkins',  score: 96, interviews: 38, isMe: false },
  { rank: 3, user: 'Michael Chen',   score: 94, interviews: 52, isMe: false },
  { rank: 4, user: 'You',            score: 92, interviews: 15, isMe: true  },
  { rank: 5, user: 'Emily Davis',    score: 91, interviews: 27, isMe: false },
];

const NAV_ITEMS = [
  { id: 'overview',     label: 'Dashboard',     icon: LayoutDashboard, path: null },
  { id: 'booking',      label: 'Book Interview', icon: CalendarPlus,   path: '/select-type' },
  { id: 'setup',        label: 'Start Interview',icon: Play,           path: '/interview/setup' },
  { id: 'evaluations',  label: 'Evaluations',    icon: FileText,       path: null },
  { id: 'leaderboard',  label: 'Leaderboard',    icon: Trophy,         path: null },
  { id: 'settings',     label: 'Settings',       icon: Settings,       path: '/settings' },
];

const DIFF_COLOR = {
  Easy:   'text-black dark:text-white bg-swiss-muted dark:bg-white/10 border-black dark:border-white',
  Medium: 'text-black dark:text-white bg-swiss-muted dark:bg-white/10 border-black dark:border-white',
  Hard:   'text-white bg-black dark:bg-white dark:text-black border-black dark:border-white',
};

/* ─── Sub-components ───────────────────────────────────────── */

function SectionLabel({ num, label }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">{num}.</span>
      <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-black dark:bg-white" />
    </div>
  );
}

function Sidebar({ active, setActive, user, onLogout, open, setOpen }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-white/20 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 flex-shrink-0 flex flex-col
        bg-white dark:bg-black border-r-2 border-black dark:border-white
        transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="h-14 flex items-center border-b-2 border-black dark:border-white px-6 flex-shrink-0">
          <span className="font-black text-sm uppercase tracking-widest">CORTEX</span>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* User cell */}
        {user && (
          <div className="border-b-2 border-black dark:border-white px-6 py-4 swiss-dots bg-swiss-muted dark:bg-white/5">
            <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center
                            text-xs font-black uppercase mb-2">
              {user.name?.charAt(0) || 'U'}
            </div>
            <p className="text-xs font-black uppercase tracking-widest truncate">{user.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 truncate">{user.email}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.path) navigate(item.path);
                  else setActive(item.id);
                  setOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-6 py-4 text-left
                  border-b border-black/10 dark:border-white/10 transition-colors duration-150
                  text-xs font-black uppercase tracking-widest
                  ${isActive
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-white dark:bg-black text-black dark:text-white hover:bg-swiss-muted dark:hover:bg-white/10'}
                `}
              >
                <item.icon size={16} strokeWidth={2.5}
                  className={isActive ? 'text-swiss-accent' : 'text-black/40 dark:text-white/40'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-6 py-4 border-t-2 border-black dark:border-white
                     text-xs font-black uppercase tracking-widest
                     hover:bg-swiss-accent hover:text-white transition-colors duration-150"
        >
          <LogOut size={16} strokeWidth={2.5} />
          Logout
        </button>
      </aside>
    </>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */

export default function Dashboard() {
  const [active, setActive]   = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  const handleLogout = () => { logout(); navigate('/'); };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-black border-t-swiss-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black text-black dark:text-white">
      <Sidebar
        active={active}
        setActive={setActive}
        user={user}
        onLogout={handleLogout}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-14 flex items-stretch border-b-2 border-black dark:border-white flex-shrink-0 bg-white dark:bg-black">
          <button
            className="lg:hidden flex items-center px-5 border-r-2 border-black dark:border-white
                       hover:bg-swiss-muted dark:hover:bg-white/10 transition-colors duration-150"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} strokeWidth={2.5} />
          </button>
          <div className="flex items-center px-6">
            <span className="text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/40">
              {NAV_ITEMS.find((n) => n.id === active)?.label || 'Dashboard'}
            </span>
          </div>
          <UsageBadge />
          <button
            onClick={() => navigate('/select-type')}
            className="ml-auto flex items-center gap-3 px-6 border-l-2 border-black dark:border-white
                       bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest
                       hover:bg-swiss-accent dark:hover:bg-swiss-accent dark:hover:text-white transition-colors duration-150"
          >
            + Book Interview
            <ArrowRight size={14} strokeWidth={3} />
          </button>
          <ThemeToggle />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">

          {/* ── Overview ── */}
          {active === 'overview' && (
            <div>
              {/* Welcome banner */}
              <div className="border-b-2 border-black dark:border-white px-6 lg:px-10 py-8 swiss-grid-pattern bg-swiss-muted dark:bg-white/5">
                <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
                  Welcome back
                </span>
                <h1 className="mt-1 font-black uppercase tracking-tighter leading-none
                               text-[clamp(2rem,5vw,4rem)]">
                  {user?.name?.split(' ')[0] || 'CANDIDATE'}.
                </h1>
              </div>

              {/* Stats */}
              <div className="border-b-2 border-black dark:border-white p-6 lg:p-10">
                <SectionLabel num="01" label="Performance" />
                <div className="grid grid-cols-2 lg:grid-cols-4 border-2 border-black dark:border-white">
                  {STATS.map((s, i) => (
                    <div
                      key={s.label}
                      className={`group p-6 hover:bg-swiss-accent transition-colors duration-150 cursor-default
                        ${i % 2 === 0 && i < 3 ? 'border-r-2 border-black dark:border-white' : ''}
                        ${i < 2 ? 'border-b-2 lg:border-b-0 border-black dark:border-white' : ''}
                        ${i === 1 || i === 2 ? 'lg:border-r-2 lg:border-black lg:dark:border-white' : ''}
                        ${i === 3 ? '' : 'lg:border-r-2 border-black dark:border-white'}
                      `}
                    >
                      <div className="text-3xl font-black tracking-tighter leading-none
                                      group-hover:text-white transition-colors duration-150">
                        {s.value}
                      </div>
                      <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40
                                      group-hover:text-white/70 transition-colors duration-150">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA card */}
              <div className="border-b-2 border-black dark:border-white p-6 lg:p-10">
                <div className="border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black p-8 lg:p-10
                                flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6
                                swiss-grid-pattern">
                  <div>
                    <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
                      Ready?
                    </span>
                    <h2 className="mt-2 text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none">
                      START YOUR<br />NEXT SESSION.
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate('/interview/setup')}
                    className="flex items-center gap-3 h-12 px-8
                               bg-swiss-accent text-white text-xs font-black uppercase tracking-widest
                               border-2 border-swiss-accent
                               hover:bg-white hover:text-black hover:border-white
                               dark:hover:bg-black dark:hover:text-white dark:hover:border-black
                               transition-colors duration-150 flex-shrink-0"
                  >
                    Begin Interview
                    <ArrowRight size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 border-b-2 border-black dark:border-white">
                {/* Evaluations */}
                <div className="border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white p-6 lg:p-10">
                  <SectionLabel num="02" label="Recent Evaluations" />
                  <div className="border-2 border-black dark:border-white">
                    {EVALUATIONS.map((e, i) => (
                      <div
                        key={e.id}
                        className={`flex items-center justify-between px-5 py-4 hover:bg-swiss-muted dark:hover:bg-white/10
                                    transition-colors duration-150 cursor-default
                                    ${i < EVALUATIONS.length - 1 ? 'border-b-2 border-black dark:border-white' : ''}`}
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-swiss-accent">
                            {e.id}
                          </p>
                          <p className="text-sm font-black uppercase tracking-tight mt-0.5">{e.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border ${DIFF_COLOR[e.difficulty]}`}>
                              {e.difficulty}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">
                              {e.date}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black tracking-tighter">{e.score}%</div>
                          <button className="text-[10px] font-black uppercase tracking-widest text-swiss-accent
                                             hover:underline mt-0.5">
                            View →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActive('evaluations')}
                    className="mt-4 text-xs font-black uppercase tracking-widest
                               hover:text-swiss-accent transition-colors duration-150"
                  >
                    See All →
                  </button>
                </div>

                {/* Leaderboard */}
                <div className="p-6 lg:p-10">
                  <SectionLabel num="03" label="Leaderboard" />
                  <div className="border-2 border-black dark:border-white">
                    {LEADERBOARD.map((item, i) => (
                      <div
                        key={item.rank}
                        className={`flex items-center justify-between px-5 py-4 transition-colors duration-150
                          ${item.isMe ? 'bg-black dark:bg-white text-white dark:text-black' : 'hover:bg-swiss-muted dark:hover:bg-white/10'}
                          ${i < LEADERBOARD.length - 1 ? 'border-b-2 border-black dark:border-white' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`text-xs font-black uppercase tracking-widest w-6
                            ${item.isMe ? 'text-swiss-accent' : 'text-black/30 dark:text-white/30'}`}>
                            {String(item.rank).padStart(2, '0')}
                          </span>
                          <div className={`w-7 h-7 flex items-center justify-center text-xs font-black
                            ${item.isMe ? 'bg-swiss-accent text-white' : 'bg-swiss-muted dark:bg-white/10 border-2 border-black dark:border-white text-black dark:text-white'}`}>
                            {item.user.charAt(0)}
                          </div>
                          <div>
                            <p className={`text-xs font-black uppercase tracking-tight
                              ${item.isMe ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}>
                              {item.user}
                            </p>
                            <p className={`text-[10px] font-bold uppercase tracking-widest
                              ${item.isMe ? 'text-white/50 dark:text-black/50' : 'text-black/40 dark:text-white/40'}`}>
                              {item.interviews} sessions
                            </p>
                          </div>
                        </div>
                        <span className={`text-xl font-black tracking-tighter
                          ${item.isMe ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}>
                          {item.score}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActive('leaderboard')}
                    className="mt-4 text-xs font-black uppercase tracking-widest
                               hover:text-swiss-accent transition-colors duration-150"
                  >
                    View All →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Evaluations full ── */}
          {active === 'evaluations' && (
            <div className="p-6 lg:p-10">
              <button
                onClick={() => setActive('overview')}
                className="text-xs font-black uppercase tracking-widest mb-6
                           hover:text-swiss-accent transition-colors duration-150"
              >
                ← Back
              </button>
              <SectionLabel num="02" label="All Evaluations" />
              <div className="border-2 border-black overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b-2 border-black bg-swiss-muted">
                      {['ID', 'Role', 'Difficulty', 'Score', 'Date', ''].map((h) => (
                        <th key={h} className="px-5 py-4 text-left font-black uppercase tracking-widest text-black/40">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {EVALUATIONS.map((e, i) => (
                      <tr key={e.id}
                        className={`hover:bg-swiss-muted transition-colors duration-150
                          ${i < EVALUATIONS.length - 1 ? 'border-b-2 border-black' : ''}`}>
                        <td className="px-5 py-4 font-black text-swiss-accent">{e.id}</td>
                        <td className="px-5 py-4 font-black uppercase tracking-tight">{e.role}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-1 border font-black uppercase tracking-widest ${DIFF_COLOR[e.difficulty]}`}>
                            {e.difficulty}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-black text-xl tracking-tighter">{e.score}%</td>
                        <td className="px-5 py-4 font-bold text-black/40 uppercase tracking-widest">{e.date}</td>
                        <td className="px-5 py-4">
                          <button className="font-black uppercase tracking-widest text-swiss-accent hover:underline">
                            View →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Leaderboard full ── */}
          {active === 'leaderboard' && (
            <div className="p-6 lg:p-10">
              <button
                onClick={() => setActive('overview')}
                className="text-xs font-black uppercase tracking-widest mb-6
                           hover:text-swiss-accent transition-colors duration-150"
              >
                ← Back
              </button>
              <SectionLabel num="03" label="Global Leaderboard" />
              <div className="border-2 border-black">
                {LEADERBOARD.map((item, i) => (
                  <div
                    key={item.rank}
                    className={`flex items-center justify-between px-6 py-5 transition-colors duration-150
                      ${item.isMe ? 'bg-black text-white' : 'hover:bg-swiss-muted'}
                      ${i < LEADERBOARD.length - 1 ? 'border-b-2 border-black' : ''}`}
                  >
                    <div className="flex items-center gap-6">
                      <span className={`text-2xl font-black tracking-tighter w-10
                        ${item.isMe ? 'text-swiss-accent' : 'text-black/20'}`}>
                        {String(item.rank).padStart(2, '0')}
                      </span>
                      <div className={`w-10 h-10 flex items-center justify-center font-black
                        ${item.isMe ? 'bg-swiss-accent text-white' : 'bg-swiss-muted border-2 border-black text-black'}`}>
                        {item.user.charAt(0)}
                      </div>
                      <div>
                        <p className={`text-sm font-black uppercase tracking-tight
                          ${item.isMe ? 'text-white' : 'text-black'}`}>
                          {item.user}
                        </p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest
                          ${item.isMe ? 'text-white/50' : 'text-black/40'}`}>
                          {item.interviews} interviews completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-black tracking-tighter
                        ${item.isMe ? 'text-white' : 'text-black'}`}>
                        {item.score}
                      </div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest
                        ${item.isMe ? 'text-white/50' : 'text-black/40'}`}>
                        Score
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
