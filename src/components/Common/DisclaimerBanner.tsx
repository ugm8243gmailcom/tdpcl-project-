import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface DisclaimerBannerProps {
  variant?: 'footer' | 'inline';
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ variant = 'inline' }) => {
  if (variant === 'footer') {
    return (
      <footer className="mt-8 pt-4 pb-6 border-t border-slate-800/60 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 bg-slate-900/40 px-4 py-2 rounded-lg border border-slate-800">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <p className="leading-relaxed">
            <span className="font-semibold text-slate-300">GRIDWATCH AI Disclaimer:</span> Research prototype designed for anomaly detection & prioritization. Detection results indicate potential theft/suspicious activity and require physical and administrative verification.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
      <div className="text-xs text-amber-200/90 leading-relaxed">
        <span className="font-bold text-amber-300">Academic Positioning:</span> System classifies patterns as <span className="font-semibold underline underline-offset-2">Potential Theft</span> or <span className="font-semibold underline underline-offset-2">Anomaly Detected</span>. Physical inspection is required for confirmation.
      </div>
    </div>
  );
};
