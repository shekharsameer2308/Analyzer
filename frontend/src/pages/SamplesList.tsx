import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Database, Search, Filter } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/v1';

export default function SamplesList() {
  const { data: samples, isLoading } = useQuery({
    queryKey: ['samples'],
    queryFn: async () => {
      // Mock data
      return Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        sample_id: `SMP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        mine_name: ['Alpha Washery', 'Beta Colliery', 'Gamma Open Cast'][i % 3],
        gcv: Math.floor(Math.random() * 3000) + 4000,
        ash: Math.floor(Math.random() * 30) + 10,
        moisture: Math.floor(Math.random() * 10) + 2,
        quality_score: Math.floor(Math.random() * 100),
        is_anomaly: Math.random() > 0.9
      }));
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Coal Samples</h2>
        <div className="flex gap-4">
          <button className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors">
            <Database size={16} /> Upload CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Sample ID or Mine Name..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-950 text-xs uppercase text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Sample ID</th>
                <th className="px-6 py-4">Mine Name</th>
                <th className="px-6 py-4">GCV (kcal)</th>
                <th className="px-6 py-4">Ash (%)</th>
                <th className="px-6 py-4">Moisture (%)</th>
                <th className="px-6 py-4">Quality Score</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading samples...</td></tr>
              ) : samples?.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">No samples found.</td></tr>
              ) : (
                samples?.map((sample: any) => (
                  <tr key={sample.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">{sample.sample_id}</td>
                    <td className="px-6 py-4">{sample.mine_name}</td>
                    <td className="px-6 py-4">{sample.gcv}</td>
                    <td className="px-6 py-4">{sample.ash}</td>
                    <td className="px-6 py-4">{sample.moisture}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${sample.quality_score > 75 ? 'bg-emerald-500' : sample.quality_score > 50 ? 'bg-blue-500' : 'bg-orange-500'}`} 
                            style={{ width: `${Math.max(0, Math.min(100, sample.quality_score || 0))}%` }}
                          />
                        </div>
                        <span>{sample.quality_score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {sample.is_anomaly ? (
                        <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold">Anomaly</span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">Normal</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
