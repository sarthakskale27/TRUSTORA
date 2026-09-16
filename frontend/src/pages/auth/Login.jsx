import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Building2, User, ShieldCheck, Eye, EyeOff, Loader2, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Login = ({ onSwitchToRegister, onBack, initialPortal }) => {
  const { login, demoLogin, demoGuestLogin } = useAuth();
  const { showToast } = useToast();
  const { isDark, toggleTheme } = useTheme();

  const [portal, setPortal]     = useState(initialPortal || null);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);

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

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-3">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className={`text-3xl font-black tracking-tight ${textCls}`}>
            Trustora
          </h1>
          <p className={`text-xs mt-1 italic ${subCls}`}>“Don't just book what looks good. Book what you can trust.”</p>
        </div>

        {!portal && (
          <div className={`backdrop-blur border rounded-2xl p-6 shadow-2xl ${cardBg}`}>
            <h2 className={`font-bold text-center text-lg mb-1 ${textCls}`}>Welcome to Trustora</h2>
            <p className={`text-xs text-center mb-6 ${subCls}`}>Choose your portal to continue</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setPortal('guest')}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-slate-700 hover:border-emerald-500/60 bg-slate-950/60 hover:bg-emerald-900/10 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-sm">I'm a Guest</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Find & book verified stays</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">Traveller</span>
              </button>
              <button onClick={() => setPortal('host')}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-slate-700 hover:border-indigo-500/60 bg-slate-950/60 hover:bg-indigo-900/10 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-sm">I'm a Host</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Get verified & list rentals</p>
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
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${accent} flex items-center justify-center shadow-md`}>
                {portal === 'guest' ? <User className="w-4 h-4 text-white" /> : <Building2 className="w-4 h-4 text-white" />}
              </div>
              <div>
                <h2 className={`font-bold text-base ${textCls}`}>{portal === 'guest' ? 'Guest / Traveller' : 'Host / Property Owner'}</h2>
                <p className={`text-xs ${subCls}`}>Sign in to Trustora</p>
              </div>
            </div>

            <button onClick={handleDemo} disabled={loading}
              className={`w-full mb-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r ${accent} text-white hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer`}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              1-Click Demo Login ({portal === 'guest' ? 'Guest' : 'Host'})
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
                <label className={`block text-xs font-semibold mb-1.5 ${subCls}`}>Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••"
                    className={`w-full border rounded-xl px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition ${inputCls}`} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${subCls} hover:text-slate-300`}>
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className={`w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r ${accent} text-white hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 mt-1 cursor-pointer`}>
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
