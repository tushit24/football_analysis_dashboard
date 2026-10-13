'use client';

import React from 'react';
import { VerdictType } from '@/lib/types';
import { VERDICT_COLORS } from '@/lib/theme';

interface VerdictBadgeProps {
  verdict: VerdictType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  verdict,
  className = '',
  size = 'md',
}) => {
  const style = VERDICT_COLORS[verdict] || VERDICT_COLORS['GOOD FIT'];

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wider',
    lg: 'text-sm px-3.5 py-1.5 font-bold tracking-widest',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-display uppercase font-bold border transition-colors shadow-sm ${style.badge} ${sizeClasses} ${className}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: style.border }}
      />
      {verdict}
    </span>
  );
};
