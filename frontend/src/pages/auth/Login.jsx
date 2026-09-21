import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Building2, User, ShieldCheck, Eye, EyeOff, Loader2, ArrowLeft, X, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import api from '../../services/api';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export const Login = ({ onSwitchToRegister, onBack, initialPortal }) => {
  const { login, googleLogin, demoLogin, demoGuestLogin } = useAuth();
  const { showToast } = useToast();
  const { isDark } = useTheme();

  const [portal, setPortal]         = useState(initialPortal || null);
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => { if (initialPortal) setPortal(initialPortal); }, [initialPortal]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(email, password, portal || 'guest');
      showToast(`Welcome back to Trustora, ${u.name}!`, 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Login failed — check credentials', 'error');
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      const u = portal === 'guest' ? await demoGuestLogin() : await demoLogin();
      showToast(`Welcome to Trustora, ${u.name}!`, 'success');
    } catch {
      showToast('Demo login failed — is the backend running?', 'error');
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const u = await googleLogin({
        email: portal === 'guest' ? 'guest.google@trustora.ai' : 'host.google@trustora.ai',
        name:  portal === 'guest' ? 'Google Guest' : 'Google Host',
        role:  portal === 'guest' ? 'guest' : 'host'
      });
      showToast(`Welcome to Trustora, ${u.name}!`, 'success');
    } catch {
      showToast('Google sign-in failed. Please try again.', 'error');
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotSent(true);
    } catch {
      setForgotSent(true);
    } finally { setForgotLoading(false); }
  };

  const accent     = portal === 'guest' ? 'from-emerald-600 to-teal-600' : 'from-indigo-600 to-violet-600';
  const bg         = isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardBg     = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xl';
  const inputCls   = isDark ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400';
  const textCls    = isDark ? 'text-white' : 'text-slate-900';
  const subCls     = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`min-h-screen ${bg} flex flex-col items-center justify-center p-4 relative transition-colors duration-200`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-900/15 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        {onBack && (
          <button onClick={onBack} className={`flex items-center gap-1.5 text-sm font-semibold ${subCls} hover:text-emerald-500 transition-colors cursor-pointer`}>
            <ArrowLeft className="w-4 h-4" /> Back to Trustora
          </button>
        )}
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-3">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className={`text-2xl font-black ${textCls} tracking-tight`}>Sign in to Trustora</h1>
          <p className={`text-xs ${subCls} mt-1 font-medium`}>Verified Stays & Host Intelligence Platform</p>
        </div>

        {/* Portal Selector */}
        {!portal && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => setPortal('guest')} className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/60' : 'bg-white border-slate-200 hover:border-emerald-500 shadow-sm'} flex flex-col items-center gap-2 transition-all group cursor-pointer`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold ${textCls}`}>Guest Portal</span>
              <span className={`text-[10px] ${subCls}`}>Book verified stays</span>
            </button>
            <button onClick={() => setPortal('host')} className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/60' : 'bg-white border-slate-200 hover:border-indigo-500 shadow-sm'} flex flex-col items-center gap-2 transition-all group cursor-pointer`}>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold ${textCls}`}>Host Portal</span>
              <span className={`text-[10px] ${subCls}`}>Manage & optimize yield</span>
            </button>
          </div>
        )}

        {portal && (
          <div className={`rounded-3xl border ${cardBg} p-6 sm:p-8 backdrop-blur-xl shadow-2xl`}>
            {/* Active Portal Header */}
            <div className={`flex items-center justify-between mb-5 pb-4 border-b ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${accent} flex items-center justify-center text-white text-xs font-bold`}>
                  {portal === 'guest' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                </div>
                <div>
                  <p className={`text-xs font-bold capitalize ${textCls}`}>{portal} Portal</p>
                  <p className={`text-[10px] ${subCls}`}>
                    {portal === 'guest' ? 'Browse verified homes' : 'Access host dashboard'}
                  </p>
                </div>
              </div>
              <button onClick={() => setPortal(null)} className={`text-[10px] ${subCls} hover:${textCls} underline cursor-pointer`}>
                Switch Portal
              </button>
            </div>

            {/* Quick Demo Pill Fillers */}
            <div className={`mb-5 p-3 rounded-2xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${subCls}`}>Quick Credentials</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">Demo Mode</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {portal === 'host' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => { setEmail('host@trustora.ai'); setPassword('password123'); }}
                      className="px-2 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-bold text-indigo-400 transition-all cursor-pointer"
                    >
                      Rohan (4 Stays)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEmail('sarthakskale27@gmail.com'); setPassword('password123'); }}
                      className="px-2 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-bold text-indigo-400 transition-all cursor-pointer"
                    >
                      Sarthak (3 Stays)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEmail('vikram.host@trustora.ai'); setPassword('password123'); }}
                      className="px-2 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-bold text-indigo-400 transition-all cursor-pointer"
                    >
                      Vikram (Heritage)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEmail('deepa.host@trustora.ai'); setPassword('password123'); }}
                      className="px-2 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-bold text-indigo-400 transition-all cursor-pointer"
                    >
                      Deepa (Kerala)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEmail('rajesh.host@trustora.ai'); setPassword('password123'); }}
                      className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-[10px] font-bold text-rose-400 transition-all cursor-pointer"
                    >
                      Rajesh (Low Trust Stays)
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => { setEmail('aarav@gmail.com'); setPassword('1234'); }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-bold text-emerald-500 transition-all cursor-pointer"
                    >
                      Aarav (aarav@gmail.com)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEmail('ananya@gmail.com'); setPassword('1234'); }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-bold text-emerald-500 transition-all cursor-pointer"
                    >
                      Ananya (ananya@gmail.com)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEmail('rohit@gmail.com'); setPassword('1234'); }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-bold text-emerald-500 transition-all cursor-pointer"
                    >
                      Rohit (rohit@gmail.com)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEmail('meera@gmail.com'); setPassword('1234'); }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-bold text-emerald-500 transition-all cursor-pointer"
                    >
                      Meera (meera@gmail.com)
                    </button>
                  </>
                )}
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1.5`}>Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={portal === 'guest' ? 'aarav@gmail.com' : 'host@trustora.ai'}
                  className={`w-full px-4 py-2.5 rounded-xl border ${inputCls} text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
                  <button type="button" onClick={() => setShowForgot(true)} className="text-[11px] text-emerald-500 hover:underline cursor-pointer">
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password123"
                    className={`w-full px-4 py-2.5 pr-10 rounded-xl border ${inputCls} text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className={`absolute right-3 top-2.5 ${subCls} hover:${textCls} cursor-pointer`}>
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl bg-gradient-to-r ${accent} text-white font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2`}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Enter ${portal === 'guest' ? 'Guest Stays' : 'Host Dashboard'}`}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className={`flex-1 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
              <span className={`text-[10px] font-bold ${subCls} uppercase tracking-widest`}>or 1-click</span>
              <div className={`flex-1 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDemo}
                disabled={loading}
                className={`py-2.5 px-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200 hover:border-emerald-500/50' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-500 shadow-sm'} text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Demo 1-Click</span>
              </button>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className={`py-2.5 px-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'} text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
              >
                <GoogleIcon />
                <span>Google</span>
              </button>
            </div>

            <p className={`text-center text-xs ${subCls} mt-6 font-medium`}>
              Don't have an account?{' '}
              <button onClick={onSwitchToRegister} className="text-emerald-500 font-bold hover:underline cursor-pointer">
                Create Free Account
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`border rounded-3xl p-6 max-w-sm w-full shadow-2xl relative ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <button onClick={() => { setShowForgot(false); setForgotSent(false); }} className={`absolute top-4 right-4 ${subCls} hover:${textCls} cursor-pointer`}>
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-black mb-1">Reset Password</h3>
            <p className={`text-xs ${subCls} mb-4`}>Enter your email to receive recovery instructions.</p>
            {forgotSent ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold text-center">
                ✓ Password reset instructions sent!
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-emerald-500 ${inputCls}`}
                />
                <button type="submit" disabled={forgotLoading} className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer">
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
