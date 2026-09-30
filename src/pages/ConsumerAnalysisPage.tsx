import { useState } from 'react';
import { Search, ShieldAlert, TrendingDown, Clock, Layers, Users, Zap, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import type { Consumer } from '../types';
import { ALL_CONSUMERS } from '../data/mockData';
import { RiskBadge } from '../components/Common/RiskBadge';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ConsumerAnalysisPageProps {
  selectedConsumer: Consumer;
  onSelectConsumer: (consumer: Consumer) => void;
}

export const ConsumerAnalysisPage: React.FC<ConsumerAnalysisPageProps> = ({
  selectedConsumer,
  onSelectConsumer
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');

  const keyCaseIds = ['C-10482', 'C-08721', 'C-19382', 'C-04912', 'C-15209'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    if (!query) return;

    const found = ALL_CONSUMERS.find(
      (c) => c.id.toUpperCase() === query || c.name.toUpperCase().includes(query)
    );

    if (found) {
      onSelectConsumer(found);
      setSearchError('');
      setSearchInput('');
    } else {
      setSearchError(`Consumer ID "${query}" not found. Try searching C-10482 or C-08721.`);
    }
  };

  const riskScore = Math.round(selectedConsumer.anomalyScore * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Search & Preset Case Selector Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Consumer ID (e.g. C-10482)..."
            className="w-full bg-[#0f172a] text-sm text-slate-100 placeholder-slate-400 pl-10 pr-24 py-2.5 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 font-mono"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Highlighted Preset Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <span className="text-xs font-mono text-slate-400 shrink-0 font-semibold">Demo Cases:</span>
          {keyCaseIds.map((id) => {
            const isCurrent = selectedConsumer.id === id;
            return (
              <button
                key={id}
                onClick={() => {
                  const target = ALL_CONSUMERS.find((c) => c.id === id);
                  if (target) onSelectConsumer(target);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {id}
              </button>
            );
          })}
        </div>
      </div>

      {searchError && (
        <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 font-mono">
          {searchError}
        </div>
      )}

      {/* Top Consumer Profile Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-cyan-400 text-xl shadow-inner">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-mono text-white">{selectedConsumer.id}</h1>
              <RiskBadge level={selectedConsumer.riskLevel} size="md" />
            </div>
            <p className="text-base font-semibold text-slate-200 mt-1">{selectedConsumer.name}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1 font-mono">
              <span>Area: <strong className="text-slate-200">{selectedConsumer.area}</strong></span>
              <span>•</span>
              <span>Connection: <strong className="text-slate-200">{selectedConsumer.consumerType}</strong></span>
              <span>•</span>
              <span>Meter Age: <strong className="text-slate-200">{selectedConsumer.meterAgeYears} years</strong></span>
              <span>•</span>
              <span>Avg Monthly: <strong className="text-slate-200">{selectedConsumer.avgMonthlyConsumption} kWh</strong></span>
            </div>
          </div>
        </div>

        {/* Visual Risk Score Gauge */}
        <div className="w-full md:w-auto p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-5 justify-center">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="34" stroke="#1e293b" strokeWidth="6" fill="transparent" />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke={selectedConsumer.riskLevel === 'HIGH' ? '#ef4444' : selectedConsumer.riskLevel === 'MEDIUM' ? '#f59e0b' : '#06b6d4'}
                strokeWidth="6"
                strokeDasharray={213}
                strokeDashoffset={213 - (213 * riskScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold font-mono text-white">{riskScore}</span>
              <span className="text-[9px] text-slate-400 font-mono">/100</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Calculated Risk Index</span>
            <div className="text-sm font-extrabold font-mono text-white">
              {selectedConsumer.riskLevel === 'HIGH' ? (
                <span className="text-red-400">HIGH RISK</span>
              ) : selectedConsumer.riskLevel === 'MEDIUM' ? (
                <span className="text-amber-400">MEDIUM RISK</span>
              ) : (
                <span className="text-cyan-400">NORMAL / LOW RISK</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Est Loss: ₹{selectedConsumer.estimatedLoss.toLocaleString()}</p>
          </div>
        </div>

      </div>

      {/* Anomaly Factors Cards */}
      <div>
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
          Key Anomaly Risk Factors
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 hover:border-red-500/40 transition-colors">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span>Consumption Deviation</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-red-400">
              {selectedConsumer.consumptionDeviation}%
            </div>
            <div className="text-[10px] text-slate-400">Below 12-mo baseline</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Night-time Anomaly</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {selectedConsumer.nightUsage}
            </div>
            <div className="text-[10px] text-slate-400">01:00-05:00 off-peak drop</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Historical Deviation</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {selectedConsumer.historicalVariance}
            </div>
            <div className="text-[10px] text-slate-400">Longitudinal variance</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Peer Comparison</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {selectedConsumer.peerDeviationPercentile}th
            </div>
            <div className="text-[10px] text-slate-400">Percentile deviation</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Sudden Load Change</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {selectedConsumer.suddenLoadChange ? 'Detected' : 'Normal'}
            </div>
            <div className="text-[10px] text-slate-400">Abrupt step-down trigger</div>
          </div>

        </div>
      </div>

      {/* 12-Month Consumption History Line Chart */}
      <div className="glass-panel p-5 rounded-2xl space-y-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>12-Month Consumption History vs Expected Baseline</span>
            </h2>
            <p className="text-xs text-slate-400">
              Longitudinal tracking of monthly billed kWh against baseline AI forecast
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Expected (kWh)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="text-slate-300">Actual Meter (kWh)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={selectedConsumer.history} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
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
              <Line type="monotone" dataKey="expected" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} name="Expected (kWh)" />
              <Line type="monotone" dataKey="actual" stroke="#f87171" strokeWidth={3} dot={{ r: 5 }} name="Actual Meter Reading (kWh)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prominent AI Explanation & Academic Disclaimer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>AI Automated Explanation</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              Confidence: 94.2%
            </span>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            "{selectedConsumer.aiExplanation}"
          </p>

          <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>AI-generated recommendation. Physical inspection is required for confirmation.</span>
          </div>
        </div>

        {/* Action Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold font-mono text-white">Utility Response Actions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Log investigation status & assign inspectors</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => alert(`Field inspection order created for ${selectedConsumer.id}!`)}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer font-mono"
            >
              <FileText className="w-4 h-4" />
              <span>Dispatch Inspection Team</span>
            </button>

            <button
              onClick={() => alert(`Consumer ${selectedConsumer.id} marked under administrative review.`)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer font-mono"
            >
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Mark Under Review</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-mono">
            Last Telemetry Sync: {selectedConsumer.lastUpdated}
          </div>
        </div>

      </div>

    </div>
  );
};
