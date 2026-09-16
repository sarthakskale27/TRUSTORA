import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, Loader2 } from 'lucide-react';
import api from '../../services/api';

const QUICK_PROMPTS = [
  'What amenities does the property have?',
  'Is early check-in possible?',
  'How do I get from the airport?',
  'Is breakfast included?',
  'What are the checkout procedures?',
  'Can I bring my pet?',
];

export const GuestConcierge = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your AI Travel Concierge. Ask me anything about your stay, local tips, or travel plans. 🌴" }
  ]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMsg = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/chat/send', { message: text, session_id: 'guest-session-1' });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I couldn't reach the server. Please check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" /> Travel Concierge
        </h1>
        <p className="text-slate-400 text-sm mt-1">AI-powered assistant for all your travel questions</p>
      </div>

      {/* Quick prompts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_PROMPTS.map(p => (
          <button
            key={p}
            onClick={() => sendMsg(p)}
            className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-600 to-teal-400 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                : 'bg-slate-800 text-slate-100 rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-600 to-teal-400 flex items-center justify-center mr-2">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-none">
              <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg(input)}
          placeholder="Ask about your stay, local places, tips..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        <button
          onClick={() => sendMsg(input)}
          disabled={loading || !input.trim()}
          className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white hover:opacity-90 disabled:opacity-40 transition shadow-lg"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
