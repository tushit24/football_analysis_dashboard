'use client';

import React from 'react';
import { FormationType } from '@/lib/types';
import { Pitch } from './Pitch';

interface FormationBoardProps {
  formation: FormationType;
  targetRole: string;
  clubColor?: string;
  onFormationChange: (fmt: FormationType) => void;
  onRoleSelect: (role: string) => void;
  className?: string;
}

export const FormationBoard: React.FC<FormationBoardProps> = ({
  formation,
  targetRole,
  clubColor = '#e4202c',
  onFormationChange,
  onRoleSelect,
  className = '',
}) => {
  const formations: FormationType[] = ['4-3-3', '4-2-3-1', '3-5-2', '4-4-2'];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Formation Selector Pills */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <label className="text-xs font-sans text-mut font-semibold uppercase tracking-wider">
          Formation:
        </label>
        <div className="inline-flex bg-panel2 p-1 rounded-xl border border-line">
          {formations.map((fmt) => {
            const isActive = formation === fmt;
            return (
              <button
                key={fmt}
                type="button"
                onClick={() => onFormationChange(fmt)}
                className={`px-3 py-1.5 text-xs font-display font-bold rounded-lg transition-all ${
                  isActive
                    ? 'bg-pitch text-slate-950 shadow-sm'
                    : 'text-mut hover:text-tx hover:bg-white/5'
                }`}
              >
                {fmt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Role Selector Badges */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="text-xs text-mut mr-1">Target Slot:</span>
        {['DM', 'CM', 'RW', 'LW', 'ST', 'CB', 'LB', 'RB'].map((role) => {
          const isSelected = targetRole.toUpperCase() === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => onRoleSelect(role)}
              className={`px-2.5 py-1 text-xs font-display font-bold rounded-lg border transition-all ${
                isSelected
                  ? 'bg-pitch/20 text-pitch border-pitch shadow-pitch-glow'
                  : 'bg-panel2 text-mut border-line hover:text-tx hover:border-tx/40'
              }`}
            >
              {role}
            </button>
          );
        })}
      </div>

      {/* Pitch Tactics Board */}
      <div className="bg-panel/60 p-4 rounded-2xl border border-line">
        <Pitch
          formation={formation}
          clubColor={clubColor}
          targetRole={targetRole}
          onSelectRole={onRoleSelect}
        />
      </div>
    </div>
  );
};
