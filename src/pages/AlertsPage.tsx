import { useState } from 'react';
import { Bell, Search, ArrowUpRight } from 'lucide-react';
import type { AlertItem, Consumer } from '../types';
import { MOCK_ALERTS, ALL_CONSUMERS } from '../data/mockData';
import { RiskBadge } from '../components/Common/RiskBadge';
import { DisclaimerBanner } from '../components/Common/DisclaimerBanner';

interface AlertsPageProps {
  onSelectConsumer: (consumer: Consumer) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ onSelectConsumer }) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [alertsList, setAlertsList] = useState<AlertItem[]>(MOCK_ALERTS);

  const filteredAlerts = alertsList.filter((a) => {
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = a.id.toLowerCase().includes(q);
      const matchTarget = (a.consumerId || a.areaName || '').toLowerCase().includes(q);
      const matchType = a.type.toLowerCase().includes(q);
      return matchId || matchTarget || matchType;
    }
    return true;
  });

  const handleStatusChange = (alertId: string, newStatus: any) => {
    setAlertsList((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <span>Alert & Anomaly Prioritization Queue</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated detection log classifying meter anomalies & cluster events by risk severity
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <span className="px-2.5 py-1 bg-red-950/60 border border-red-500/30 text-red-400 rounded-lg font-bold">
            {alertsList.filter((a) => a.severity === 'HIGH').length} High Priority
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter Alert ID, Consumer ID, or Area..."
            className="w-full bg-[#0f172a] text-xs text-slate-100 placeholder-slate-400 pl-9 pr-3 py-2 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none font-mono"
          />
        </div>

        {/* Severity & Status Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 font-mono text-xs">
            <span className="text-slate-400 text-[10px] uppercase font-bold px-2">Severity:</span>
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 font-mono text-xs">
            <span className="text-slate-400 text-[10px] uppercase font-bold px-2">Status:</span>
            {['ALL', 'New', 'Reviewing', 'Investigation', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Main Alerts Table */}
      <div className="glass-panel p-5 rounded-2xl space-y-4 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="pb-3 px-3">Alert ID</th>
                <th className="pb-3 px-3">Consumer / Area Target</th>
                <th className="pb-3 px-3">Anomaly Type</th>
                <th className="pb-3 px-3 text-center">Severity</th>
                <th className="pb-3 px-3 text-center">Score</th>
                <th className="pb-3 px-3 text-center">Detected</th>
                <th className="pb-3 px-3 text-center">Audit Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                    No alerts match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className="hover:bg-cyan-950/30 transition-colors group"
                  >
                    <td className="py-3.5 px-3 font-bold text-white">
                      {alert.id}
                    </td>

                    <td className="py-3.5 px-3">
                      {alert.consumerId ? (
                        <button
                          onClick={() => {
                            const target = ALL_CONSUMERS.find((c) => c.id === alert.consumerId);
                            if (target) onSelectConsumer(target);
                          }}
                          className="font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{alert.consumerId}</span>
                          <span className="text-[11px] font-normal text-slate-400">({alert.areaName})</span>
                        </button>
                      ) : (
                        <span className="font-semibold text-slate-200">{alert.areaName}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-slate-300 font-sans">
                      {alert.type}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <RiskBadge level={alert.severity} size="sm" />
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-amber-300">
                      {alert.anomalyScore.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-3 text-center text-slate-400 text-[11px]">
                      {alert.timestamp}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          alert.status === 'Investigation'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : alert.status === 'Reviewing'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : alert.status === 'New'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {alert.consumerId && (
                          <button
                            onClick={() => {
                              const target = ALL_CONSUMERS.find((c) => c.id === alert.consumerId);
                              if (target) onSelectConsumer(target);
                            }}
                            className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        )}

                        <select
                          value={alert.status}
                          onChange={(e) => handleStatusChange(alert.id, e.target.value)}
                          className="bg-slate-900 text-slate-300 border border-slate-700 text-[10px] rounded px-1.5 py-1 focus:outline-none focus:border-cyan-500"
                        >
                          <option value="New">New</option>
                          <option value="Reviewing">Reviewing</option>
                          <option value="Investigation">Investigation</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DisclaimerBanner variant="inline" />

    </div>
  );
};
