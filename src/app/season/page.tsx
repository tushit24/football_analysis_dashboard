'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { predictSeason } from '@/lib/api';
import { SeasonSimulationResponse } from '@/lib/types';
import { StandingsTable } from '@/components/StandingsTable';
import clubsData from '@/lib/mock/clubs.json';
import { Trophy, RefreshCw, Award, TrendingUp, AlertOctagon } from 'lucide-react';

export default function SeasonPredictorPage() {
  const { selectedClub } = useAppStore();
  const clubs = clubsData as Record<string, any>;
  const clubNames = Object.keys(clubs);
  const managers = Array.from(new Set(Object.values(clubs).map((c) => c.manager)));

  const [focusClub, setFocusClub] = useState(selectedClub);
  const [manager, setManager] = useState(clubs[selectedClub]?.manager || 'Mikel Arteta');
  const [simulation, setSimulation] = useState<SeasonSimulationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    const res = await predictSeason({ focusClub, manager });
    setSimulation(res);
    setLoading(false);
  };

  useEffect(() => {
    runSimulation();
  }, [focusClub, manager]);

  const handleClubChange = (name: string) => {
    setFocusClub(name);
    setManager(clubs[name]?.manager || manager);
  };

  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="border-b border-line pb-6">
        <div className="flex items-center gap-2 text-xs font-sans text-pitch font-bold uppercase tracking-wider mb-1">
          <Trophy className="w-4 h-4" />
          <span>Monte Carlo League Simulator</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-tx uppercase tracking-tight">
          Season Predictor
        </h1>
        <p className="text-mut text-sm sm:text-base max-w-2xl mt-1">
          Simulates 38 fixtures for all 20 Premier League clubs across 800 iterations to project final
          points, title probabilities, top-4 finishes, and relegation risk.
        </p>
      </div>

      {/* Simulation Controls Card */}
      <div className="bg-panel border border-line rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-xs text-mut font-semibold">Target Club</label>
            <select
              value={focusClub}
              onChange={(e) => handleClubChange(e.target.value)}
              className="w-full bg-panel2 border border-line rounded-xl px-3 py-2.5 text-xs text-tx font-bold focus:border-pitch outline-none"
            >
              {clubNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-xs text-mut font-semibold">Manager / Tactics</label>
            <select
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full bg-panel2 border border-line rounded-xl px-3 py-2.5 text-xs text-tx font-bold focus:border-pitch outline-none"
            >
              {managers.map((mgr) => (
                <option key={mgr} value={mgr}>
                  {mgr}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              type="button"
              onClick={runSimulation}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-pitch hover:bg-pitch-light text-slate-950 font-display font-black text-base uppercase tracking-wider transition-all shadow-pitch-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Simulating...' : 'Run 800 Runs'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Outcome Projection Cards */}
      {simulation && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Projected Finish */}
            <div className="bg-panel border border-line rounded-2xl p-5 shadow-lg">
              <span className="text-[10px] uppercase font-bold text-mut block flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-pitch" /> Projected Finish
              </span>
              <strong className="font-display font-black text-3xl sm:text-4xl text-tx block mt-1">
                {getOrdinal(simulation.projectedRank)}
              </strong>
              <span className="text-xs text-mut font-medium">
                ~{simulation.projectedPoints} Projected Points
              </span>
            </div>

            {/* Title Odds */}
            <div className="bg-panel border border-line rounded-2xl p-5 shadow-lg">
              <span className="text-[10px] uppercase font-bold text-mut block flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-gold" /> Title Odds
              </span>
              <strong className="font-display font-black text-3xl sm:text-4xl text-pitch block mt-1">
                {simulation.titleOdds}%
              </strong>
              <span className="text-xs text-mut font-medium">Champions Probability</span>
            </div>

            {/* Top 4 Odds */}
            <div className="bg-panel border border-line rounded-2xl p-5 shadow-lg">
              <span className="text-[10px] uppercase font-bold text-mut block flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" /> Top 4 Finish
              </span>
              <strong className="font-display font-black text-3xl sm:text-4xl text-sky-400 block mt-1">
                {simulation.top4Odds}%
              </strong>
              <span className="text-xs text-mut font-medium">UCL Qualification</span>
            </div>

            {/* Relegation Odds */}
            <div className="bg-panel border border-line rounded-2xl p-5 shadow-lg">
              <span className="text-[10px] uppercase font-bold text-mut block flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400" /> Relegation Risk
              </span>
              <strong className="font-display font-black text-3xl sm:text-4xl text-rose-400 block mt-1">
                {simulation.relegationOdds}%
              </strong>
              <span className="text-xs text-mut font-medium">Drop to Championship</span>
            </div>
          </div>

          {/* Standings Table Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-tx uppercase">
                  Projected Standings
                </h2>
                <p className="text-xs text-mut">800 Monte Carlo simulations mean outcomes</p>
              </div>
              <span className="text-[11px] font-bold text-pitch bg-pitch/10 px-3 py-1 rounded-full border border-pitch/20">
                {focusClub} Row Highlighted
              </span>
            </div>

            <StandingsTable standings={simulation.standings} focusClub={focusClub} />
          </div>
        </div>
      )}
    </div>
  );
}
