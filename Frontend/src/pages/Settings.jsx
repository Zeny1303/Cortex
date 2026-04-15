import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User, Lock, SlidersHorizontal, Trash2,
  ArrowRight, Check, LayoutDashboard, LogOut
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

/* ─── Shared primitives ─────────────────────────────────── */

function SectionLabel({ num, label }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">{num}.</span>
      <span className="text-xs font-black uppercase tracking-widest text-black dark:text-white">{label}</span>
      <div className="flex-1 h-px bg-black dark:bg-white" />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="border-b-2 border-black dark:border-white last:border-b-0">
      <label className="block px-5 pt-4 text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, type = 'text', placeholder = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-5 pb-4 pt-1 bg-transparent text-sm font-bold
                 text-black dark:text-white
                 placeholder:text-black/20 dark:placeholder:text-white/20
                 focus:outline-none focus:bg-swiss-muted dark:focus:bg-white/5
                 transition-colors duration-150"
    />
  );
}

/* Swiss toggle — checkbox styled as a bordered square that inverts */
function Toggle({ checked, onChange, label, sub }) {
  return (
    <div
      className={`flex items-center justify-between px-6 py-5 border-b-2 border-black dark:border-white
                  hover:bg-swiss-muted dark:hover:bg-white/10 transition-colors duration-150 cursor-pointer
                  last:border-b-0`}
      onClick={onChange}
    >
      <div>
        <p className="text-sm font-black uppercase tracking-tight text-black dark:text-white">{label}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mt-0.5">{sub}</p>
      </div>
      <div className={`w-8 h-8 border-2 border-black dark:border-white flex items-center justify-center flex-shrink-0
                       transition-colors duration-150
                       ${checked ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-black text-transparent'}`}>
        <Check size={14} strokeWidth={3} />
      </div>
    </div>
  );
}

/* ─── Sidebar (reused from Dashboard pattern) ───────────── */

const NAV = [
  { id: 'account',     label: 'Account',     icon: User },
  { id: 'security',    label: 'Security',     icon: Lock },
  { id: 'preferences', label: 'Preferences',  icon: SlidersHorizontal },
  { id: 'danger',      label: 'Danger Zone',  icon: Trash2 },
];

