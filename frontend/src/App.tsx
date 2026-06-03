import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import SamplesList from './pages/SamplesList';
import AIInsights from './pages/AIInsights';
import AnomalyDetection from './pages/AnomalyDetection';
import BlendingOptimizer from './pages/BlendingOptimizer';
import { LayoutDashboard, Database, BrainCircuit, Activity, AlertTriangle, Layers, Search, Bell, Settings, HelpCircle, User } from 'lucide-react';
import './index.css';

const queryClient = new QueryClient();

function SidebarLink({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-4 px-6 py-3 transition-colors ${
        isActive 
          ? 'bg-white/5 border-l-4 border-emerald-500 text-white font-medium' 
          : 'text-zinc-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#050505] border-r border-zinc-800 flex flex-col flex-shrink-0 z-20">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white italic tracking-tight">
            CoalLab UI
          </h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <div className="mb-6">
            <p className="px-6 text-xs font-semibold text-zinc-500 mb-2 tracking-wider">MENU</p>
            <SidebarLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <SidebarLink to="/samples" icon={<Database size={18} />} label="Coal Samples" />
          </div>

          <div className="mb-6">
            <p className="px-6 text-xs font-semibold text-zinc-500 mb-2 tracking-wider">ANALYTICS</p>
            <SidebarLink to="/anomalies" icon={<AlertTriangle size={18} />} label="Anomaly Alerts" />
            <SidebarLink to="/blending" icon={<Layers size={18} />} label="Blend Optimizer" />
            <SidebarLink to="/insights" icon={<BrainCircuit size={18} />} label="AI Insights" />
          </div>

          <div className="mb-6">
            <p className="px-6 text-xs font-semibold text-zinc-500 mb-2 tracking-wider">TOOLS</p>
            <SidebarLink to="/settings" icon={<Settings size={18} />} label="Setting" />
            <SidebarLink to="/feedback" icon={<User size={18} />} label="Feedback" />
            <SidebarLink to="/help" icon={<HelpCircle size={18} />} label="Help" />
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#09090b]">
        {/* Top Navbar */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Dashboard Analytics</h2>
            <p className="text-sm text-zinc-400 mt-1">Real-time coal quality monitoring and predictive insights.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
              <Search size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
              <div className="w-10 h-10 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold overflow-hidden">
                <User size={20} />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white leading-tight">Admin User</p>
                <p className="text-xs text-zinc-500">Operation Center</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8 relative">
          {children}
        </main>
      </div>
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
