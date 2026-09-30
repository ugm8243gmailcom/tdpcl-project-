import { Users, MapPin, Activity, ShieldAlert, AlertCircle, IndianRupee, ArrowUpRight, ChevronRight, Zap } from 'lucide-react';
import { MOCK_KPI, MOCK_30DAY_CONSUMPTION, MOCK_RISK_DISTRIBUTION, MOCK_AREAS, MOCK_ALERTS, ALL_CONSUMERS } from '../data/mockData';
import type { Consumer, AreaSummary } from '../types';
import { RiskBadge } from '../components/Common/RiskBadge';
import { DisclaimerBanner } from '../components/Common/DisclaimerBanner';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ReferenceDot
} from 'recharts';

interface OverviewPageProps {
  onSelectConsumer: (consumer: Consumer) => void;
  onSelectArea: (area: AreaSummary) => void;
  onNavigateTab: (tab: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onSelectConsumer,
  onSelectArea,
  onNavigateTab
}) => {
  const kpiItems = [
    {
      label: 'Total Consumers',
      value: MOCK_KPI.totalConsumers.toLocaleString(),
      icon: Users,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/40 border-cyan-500/30'
    },
    {
      label: 'Monitored Areas',
      value: MOCK_KPI.monitoredAreas,
      icon: MapPin,
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/40 border-blue-500/30'
    },
    {
      label: 'Consumers Analyzed',
      value: MOCK_KPI.consumersAnalyzed.toLocaleString(),
      icon: Activity,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40 border-emerald-500/30'
    },
    {
      label: 'Potential Theft Cases',
      value: MOCK_KPI.potentialTheftCases,
      icon: ShieldAlert,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40 border-amber-500/30'
    },
    {
      label: 'High Risk',
      value: MOCK_KPI.highRiskCases,
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-950/40 border-red-500/30'
    },
    {
      label: 'Est. Suspicious Loss',
      value: MOCK_KPI.estimatedSuspiciousLossINR,
      icon: IndianRupee,
      color: 'text-cyan-300',
      bgColor: 'bg-cyan-950/60 border-cyan-400/40'
    }
  ];

  // Specific highlighted anomalies for graph annotation
  const anomalyPoint1 = MOCK_30DAY_CONSUMPTION.find((d) => d.date === 'Aug 14');
  const anomalyPoint2 = MOCK_30DAY_CONSUMPTION.find((d) => d.date === 'Aug 24');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner Disclaimer */}
      <DisclaimerBanner variant="inline" />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        {kpiItems.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${kpi.bgColor} backdrop-blur-md flex flex-col justify-between space-y-2 shadow-lg hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-medium text-slate-400 tracking-tight">
                  {kpi.label}
                </span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-xl lg:text-2xl font-extrabold font-mono text-white tracking-tight">
                {kpi.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Line Chart: Consumption vs Expected Consumption */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl space-y-4 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Consumption vs Expected Consumption (30-Day Grid Stream)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Comparing aggregate actual demand against baseline model predictions
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <span className="text-slate-300">Expected (MW)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-slate-300">Actual (MW)</span>
              </div>
            </div>
          </div>

          {/* Graph Container */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_30DAY_CONSUMPTION} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[30, 60]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono'
                  }}
                />
                
                {/* Expected Line */}
                <Line
                  type="monotone"
                  dataKey="expectedMW"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={false}
                  name="Expected Demand (MW)"
                />
                
                {/* Actual Line */}
                <Line
                  type="monotone"
                  dataKey="actualMW"
                  stroke="#f87171"
                  strokeWidth={2.5}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    if (payload.anomalyDetected) {
                      return (
                        <circle
                          key={payload.date}
                          cx={cx}
                          cy={cy}
                          r={6}
                          fill="#ef4444"
                          stroke="#ffffff"
                          strokeWidth={2}
                          className="animate-pulse"
                        />
                      );
                    }
                    return <circle key={payload.date} cx={cx} cy={cy} r={2} fill="#f87171" />;
                  }}
                  name="Actual Metered Load (MW)"
                />

                {/* Direct Annotations on Anomalies */}
                {anomalyPoint1 && (
                  <ReferenceDot
                    x={anomalyPoint1.date}
                    y={anomalyPoint1.actualMW}
                    r={8}
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                )}
                {anomalyPoint2 && (
                  <ReferenceDot
                    x={anomalyPoint2.date}
                    y={anomalyPoint2.actualMW}
                    r={8}
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Anomaly Callout Legend */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono border-t border-slate-800/80">
            <div className="flex items-center gap-2 bg-red-950/40 text-red-300 px-3 py-1.5 rounded-lg border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Aug 14 Callout: "Abnormal deviation detected (-32%)"</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-950/40 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Aug 24 Callout: "Feeder cluster drop detected (-27%)"</span>
            </div>
          </div>
        </div>

        {/* Donut Chart: Risk Distribution */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center justify-between">
              <span>Risk Distribution</span>
              <span className="text-xs text-slate-400 font-normal">24,860 Consumers</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Consumer stratification by anomaly severity index
            </p>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_RISK_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {MOCK_RISK_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: any) => [`${value}% (${MOCK_RISK_DISTRIBUTION.find(r=>r.name===name)?.count.toLocaleString()} consumers)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold font-mono text-white">317</span>
              <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">
                Flagged Cases
              </span>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
            {MOCK_RISK_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-1.5 rounded bg-slate-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Grid: Top Suspicious Areas & Live Alerts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Suspicious Areas Table */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl space-y-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Top Suspicious Distribution Areas</span>
              </h2>
              <p className="text-xs text-slate-400">
                Feeder regions ranked by potential unmetered energy loss
              </p>
            </div>
            
            <button
              onClick={() => onNavigateTab('area-intelligence')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View Area Intelligence Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="pb-3 px-3">Area</th>
                  <th className="pb-3 px-3 text-right">Consumers</th>
                  <th className="pb-3 px-3 text-right">Anomalies</th>
                  <th className="pb-3 px-3 text-center">Risk Level</th>
                  <th className="pb-3 px-3 text-right">Est. Loss (₹)</th>
                  <th className="pb-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {MOCK_AREAS.slice(0, 5).map((area) => (
                  <tr
                    key={area.name}
                    onClick={() => onSelectArea(area)}
                    className="hover:bg-cyan-950/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3 font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {area.name}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300">
                      {area.totalConsumers.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-amber-400 font-bold">
                      {area.anomaliesCount}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <RiskBadge level={area.riskLevel} />
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-cyan-300">
                      ₹{(area.estimatedLossINR / 100000).toFixed(1)}L
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-slate-500 group-hover:text-cyan-400 transition-colors inline-flex items-center gap-1 text-[10px] font-semibold">
                        Inspect
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Alert Panel (Recent Detection Events) */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Live Recent Detection Events</span>
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time anomaly triggers from smart meter telemetry
            </p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-72">
            {MOCK_ALERTS.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                onClick={() => {
                  if (alert.consumerId) {
                    const target = ALL_CONSUMERS.find((c) => c.id === alert.consumerId);
                    if (target) onSelectConsumer(target);
                  } else {
                    onNavigateTab('alerts');
                  }
                }}
                className="p-3 bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 rounded-xl space-y-1 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <RiskBadge level={alert.severity} size="sm" showDot={false} />
                    <span className="font-mono font-bold text-white group-hover:text-cyan-400">
                      {alert.consumerId || alert.areaName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{alert.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug line-clamp-2">
                  "{alert.description}"
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('alerts')}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-xl text-xs font-semibold font-mono border border-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Complete Alert Log</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
