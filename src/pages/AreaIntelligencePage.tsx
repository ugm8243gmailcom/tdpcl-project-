import { MapPin, ArrowUpRight, Zap } from 'lucide-react';
import type { AreaSummary, Consumer } from '../types';
import { MOCK_AREAS, ALL_CONSUMERS } from '../data/mockData';
import { RiskBadge } from '../components/Common/RiskBadge';

interface AreaIntelligencePageProps {
  selectedArea: AreaSummary | null;
  onSelectArea: (area: AreaSummary) => void;
  onSelectConsumer: (consumer: Consumer) => void;
}

export const AreaIntelligencePage: React.FC<AreaIntelligencePageProps> = ({
  selectedArea,
  onSelectArea,
  onSelectConsumer
}) => {
  const currentArea = selectedArea || MOCK_AREAS[0];

  // Consumers belonging to the selected area
  const areaConsumers = ALL_CONSUMERS.filter((c) => c.area === currentArea.name);
  const highRiskAreaConsumers = areaConsumers.filter((c) => c.riskLevel === 'HIGH' || c.riskLevel === 'MEDIUM');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span>Distribution Area Intelligence Map</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Macro-level sub-station grid node monitoring across 42 distribution areas
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Active Grid Feeders: 42</span>
        </div>
      </div>

      {/* Main Interactive Grid & Side Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Stylized Grid Node Map */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 relative min-h-[500px] flex flex-col justify-between overflow-hidden bg-grid-pattern">
          
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Bengaluru Utility Sub-Station Topology Node Visualizer
            </span>
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-slate-400">High Risk Feeder</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-slate-400">Medium Risk Feeder</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-400">Normal Feeder</span>
              </div>
            </div>
          </div>

          {/* Interactive Stylized Map Node Canvas */}
          <div className="relative flex-1 min-h-[380px] w-full rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
            
            {/* SVG Connecting Lines between Nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
              <line x1="78%" y1="35%" x2="62%" y2="48%" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="62%" y1="48%" x2="55%" y2="42%" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="55%" y1="42%" x2="38%" y2="55%" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="38%" y1="55%" x2="45%" y2="75%" stroke="#ef4444" strokeWidth="2" />
              <line x1="62%" y1="48%" x2="82%" y2="65%" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="78%" y1="35%" x2="72%" y2="22%" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="38%" y1="55%" x2="30%" y2="30%" stroke="#38bdf8" strokeWidth="1.5" />
            </svg>

            {/* Area Nodes */}
            {MOCK_AREAS.map((area) => {
              const isSelected = currentArea.name === area.name;
              return (
                <button
                  key={area.name}
                  onClick={() => onSelectArea(area)}
                  style={{ left: `${area.coordinates.x}%`, top: `${area.coordinates.y}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-110 z-20 ring-2 ring-cyan-500/50'
                      : 'bg-slate-900/90 border-slate-700/80 hover:border-cyan-500/60 hover:scale-105 z-10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        area.riskLevel === 'HIGH'
                          ? 'bg-red-500 shadow-md shadow-red-500 animate-pulse'
                          : area.riskLevel === 'MEDIUM'
                          ? 'bg-amber-400'
                          : area.riskLevel === 'LOW'
                          ? 'bg-cyan-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <span className="font-mono font-bold text-xs text-white group-hover:text-cyan-400 transition-colors">
                      {area.name}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                    <span>{area.anomaliesCount} Anomalies</span>
                    <span>•</span>
                    <span className="text-cyan-300 font-semibold">₹{(area.estimatedLossINR / 100000).toFixed(1)}L</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono text-slate-400 text-center">
            Click any sub-station node to load localized telemetry & consumer risk metrics
          </div>
        </div>

        {/* Selected Area Detail Side Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-5 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Sub-Station Feeder Profile</span>
                <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
                  <span>{currentArea.name}</span>
                  <RiskBadge level={currentArea.riskLevel} size="sm" />
                </h2>
              </div>
              <div className="p-2 bg-cyan-950/60 border border-cyan-500/30 rounded-xl text-cyan-400 font-mono font-bold text-xs">
                NODE-{currentArea.name.slice(0, 3).toUpperCase()}
              </div>
            </div>

            {/* Key Area Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px]">Total Consumers</span>
                <div className="text-base font-extrabold text-white mt-0.5">
                  {currentArea.totalConsumers.toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px]">Expected Load</span>
                <div className="text-base font-extrabold text-cyan-400 mt-0.5">
                  {currentArea.expectedLoadMWh} MWh
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px]">Actual Billed Load</span>
                <div className="text-base font-extrabold text-white mt-0.5">
                  {currentArea.actualLoadMWh} MWh
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px]">Feeder Deviation</span>
                <div className="text-base font-extrabold text-red-400 mt-0.5">
                  {currentArea.deviationPercent}%
                </div>
              </div>
            </div>

            {/* Financial Loss Callout */}
            <div className="p-4 bg-gradient-to-r from-red-950/40 to-slate-900 border border-red-500/30 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Estimated Suspicious Loss</span>
                <div className="text-xl font-extrabold font-mono text-cyan-300 mt-0.5">
                  ₹{(currentArea.estimatedLossINR / 100000).toFixed(1)} Lakhs
                </div>
              </div>
              <div className="text-right font-mono text-xs text-amber-400">
                <div className="font-bold">{currentArea.anomaliesCount} Anomalies</div>
                <div className="text-[10px] text-slate-400">{currentArea.highRiskCount} High Risk</div>
              </div>
            </div>

            {/* List of Suspicious Consumers in this Area */}
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                Flagged Consumers in {currentArea.name} ({highRiskAreaConsumers.length})
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {highRiskAreaConsumers.map((consumer) => (
                  <button
                    key={consumer.id}
                    onClick={() => onSelectConsumer(consumer)}
                    className="w-full p-2.5 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white group-hover:text-cyan-400">
                          {consumer.id}
                        </span>
                        <span className="text-[11px] text-slate-300">{consumer.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Dev: {consumer.consumptionDeviation}% • {consumer.actualConsumption} kWh
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <RiskBadge level={consumer.riskLevel} size="sm" showDot={false} />
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
