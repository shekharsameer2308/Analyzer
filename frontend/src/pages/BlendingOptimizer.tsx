import { Layers, Settings, PieChart, Play, Sliders } from 'lucide-react';

export default function BlendingOptimizer() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="text-indigo-500" /> Blending Optimizer
          </h2>
          <p className="text-slate-500 mt-1">AI-driven coal blending to meet target specifications</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
          <Play size={16} /> Run Optimization
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
              <Settings size={18} /> Target Specifications
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target GCV (kcal/kg)</label>
                <div className="flex items-center gap-4">
                  <input type="range" min="3000" max="6000" defaultValue="4200" className="w-full" />
                  <span className="font-semibold text-slate-900 dark:text-white">4200</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Ash Content (%)</label>
                <div className="flex items-center gap-4">
                  <input type="range" min="10" max="50" defaultValue="35" className="w-full" />
                  <span className="font-semibold text-slate-900 dark:text-white">35.0</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Moisture (%)</label>
                <div className="flex items-center gap-4">
                  <input type="range" min="5" max="25" defaultValue="12" className="w-full" />
                  <span className="font-semibold text-slate-900 dark:text-white">12.0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
              <Sliders size={18} /> Available Sources
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">High GCV Source (Mine A)</p>
                  <p className="text-xs text-slate-500">4800 kcal • 28% Ash • $45/t</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">Low Cost Source (Mine B)</p>
                  <p className="text-xs text-slate-500">3200 kcal • 42% Ash • $25/t</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">Washed Coal (Washery 1)</p>
                  <p className="text-xs text-slate-500">4100 kcal • 34% Ash • $38/t</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-indigo-200 dark:border-indigo-900/50 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <PieChart size={120} />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-6">Optimal Blend Recommendation</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
              <div>
                <p className="text-sm text-slate-500">Predicted GCV</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">4215 <span className="text-base font-normal">kcal</span></p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Predicted Ash</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">34.8 <span className="text-base font-normal">%</span></p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Cost</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">$37.50 <span className="text-base font-normal">/t</span></p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Confidence</p>
                <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">94.2 <span className="text-base font-normal">%</span></p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Blend Ratio</h4>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">High GCV Source (Mine A)</span>
                  <span className="font-bold">62%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                  <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Low Cost Source (Mine B)</span>
                  <span className="font-bold">38%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                  <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-400">Washed Coal (Washery 1)</span>
                  <span className="font-bold text-slate-400">0%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                  <div className="bg-slate-300 dark:bg-slate-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
