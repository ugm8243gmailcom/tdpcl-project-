import { Cpu, AlertOctagon, BarChart2 } from 'lucide-react';
import { MOCK_MODEL_METRICS, MOCK_FEATURE_IMPORTANCE } from '../data/mockData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export const ModelInsightsPage: React.FC = () => {
  const customColors = ['#06b6d4', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Mandatory Academic Disclaimer Banner */}
      <div className="bg-cyan-950/40 border-2 border-cyan-500/50 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-cyan-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <AlertOctagon className="w-6 h-6 shrink-0" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold font-mono text-sm uppercase tracking-wider text-cyan-300">
                DEMO / SIMULATED RESULTS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-900/80 text-cyan-300 rounded border border-cyan-400/40">
                Academic Evaluation Benchmark
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Performance metrics and feature importance distributions presented below are simulated benchmarking estimates for prototype evaluation.
            </p>
          </div>
        </div>

        <div className="px-4 py-2 bg-[#0b1222] border border-cyan-500/30 rounded-xl font-mono text-xs text-cyan-400 font-bold shrink-0">
          Model Version: XGB-RF-v1.4
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Machine Learning Model Performance & Feature Analytics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Comparative analysis of supervised ensemble & unsupervised tree isolation models
        </p>
      </div>

      {/* Model Performance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Random Forest */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">Supervised Ensemble</span>
              <h3 className="text-lg font-bold font-mono text-white mt-0.5">Random Forest</h3>
            </div>
            <div className="p-2 bg-cyan-950/60 border border-cyan-500/30 rounded-xl text-cyan-400 font-mono font-bold text-xs">
              94.2% Acc
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {MOCK_MODEL_METRICS[0].description}
          </p>

          <div className="grid grid-cols-2 gap-3 font-mono pt-2 border-t border-slate-800/80">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400">Accuracy</span>
              <div className="text-lg font-extrabold text-cyan-400 mt-0.5">94.2%</div>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400">Precision</span>
              <div className="text-lg font-extrabold text-white mt-0.5">91.7%</div>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400">Recall</span>
              <div className="text-lg font-extrabold text-white mt-0.5">88.4%</div>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400">F1 Score</span>
              <div className="text-lg font-extrabold text-emerald-400 mt-0.5">90.0%</div>
            </div>
          </div>
        </div>

        {/* Card 2: Isolation Forest */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">Unsupervised Anomaly</span>
              <h3 className="text-lg font-bold font-mono text-white mt-0.5">Isolation Forest</h3>
            </div>
            <div className="p-2 bg-amber-950/60 border border-amber-500/30 rounded-xl text-amber-400 font-mono font-bold text-xs">
              89.1% Rate
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {MOCK_MODEL_METRICS[1].description}
          </p>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Anomaly Detection Rate</span>
              <span className="text-base font-extrabold text-amber-400">89.1%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full w-[89.1%]" />
            </div>
            <p className="text-[10px] text-slate-400 leading-normal pt-1">
              Isolates irregular consumption shapes without requiring prior ground truth labels.
            </p>
          </div>
        </div>

        {/* Card 3: Logistic Regression */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Linear Baseline Benchmark</span>
              <h3 className="text-lg font-bold font-mono text-white mt-0.5">Logistic Regression</h3>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 font-mono font-bold text-xs">
              87.6% Acc
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {MOCK_MODEL_METRICS[2].description}
          </p>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Baseline Accuracy</span>
              <span className="text-base font-extrabold text-slate-200">87.6%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-slate-400 h-full w-[87.6%]" />
            </div>
            <p className="text-[10px] text-slate-400 leading-normal pt-1">
              Serves as baseline statistical benchmark for non-linear model evaluation.
            </p>
          </div>
        </div>

      </div>

      {/* Feature Importance Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Feature Importance Weighting (%)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Contribution ratio of key electrical telemetry features to anomaly prediction
            </p>
          </div>

          <div className="px-3 py-1 bg-amber-950/40 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-mono font-semibold">
            Illustrative feature importance — final values depend on trained model
          </div>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={MOCK_FEATURE_IMPORTANCE}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 40]} unit="%" />
              <YAxis type="category" dataKey="feature" stroke="#64748b" tick={{ fontSize: 11 }} width={180} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono'
                }}
                formatter={(value: any, _name: any, props: any) => [
                  `${value}% importance`,
                  props.payload.description
                ]}
              />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                {MOCK_FEATURE_IMPORTANCE.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={customColors[index % customColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
