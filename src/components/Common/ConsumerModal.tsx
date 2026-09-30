import { X, AlertOctagon, TrendingDown, Clock, Layers, Users, Zap, ShieldAlert, FileText, ExternalLink } from 'lucide-react';
import type { Consumer } from '../../types';
import { RiskBadge } from './RiskBadge';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ConsumerModalProps {
  consumer: Consumer | null;
  onClose: () => void;
  onNavigateToFullPage: (consumer: Consumer) => void;
}

export const ConsumerModal: React.FC<ConsumerModalProps> = ({
  consumer,
  onClose,
  onNavigateToFullPage
}) => {
  if (!consumer) return null;

  const riskScoreNumber = Math.round(consumer.anomalyScore * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b1222] border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-cyan-400 text-lg shadow-inner">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold font-mono text-white">{consumer.id}</h2>
                <RiskBadge level={consumer.riskLevel} size="md" />
                <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                  {consumer.consumerType}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-200 mt-0.5">{consumer.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Area: <span className="text-slate-200 font-medium">{consumer.area}</span> • Meter Age: {consumer.meterAgeYears} years • Avg Monthly: {consumer.avgMonthlyConsumption} kWh
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 glass-panel p-4 rounded-xl flex flex-col justify-center items-center text-center border-l-4 border-l-red-500">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Calculated Risk Score</span>
              <div className="text-4xl font-extrabold font-mono text-white mt-1">
                {riskScoreNumber}<span className="text-lg text-slate-400">/100</span>
              </div>
              <span className="text-xs font-bold text-red-400 mt-1 uppercase font-mono tracking-wide">
                {consumer.riskLevel} RISK
              </span>
            </div>

            <div className="md:col-span-3 glass-panel p-4 rounded-xl flex flex-col justify-center space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                <ShieldAlert className="w-4 h-4" />
                <span>AI Automated Anomaly Assessment</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                "{consumer.aiExplanation}"
              </p>
              <div className="text-[11px] text-amber-300/80 bg-amber-950/30 px-3 py-1.5 rounded border border-amber-500/20 flex items-center gap-2 font-mono">
                <AlertOctagon className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>AI Recommendation — Physical inspection required for confirmation.</span>
              </div>
            </div>
          </div>

          {/* Anomaly Factors Grid */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
              Anomaly Risk Factors
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                  <span>Deviation</span>
                </div>
                <div className="text-lg font-bold font-mono text-red-400 mt-1">
                  {consumer.consumptionDeviation}%
                </div>
                <div className="text-[10px] text-slate-400">vs expected baseline</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Night Anomaly</span>
                </div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {consumer.nightUsage}
                </div>
                <div className="text-[10px] text-slate-400">01:00-05:00 ratio</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hist. Variance</span>
                </div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {consumer.historicalVariance}
                </div>
                <div className="text-[10px] text-slate-400">12-month pattern</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Peer Comparison</span>
                </div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {consumer.peerDeviationPercentile}th
                </div>
                <div className="text-[10px] text-slate-400">percentile dev.</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sudden Load Shift</span>
                </div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {consumer.suddenLoadChange ? 'Detected' : 'Normal'}
                </div>
                <div className="text-[10px] text-slate-400">step function drop</div>
              </div>
            </div>
          </div>

          {/* 12-Month Expected vs Actual Line Chart */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                12-Month Consumption Profile (Expected vs Actual)
              </span>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-slate-400">Expected (kWh)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="text-slate-400">Actual Meter (kWh)</span>
                </div>
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consumer.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="expected" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="actual" stroke="#f87171" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onNavigateToFullPage(consumer);
              onClose();
            }}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Dedicated Consumer Analysis Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert(`Field inspection request logged for ${consumer.id} (${consumer.area})! Prioritized team dispatched.`);
                onClose();
              }}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-red-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dispatch Field Inspection</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
