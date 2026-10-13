'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { predictMatch } from '@/lib/api';
import { MatchPredictionResponse } from '@/lib/types';
import { ProbabilityBar } from '@/components/ProbabilityBar';
import { StatBar } from '@/components/StatBar';
import clubsData from '@/lib/mock/clubs.json';
import { ArrowLeftRight, Dices, ShieldAlert } from 'lucide-react';

export default function MatchPredictorPage() {
  const { selectedClub } = useAppStore();
  const clubs = clubsData as Record<string, any>;
  const clubNames = Object.keys(clubs);
  const managers = Array.from(new Set(Object.values(clubs).map((c) => c.manager)));

  const [homeTeam, setHomeTeam] = useState(selectedClub);
  const [awayTeam, setAwayTeam] = useState('Chelsea');
  const [homeManager, setHomeManager] = useState(clubs[selectedClub]?.manager || 'Mikel Arteta');
  const [awayManager, setAwayManager] = useState(clubs['Chelsea']?.manager || 'Mauricio Pochettino');

  const [activeSegment, setActiveSegment] = useState<'home' | 'away'>('home');
  const [result, setResult] = useState<MatchPredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const runPrediction = async () => {
    setLoading(true);
    const pred = await predictMatch({
      homeTeam,
      awayTeam,
      homeManager,
      awayManager,
    });
    setResult(pred);
    setLoading(false);
  };

  useEffect(() => {
    runPrediction();
  }, [homeTeam, awayTeam, homeManager, awayManager]);

  const handleSwapSides = () => {
    const tempT = homeTeam;
    const tempM = homeManager;
    setHomeTeam(awayTeam);
    setHomeManager(awayManager);
    setAwayTeam(tempT);
    setAwayManager(tempM);
    setActiveSegment(activeSegment === 'home' ? 'away' : 'home');
  };

  const handleHomeTeamChange = (name: string) => {
    setHomeTeam(name);
    setHomeManager(clubs[name]?.manager || homeManager);
  };

  const handleAwayTeamChange = (name: string) => {
    setAwayTeam(name);
    setAwayManager(clubs[name]?.manager || awayManager);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-line pb-6">
        <div className="flex items-center gap-2 text-xs font-sans text-pitch font-bold uppercase tracking-wider mb-1">
          <Dices className="w-4 h-4" />
          <span>Matchday Odds Engine</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-tx uppercase tracking-tight">
          Match Predictor
        </h1>
        <p className="text-mut text-sm sm:text-base max-w-2xl mt-1">
          Pick two clubs and their managers to see win, draw and loss odds with tactical driver
          breakdowns.
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Match Setup Controls */}
        <div className="lg:col-span-5 bg-panel border border-line rounded-3xl p-6 shadow-xl space-y-5">
          {/* Home / Away Swap Segments */}
          <div className="flex items-center justify-between">
            <div className="inline-flex bg-panel2 p-1 rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setActiveSegment('home')}
                className={`px-4 py-2 text-xs font-display font-bold uppercase rounded-lg transition-all ${
                  activeSegment === 'home'
                    ? 'bg-pitch text-slate-950 shadow-sm'
                    : 'text-mut hover:text-tx'
                }`}
              >
                Home Focus
              </button>
              <button
                type="button"
                onClick={() => setActiveSegment('away')}
                className={`px-4 py-2 text-xs font-display font-bold uppercase rounded-lg transition-all ${
                  activeSegment === 'away'
                    ? 'bg-pitch text-slate-950 shadow-sm'
                    : 'text-mut hover:text-tx'
                }`}
              >
                Away Focus
              </button>
            </div>

            <button
              type="button"
              onClick={handleSwapSides}
              className="p-2 rounded-xl bg-panel2 border border-line hover:border-pitch text-mut hover:text-pitch transition-colors"
              title="Swap Home and Away"
              aria-label="Swap Home and Away teams"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Teams Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-mut font-semibold">Home Team</label>
              <select
                value={homeTeam}
                onChange={(e) => handleHomeTeamChange(e.target.value)}
                className="w-full bg-panel2 border border-line rounded-xl px-3 py-2 text-xs text-tx font-bold focus:border-pitch outline-none"
              >
                {clubNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-mut font-semibold">Away Team</label>
              <select
                value={awayTeam}
                onChange={(e) => handleAwayTeamChange(e.target.value)}
                className="w-full bg-panel2 border border-line rounded-xl px-3 py-2 text-xs text-tx font-bold focus:border-pitch outline-none"
              >
                {clubNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Managers Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-mut font-semibold">Home Manager</label>
              <select
                value={homeManager}
                onChange={(e) => setHomeManager(e.target.value)}
                className="w-full bg-panel2 border border-line rounded-xl px-3 py-2 text-xs text-tx font-bold focus:border-pitch outline-none"
              >
                {managers.map((mgr) => (
                  <option key={mgr} value={mgr}>
                    {mgr}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-mut font-semibold">Away Manager</label>
              <select
                value={awayManager}
                onChange={(e) => setAwayManager(e.target.value)}
                className="w-full bg-panel2 border border-line rounded-xl px-3 py-2 text-xs text-tx font-bold focus:border-pitch outline-none"
              >
                {managers.map((mgr) => (
                  <option key={mgr} value={mgr}>
                    {mgr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Predict Action */}
          <button
            type="button"
            onClick={runPrediction}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-pitch hover:bg-pitch-light text-slate-950 font-display font-black text-lg tracking-wider uppercase transition-all shadow-pitch-glow disabled:opacity-50"
          >
            {loading ? 'Predicting Outcome...' : 'Predict Outcome'}
          </button>
        </div>

        {/* Right Column: Predicted Result & Drivers */}
        <div className="lg:col-span-7 bg-panel border border-line rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-line pb-3">
            <h2 className="font-display font-extrabold text-2xl text-tx uppercase">
              Predicted Result
            </h2>
            <p className="text-xs text-mut">Win, draw and loss distribution</p>
          </div>

          {result && (
            <>
              {/* Animated Segmented Probability Bar */}
              <ProbabilityBar
                homeName={homeTeam}
                awayName={awayTeam}
                homeWin={result.home_win}
                draw={result.draw}
                awayWin={result.away_win}
                homeColor={clubs[homeTeam]?.color}
                awayColor={clubs[awayTeam]?.color}
              />

              {/* What drives it section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-xl text-tx uppercase">
                    What Drives It
                  </h3>
                  <span className="text-[11px] text-mut">Key Feature Factors</span>
                </div>

                <div className="space-y-3.5">
                  {result.drivers.map((driver, idx) => {
                    const isPositive = driver.value >= 0;
                    const magnitude = Math.min(100, Math.round(Math.abs(driver.value) * 100));
                    const driverColor = isPositive
                      ? clubs[homeTeam]?.color || '#19c37d'
                      : clubs[awayTeam]?.color || '#034694';

                    return (
                      <StatBar
                        key={idx}
                        label={driver.name}
                        value={magnitude}
                        color={driverColor}
                        subLabel={`Favours ${driver.favours}`}
                      />
                    );
                  })}
                </div>

                <p className="text-xs text-mut pt-2 italic">
                  Illustrative model: squad rating differential plus home advantage and manager style vector delta.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
