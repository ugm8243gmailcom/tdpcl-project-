import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  ScatterChart,
  MapPin,
  LineChart,
  Bell,
  Cpu,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLandingView: boolean;
  setIsLandingView: (val: boolean) => void;
  highRiskCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isLandingView,
  setIsLandingView,
  highRiskCount
}) => {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Main Presentation Dashboard'
    },
    {
      id: 'consumer-analysis',
      label: 'Consumer Analysis',
      icon: UserCheck,
      description: 'Individual Consumer Deep-Dive'
    },
    {
      id: 'anomaly-detection',
      label: 'Anomaly Detection',
      icon: ScatterChart,
      description: 'ML Clustering & Scatter Visualizer'
    },
    {
      id: 'area-intelligence',
      label: 'Area Intelligence',
      icon: MapPin,
      description: 'Large-Scale Grid Nodes Map'
    },
    {
      id: 'consumption-analytics',
      label: 'Consumption Analytics',
      icon: LineChart,
      description: 'Demand & Seasonal Analytics'
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge: highRiskCount,
      description: 'Prioritized Alert Management'
    },
    {
      id: 'model-insights',
      label: 'Model Insights',
      icon: Cpu,
      description: 'Simulated ML Metrics & Features'
    }
  ];

  return (
    <aside className="w-64 bg-[#090e1c] border-r border-slate-800/80 flex flex-col shrink-0 min-h-[calc(100vh-61px)] select-none">
      
      {/* View Selector Card */}
      <div className="p-4 border-b border-slate-800/60">
        <button
          onClick={() => setIsLandingView(!isLandingView)}
          className={`w-full p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
            isLandingView
              ? 'bg-cyan-950/40 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg ${isLandingView ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'}`}>
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white tracking-wide">
                  {isLandingView ? 'Landing Overview' : 'Project Specs'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {isLandingView ? 'Viewing Overview' : 'How System Works'}
                </p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform ${isLandingView ? 'text-cyan-400 rotate-90' : 'text-slate-500'}`} />
          </div>
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
          Core Dashboards
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !isLandingView && activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setIsLandingView(false);
                setActiveTab(item.id);
              }}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between group transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 border border-cyan-500/30 text-white font-semibold shadow-md shadow-cyan-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-cyan-400'
                      : 'text-slate-400 group-hover:text-cyan-400'
                  }`}
                />
                <span className="text-xs tracking-wide">{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Academic Prototype Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold font-mono">Academic Prototype</span>
            </div>
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            ETDS TDPCL Project Prototype. Prioritizes anomaly investigation for grid operators.
          </p>
        </div>
      </div>
    </aside>
  );
};
