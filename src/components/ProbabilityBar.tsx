'use client';

import React from 'react';

interface ProbabilityBarProps {
  homeName: string;
  awayName: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  homeColor?: string;
  awayColor?: string;
  className?: string;
}

export const ProbabilityBar: React.FC<ProbabilityBarProps> = ({
  homeName,
  awayName,
  homeWin,
  draw,
  awayWin,
  homeColor = '#e4202c',
  awayColor = '#034694',
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Segmented bar */}
      <div className="flex h-12 w-full rounded-xl overflow-hidden shadow-lg border border-line bg-panel2 font-display font-extrabold text-xl text-white select-none">
        <div
          className="flex items-center justify-center transition-all duration-700 ease-out min-w-[32px] px-2 text-center"
          style={{
            flex: homeWin,
            backgroundColor: homeColor,
          }}
          title={`${homeName} Win: ${homeWin}%`}
        >
          {homeWin >= 10 && <span>{homeWin}%</span>}
        </div>
        <div
          className="flex items-center justify-center bg-slate-600/80 transition-all duration-700 ease-out min-w-[28px] px-1 text-center text-slate-200"
          style={{ flex: draw }}
          title={`Draw: ${draw}%`}
        >
          {draw >= 8 && <span>{draw}%</span>}
        </div>
        <div
          className="flex items-center justify-center transition-all duration-700 ease-out min-w-[32px] px-2 text-center"
          style={{
            flex: awayWin,
            backgroundColor: awayColor,
          }}
          title={`${awayName} Win: ${awayWin}%`}
        >
          {awayWin >= 10 && <span>{awayWin}%</span>}
        </div>
      </div>

      {/* Descriptive Labels Row */}
      <div className="flex justify-between items-center text-xs font-sans text-mut px-1 font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: homeColor }} />
          <span className="text-tx">{homeName} win</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          <span>Draw</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: awayColor }} />
          <span className="text-tx">{awayName} win</span>
        </div>
      </div>
    </div>
  );
};
