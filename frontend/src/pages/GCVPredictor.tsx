import { useState } from 'react';
import axios from 'axios';
import { BrainCircuit, Calculator, Info } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export default function GCVPredictor() {
  const [formData, setFormData] = useState({
    moisture: '',
    ash: '',
    volatile_matter: '',
    fixed_carbon: ''
  });
  
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPrediction(null);
    
    try {
      const payload = {
        moisture: parseFloat(formData.moisture),
        ash: parseFloat(formData.ash),
        volatile_matter: parseFloat(formData.volatile_matter),
        fixed_carbon: parseFloat(formData.fixed_carbon)
      };
      
      const res = await axios.post(`${API_URL}/ml/predict-gcv`, payload);
      setPrediction(res.data.predicted_gcv);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred during prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <BrainCircuit className="text-purple-500" size={32} />
          XGBoost GCV Predictor
        </h2>
        <p className="text-sm text-zinc-500 mt-2">
          Predict Gross Calorific Value instantly using an XGBoost Regression model trained on historical data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-[#101010] border border-zinc-800/60 rounded-2xl p-8 relative overflow-hidden">
          <h3 className="text-xl font-bold text-white mb-6">Input Parameters</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Moisture (%)</label>
                <input 
                  type="number" step="0.01" required name="moisture"
                  value={formData.moisture} onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                  placeholder="e.g. 8.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Ash (%)</label>
                <input 
                  type="number" step="0.01" required name="ash"
                  value={formData.ash} onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                  placeholder="e.g. 15.2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Volatile Matter (%)</label>
                <input 
                  type="number" step="0.01" required name="volatile_matter"
                  value={formData.volatile_matter} onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                  placeholder="e.g. 25.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Fixed Carbon (%)</label>
                <input 
                  type="number" step="0.01" required name="fixed_carbon"
                  value={formData.fixed_carbon} onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                  placeholder="e.g. 51.3"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><Calculator size={18} /> Calculate Prediction</>
              )}
            </button>
            
            {error && (
              <p className="text-red-400 text-sm mt-3 text-center bg-red-900/20 py-2 rounded-lg">{error}</p>
            )}
          </form>
        </div>

        {/* Results Card */}
        <div className="bg-[#101010] border border-zinc-800/60 rounded-2xl p-8 relative overflow-hidden group flex flex-col justify-center min-h-[300px]">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full glow-purple opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          
          <div className="relative z-10 text-center">
            {prediction !== null ? (
              <div className="animate-in fade-in zoom-in duration-500">
                <p className="text-zinc-400 font-medium mb-2 uppercase tracking-widest text-sm">Predicted GCV</p>
                <div className="text-6xl md:text-7xl font-bold text-white mb-2 font-mono">
                  {prediction.toFixed(0)} <span className="text-2xl text-purple-400 align-top">kcal/kg</span>
                </div>
                <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-500/10 px-3 py-1.5 rounded-full mt-4 border border-emerald-500/20">
                  <Info size={14} /> High Confidence Estimate
                </div>
              </div>
            ) : (
              <div className="text-zinc-600 flex flex-col items-center">
                <BrainCircuit size={64} className="mb-4 opacity-50" />
                <p className="text-lg">Awaiting input parameters...</p>
                <p className="text-sm mt-2 max-w-xs text-zinc-500">The XGBoost model evaluates complex non-linear relationships to accurately predict energy density.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
