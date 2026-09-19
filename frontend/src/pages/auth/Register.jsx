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
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      showToast(err.response?.data?.error || 'Registration failed', 'error');
      setLoading(false);
    }
  };

  const accent = role === 'guest' ? 'from-emerald-600 to-teal-600' : 'from-indigo-600 to-violet-600';
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
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className={'text-2xl font-black ' + textCls + ' tracking-tight'}>Create Trustora Account</h1>
          <p className={'text-xs ' + subCls + ' mt-1 font-medium'}>Join the Verified Hospitality Ecosystem</p>
        </div>

        <div className={'rounded-3xl border ' + cardBg + ' p-6 sm:p-8 backdrop-blur-xl shadow-2xl'}>
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 mb-5 p-1 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setRole('guest')}
              className={'py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ' + (role === 'guest' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30' : 'text-slate-400 hover:text-white')}
            >
              <User className="w-3.5 h-3.5" />
              <span>I am a Guest</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('host')}
              className={'py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ' + (role === 'host' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white')}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>I am a Host</span>
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className={'w-full px-4 py-2.5 rounded-xl border ' + inputCls + ' text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className={'w-full px-4 py-2.5 rounded-xl border ' + inputCls + ' text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 12345"
                className={'w-full px-4 py-2.5 rounded-xl border ' + inputCls + ' text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={'w-full px-4 py-2.5 pr-10 rounded-xl border ' + inputCls + ' text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={'w-full py-3 rounded-xl bg-gradient-to-r ' + accent + ' text-white font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2'}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account & Continue'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6 font-medium">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-emerald-400 font-bold hover:underline cursor-pointer">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
