import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Zap, Calendar, ExternalLink, ShieldAlert, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { Consumer } from '../../types';
import { ALL_CONSUMERS, MOCK_ALERTS } from '../../data/mockData';

interface TopBarProps {
  setActiveTab: (tab: string) => void;
  onSelectConsumer: (consumer: Consumer) => void;
  isLandingView: boolean;
  setIsLandingView: (val: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  setActiveTab,
  onSelectConsumer,
  isLandingView,
  setIsLandingView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Consumer[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Real-time clock tick
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setCurrentTime(now.toLocaleDateString('en-US', options) + ' IST');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = ALL_CONSUMERS.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q)
    ).slice(0, 6);
    setSearchResults(filtered);
    setIsSearchOpen(true);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#080d1a]/90 backdrop-blur-md border-b border-cyan-900/30 px-4 lg:px-6 py-3 transition-all duration-200">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setIsLandingView(false);
              setActiveTab('overview');
            }}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-[#0b1222] rounded-[11px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white font-mono">
                  GRIDWATCH <span className="text-cyan-400">AI</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono tracking-wide font-semibold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 rounded">
                  ETDS v1.2
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Distribution Intelligence Platform
              </p>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block" ref={searchRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
              placeholder="Search Consumer ID (e.g. C-10482), Area, or Name..."
              className="w-full bg-[#0f172a]/80 text-sm text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2 rounded-lg border border-slate-700/60 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#0f172a] border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
              <div className="px-3 py-2 bg-slate-900/80 text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex justify-between">
                <span>Matching Consumers ({searchResults.length})</span>
                <span>Press Click to Investigate</span>
              </div>
              {searchResults.map((consumer) => (
                <button
                  key={consumer.id}
                  onClick={() => {
                    setIsLandingView(false);
                    onSelectConsumer(consumer);
                    setActiveTab('consumer-analysis');
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-cyan-950/40 transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {consumer.id}
                      </span>
                      <span className="text-xs text-slate-300 font-medium">{consumer.name}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{consumer.area}</span>
                      <span>•</span>
                      <span>{consumer.consumerType}</span>
                      <span>•</span>
                      <span>Meter: {consumer.actualConsumption} kWh</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        consumer.riskLevel === 'HIGH'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : consumer.riskLevel === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : consumer.riskLevel === 'LOW'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {consumer.riskLevel} RISK
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
          
          {/* Demo Mode Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-400 tracking-wider">
              DEMO MODE
            </span>
          </div>

          {/* Date / Time */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentTime || '09 Sep 2026 • 14:25 IST'}</span>
          </div>

          {/* Notifications Icon & Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors cursor-pointer"
              title="Recent Detection Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-mono text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm shadow-red-500/50">
                {MOCK_ALERTS.length}
              </span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#0f172a] border border-cyan-500/30 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-xs text-slate-200">
                    <ShieldAlert className="w-4 h-4 text-cyan-400" />
                    <span>Recent Detection Notifications</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                    Live Telemetry
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {MOCK_ALERTS.map((alert) => (
                    <button
                      key={alert.id}
                      onClick={() => {
                        setIsLandingView(false);
                        setActiveTab('alerts');
                        setIsNotificationsOpen(false);
                      }}
                      className="w-full p-3 text-left hover:bg-slate-800/50 transition-colors flex items-start gap-3 group"
                    >
                      <span
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          alert.severity === 'HIGH'
                            ? 'bg-red-500 shadow-sm shadow-red-500/80'
                            : alert.severity === 'MEDIUM'
                            ? 'bg-amber-400'
                            : 'bg-cyan-400'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-white group-hover:text-cyan-400">
                            {alert.consumerId || alert.areaName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2">{alert.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-2 bg-slate-900/90 border-t border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setIsLandingView(false);
                      setActiveTab('alerts');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    View All Anomalies & Alerts
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* View Mode Switcher / Launch Demo CTA */}
          <button
            onClick={() => setIsLandingView(!isLandingView)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              isLandingView
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {isLandingView ? (
              <>
                <span>Launch Demo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Presentation Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
