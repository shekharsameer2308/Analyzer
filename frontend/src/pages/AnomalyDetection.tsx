import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AlertTriangle, Database, Activity, ShieldAlert, ShieldCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export default function AnomalyDetection() {
  const { data: anomaliesData, isLoading } = useQuery({
    queryKey: ['ml-anomalies'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/ml/anomalies`);
      return res.data;
    }
  });

  if (isLoading) return (
    <div className="flex h-full items-center justify-center">
      <div className="text-zinc-500 animate-pulse text-lg">Running Isolation Forest ML Engine...</div>
    </div>
  );

  const anomalies = anomaliesData?.data?.filter((s: any) => s.is_anomaly) || [];
  const normalCount = anomaliesData?.total_analyzed - anomalies.length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Anomaly Detection</h2>
          <p className="text-sm text-zinc-500 mt-1">Machine Learning Analysis powered by Scikit-Learn Isolation Forest</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#101010] border border-zinc-800/60 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full glow-blue opacity-30"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl"><Database className="text-blue-400" /></div>
            <div>
              <p className="text-sm text-zinc-500">Total Analyzed</p>
              <p className="text-2xl font-bold text-white">{anomaliesData?.total_analyzed || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#101010] border border-zinc-800/60 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full glow-red opacity-30"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl"><ShieldAlert className="text-red-400" /></div>
            <div>
              <p className="text-sm text-zinc-500">Anomalies Detected</p>
              <p className="text-2xl font-bold text-red-400">{anomalies.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#101010] border border-zinc-800/60 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full glow-green opacity-30"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl"><ShieldCheck className="text-emerald-400" /></div>
            <div>
              <p className="text-sm text-zinc-500">Normal Samples</p>
              <p className="text-2xl font-bold text-emerald-400">{normalCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="bg-[#101010] border border-zinc-800/60 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <AlertTriangle className="text-red-500" /> High-Risk Anomalies
        </h3>
        
        {anomalies.length === 0 ? (
          <div className="text-center py-10">
            <ShieldCheck size={48} className="mx-auto text-emerald-500 mb-3 opacity-50" />
            <p className="text-zinc-400">No anomalies detected in the current dataset.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalies.map((sample: any) => (
              <div key={sample.id} className="bg-zinc-900/50 border border-red-900/30 rounded-xl p-5 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:bg-zinc-900 transition-colors">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">
                      Score: {sample.anomaly_score}/100
                    </span>
                    <span className="text-white font-medium">Sample ID: {sample.id.substring(0, 8)}</span>
                    <span className="text-zinc-500 text-sm">{sample.mine_name}</span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-2">
                    This sample exhibits a highly unusual combination of properties compared to the dataset distribution.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 md:justify-end">
                  <Metric label="GCV" value={sample.gcv} unit="kcal/kg" />
                  <Metric label="Moisture" value={sample.moisture} unit="%" />
                  <Metric label="Ash" value={sample.ash} unit="%" />
                  <Metric label="Sulfur" value={sample.sulfur} unit="%" />
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, unit }: { label: string, value: number, unit: string }) {
  return (
    <div className="bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-2 min-w-[100px]">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-white font-mono font-medium">{value} <span className="text-zinc-600 text-xs ml-0.5">{unit}</span></p>
    </div>
  );
}
