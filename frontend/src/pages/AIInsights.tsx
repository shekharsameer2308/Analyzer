import { useState } from 'react';
import { BrainCircuit, Send, Sparkles } from 'lucide-react';

export default function AIInsights() {
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState([
    { role: 'assistant', text: "Hello! I'm CoalLab AI. Ask me about coal quality trends, anomaly detection, or predictive insights." }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setChat(prev => [...prev, { role: 'user', text: query }]);
    setQuery('');
    setLoading(true);

    // Mock API call to Gemini/LangChain
    setTimeout(() => {
      setChat(prev => [...prev, { 
        role: 'assistant', 
        text: "I analyzed the recent sample data. The average GCV has dropped by 2.4% over the last week, primarily from the Beta Colliery. I recommend investigating the washery efficiency there." 
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
          <BrainCircuit className="text-purple-600 dark:text-purple-400" size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            AI Insights <Sparkles size={20} className="text-amber-400" />
          </h2>
          <p className="text-slate-500">Powered by Gemini & LangChain</p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden mb-4">
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl px-6 py-4 flex gap-2 items-center">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about GCV trends, anomalies, or blending recommendations..."
              className="w-full pl-6 pr-14 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
            <button 
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-full transition-colors"
            >
              <Send size={18} className={query.trim() ? "translate-x-0.5" : ""} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
