import React, { useState } from 'react';
import { LineChart, BarChart2, Calendar, TrendingDown, Layers, Zap, Clock, PieChart } from 'lucide-react';
import { MOCK_ANALYTICS_MONTHLY, MOCK_PEAK_OFFPEAK, MOCK_AREAS, MOCK_RISK_DISTRIBUTION, MOCK_30DAY_CONSUMPTION } from '../data/mockData';
import {
  ResponsiveContainer,
  LineChart as RechartsLine,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export const ConsumptionAnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '3M' | '1Y'>('30D');

  const areaWiseData = MOCK_AREAS.map((a) => ({
    name: a.name,
    expected: a.expectedLoadMWh,
    actual: a.actualLoadMWh,
    loss: Math.round((a.estimatedLossINR / 1000)) // kINR
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <LineChart className="w-5 h-5 text-cyan-400" />
            <span>Consumption & Energy Loss Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive telemetry demand analysis, off-peak patterns & loss distribution metrics
          </p>
        </div>

        {/* Timeframe Selector Buttons */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 font-mono text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1" />
          {(['7D', '30D', '3M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf === '7D' ? '7 Days' : tf === '30D' ? '30 Days' : tf === '3M' ? '3 Months' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 6 Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Daily Electricity Demand */}
        <div className="glass-panel p-5 rounded-2xl space-y-3 border border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>1. Daily Electricity Demand (MW)</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">30-Day Window</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_30DAY_CONSUMPTION}>
                <defs>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[30, 60]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                <Area type="monotone" dataKey="expectedMW" stroke="#38bdf8" fillOpacity={1} fill="url(#colorExp)" name="Expected (MW)" />
                <Area type="monotone" dataKey="actualMW" stroke="#f87171" fillOpacity={1} fill="url(#colorAct)" name="Actual (MW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Monthly Consumption Trends */}
        <div className="glass-panel p-5 rounded-2xl space-y-3 border border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>2. Monthly Consumption Trends (MWh)</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">12 Months</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_ANALYTICS_MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="expected" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Expected MWh" />
                <Bar dataKey="actual" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Actual Billed MWh" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Peak vs Off-Peak Consumption */}
        <div className="glass-panel p-5 rounded-2xl space-y-3 border border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>3. Peak vs Off-Peak Consumption Breakdown</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">Diurnal Load</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_PEAK_OFFPEAK} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="expected" fill="#38bdf8" radius={[0, 4, 4, 0]} name="Expected MW" />
                <Bar dataKey="actual" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Actual MW" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Expected vs Actual Consumption Deviation */}
        <div className="glass-panel p-5 rounded-2xl space-y-3 border border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span>4. Energy Loss Volatility Trend (MWh Unmetered)</span>
            </h2>
            <span className="text-xs font-mono text-red-400">Unmetered Gap</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLine data={MOCK_ANALYTICS_MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} name="Unmetered Loss (MWh)" />
              </RechartsLine>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Area-Wise Consumption Breakdown */}
        <div className="glass-panel p-5 rounded-2xl space-y-3 border border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>5. Area-Wise Consumption & Loss Comparison</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">8 Sub-stations</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaWiseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="expected" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Expected MWh" />
                <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} name="Actual MWh" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Consumer Risk Distribution */}
        <div className="glass-panel p-5 rounded-2xl space-y-3 border border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <span>6. Consumer Risk Category Stratification</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">24,860 Total</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_RISK_DISTRIBUTION}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Consumer Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
