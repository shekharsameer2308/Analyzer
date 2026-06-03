import { useState } from 'react';
import axios from 'axios';
import { BrainCircuit, Send, Sparkles, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export default function AIInsights() {
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState<Message[]>([
    { role: 'assistant', text: "Hello! I am CoalLab AI. Ask me about coal quality trends, anomaly alerts, or blending recommendations." }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const nextMessages: Message[] = [...chat, { role: 'user', text: query }];
    setChat(nextMessages);
    setQuery('');
    setLoading(true);
    setError('');

    try {
      // Call backend API for live Gemini / heuristic insights
      const res = await axios.post(`${API_URL}/chat/chat`, {
        messages: nextMessages.map(m => ({
          role: m.role,
          text: m.text
        }))
      });
      
      setChat(prev => [...prev, { role: 'assistant', text: res.data.text }]);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to connect to the AI insights service.');
      setChat(prev => [...prev, { 
        role: 'assistant', 
        text: "I encountered an error communicating with the insights engine. Please verify the backend service is running." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto pb-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
          <BrainCircuit className="text-purple-400" size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            AI Insights <Sparkles size={20} className="text-purple-400" />
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Interactive data summary evaluation powered by Gemini and SQLite context</p>
        </div>
      </div>

      <div className="flex-1 bg-[#101010] border border-zinc-800/60 rounded-2xl flex flex-col overflow-hidden min-h-[500px]">
        {/* Chat Window */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/10' 
                    : 'bg-zinc-900 border border-zinc-800/50 text-zinc-200'
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-zinc-800/50 rounded-2xl px-5 py-3 flex gap-2 items-center">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-950/20 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
        
        {/* Chat Input */}
        <div className="p-4 bg-zinc-950/50 border-t border-zinc-800/50">
          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about quality summaries, coal properties, or anomalies..."
              className="w-full pl-6 pr-14 py-4 bg-zinc-900 border border-zinc-800/60 rounded-full text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all"
            />
            <button 
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-30 text-white rounded-full transition-colors cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
