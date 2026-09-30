import React from 'react';
import { Zap, ShieldAlert, Cpu, ArrowRight, CheckCircle2, BarChart2, MapPin, Search, Layers, FileCheck } from 'lucide-react';

interface LandingPageProps {
  onLaunchDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDemo }) => {
  const steps = [
    {
      num: '01',
      title: 'Collect Meter Data',
      desc: 'Ingest high-frequency electricity consumption data from smart meters & distribution transformers.',
      icon: Zap
    },
    {
      num: '02',
      title: 'Establish Baseline',
      desc: 'Build seasonal, historical & peer-group baseline models for normal consumption profiles.',
      icon: Layers
    },
    {
      num: '03',
      title: 'Detect Anomalies',
      desc: 'Run unsupervised Isolation Forest & statistical algorithms to pinpoint unexpected drops & tampering.',
      icon: Cpu
    },
    {
      num: '04',
      title: 'Calculate Risk Scores',
      desc: 'Aggregate multi-factor risk scores (0-100) combining deviation, night-time usage & peer metrics.',
      icon: ShieldAlert
    },
    {
      num: '05',
      title: 'Prioritize Cases',
      desc: 'Rank suspicious consumers & feeder areas by financial exposure and anomaly confidence.',
      icon: BarChart2
    },
    {
      num: '06',
      title: 'Field Investigation',
      desc: 'Provide actionable telemetry reports for utility teams to dispatch physical verification units.',
      icon: FileCheck
    }
  ];

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <div className="relative glass-panel-glow rounded-3xl p-8 lg:p-12 overflow-hidden border border-cyan-500/30">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/60 border border-cyan-500/30 rounded-full text-xs font-mono text-cyan-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>TDPCL Academic Capstone Prototype</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            AI-Powered Energy Theft & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Anomaly Detection System</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            <strong className="text-white">GRIDWATCH AI</strong> analyzes electricity consumption patterns across thousands of distribution meters to detect potential theft, meter tampering, faulty hardware, and suspicious consumer clusters at scale.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onLaunchDemo}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Demo Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 px-4 py-3 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>500+ Simulated Consumers Monitored</span>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Large-Scale Detection</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Eliminating blind manual meter checking. Systems analyze telemetry streams across entire utility distribution areas simultaneously.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Smart Prioritization</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Multi-factor machine learning risk scoring pinpoints the highest-confidence suspicious cases for field inspection.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold font-mono">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Area Intelligence</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Transformer-level load matching maps unmetered energy loss across sub-stations (e.g. Whitefield, Electronic City).
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span>How It Works — Detection Pipeline</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              End-to-end telemetry analysis & investigation workflow
            </p>
          </div>
          <button
            onClick={onLaunchDemo}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Interactive Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-cyan-500/40 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-500/30">
                    STEP {step.num}
                  </span>
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-white">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
