'use client';

import React, { useEffect, useState } from 'react';

interface StatBarProps {
  label: string;
  value: number; // 0 - 100
  benchmark?: number; // 0 - 100
  color?: string;
  subLabel?: string;
  className?: string;
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  benchmark,
  color = '#19c37d',
  subLabel,
  className = '',
}) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(Math.min(100, Math.max(0, value)));
    }, 60);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex justify-between items-baseline text-xs font-sans">
        <span className="text-tx font-medium">{label}</span>
        <span className="text-mut text-[11px]">
          {subLabel ? (
            subLabel
          ) : benchmark !== undefined ? (
            <span>
              <strong className="text-tx font-bold">{value}%</strong>
              <span className="text-mut"> (Brief: {benchmark}%)</span>
            </span>
          ) : (
            <strong className="text-tx font-bold">{value}%</strong>
          )}
        </span>
      </div>
      <div className="relative h-2.5 w-full bg-panel2 rounded-full overflow-hidden border border-line/40">
        {/* Benchmark target marker line */}
        {benchmark !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/70 z-10 shadow-sm"
            style={{ left: `${Math.min(100, Math.max(0, benchmark))}%` }}
            title={`Benchmark target: ${benchmark}%`}
          />
        )}
        {/* Animated fill */}
        <div
          className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{
            width: `${width}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};
