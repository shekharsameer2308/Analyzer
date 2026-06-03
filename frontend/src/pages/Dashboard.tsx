import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { Database, Flame, Activity, MoreVertical, TrendingDown, Info } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export default function Dashboard() {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/analytics/kpis`);
      return res.data;
    }
  });

  const { data: distribution, isLoading: distLoading } = useQuery({
    queryKey: ['mine-distribution'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/analytics/mine-distribution`);
      return res.data;
    }
  });

  if (kpisLoading || distLoading) return (
    <div className="flex h-full items-center justify-center">
      <div className="text-zinc-500 animate-pulse text-lg">Initializing Dashboard Analytics...</div>
    </div>
  );

  const avgScore = kpis?.avg_quality_score || 0;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* 2x2 Grid for KPIs + 1 for Gauge Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: KPI Cards Grid */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <KPICard 
            title="Total Samples" 
            value={kpis?.total_samples?.toLocaleString() || '0'} 
            subtitle="Processed this month"
            trend="+12.5%"
            isPositive={true}
            icon={<Database className="text-emerald-400" size={24} />} 
            glowClass="glow-green"
          />
          <KPICard 
            title="Avg GCV (kcal/kg)" 
            value={kpis?.avg_gcv?.toString() || '0'} 
            subtitle="Average across all mines"
            trend="+3.2%"
            isPositive={true}
            icon={<Flame className="text-orange-400" size={24} />} 
            glowClass="glow-orange"
          />
          <KPICard 
            title="Avg Ash Content" 
            value={`${kpis?.avg_ash?.toString() || '0'}%`} 
            subtitle="Current impurity level"
            trend="-1.5%"
            isPositive={true} 
            icon={<Activity className="text-blue-400" size={24} />} 
            glowClass="glow-blue"
          />
          <KPICard 
            title="Anomaly Risk" 
            value="Low" 
            subtitle="Based on current feed"
            trend="+8.4%"
            isPositive={false}
            icon={<AlertTriangle className="text-red-400" size={24} />} 
            glowClass="glow-red"
          />
        </div>

        {/* Right Side: Quality Index Gauge */}
        <div className="bg-[#101010] border border-zinc-800/60 rounded-2xl p-6 relative flex flex-col items-center justify-center">
          <div className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 cursor-pointer text-zinc-500 transition-colors">
            <MoreVertical size={20} />
          </div>
          
          <div className="w-full text-left mb-2">
            <h3 className="text-xl font-bold text-white tracking-wide">Overall Quality Index</h3>
          </div>
          
          <div className="w-full flex-1 flex flex-col items-center justify-center relative -mt-4">
            <Plot
              data={[{
                type: "indicator",
                mode: "gauge+number",
                value: avgScore,
                number: { suffix: "%", font: { size: 48, color: "white", family: "Inter" } },
                gauge: {
                  axis: { range: [0, 100], tickwidth: 1, tickcolor: "#27272a", tickfont: {color: "#52525b"} },
                  bar: { color: "#10b981", thickness: 0.15 },
                  bgcolor: "#27272a",
                  borderwidth: 0,
                  steps: [
                    { range: [0, 50], color: "#ef4444" },
                    { range: [50, 75], color: "#f59e0b" },
                    { range: [75, 100], color: "rgba(16, 185, 129, 0.1)" }
                  ],
                }
              }]}
              layout={{
                width: 350,
                height: 250,
                margin: { t: 50, r: 25, l: 25, b: 25 },
                paper_bgcolor: "transparent",
                plot_bgcolor: "transparent",
                font: { color: "white", family: "Inter" }
              }}
              config={{ displayModeBar: false }}
            />
          </div>
          
          <div className="w-full mt-4 flex items-center justify-between text-zinc-500 text-sm">
            <span>Low Quality</span>
            <span>High Quality</span>
          </div>
          
          <div className="w-full mt-4 py-3 px-4 bg-zinc-900/50 rounded-xl border border-zinc-800 flex items-center gap-3 text-xs text-zinc-400">
            <Info size={16} className="text-zinc-500" />
            <span>Now: {avgScore}% indicates <strong className="text-zinc-300 font-medium">Optimal Quality</strong></span>
          </div>
        </div>
      </div>

      {/* Bottom Chart: Sample Distribution */}
      <div className="bg-[#101010] border border-zinc-800/60 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">Sample Distribution</h3>
            <p className="text-sm text-zinc-500 mt-1">Track your coal samples origin distribution</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="w-3 h-3 rounded-full bg-zinc-700"></span> Expected
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Actual Sales
            </div>
            <select className="bg-transparent border border-zinc-800 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500 ml-4">
              <option className="bg-[#101010]">This month</option>
              <option className="bg-[#101010]">Last month</option>
            </select>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          {distribution && (
            <Plot
              data={[{
                x: distribution.map((d: any) => d.mine_name),
                y: distribution.map((d: any) => d.count),
                type: 'bar',
                marker: { 
                  color: 'rgba(16, 185, 129, 0.8)',
                  line: { color: '#10b981', width: 1 },
                  opacity: 0.9
                },
                width: 0.4,
              }]}
              layout={{
                autosize: true,
                margin: { t: 10, l: 40, r: 10, b: 40 },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: { color: '#71717a', family: "Inter" },
                xaxis: { 
                  showgrid: false,
                  zeroline: false,
                  tickfont: { color: '#71717a' }
                },
                yaxis: {
                  showgrid: true,
                  gridcolor: '#27272a',
                  zeroline: false,
                  tickfont: { color: '#71717a' }
                },
                hovermode: 'closest'
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
              config={{ displayModeBar: false }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Custom AlertTriangle for the red glow card
function AlertTriangle({ className, size }: { className: string, size: number }) {
  return <TrendingDown className={className} size={size} />;
}

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
  glowClass: string;
}

function KPICard({ title, value, subtitle, trend, isPositive, icon, glowClass }: KPICardProps) {
  return (
    <div className="bg-[#101010] border border-zinc-800/60 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition-colors">
      
      {/* Background Glow Effect */}
      <div className={`absolute -top-12 -left-12 w-48 h-48 rounded-full ${glowClass} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      {/* Header Row: Icon + Trend Pill */}
      <div className="flex justify-between items-start relative z-10">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          {icon}
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
          isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {trend}
        </div>
      </div>
      
      {/* Content */}
      <div className="mt-8 relative z-10">
        <p className="text-zinc-400 text-sm font-medium mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">{value}</h2>
        </div>
        <p className="text-zinc-500 text-sm mt-3">{subtitle}</p>
      </div>
      
    </div>
  );
}
