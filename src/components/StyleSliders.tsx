'use client';

import React from 'react';
import { TacticalStyle, DefensiveBlock } from '@/lib/types';

interface StyleSlidersProps {
  style: TacticalStyle;
  onChange: (updated: Partial<TacticalStyle>) => void;
  className?: string;
}

export const StyleSliders: React.FC<StyleSlidersProps> = ({
  style,
  onChange,
  className = '',
}) => {
  return (
    <div className={`space-y-5 ${className}`}>
      {/* Defensive Block Selector */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-sans">
          <span className="text-tx font-medium">Defensive Block Height</span>
          <span className="text-mut capitalize font-semibold">{style.block} Block</span>
        </div>
        <div className="grid grid-cols-3 gap-1 bg-panel2 p-1 rounded-xl border border-line">
          {(['low', 'mid', 'high'] as DefensiveBlock[]).map((block) => {
            const isActive = style.block === block;
            return (
              <button
                key={block}
                type="button"
                onClick={() => onChange({ block })}
                className={`py-2 text-xs font-display font-bold uppercase rounded-lg transition-all ${
                  isActive
                    ? 'bg-pitch text-slate-950 shadow-sm'
                    : 'text-mut hover:text-tx hover:bg-white/5'
                }`}
              >
                {block} Block
              </button>
            );
          })}
        </div>
      </div>

      {/* Pressing Intensity */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-sans">
          <span className="text-tx font-medium">Pressing Intensity</span>
          <span className="text-tx font-display font-bold text-sm">
            {style.pressing}%
            <span className="text-mut font-normal text-xs ml-1">
              ({style.pressing >= 80 ? 'Heavy High Press' : style.pressing >= 60 ? 'Mid Press' : 'Stand Off'})
            </span>
          </span>
        </div>
        <input
          type="range"
          min={30}
          max={98}
          value={style.pressing}
          onChange={(e) => onChange({ pressing: Number(e.target.value) })}
          className="w-full accent-pitch bg-panel2 h-2 rounded-lg cursor-pointer"
          aria-label="Pressing Intensity"
        />
      </div>

      {/* Build-Up Style */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-sans">
          <span className="text-tx font-medium">Build-up Approach</span>
          <span className="text-tx font-display font-bold text-sm">
            {style.buildUp >= 65 ? 'Short & Patient' : style.buildUp <= 40 ? 'Direct & Vertical' : 'Balanced'}
            <span className="text-mut font-normal text-xs ml-1">({style.buildUp}%)</span>
          </span>
        </div>
        <input
          type="range"
          min={20}
          max={98}
          value={style.buildUp}
          onChange={(e) => onChange({ buildUp: Number(e.target.value) })}
          className="w-full accent-pitch bg-panel2 h-2 rounded-lg cursor-pointer"
          aria-label="Build-up Approach"
        />
        <div className="flex justify-between text-[10px] text-mut">
          <span>Direct / Long Ball</span>
          <span>Short / Positional</span>
        </div>
      </div>

      {/* Tempo */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-sans">
          <span className="text-tx font-medium">Circulation Tempo</span>
          <span className="text-tx font-display font-bold text-sm">
            {style.tempo}%
            <span className="text-mut font-normal text-xs ml-1">
              ({style.tempo >= 80 ? 'Fast One-Touch' : 'Measured'})
            </span>
          </span>
        </div>
        <input
          type="range"
          min={35}
          max={95}
          value={style.tempo}
          onChange={(e) => onChange({ tempo: Number(e.target.value) })}
          className="w-full accent-pitch bg-panel2 h-2 rounded-lg cursor-pointer"
          aria-label="Circulation Tempo"
        />
      </div>

      {/* Possession vs Transition */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-sans">
          <span className="text-tx font-medium">Game Model Philosophy</span>
          <span className="text-tx font-display font-bold text-sm">
            {style.possessionBias}% Possession / {100 - style.possessionBias}% Transition
          </span>
        </div>
        <input
          type="range"
          min={25}
          max={85}
          value={style.possessionBias}
          onChange={(e) => onChange({ possessionBias: Number(e.target.value) })}
          className="w-full accent-pitch bg-panel2 h-2 rounded-lg cursor-pointer"
          aria-label="Possession vs Transition bias"
        />
        <div className="flex justify-between text-[10px] text-mut">
          <span>Counter-Attacking Transitions</span>
          <span>Positional Control</span>
        </div>
      </div>
    </div>
  );
};
