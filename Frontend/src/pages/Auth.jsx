import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowRight, Check, X } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const getPasswordChecks = (pw) => ({
  length:  pw.length >= 6,
  upper:   /[A-Z]/.test(pw),
  lower:   /[a-z]/.test(pw),
  special: /\W/.test(pw),
});

const strengthLabel = (checks) => {
  const n = Object.values(checks).filter(Boolean).length;
  if (n <= 1) return { label: 'WEAK',   w: '25%',  color: 'bg-swiss-accent' };
  if (n === 2) return { label: 'FAIR',   w: '50%',  color: 'bg-black' };
  if (n === 3) return { label: 'GOOD',   w: '75%',  color: 'bg-black' };
  return           { label: 'STRONG', w: '100%', color: 'bg-black' };
};

export default function Auth() {
  const [isLogin, setIsLogin]           = useState(true);
  const [showPw, setShowPw]             = useState(false);
  const [formData, setFormData]         = useState({ name: '', email: '', password: '' });
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const checks   = getPasswordChecks(formData.password);
  const strength = strengthLabel(checks);
  const pwValid  = Object.values(checks).every(Boolean);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isLogin && !pwValid) { setError('Meet all password requirements.'); return; }
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
        await login(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col swiss-noise relative">

      {/* Top bar */}
      <div className="border-b-2 border-black dark:border-white flex items-stretch h-14">
        <a href="/"
          className="flex items-center px-6 border-r-2 border-black dark:border-white
                     font-black text-sm uppercase tracking-widest
                     hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
                     transition-colors duration-150">
          CORTEX
        </a>
        <div className="flex items-center px-6 ml-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">
            {isLogin ? 'Sign In' : 'Create Account'}
          </span>
        </div>
        <ThemeToggle />
      </div>

      {/* Main */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">

        {/* Left: geometric composition */}
        <div className="hidden lg:flex lg:col-span-5 border-r-2 border-black dark:border-white
                        flex-col justify-between p-12 swiss-grid-pattern bg-swiss-muted dark:bg-white/5">
          <div>
            <span className="text-swiss-accent text-xs font-black uppercase tracking-widest">
              01. Access
            </span>
            <h2 className="mt-4 font-black uppercase tracking-tighter leading-none
                           text-[clamp(3rem,5vw,5rem)]">
              PRACTICE.<br />PERFORM.<br />
              <span className="text-swiss-accent">PREVAIL.</span>
            </h2>
          </div>

          {/* Bauhaus composition */}
          <div className="relative h-64 border-2 border-black dark:border-white swiss-dots">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            w-32 h-32 rounded-full border-4 border-black dark:border-white" />
            <div className="absolute top-6 right-6 w-12 h-12 bg-swiss-accent" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black dark:bg-white" />
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black dark:bg-white" />
            <div className="absolute bottom-6 left-6 w-5 h-5 bg-black dark:bg-white rounded-full" />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">
            AI-Powered Mock Interviews — Cortex / 2025
          </p>
        </div>

        {/* Right: form */}
        <div className="lg:col-span-7 flex items-center justify-center p-6 lg:p-16">
          <div className="w-full max-w-md">

            {/* Tab toggle */}
            <div className="flex border-2 border-black dark:border-white mb-10">
              {['Sign In', 'Sign Up'].map((label, i) => {
                const active = isLogin ? i === 0 : i === 1;
                return (
                  <button
                    key={label}
                    onClick={() => { setIsLogin(i === 0); setError(''); }}
                    className={`flex-1 h-12 text-xs font-black uppercase tracking-widest transition-colors duration-150
                      ${active ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-black text-black dark:text-white hover:bg-swiss-muted dark:hover:bg-white/10'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-0">

              {/* Name (signup only) */}
              {!isLogin && (
                <div className="border-2 border-black dark:border-white border-b-0">
                  <input
                    type="text"
                    name="name"
                    placeholder="FULL NAME"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-14 px-5 bg-white dark:bg-black text-black dark:text-white text-sm font-bold
                               uppercase tracking-widest placeholder:text-black/30 dark:placeholder:text-white/30
                               focus:outline-none focus:bg-swiss-muted dark:focus:bg-white/5 transition-colors duration-150"
                  />
                </div>
              )}

              {/* Email */}
              <div className="border-2 border-black dark:border-white border-b-0">
                <input
                  type="email"
                  name="email"
                  placeholder="EMAIL ADDRESS"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-14 px-5 bg-white dark:bg-black text-black dark:text-white text-sm font-bold
                             uppercase tracking-widest placeholder:text-black/30 dark:placeholder:text-white/30
                             focus:outline-none focus:bg-swiss-muted dark:focus:bg-white/5 transition-colors duration-150"
                />
              </div>

              {/* Password */}
              <div className="border-2 border-black dark:border-white relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  placeholder="PASSWORD"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full h-14 px-5 pr-14 bg-white dark:bg-black text-black dark:text-white text-sm font-bold
                             uppercase tracking-widest placeholder:text-black/30 dark:placeholder:text-white/30
                             focus:outline-none focus:bg-swiss-muted dark:focus:bg-white/5 transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center
                             border-l-2 border-black dark:border-white
                             hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
                             transition-colors duration-150"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
                </button>
              </div>

              {/* Password checks (signup) */}
              {!isLogin && formData.password.length > 0 && (
                <div className="border-2 border-black dark:border-white border-t-0 p-4 bg-swiss-muted dark:bg-white/5 swiss-dots">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      ['6+ characters', checks.length],
                      ['Uppercase',     checks.upper],
                      ['Lowercase',     checks.lower],
                      ['Special char',  checks.special],
                    ].map(([label, valid]) => (
                      <div key={label} className="flex items-center gap-2">
                        {valid
                          ? <Check size={12} strokeWidth={3} className="text-black dark:text-white flex-shrink-0" />
                          : <X     size={12} strokeWidth={3} className="text-swiss-accent flex-shrink-0" />}
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${valid ? 'text-black dark:text-white' : 'text-black/40 dark:text-white/40'}`}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Strength bar */}
                  <div className="h-1 w-full bg-black/10 dark:bg-white/10">
                    <div
                      className={`h-1 transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.w }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                    Strength: {strength.label}
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="border-2 border-swiss-accent border-t-0 px-5 py-3 bg-swiss-accent/5">
                  <p className="text-xs font-bold uppercase tracking-widest text-swiss-accent">
                    ⚠ {error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || (!isLogin && !pwValid)}
                className="w-full h-14 flex items-center justify-between px-5
                           bg-black dark:bg-white text-white dark:text-black text-sm font-black uppercase tracking-widest
                           border-2 border-black dark:border-white
                           hover:bg-swiss-accent hover:border-swiss-accent dark:hover:bg-swiss-accent dark:hover:border-swiss-accent dark:hover:text-white
                           disabled:opacity-40 disabled:cursor-not-allowed
                           transition-colors duration-150 mt-0"
              >
                <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
                <ArrowRight size={16} strokeWidth={3} />
              </button>
            </form>

            {/* Switch mode */}
            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 text-center">
              {isLogin ? "No account?" : "Have an account?"}
              <button
                onClick={() => { setIsLogin((p) => !p); setError(''); }}
                className="ml-2 text-black dark:text-white underline hover:text-swiss-accent transition-colors duration-150"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
