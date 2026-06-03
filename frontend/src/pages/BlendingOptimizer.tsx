import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers, Settings, PieChart, Play, Sliders, Info, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

interface CoalSource {
  name: string;
  gcv: number;
  ash: number;
  moisture: number;
  cost: number;
  selected: boolean;
}

interface OptimizeResult {
  feasible: boolean;
  blend_ratios: Array<{ name: string; weight: number }>;
  predicted_gcv: number;
  predicted_ash: number;
  predicted_moisture: number;
  total_cost: number;
  confidence: number;
}

export default function BlendingOptimizer() {
  const [sources, setSources] = useState<CoalSource[]>([
    { name: "High GCV Source (Mine A)", gcv: 4800, ash: 28, moisture: 8, cost: 45, selected: true },
    { name: "Low Cost Source (Mine B)", gcv: 3200, ash: 42, moisture: 15, cost: 25, selected: true },
    { name: "Washed Coal (Washery 1)", gcv: 4100, ash: 34, moisture: 10, cost: 38, selected: true }
  ]);

  const [targetGcv, setTargetGcv] = useState(4200);
  const [maxAsh, setMaxAsh] = useState(35.0);
  const [maxMoisture, setMaxMoisture] = useState(12.0);

  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSource = (index: number) => {
    const next = [...sources];
    next[index].selected = !next[index].selected;
    setSources(next);
  };

  const runOptimization = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const payload = {
        sources: sources.map(s => ({
          name: s.name,
          gcv: s.gcv,
          ash: s.ash,
          moisture: s.moisture,
          cost: s.cost,
          selected: s.selected
        })),
        target: {
          target_gcv: targetGcv,
          max_ash: maxAsh,
          max_moisture: maxMoisture
        }
      };

      const res = await axios.post(`${API_URL}/blending/optimize`, payload);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Optimization solver failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount and targets/sources change
  useEffect(() => {
    runOptimization();
  }, [targetGcv, maxAsh, maxMoisture, sources.map(s => s.selected).join(',')]);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Layers className="text-indigo-500" size={32} />
            Blending Optimizer
          </h2>
          <p className="text-sm text-zinc-500 mt-2">AI-driven coal blending to meet target specifications at minimum cost</p>
        </div>
        <button 
          onClick={runOptimization}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/10 cursor-pointer"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <><Play size={16} /> Run Optimization</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#101010] border border-zinc-800/60 rounded-2xl p-6">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-6">
              <Settings size={18} className="text-indigo-400" /> Target Specifications
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <label className="font-medium text-zinc-400">Target GCV (kcal/kg)</label>
                  <span className="font-bold text-white font-mono">{targetGcv}</span>
                </div>
                <input 
                  type="range" min="3000" max="6000" step="50"
                  value={targetGcv} onChange={(e) => setTargetGcv(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer" 
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <label className="font-medium text-zinc-400">Max Ash Content (%)</label>
                  <span className="font-bold text-white font-mono">{maxAsh.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="10" max="50" step="0.5"
                  value={maxAsh} onChange={(e) => setMaxAsh(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer" 
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <label className="font-medium text-zinc-400">Max Moisture (%)</label>
                  <span className="font-bold text-white font-mono">{maxMoisture.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="5" max="25" step="0.5"
                  value={maxMoisture} onChange={(e) => setMaxMoisture(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer" 
                />
              </div>
            </div>
          </div>

          <div className="bg-[#101010] border border-zinc-800/60 rounded-2xl p-6">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-6">
              <Sliders size={18} className="text-indigo-400" /> Available Sources
            </h3>
            <div className="space-y-3">
              {sources.map((src, i) => (
                <label 
                  key={src.name}
                  className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                    src.selected 
                      ? 'bg-indigo-500/5 border-indigo-500/30' 
                      : 'bg-zinc-900/20 border-zinc-800/50 hover:bg-zinc-900/40'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={src.selected} 
                    onChange={() => toggleSource(i)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-500 w-4 h-4" 
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">{src.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">{src.gcv} kcal • {src.ash}% Ash • ${src.cost}/t</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <div className="bg-[#101010] border border-zinc-800/60 rounded-2xl p-8 relative overflow-hidden flex flex-col h-full justify-between min-h-[450px]">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full glow-indigo opacity-20 pointer-events-none"></div>
            
            <div>
              <h3 className="font-semibold text-white mb-8 flex items-center gap-2">
                <PieChart size={18} className="text-indigo-400" /> Optimal Blend Recommendation
              </h3>
              
              {error ? (
                <div className="bg-red-950/20 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-start gap-3">
                  <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-medium">Optimization Error</p>
                    <p className="mt-1 text-zinc-400">{error}</p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-8 relative z-10">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-zinc-900/50 border border-zinc-800/40 p-4 rounded-xl">
                      <p className="text-xs text-zinc-500 font-medium mb-1">Predicted GCV</p>
                      <p className="text-2xl font-bold text-emerald-400 font-mono">
                        {result.predicted_gcv} <span className="text-xs font-normal text-zinc-500">kcal/kg</span>
                      </p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800/40 p-4 rounded-xl">
                      <p className="text-xs text-zinc-500 font-medium mb-1">Predicted Ash</p>
                      <p className="text-2xl font-bold text-emerald-400 font-mono">
                        {result.predicted_ash.toFixed(1)} <span className="text-xs font-normal text-zinc-500">%</span>
                      </p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800/40 p-4 rounded-xl">
                      <p className="text-xs text-zinc-500 font-medium mb-1">Optimal Cost</p>
                      <p className="text-2xl font-bold text-indigo-400 font-mono">
                        ${result.total_cost.toFixed(2)} <span className="text-xs font-normal text-zinc-500">/t</span>
                      </p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800/40 p-4 rounded-xl">
                      <p className="text-xs text-zinc-500 font-medium mb-1">Feasibility</p>
                      <p className={`text-2xl font-bold font-mono ${result.feasible ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {result.feasible ? 'Optimal' : 'Approximate'}
                      </p>
                    </div>
                  </div>

                  {!result.feasible && (
                    <div className="bg-amber-950/20 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-xs flex items-center gap-3">
                      <Info className="flex-shrink-0" size={16} />
                      <span>Target specifications cannot be strictly met with the selected sources. Showing closest feasible blend ratios.</span>
                    </div>
                  )}

                  <div className="space-y-5">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Blend Ratio Weights</h4>
                    
                    {result.blend_ratios.map((item, idx) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-white">{item.name}</span>
                          <span className="font-bold text-indigo-400 font-mono">{item.weight}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 border border-zinc-800/50 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              idx === 0 ? 'bg-indigo-500 shadow-lg shadow-indigo-500/25' :
                              idx === 1 ? 'bg-sky-500 shadow-lg shadow-sky-500/25' :
                              'bg-emerald-500 shadow-lg shadow-emerald-500/25'
                            }`}
                            style={{ width: `${item.weight}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-zinc-500">
                  <Play size={48} className="mx-auto mb-4 opacity-30 animate-pulse" />
                  <p>Awaiting parameters calculation...</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 py-4 px-5 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-start gap-3 text-xs text-zinc-400">
              <Info size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>
                Calculations are completed dynamically on the server by evaluating blending constraint matrices to minimize raw materials cost while achieving performance guidelines.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
