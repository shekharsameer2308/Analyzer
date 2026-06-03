import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Database, Search, Filter } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export default function SamplesList() {
  const { data: samples, isLoading } = useQuery({
    queryKey: ['samples'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/samples`);
      return res.data;
    }
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Database className="text-blue-500" size={32} />
            Coal Samples
          </h2>
          <p className="text-sm text-zinc-500 mt-2">Manage and monitor all incoming raw coal sample laboratory telemetry</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer text-sm">
            <Filter size={16} /> Filter
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-600/10 transition-colors cursor-pointer text-sm">
            <Database size={16} /> Upload CSV
          </button>
        </div>
      </div>

      <div className="bg-[#101010] border border-zinc-800/60 rounded-2xl overflow-hidden">
        {/* Search Panel */}
        <div className="p-4 border-b border-zinc-800/60 flex items-center gap-4 bg-zinc-950/20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by Sample ID or Mine Name..." 
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
            />
          </div>
        </div>
        
        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/40 text-xs uppercase text-zinc-400 font-semibold border-b border-zinc-800/60">
              <tr>
                <th className="px-6 py-4">Sample ID</th>
                <th className="px-6 py-4">Mine Name</th>
                <th className="px-6 py-4">GCV (kcal/kg)</th>
                <th className="px-6 py-4">Ash (%)</th>
                <th className="px-6 py-4">Moisture (%)</th>
                <th className="px-6 py-4">Quality Score</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-zinc-800 border-t-blue-500 rounded-full animate-spin"></div>
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : samples?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No coal samples found in the database.
                  </td>
                </tr>
              ) : (
                samples?.map((sample: any) => (
                  <tr key={sample.id} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-white text-xs">{sample.sample_id}</td>
                    <td className="px-6 py-4 text-zinc-300">{sample.mine_name}</td>
                    <td className="px-6 py-4 font-mono text-zinc-300">{sample.gcv}</td>
                    <td className="px-6 py-4 font-mono text-zinc-300">{sample.ash}%</td>
                    <td className="px-6 py-4 font-mono text-zinc-300">{sample.moisture}%</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              sample.quality_score > 75 ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 
                              sample.quality_score > 50 ? 'bg-blue-500 shadow-md shadow-blue-500/20' : 
                              'bg-orange-500 shadow-md shadow-orange-500/20'
                            }`} 
                            style={{ width: `${Math.max(0, Math.min(100, sample.quality_score || 0))}%` }}
                          />
                        </div>
                        <span className="font-mono text-zinc-300 text-xs">{sample.quality_score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {sample.is_anomaly ? (
                        <span className="bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full text-xs font-semibold border border-red-500/20">
                          Anomaly
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-500/20">
                          Normal
                        </span>
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
