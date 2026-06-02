import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import SamplesList from './pages/SamplesList';
import AIInsights from './pages/AIInsights';
import AnomalyDetection from './pages/AnomalyDetection';
import BlendingOptimizer from './pages/BlendingOptimizer';
import { LayoutDashboard, Database, BrainCircuit, Activity, AlertTriangle, Layers } from 'lucide-react';
import './index.css';

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="text-blue-500" /> CoalLab AI
          </h1>
          <p className="text-sm text-slate-500 mt-1">Quality Analytics Platform</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-white font-medium">
            <LayoutDashboard size={20} className="text-blue-400" />
            Dashboard
          </Link>
          <Link to="/samples" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            <Database size={20} className="text-emerald-400" />
            Coal Samples
          </Link>
          <Link to="/anomalies" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            <AlertTriangle size={20} className="text-red-400" />
            Anomaly Alerts
          </Link>
          <Link to="/blending" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            <Layers size={20} className="text-indigo-400" />
            Blend Optimizer
          </Link>
          <Link to="/insights" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            <BrainCircuit size={20} className="text-purple-400" />
            AI Insights
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950">
        <div className="p-8 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/samples" element={<SamplesList />} />
            <Route path="/anomalies" element={<AnomalyDetection />} />
            <Route path="/blending" element={<BlendingOptimizer />} />
            <Route path="/insights" element={<AIInsights />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