function SettingsSidebar({ active, setActive, onLogout }) {
  const navigate = useNavigate();
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col border-r-2 border-black dark:border-white bg-white dark:bg-black">
      {/* Brand */}
      <div className="h-14 flex items-center px-6 border-b-2 border-black dark:border-white flex-shrink-0">
        <span className="font-black text-sm uppercase tracking-widest">CORTEX</span>
      </div>

      {/* Back to dashboard */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-3 px-6 py-4 border-b-2 border-black dark:border-white
                   text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40
                   hover:bg-swiss-muted dark:hover:bg-white/10 transition-colors duration-150"
      >
        <LayoutDashboard size={13} strokeWidth={2.5} />
        Dashboard
      </button>

      {/* Nav */}
      <nav className="flex-1">
        {NAV.map((item) => {
          const active_ = active === item.id;
          const isDanger = item.id === 'danger';
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 text-left
                          border-b border-black/10 dark:border-white/10 transition-colors duration-150
                          text-[10px] font-black uppercase tracking-widest
                          ${active_
                            ? isDanger
                              ? 'bg-swiss-accent text-white'
                              : 'bg-black dark:bg-white text-white dark:text-black'
                            : isDanger
                              ? 'text-swiss-accent hover:bg-swiss-accent/10'
                              : 'text-black dark:text-white hover:bg-swiss-muted dark:hover:bg-white/10'}`}
            >
              <item.icon size={13} strokeWidth={2.5}
                className={active_ ? (isDanger ? 'text-white' : 'text-swiss-accent') : ''} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-6 py-4 border-t-2 border-black dark:border-white
                   text-[10px] font-black uppercase tracking-widest
                   hover:bg-swiss-accent hover:text-white transition-colors duration-150"
      >
        <LogOut size={13} strokeWidth={2.5} />
        Logout
      </button>
    </aside>
  );
}

/* ─── Section panels ────────────────────────────────────── */

function AccountPanel({ data, setData }) {
  const [saved, setSaved] = useState(false);
  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <SectionLabel num="01" label="Account Settings" />
      <form onSubmit={handleSave}>
        <div className="border-2 border-black dark:border-white mb-6">
          <Field label="Full Name">
            <TextInput value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })} />
          </Field>
          <Field label="Username">
            <TextInput value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })} />
          </Field>
          <Field label="Email Address">
            <TextInput type="email" value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })} />
          </Field>
        </div>

        <button
          type="submit"
          className="h-12 px-8 flex items-center gap-3
                     bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest
                     border-2 border-black dark:border-white
                     hover:bg-swiss-accent hover:border-swiss-accent
                     dark:hover:bg-swiss-accent dark:hover:border-swiss-accent dark:hover:text-white
                     transition-colors duration-150"
        >
          {saved ? <><Check size={14} strokeWidth={3} /> Saved</> : <>Save Changes <ArrowRight size={14} strokeWidth={3} /></>}
        </button>
      </form>
    </div>
  );
}

function SecurityPanel({ data, setData }) {
  const [saved, setSaved] = useState(false);
  const [err, setErr]     = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (data.newPassword !== data.confirmPassword) {
      setErr('Passwords do not match.');
      return;
    }
    setErr('');
    setSaved(true);
    setData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <SectionLabel num="02" label="Security" />
      <form onSubmit={handleSave}>
        <div className="border-2 border-black dark:border-white mb-6">
          <Field label="Current Password">
            <TextInput type="password" value={data.currentPassword}
              onChange={(e) => setData({ ...data, currentPassword: e.target.value })} />
          </Field>
          <Field label="New Password">
            <TextInput type="password" value={data.newPassword}
              onChange={(e) => setData({ ...data, newPassword: e.target.value })} />
          </Field>
          <Field label="Confirm New Password">
            <TextInput type="password" value={data.confirmPassword}
              onChange={(e) => setData({ ...data, confirmPassword: e.target.value })} />
          </Field>
        </div>

        {err && (
          <div className="border-2 border-swiss-accent px-5 py-3 mb-4 bg-swiss-accent/5">
            <p className="text-xs font-black uppercase tracking-widest text-swiss-accent">⚠ {err}</p>
          </div>
        )}

        <button
          type="submit"
          className="h-12 px-8 flex items-center gap-3
                     bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest
                     border-2 border-black dark:border-white
                     hover:bg-swiss-accent hover:border-swiss-accent
                     dark:hover:bg-swiss-accent dark:hover:border-swiss-accent dark:hover:text-white
                     transition-colors duration-150"
        >
          {saved ? <><Check size={14} strokeWidth={3} /> Updated</> : <>Update Password <ArrowRight size={14} strokeWidth={3} /></>}
        </button>
      </form>
    </div>
  );
}

function PreferencesPanel({ prefs, setPrefs }) {
  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div>
      <SectionLabel num="03" label="Preferences" />
      <div className="border-2 border-black dark:border-white">
        <Toggle
          checked={prefs.emailNotifications}
          onChange={() => toggle('emailNotifications')}
          label="Email Notifications"
          sub="Receive reports and session updates via email"
        />
        <Toggle
          checked={prefs.leaderboardVisibility}
          onChange={() => toggle('leaderboardVisibility')}
          label="Leaderboard Visibility"
          sub="Show your progress on the public leaderboard"
        />
        <Toggle
          checked={prefs.voiceMode}
          onChange={() => toggle('voiceMode')}
          label="Voice Mode Default"
          sub="Start interviews in voice mode by default"
        />
        <Toggle
          checked={prefs.autoAdvance}
          onChange={() => toggle('autoAdvance')}
          label="Auto-Advance Questions"
          sub="Move to next question automatically after submission"
        />
      </div>
    </div>
  );
}

function DangerPanel() {
  const [confirm, setConfirm] = useState(false);
  return (
    <div>
      <SectionLabel num="04" label="Danger Zone" />

      <div className="border-2 border-swiss-accent">
        <div className="px-6 py-5 border-b-2 border-swiss-accent bg-swiss-accent/5">
          <p className="text-sm font-black uppercase tracking-tight text-swiss-accent">
            Delete Account
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/50 mt-1">
            This action is permanent and cannot be undone.
          </p>
        </div>

        <div className="px-6 py-6">
          {!confirm ? (
            <button
              onClick={() => setConfirm(true)}
              className="h-12 px-8 flex items-center gap-3
                         bg-white dark:bg-black text-swiss-accent text-xs font-black uppercase tracking-widest
                         border-2 border-swiss-accent
                         hover:bg-swiss-accent hover:text-white
                         transition-colors duration-150"
            >
              <Trash2 size={14} strokeWidth={2.5} />
              Delete My Account
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-swiss-accent">
                Are you absolutely sure? This cannot be reversed.
              </p>
              <div className="flex gap-0">
                <button
                  className="h-12 px-8 bg-swiss-accent text-white text-xs font-black uppercase tracking-widest
                             border-2 border-swiss-accent
                             hover:bg-black hover:border-black
                             dark:hover:bg-white dark:hover:border-white dark:hover:text-black
                             transition-colors duration-150"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setConfirm(false)}
                  className="h-12 px-8 bg-white dark:bg-black text-black dark:text-white text-xs font-black uppercase tracking-widest
                             border-2 border-black dark:border-white border-l-0
                             hover:bg-swiss-muted dark:hover:bg-white/10
                             transition-colors duration-150"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */

export default function Settings() {
  const [active, setActive] = useState('account');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [accountData, setAccountData] = useState({
    fullName: 'Alex Walker',
    email:    'alex@example.com',
    username: 'alexw',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });

  const [prefs, setPrefs] = useState({
    emailNotifications:    true,
    leaderboardVisibility: true,
    voiceMode:             false,
    autoAdvance:           false,
  });

  const handleLogout = () => { logout(); navigate('/'); };

  const PANEL_TITLE = {
    account:     'Account Settings',
    security:    'Security',
    preferences: 'Preferences',
    danger:      'Danger Zone',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black text-black dark:text-white">
      <SettingsSidebar active={active} setActive={setActive} onLogout={handleLogout} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-14 flex items-stretch border-b-2 border-black dark:border-white flex-shrink-0 bg-white dark:bg-black">
          <div className="flex items-center px-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
              Settings /
            </span>
            <span className="ml-2 text-[10px] font-black uppercase tracking-widest">
              {PANEL_TITLE[active]}
            </span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">

            {/* Form area */}
            <div className="lg:col-span-8 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white p-6 lg:p-12">
              {active === 'account'     && <AccountPanel     data={accountData}  setData={setAccountData} />}
              {active === 'security'    && <SecurityPanel    data={securityData} setData={setSecurityData} />}
              {active === 'preferences' && <PreferencesPanel prefs={prefs}       setPrefs={setPrefs} />}
              {active === 'danger'      && <DangerPanel />}
            </div>

            {/* Right info panel */}
            <div className="lg:col-span-4 p-6 lg:p-12 swiss-dots bg-swiss-muted dark:bg-white/5">
              {active === 'account' && (
                <>
                  <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
                    Profile
                  </span>
                  {/* Avatar */}
                  <div className="mt-6 flex flex-col items-start gap-4">
                    <div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center
                                    text-2xl font-black border-2 border-black dark:border-white">
                      {accountData.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight text-black dark:text-white">{accountData.fullName}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mt-0.5">
                        {accountData.email}
                      </p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mt-8 border-2 border-black dark:border-white bg-white dark:bg-black">
                    {[
                      ['Username', `@${accountData.username}`],
                      ['Plan',     'Pro'],
                      ['Joined',   'Feb 2026'],
                    ].map(([k, v], i, arr) => (
                      <div key={k}
                        className={`flex justify-between px-5 py-3
                          ${i < arr.length - 1 ? 'border-b-2 border-black dark:border-white' : ''}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">{k}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">{v}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {active === 'security' && (
                <>
                  <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
                    Password Rules
                  </span>
                  <div className="mt-6 border-2 border-black dark:border-white bg-white dark:bg-black">
                    {[
                      '6+ characters',
                      'One uppercase letter',
                      'One lowercase letter',
                      'One special character',
                    ].map((r, i, arr) => (
                      <div key={r}
                        className={`flex items-center gap-3 px-5 py-3
                          ${i < arr.length - 1 ? 'border-b-2 border-black dark:border-white' : ''}`}>
                        <div className="w-1.5 h-1.5 bg-black dark:bg-white flex-shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">{r}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {active === 'preferences' && (
                <>
                  <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
                    Active Settings
                  </span>
                  <div className="mt-6 border-2 border-black dark:border-white bg-white dark:bg-black">
                    {Object.entries(prefs).map(([k, v], i, arr) => (
                      <div key={k}
                        className={`flex justify-between items-center px-5 py-3
                          ${i < arr.length - 1 ? 'border-b-2 border-black dark:border-white' : ''}`}>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">
                          {k.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest
                          ${v ? 'text-black dark:text-white' : 'text-black/20 dark:text-white/20'}`}>
                          {v ? 'On' : 'Off'}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {active === 'danger' && (
                <>
                  <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
                    Warning
                  </span>
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-black/50 dark:text-white/50 leading-relaxed">
                    Deleting your account will permanently remove all your data, interview history,
                    scores, and settings. This cannot be undone.
                  </p>
                  <div className="mt-6 border-2 border-swiss-accent p-5 bg-swiss-accent/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-swiss-accent">
                      ⚠ Irreversible action
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
