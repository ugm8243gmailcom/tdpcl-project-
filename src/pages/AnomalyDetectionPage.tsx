import { useState } from 'react';
import { Cpu, ScatterChart, Filter } from 'lucide-react';
import type { Consumer } from '../types';
import { ALL_CONSUMERS } from '../data/mockData';
import { DisclaimerBanner } from '../components/Common/DisclaimerBanner';
import { ResponsiveContainer, ScatterChart as RechartsScatter, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

interface AnomalyDetectionPageProps {
  onSelectConsumer: (consumer: Consumer) => void;
}

export const AnomalyDetectionPage: React.FC<AnomalyDetectionPageProps> = ({ onSelectConsumer }) => {
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NORMAL'>('ALL');

  const pipelineSteps = [
    { name: 'SMART METER DATA', sub: 'High-frequency telemetry' },
    { name: 'DATA PREPROCESSING', sub: 'Imputation & normalization' },
    { name: 'FEATURE EXTRACTION', sub: 'Night/Peer/Dev features' },
    { name: 'ML MODEL', sub: 'Isolation Forest & RF' },
    { name: 'ANOMALY SCORE', sub: '0.00 to 1.00 probability' },
    { name: 'RISK CLASSIFICATION', sub: 'High / Med / Low / Normal' },
    { name: 'INVESTIGATION PRIORITY', sub: 'Actionable audit queue' }
  ];

  // Filter consumers for scatter plot
  const filteredConsumers = ALL_CONSUMERS.filter((c) => {
    if (riskFilter === 'ALL') return true;
    return c.riskLevel === riskFilter;
  });

  // Split into series for custom colors in scatter plot
  const normalPoints = filteredConsumers.filter((c) => c.riskLevel === 'NORMAL');
  const lowPoints = filteredConsumers.filter((c) => c.riskLevel === 'LOW');
  const mediumPoints = filteredConsumers.filter((c) => c.riskLevel === 'MEDIUM');
  const highPoints = filteredConsumers.filter((c) => c.riskLevel === 'HIGH');

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: Consumer = payload[0].payload;
      return (
        <div className="bg-[#0f172a] border border-cyan-500/40 p-3 rounded-xl shadow-2xl space-y-1 font-mono text-xs z-50">
          <div className="flex items-center justify-between gap-4 font-bold border-b border-slate-800 pb-1">
            <span className="text-white">{data.id}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                data.riskLevel === 'HIGH'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : data.riskLevel === 'MEDIUM'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {data.riskLevel} RISK
            </span>
          </div>
          <p className="text-slate-300 font-sans text-[11px]">{data.name} ({data.area})</p>
          <div className="text-slate-400 space-y-0.5 pt-1">
            <div>Expected: <span className="text-cyan-300 font-bold">{data.expectedConsumption} kWh</span></div>
            <div>Actual: <span className="text-red-300 font-bold">{data.actualConsumption} kWh</span></div>
            <div>Deviation: <span className="text-red-400 font-bold">{data.consumptionDeviation}%</span></div>
            <div>Anomaly Score: <span className="text-amber-300 font-bold">{data.anomalyScore}</span></div>
          </div>
          <div className="pt-1 text-[10px] text-cyan-400 font-sans italic">
            Click node to inspect details
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <ScatterChart className="w-5 h-5 text-cyan-400" />
            <span>Machine Learning Anomaly Clustering Scatter Visualizer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mapping {ALL_CONSUMERS.length} consumers by Expected vs Actual consumption to identify multi-dimensional outliers
          </p>
        </div>

        {/* Filter Pill Selector */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 font-mono text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW', 'NORMAL'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                riskFilter === lvl
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Detection Pipeline Horizontal Bar */}
      <div className="glass-panel-glow p-5 rounded-2xl border border-cyan-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>End-to-End Detection Pipeline</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Pipeline Active</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 p-3 rounded-xl text-center space-y-1 transition-all h-full flex flex-col justify-center">
                <span className="text-[10px] font-mono font-bold text-cyan-400">0{idx + 1}</span>
                <p className="text-xs font-bold font-mono text-white leading-tight">{step.name}</p>
                <p className="text-[9px] text-slate-400 leading-tight">{step.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Scatter Chart Container */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <ScatterChart className="w-4 h-4 text-cyan-400" />
              <span>Scatter Distribution: Expected vs Actual Consumption (kWh)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Normal consumers align along the 1:1 baseline (diagonal line); suspicious & high-risk outliers deviate significantly below
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Normal ({normalPoints.length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Low Risk ({lowPoints.length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-slate-300">Medium Risk ({mediumPoints.length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-slate-300">High Risk ({highPoints.length})</span>
            </div>
          </div>
        </div>

        {/* Scatter Plot */}
        <div className="h-96 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsScatter margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                dataKey="expectedConsumption"
                name="Expected Consumption"
                unit=" kWh"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                domain={[100, 1500]}
              />
              <YAxis
                type="number"
                dataKey="actualConsumption"
                name="Actual Consumption"
                unit=" kWh"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                domain={[0, 1500]}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Ideal 1:1 Expected Relationship Line */}
              <ReferenceLine segment={[{ x: 100, y: 100 }, { x: 1500, y: 1500 }]} stroke="#38bdf8" strokeDasharray="4 4" strokeWidth={2} label={{ value: 'Expected Baseline (y = x)', fill: '#38bdf8', fontSize: 11, position: 'top' }} />

              {/* Normal Consumers Scatter */}
              <Scatter
                name="Normal Consumers"
                data={normalPoints}
                fill="#10b981"
                opacity={0.6}
                onClick={(node: any) => onSelectConsumer(node.payload)}
                className="cursor-pointer hover:opacity-100"
              />

              {/* Low Risk Scatter */}
              <Scatter
                name="Low Risk"
                data={lowPoints}
                fill="#06b6d4"
                opacity={0.8}
                onClick={(node: any) => onSelectConsumer(node.payload)}
                className="cursor-pointer hover:opacity-100"
              />

              {/* Medium Risk Scatter */}
              <Scatter
                name="Medium Risk"
                data={mediumPoints}
                fill="#f59e0b"
                opacity={0.9}
                onClick={(node: any) => onSelectConsumer(node.payload)}
                className="cursor-pointer hover:opacity-100"
              />

              {/* High Risk Scatter */}
              <Scatter
                name="High Risk Anomalies"
                data={highPoints}
                fill="#ef4444"
                r={6}
                onClick={(node: any) => onSelectConsumer(node.payload)}
                className="cursor-pointer animate-pulse"
              />
            </RechartsScatter>
          </ResponsiveContainer>
        </div>
      </div>

      <DisclaimerBanner variant="inline" />

    </div>
  );
};
