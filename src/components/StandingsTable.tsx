'use client';

import React from 'react';
import { StandingsRow } from '@/lib/types';
import { ClubCrest } from './ClubCrest';

interface StandingsTableProps {
  standings: StandingsRow[];
  focusClub?: string;
  className?: string;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  standings,
  focusClub = 'Arsenal',
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-line bg-panel ${className}`}>
      <table className="w-full border-collapse text-left text-sm font-sans">
        <thead>
          <tr className="border-b border-line bg-panel2/50 text-xs font-semibold text-mut uppercase tracking-wider">
            <th className="py-3 px-3.5 w-12 text-center">#</th>
            <th className="py-3 px-3.5">Club</th>
            <th className="py-3 px-3.5 text-right font-display text-sm">Pts</th>
            <th className="py-3 px-3.5 text-right font-display text-sm">Title %</th>
            <th className="py-3 px-3.5 text-right font-display text-sm">Top 4 %</th>
            <th className="py-3 px-3.5 text-right font-display text-sm">Drop %</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60">
          {standings.map((row) => {
            const isFocus = row.club.toLowerCase() === focusClub.toLowerCase();
            return (
              <tr
                key={row.club}
                className={`transition-colors duration-150 ${
                  isFocus
                    ? 'bg-pitch/15 font-bold border-l-4 border-l-pitch text-white'
                    : 'hover:bg-panel2/40 text-tx'
                }`}
              >
                <td className="py-3 px-3.5 text-center font-display font-extrabold text-base text-mut">
                  {row.rank}
                </td>
                <td className="py-3 px-3.5">
                  <div className="flex items-center gap-3">
                    <ClubCrest name={row.club} size={28} />
                    <span className="font-semibold text-tx tracking-tight">{row.club}</span>
                    {isFocus && (
                      <span className="text-[10px] uppercase font-bold text-pitch bg-pitch/20 px-2 py-0.5 rounded-full">
                        Your Club
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3.5 text-right font-display font-extrabold text-lg text-white">
                  {row.points}
                </td>
                <td className="py-3 px-3.5 text-right font-display font-bold text-base text-tx">
                  {row.titleOdds > 0 ? (
                    <span className="text-pitch">{row.titleOdds}%</span>
                  ) : (
                    <span className="text-mut/70">-</span>
                  )}
                </td>
                <td className="py-3 px-3.5 text-right font-display font-bold text-base text-tx">
                  {row.top4Odds > 0 ? (
                    <span className="text-sky-400">{row.top4Odds}%</span>
                  ) : (
                    <span className="text-mut/70">-</span>
                  )}
                </td>
                <td className="py-3 px-3.5 text-right font-display font-bold text-base text-tx">
                  {row.relegationOdds > 0 ? (
                    <span className="text-rose-400">{row.relegationOdds}%</span>
                  ) : (
                    <span className="text-mut/70">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
