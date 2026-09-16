/** Pages Part 1 */
const fs = require('fs');
const path = require('path');

function write(relPath, content) {
  const fullPath = path.join('C:/Users/Sarthak/.gemini/antigravity/scratch/hostboost-ai/frontend', relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Wrote: ' + relPath);
}

// Login.jsx
write('src/pages/auth/Login.jsx', `import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Sparkles, ShieldCheck, ArrowRight, Lock, Mail, Zap } from 'lucide-react';

export const Login = ({ onSwitchToRegister }) => {
  const { login, demoLogin } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to HostBoost AI!');
    } catch (err ) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await demoLogin();
      toast.success('Logged in with Verified Demo Host Account!');
    } catch (err) {
      toast.error('Failed to auto-login demo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />

      <div className="max-w-md w-full z-10">
        {/* Brand Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 shadow-xl shadow-indigo-500/25 mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            HostBoost <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Intelligent Hospitality & Trust Management Platform
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          {/* 1-Click Demo Button */}
          <button
            type="button"
            onClick={handleDemo}
            disabled={loading}
            className="w-full mb-6 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all duration-200"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>1-Click Demo Host Login</span>
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-800 w-full"></div>
            <span className="absolute bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider">
              or sign in with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="host@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• �6�74��S�'r�gV����"�B��"�R&r�6�FRӓS&�&FW"&�&FW"�6�FRӃ&�V�FVB׆�FW�B�6�FW�B�v��FR�6V���FW"�6�FR�cf�7W3��WFƖ�R����Rf�7W3�&�&FW"֖�F�v��S �����F�c���F�cࠢ�'WGF��G�S�'7V&֗B �F�6&�VC׶��F��wТ6�74��S�'r�gV����2��B&�V�FVB�'��&r֖�F�v��c��fW#�&r֖�F�v��SFW�B�v��FRf��B�&��BFW�B�6�f�W��FV�2�6V�FW"�W7F�g��6V�FW"v�"6�F�r��r6�F�r֖�F�v�ӓ�CG&�6�F������ �����F��r�u6�v��r�����r������7��6�v���F�F6�&�&C��7���'&�u&�v�B6�74��S�'r�B��B"������Т��'WGF�����f�&�ࠢ�F�b6�74��S�&�B�bFW�B�6V�FW"#��6�74��S�'FW�Bׇ2FW�B�6�FR�C#��Wr��7C��rwТ�'WGF����6Ɩ6�׶��7v�F6�F�&Vv�7FW'Т6�74��S�'FW�B֖�F�v��C��fW#�FW�B֖�F�v��3f��B�6V֖&��B ��7&VFR�66�V�@���'WGF��������F�c���F�c���F�c���F�c����Ӱ�����6��6��R���r�uvW2'Bf��6�VBr��