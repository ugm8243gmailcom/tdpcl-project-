import type { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'sm', showDot = true }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm font-bold'
  };

  const styles = {
    HIGH: 'bg-red-500/15 text-red-400 border-red-500/30 glow-red/10',
    MEDIUM: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    LOW: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    NORMAL: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
  };

  const dots = {
    HIGH: 'bg-red-500 shadow-sm shadow-red-500',
    MEDIUM: 'bg-amber-400 shadow-sm shadow-amber-400',
    LOW: 'bg-cyan-400',
    NORMAL: 'bg-emerald-400'
  };

  const labels = {
    HIGH: 'HIGH RISK',
    MEDIUM: 'MEDIUM RISK',
    LOW: 'LOW RISK',
    NORMAL: 'NORMAL'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold border rounded-md uppercase tracking-wider ${sizeClasses[size]} ${styles[level]}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dots[level]}`} />}
      <span>{labels[level]}</span>
    </span>
  );
};
