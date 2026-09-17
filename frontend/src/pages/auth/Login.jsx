import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Building2, User, ShieldCheck, Eye, EyeOff, Loader2, ArrowLeft, Sun, Moon, X, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
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
  const { login, demoLogin, demoGuestLogin } = useAuth();
  const { showToast } = useToast();
  const { isDark, toggleTheme } = useTheme();

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
      const u = await login(email, password);
      showToast(`Welcome back to Trustora, ${u.name}!`, 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Login failed', 'error');
    } finally { setLoading(false); }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      const u = portal === 'guest' ? await demoGuestLogin() : await demoLogin();
      showToast(`Welcome to Trustora, ${u.name}!`, 'success');
    } catch {
      showToast('Demo login failed — is the backend running?', 'error');
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google-mock', {
        email: portal === 'guest' ? 'guest.google@trustora.ai' : 'host.google@trustora.ai',
        name:  portal === 'guest' ? 'Google Guest' : 'Google Host',
        role:  portal === 'guest' ? 'guest' : 'host'
      });
      const { token, user } = res.data;
      localStorage.setItem('trustora_token', token);
      localStorage.setItem('trustora_user', JSON.stringify(user));
      window.location.reload();
    } catch {
      showToast('Google sign-in failed. Please try again.', 'error');
    } finally { setLoading(false); }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotSent(true);
    } catch {
      setForgotSent(true); // Always show success for security
    } finally { setForgotLoading(false); }
  };

  const accent     = portal === 'guest' ? 'from-emerald-600 to-teal-600' : 'from-indigo-600 to-violet-600';
  const accentText = portal === 'guest' ? 'text-emerald-400' : 'text-indigo-400';
  const bg         = isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/40';
  const cardBg     = isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-gray-200 shadow-xl';
  const inputCls   = isDark ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400';
  const textCls    = isDark ? 'text-white' : 'text-gray-900';
  const subCls     = isDark ? 'text-slate-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen ${bg} flex flex-col items-center justify-center p-4 relative`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-900/15 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        {onBack && (
          <button onClick={onBack} className={`flex items-center gap-1.5 text-sm font-semibold ${subCls} hover:text-emerald-400 transition-colors cursor-pointer`}>
            <ArrowLeft className="w-4 h-4" /> Back to Trustora
          </button>
        )}
        <button onClick={toggleTheme} className={`ml-auto p-2 rounded-xl border ${isDark ? 'border-slate-800 text-slate-400' : 'border-gray-200 text-gray-500'} hover:scale-110 transition-all cursor-pointer`}>
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
        </button>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-2xl p-6 border shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-base ${textCls}`}>Reset Password</h3>
              <button onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }} className={`p-1.5 rounded-lg hover:bg-slate-800 ${subCls}`}><X className="w-4 h-4" /></button>
            </div>
            {forgotSent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-900/30 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-emerald-400" />
                </div>
                <p className={`font-bold ${textCls}`}>Email Sent!</p>
                <p className={`text-sm mt-1 ${subCls}`}>If that account exists, we've sent a reset link to <strong>{forgotEmail}</strong>. Check your inbox.</p>
                <button onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }} className={`mt-4 text-sm font-semibold ${accentText}`}>Back to Login</button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <p className={`text-sm ${subCls}`}>Enter your email address and we'll send you a password reset link.</p>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${subCls}`}>Email Address</label>
                  <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required placeholder="your@email.com" className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition ${inputCls}`} />
                </div>
                <button type="submit" disabled={forgotLoading} className={`w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r ${accent} text-white hover:opacity-90 transition-all flex items-center justify-center gap-2`}>
                  {forgotLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-3">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className={`text-3xl font-black tracking-tight ${textCls}`}>Trustora</h1>
          <p className={`text-xs mt-1 italic ${subCls}`}>"Don't just book what looks good. Book what you can trust."</p>
        </div>

        {!portal && (
          <div className={`backdrop-blur border rounded-2xl p-6 shadow-2xl ${cardBg}`}>
            <h2 className={`font-bold text-center text-lg mb-1 ${textCls}`}>Welcome to Trustora</h2>
            <p className={`text-xs text-center mb-6 ${subCls}`}>Choose your portal to continue</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setPortal('guest')} className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-slate-700 hover:border-emerald-500/60 bg-slate-950/60 hover:bg-emerald-900/10 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><User className="w-6 h-6 text-white" /></div>
                <div className="text-center">
                  <p className="text-white font-bold text-sm">I'm a Guest</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Find &amp; book verified stays</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">Traveller</span>
              </button>
              <button onClick={() => setPortal('host')} className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-slate-700 hover:border-indigo-500/60 bg-slate-950/60 hover:bg-indigo-900/10 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Building2 className="w-6 h-6 text-white" /></div>
                <div className="text-center">
                  <p className="text-white font-bold text-sm">I'm a Host</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Get verified &amp; list rentals</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold">Property Owner</span>
              </button>
            </div>
            <p className={`text-center text-xs mt-6 ${subCls}`}>
              New to Trustora?{' '}
              <button onClick={onSwitchToRegister} className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer">Create an account</button>
            </p>
          </div>
        )}

        {portal && (
          <div className={`backdrop-blur border rounded-2xl p-6 shadow-2xl ${cardBg}`}>
            <button onClick={() => setPortal(null)} className={`flex items-center gap-1.5 text-xs mb-4 ${subCls} hover:text-white transition-colors cursor-pointer`}>
              <ArrowLeft className="w-3.5 h-3.5" /> Back to portal selection
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${accent} flex items-center justify-center shadow-md`}>
                {portal === 'guest' ? <User className="w-4 h-4 text-white" /> : <Building2 className="w-4 h-4 text-white" />}
              </div>
              <div>
                <h2 className={`font-bold text-base ${textCls}`}>{portal === 'guest' ? 'Guest / Traveller' : 'Host / Property Owner'}</h2>
                <p className={`text-xs ${subCls}`}>Sign in to Trustora</p>
              </div>
            </div>

            {/* Demo login */}
            <button onClick={handleDemo} disabled={loading} className={`w-full mb-3 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r ${accent} text-white hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer`}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              1-Click Demo Login ({portal === 'guest' ? 'Guest' : 'Host'})
            </button>

            {/* Google sign-in */}
            <button onClick={handleGoogle} disabled={loading} className={`w-full mb-4 py-2.5 rounded-xl font-bold text-sm border ${isDark ? 'bg-white/5 border-slate-700 text-white hover:bg-white/10' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} transition-all flex items-center justify-center gap-2 cursor-pointer`}>
              <GoogleIcon /> Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-800" />
              <span className={`text-[11px] ${subCls}`}>or sign in with email</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${subCls}`}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder={portal === 'guest' ? 'guest@trustora.ai' : 'host@trustora.ai'}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition ${inputCls}`} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`block text-xs font-semibold ${subCls}`}>Password</label>
                  <button type="button" onClick={() => { setForgotEmail(email); setShowForgot(true); }} className={`text-[11px] font-semibold ${accentText} hover:opacity-80 transition cursor-pointer`}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                    className={`w-full border rounded-xl px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition ${inputCls}`} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${subCls} hover:text-slate-300`}>
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className={`w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r ${accent} text-white hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 mt-1 cursor-pointer`}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Sign In as {portal === 'guest' ? 'Guest' : 'Host'}
              </button>
            </form>

            <p className={`text-center text-xs mt-4 ${subCls}`}>
              Don't have an account?{' '}
              <button onClick={onSwitchToRegister} className={`${accentText} font-semibold cursor-pointer`}>Sign up free</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
