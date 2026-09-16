import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Building2, User, ShieldCheck, Eye, EyeOff, Loader2, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Register = ({ onSwitchToLogin, onBack }) => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const { isDark, toggleTheme } = useTheme();

  const [role, setRole] = useState('guest');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await register({ name, email, password, phone, role });
      showToast('Account created! Welcome to Trustora, ' + u.name, 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const accent = role === 'guest' ? 'from-emerald-600 to-teal-600' : 'from-indigo-600 to-violet-600';
  const accentText = role === 'guest' ? 'text-emerald-400' : 'text-indigo-400';
  const bg = isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/40';
  const cardBg = isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-gray-200 shadow-xl';
  const inputCls = isDark ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400';
  const textCls = isDark ? 'text-white' : 'text-gray-900';
  const subCls = isDark ? 'text-slate-400' : 'text-gray-500';

  return (
    <div className={'min-h-screen ' + bg + ' flex flex-col items-center justify-center p-4 relative'}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-900/15 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        {onBack && (
          <button onClick={onBack} className={'flex items-center gap-1.5 text-sm font-semibold ' + subCls + ' hover:text-emerald-400 transition-colors cursor-pointer'}>
            <ArrowLeft className="w-4 h-4" /> Back to Trustora
          </button>
        )}
        <button onClick={toggleTheme} className={'ml-auto p-2 rounded-xl border ' + (isDark ? 'border-slate-800 text-slate-400' : 'border-gray-200 text-gray-500') + ' hover:scale-110 transition-all cursor-pointer'}>
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
        </button>
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-3">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className={'text-2xl font-black ' + textCls}>Create Trustora Account</h1>
          <p className={'text-xs mt-1 ' + subCls}>Join the Trust Intelligence Layer for Local Rentals</p>
        </div>

        <div className={'backdrop-blur border rounded-2xl p-6 shadow-2xl ' + cardBg}>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => setRole('guest')}
              className={'flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ' + (role === 'guest' ? 'border-emerald-500 bg-emerald-900/20 text-emerald-300' : 'border-slate-700 text-slate-400 hover:border-slate-600')}
            >
              <User className="w-4 h-4" /> I am a Guest
            </button>
            <button
              type="button"
              onClick={() => setRole('host')}
              className={'flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ' + (role === 'host' ? 'border-indigo-500 bg-indigo-900/20 text-indigo-300' : 'border-slate-700 text-slate-400 hover:border-slate-600')}
            >
              <Building2 className="w-4 h-4" /> I am a Host
            </button>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className={'block text-xs font-semibold mb-1.5 ' + subCls}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Priya Sharma"
                required
                className={'w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition ' + inputCls}
              />
            </div>
            <div>
              <label className={'block text-xs font-semibold mb-1.5 ' + subCls}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@trustora.ai"
                required
                className={'w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition ' + inputCls}
              />
            </div>
            <div>
              <label className={'block text-xs font-semibold mb-1.5 ' + subCls}>Phone (optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className={'w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition ' + inputCls}
              />
            </div>
            <div>
              <label className={'block text-xs font-semibold mb-1.5 ' + subCls}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className={'w-full border rounded-xl px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition ' + inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className={'absolute right-3 top-1/2 -translate-y-1/2 ' + subCls + ' hover:text-slate-300 cursor-pointer'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={'w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r ' + accent + ' text-white hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 mt-1 cursor-pointer'}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create {role === 'guest' ? 'Guest' : 'Host'} Account
            </button>
          </form>

          <p className={'text-center text-xs mt-4 ' + subCls}>
            Already registered?{' '}
            <button onClick={onSwitchToLogin} className={accentText + ' font-semibold cursor-pointer'}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
};
