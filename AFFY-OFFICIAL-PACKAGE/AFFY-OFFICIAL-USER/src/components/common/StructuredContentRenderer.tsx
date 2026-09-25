import React from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface StructuredContentRendererProps {
  content?: string;
  accentColor?: 'cyan' | 'indigo' | 'emerald' | 'purple';
  className?: string;
}

export const StructuredContentRenderer: React.FC<StructuredContentRendererProps> = ({
  content,
  accentColor = 'cyan',
  className = ''
}) => {
  if (!content || !content.trim()) return null;

  // Split lines while preserving order and content
  const rawLines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  if (rawLines.length === 0) return null;

  const getAccentStyles = () => {
    switch (accentColor) {
      case 'indigo':
        return {
          numberBadge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          bulletIcon: 'text-indigo-400',
          containerBorder: 'border-indigo-500/20 bg-indigo-950/20',
          highlight: 'text-indigo-300'
        };
      case 'emerald':
        return {
          numberBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          bulletIcon: 'text-emerald-400',
          containerBorder: 'border-emerald-500/20 bg-emerald-950/20',
          highlight: 'text-emerald-300'
        };
      case 'purple':
        return {
          numberBadge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          bulletIcon: 'text-purple-400',
          containerBorder: 'border-purple-500/20 bg-purple-950/20',
          highlight: 'text-purple-300'
        };
      case 'cyan':
      default:
        return {
          numberBadge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          bulletIcon: 'text-cyan-400',
          containerBorder: 'border-cyan-500/20 bg-cyan-950/20',
          highlight: 'text-cyan-300'
        };
    }
  };

  const styles = getAccentStyles();

  return (
    <div className={`space-y-2.5 ${className}`}>
      {rawLines.map((line, idx) => {
        // Match numbered lines (e.g. "1.", "1)", "01.", "(1)")
        const numberedMatch = line.match(/^(\d{1,3})[\.\)\-:]\s*(.+)$/);
        // Match bullet lines (e.g. "•", "-", "*", "✦", "✓", "→", ">")
        const bulletMatch = line.match(/^[•\-\*✦✓→\>]\s*(.+)$/);

        if (numberedMatch) {
          const num = numberedMatch[1];
          const text = numberedMatch[2];
          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors text-left"
            >
              <span
                className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-lg text-xs font-mono font-bold border ${styles.numberBadge}`}
              >
                {num}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-0.5 select-text break-words flex-1">
                {text}
              </p>
            </div>
          );
        }

        if (bulletMatch) {
          const text = bulletMatch[1];
          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors text-left"
            >
              <div className={`shrink-0 pt-0.5 ${styles.bulletIcon}`}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed select-text break-words flex-1">
                {text}
              </p>
            </div>
          );
        }

        // Standard line / paragraph point
        return (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 transition-colors text-left"
          >
            <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${styles.bulletIcon}`} />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed select-text break-words flex-1">
              {line}
            </p>
          </div>
        );
      })}
    </div>
  );
};
