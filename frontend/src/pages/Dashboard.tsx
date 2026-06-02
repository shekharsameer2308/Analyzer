import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { Activity, Droplets, Flame, BarChart3, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/v1';

export default function Dashboard() {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      // Mock data
      return {
        total_samples: 100000,
        avg_gcv: 5432.10,
        avg_ash: 23.4,
        avg_moisture: 8.5,
        avg_quality_score: 72.5
      };
    }
  });

  const { data: distribution, isLoading: distLoading } = useQuery({
    queryKey: ['mine-distribution'],
    queryFn: async () => {
      // Mock data
      return [
        { mine_name: 'Alpha Washery', count: 21000, avg_gcv: 6100 },
        { mine_name: 'Beta Colliery', count: 18500, avg_gcv: 4500 },
        { mine_name: 'Gamma Open Cast', count: 25000, avg_gcv: 5200 },
        { mine_name: 'Delta Underground', count: 15500, avg_gcv: 6800 },
        { mine_name: 'Omega Works', count: 20000, avg_gcv: 4900 },
      ];
    }
  });

  if (kpisLoading || distLoading) return <div className="text-slate-500 animate-pulse">Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics Overview</h2>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
          <Activity size={16} /> Live Data Feed Active
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Samples" value={kpis?.total_samples?.toLocaleString() || '0'} icon={<Database className="text-blue-500" />} />
        <KPICard title="Avg GCV (kcal/kg)" value={kpis?.avg_gcv?.toString() || '0'} icon={<Flame className="text-orange-500" />} />
        <KPICard title="Avg Ash (%)" value={kpis?.avg_ash?.toString() || '0'} icon={<Activity className="text-slate-500" />} />
        <KPICard title="Avg Quality Score" value={kpis?.avg_quality_score?.toString() || '0'} icon={<BarChart3 className="text-emerald-500" />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Samples by Mine</h3>
          {distribution && (
            <Plot
              data={[{
                x: distribution.map((d: any) => d.mine_name),
                y: distribution.map((d: any) => d.count),
                type: 'bar',
                marker: { color: '#3b82f6' }
              }]}
              layout={{
                autosize: true,
                margin: { t: 10, l: 40, r: 10, b: 80 },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: { color: '#64748b' },
                xaxis: { tickangle: -45 }
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '300px' }}
            />
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Average GCV by Mine</h3>
          {distribution && (
            <Plot
              data={[{
                labels: distribution.map((d: any) => d.mine_name),
                values: distribution.map((d: any) => d.avg_gcv),
                type: 'pie',
                hole: 0.4,
                marker: { colors: ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'] }
              }]}
              layout={{
                autosize: true,
                margin: { t: 10, l: 10, r: 10, b: 10 },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: { color: '#64748b' }
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '300px' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );
}
