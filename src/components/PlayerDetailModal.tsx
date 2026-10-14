'use client';

import React, { useEffect } from 'react';
import { PlayerMatch, TeamBrief } from '@/lib/types';
import { FitRing } from './FitRing';
import { VerdictBadge } from './VerdictBadge';
import { RadarCompare } from './RadarCompare';
import { StatBar } from './StatBar';
import {
  X,
  CheckCircle,
  AlertTriangle,
  Bookmark,
  GitCompare,
  CheckSquare,
  Square,
  TrendingUp,
  Sparkles,
  Award,
} from 'lucide-react';

interface PlayerDetailModalProps {
  match: PlayerMatch | null;
  brief: TeamBrief;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleShortlist: () => void;
  isCompared: boolean;
  onToggleCompare: () => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  match,
  brief,
  isOpen,
  onClose,
  isSaved,
  onToggleShortlist,
  isCompared,
  onToggleCompare,
}) => {
  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !match) return null;

  const { player, fitScore, verdict, strengths, concerns, attributeFit, xiImpact } = match;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Full scouting breakdown for ${player.name}`}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-panel border border-line rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-tx"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-panel2 border border-line text-mut hover:text-tx hover:border-tx/30 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-line pb-6 pr-10">
          <div className="flex items-center gap-5">
            <FitRing score={fitScore} size={90} strokeWidth={8} />

            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <VerdictBadge verdict={verdict} size="sm" />
                <span className="text-xs text-mut font-semibold uppercase tracking-wider">
                  Tactical Scouting Report
                </span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-tx tracking-tight">
                {player.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                <span className="text-tx font-bold bg-panel2 px-2.5 py-0.5 rounded-lg border border-line">
                  £{player.marketValue}M
                </span>
                <span className="text-pitch font-bold">{player.primaryRole}</span>
                <span className="text-mut">· {player.club}</span>
                <span className="text-mut">· {player.age} yrs</span>
                <span className="text-mut">· {player.nationality}</span>
                {player.isHomegrown && (
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Homegrown
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions (Save & Compare) */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto pt-2 sm:pt-0">
            <button
              type="button"
              onClick={onToggleShortlist}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                isSaved
                  ? 'bg-pitch/20 text-pitch border-pitch/50 shadow-sm'
                  : 'bg-panel2 text-mut border-line hover:text-tx'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-pitch' : ''}`} />
              <span>{isSaved ? 'Saved in Shortlist' : 'Add to Shortlist'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleCompare}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                isCompared
                  ? 'bg-pitch/20 text-pitch border-pitch/60 shadow-pitch-glow'
                  : 'bg-panel2 text-mut border-line hover:text-tx'
              }`}
            >
              {isCompared ? (
                <CheckSquare className="w-4 h-4 text-pitch" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>{isCompared ? 'Selected for Compare' : 'Add to Compare'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Radar & Attributes | Team Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Radar Geometry & Attribute Bars */}
          <div className="lg:col-span-6 space-y-6 bg-panel2/40 p-5 rounded-2xl border border-line">
            <div>
              <h3 className="font-display font-extrabold text-xl text-tx uppercase tracking-wide">
                Tactical Radar Geometry
              </h3>
              <p className="text-xs text-mut">
                {player.name} vs {brief.club} ({brief.targetRole}) Target Vector
              </p>
            </div>

            <RadarCompare
              attributes={attributeFit}
              playerName={player.name}
              teamName={`${brief.club} Brief`}
            />

            {/* Granular Attribute Comparison Bars */}
            <div className="space-y-3 pt-1">
              <span className="text-xs uppercase font-bold text-mut tracking-wider block">
                Dimensional Fit Breakdown
              </span>
              {attributeFit.map((attr) => (
                <StatBar
                  key={attr.name}
                  label={attr.name}
                  value={attr.playerValue}
                  benchmark={attr.teamBenchmark}
                  color="#19c37d"
                />
              ))}
            </div>
          </div>

          {/* Right Column: Strengths, Concerns & XI Impact Simulation */}
          <div className="lg:col-span-6 space-y-6">
            {/* Strengths & Concerns */}
            <div className="space-y-3">
              <div className="bg-panel2/60 p-4 rounded-2xl border border-line space-y-2">
                <span className="text-xs font-bold uppercase text-pitch tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Key Strengths
                </span>
                <ul className="space-y-1.5 text-xs text-tx">
                  {strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-pitch">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-panel2/60 p-4 rounded-2xl border border-line space-y-2">
                <span className="text-xs font-bold uppercase text-alert tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Watch / Concerns
                </span>
                <ul className="space-y-1.5 text-xs text-tx">
                  {concerns.map((con, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-alert">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Starting XI Simulation Impact */}
            <div className="bg-panel2/60 p-5 rounded-2xl border border-line space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-pitch uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Simulation: Impact on {brief.club} XI</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-panel p-3 rounded-xl border border-line">
                  <span className="text-[10px] uppercase font-bold text-mut block">
                    Points Delta
                  </span>
                  <strong className="font-display font-black text-2xl text-pitch block mt-0.5">
                    {xiImpact.expectedPointsDelta > 0 ? '+' : ''}
                    {xiImpact.expectedPointsDelta}
                  </strong>
                  <span className="text-[9px] text-mut">Season Total</span>
                </div>

                <div className="bg-panel p-3 rounded-xl border border-line">
                  <span className="text-[10px] uppercase font-bold text-mut block">
                    Title Odds
                  </span>
                  <strong className="font-display font-black text-2xl text-sky-400 block mt-0.5">
                    {xiImpact.titleOddsDelta > 0 ? '+' : ''}
                    {xiImpact.titleOddsDelta}%
                  </strong>
                  <span className="text-[9px] text-mut">Odds Shift</span>
                </div>

                <div className="bg-panel p-3 rounded-xl border border-line">
                  <span className="text-[10px] uppercase font-bold text-mut block">
                    Clean Sheets
                  </span>
                  <strong className="font-display font-black text-2xl text-gold block mt-0.5">
                    +{xiImpact.cleanSheetsDelta}
                  </strong>
                  <span className="text-[9px] text-mut">Defensive Solid</span>
                </div>
              </div>

              {/* Tactical contribution */}
              <div className="bg-panel p-3.5 rounded-xl border border-line space-y-1">
                <span className="text-xs font-bold text-tx uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pitch" />
                  Tactical Contribution in {brief.formation}:
                </span>
                <p className="text-xs text-tx/90 leading-relaxed">{xiImpact.summary}</p>
              </div>

              {/* Verdict recommendation */}
              <div className="p-3 rounded-xl bg-pitch/10 border border-pitch/30 flex items-start gap-2.5">
                <Award className="w-4 h-4 text-pitch flex-shrink-0 mt-0.5" />
                <p className="text-xs text-tx/90">
                  <strong className="text-pitch">{verdict}:</strong> Compatibility score is{' '}
                  <strong>{fitScore}/100</strong> under current manager brief settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-3 border-t border-line">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-panel2 hover:bg-panel2/80 text-tx border border-line hover:border-tx/30 font-display font-bold text-sm uppercase tracking-wide transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
