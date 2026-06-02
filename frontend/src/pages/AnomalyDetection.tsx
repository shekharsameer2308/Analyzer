import { AlertTriangle, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AnomalyDetection() {
  // Mock data for anomalies
  const anomalies = [
    { id: 1, sample_id: 'SMP-A9B8C7', mine: 'Beta Colliery', type: 'High Ash', severity: 'High', value: '42.5%', expected: '< 35%', date: '2026-06-02' },
    { id: 2, sample_id: 'SMP-X1Y2Z3', mine: 'Omega Works', type: 'Low GCV', severity: 'Critical', value: '3100 kcal', expected: '> 4000 kcal', date: '2026-06-01' },
    { id: 3, sample_id: 'SMP-M4N5O6', mine: 'Alpha Washery', type: 'Moisture Spike', severity: 'Medium', value: '18.2%', expected: '< 12%', date: '2026-05-30' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="text-red-500" /> Anomaly Detection
          </h2>
          <p className="text-slate-500 mt-1">AI-powered outlier detection (Isolation Forest)</p>
        </div>
        <button className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
          <Filter size={16} /> Filter Alerts
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl p-6">
          <p className="text-red-600 dark:text-red-400 font-medium text-sm">Critical Anomalies</p>
          <p className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">1</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50 rounded-xl p-6">
          <p className="text-orange-600 dark:text-orange-400 font-medium text-sm">High Severity</p>
          <p className="text-3xl font-bold text-orange-700 dark:text-orange-300 mt-2">1</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/50 rounded-xl p-6">
          <p className="text-yellow-600 dark:text-yellow-400 font-medium text-sm">Medium Severity</p>
          <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mt-2">1</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Recent Flagged Samples</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {anomalies.map((item) => (
            <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 dark:text-white">{item.sample_id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    item.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                    item.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.severity}
                  </span>
                </div>
                <p className="text-slate-500 text-sm mt-1">{item.mine} • Detected {item.date}</p>
              </div>
              
              <div className="flex flex-col md:items-end">
                <div className="flex items-center gap-2">
                  {item.type.includes('High') || item.type.includes('Spike') ? (
                    <ArrowUpRight className="text-red-500" size={18} />
                  ) : (
                    <ArrowDownRight className="text-red-500" size={18} />
                  )}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.type}</span>
                </div>
                <p className="text-sm mt-1">
                  <span className="text-red-500 font-medium">{item.value}</span> 
                  <span className="text-slate-400 mx-2">vs</span> 
                  <span className="text-emerald-500 font-medium">Expected {item.expected}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
