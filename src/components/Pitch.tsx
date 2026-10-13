'use client';

import React from 'react';
import { FormationType } from '@/lib/types';

interface PitchPlayer {
  id?: string;
  name: string;
  role: string;
  isTargetRole?: boolean;
}

interface PitchProps {
  formation?: FormationType;
  players?: (string | PitchPlayer)[];
  clubColor?: string;
  targetRole?: string;
  onSelectRole?: (role: string, name?: string) => void;
  className?: string;
}

// 11-player positions per formation on standard 100x130 viewBox
// GK at bottom (50, 118), Attackers at top
const FORMATION_COORDS: Record<FormationType, [number, number, string][]> = {
  '4-3-3': [
    [50, 118, 'GK'],
    [16, 98, 'LB'],
    [38, 102, 'CB'],
    [62, 102, 'CB'],
    [84, 98, 'RB'],
    [50, 80, 'DM'],
    [30, 62, 'CM'],
    [70, 62, 'CM'],
    [18, 30, 'LW'],
    [50, 22, 'ST'],
    [82, 30, 'RW'],
  ],
  '4-2-3-1': [
    [50, 118, 'GK'],
    [16, 98, 'LB'],
    [38, 102, 'CB'],
    [62, 102, 'CB'],
    [84, 98, 'RB'],
    [36, 80, 'DM'],
    [64, 80, 'DM'],
    [18, 48, 'LAM'],
    [50, 48, 'CAM'],
    [82, 48, 'RAM'],
    [50, 22, 'ST'],
  ],
  '3-5-2': [
    [50, 118, 'GK'],
    [26, 102, 'LCB'],
    [50, 104, 'CB'],
    [74, 102, 'RCB'],
    [12, 70, 'LWB'],
    [38, 72, 'DM'],
    [62, 72, 'DM'],
    [88, 70, 'RWB'],
    [50, 50, 'AM'],
    [35, 24, 'ST'],
    [65, 24, 'ST'],
  ],
  '4-4-2': [
    [50, 118, 'GK'],
    [16, 98, 'LB'],
    [38, 102, 'CB'],
    [62, 102, 'CB'],
    [84, 98, 'RB'],
    [16, 62, 'LM'],
    [38, 65, 'CM'],
    [62, 65, 'CM'],
    [84, 62, 'RM'],
    [36, 24, 'ST'],
    [64, 24, 'ST'],
  ],
};

export const Pitch: React.FC<PitchProps> = ({
  formation = '4-3-3',
  players = [],
  clubColor = '#e4202c',
  targetRole,
  onSelectRole,
  className = '',
}) => {
  const coords = FORMATION_COORDS[formation] || FORMATION_COORDS['4-3-3'];

  return (
    <div className={`relative max-w-[440px] mx-auto select-none ${className}`}>
      <svg
        viewBox="0 0 100 130"
        className="w-full h-auto rounded-2xl shadow-2xl border border-line/60 overflow-hidden"
      >
        <defs>
          {/* Lawn Stripe Pattern */}
          <pattern id="pitch-stripes" width="100" height="26" patternUnits="userSpaceOnUse">
            <rect width="100" height="13" fill="#1f9a57" />
            <rect y="13" width="100" height="13" fill="#1a8c4f" />
          </pattern>
        </defs>

        {/* Pitch Surface Background */}
        <rect width="100" height="130" fill="url(#pitch-stripes)" />

        {/* Tactical Pitch Markings */}
        <g fill="none" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="0.5">
          {/* Outer Boundary */}
          <rect x="3" y="3" width="94" height="124" />
          {/* Halfway Line */}
          <path d="M3 65H97" />
          {/* Center Circle & Spot */}
          <circle cx="50" cy="65" r="10" />
          <circle cx="50" cy="65" r="0.8" fill="rgba(255, 255, 255, 0.7)" />

          {/* Top Penalty Area & 6-Yard Box */}
          <rect x="25" y="3" width="50" height="18" />
          <rect x="37" y="3" width="26" height="6.5" />
          <circle cx="50" cy="14" r="0.7" fill="rgba(255, 255, 255, 0.7)" />

          {/* Bottom Penalty Area & 6-Yard Box */}
          <rect x="25" y="109" width="50" height="18" />
          <rect x="37" y="120.5" width="26" height="6.5" />
          <circle cx="50" cy="116" r="0.7" fill="rgba(255, 255, 255, 0.7)" />
        </g>

        {/* Player Nodes */}
        {coords.map(([x, y, defaultRole], idx) => {
          const raw = players[idx];
          const name = typeof raw === 'string' ? raw : raw?.name || defaultRole;
          const role = typeof raw === 'object' && raw?.role ? raw.role : defaultRole;
          const isSelected =
            Boolean(targetRole) &&
            (role.toUpperCase() === targetRole!.toUpperCase() ||
              name.toUpperCase() === targetRole!.toUpperCase() ||
              (targetRole === 'DM' && role === 'DM'));

          return (
            <g
              key={`${role}-${idx}`}
              className="cursor-pointer transition-transform duration-300 hover:scale-110 group"
              style={{ transform: `translate(${x}px, ${y}px)` }}
              onClick={() => onSelectRole && onSelectRole(role, name)}
            >
              {/* Invisible large hitbox for easy cursor click */}
              <circle
                r="9"
                fill="transparent"
                style={{ pointerEvents: 'all' }}
                className="cursor-pointer"
                onClick={() => onSelectRole && onSelectRole(role, name)}
              />

              {/* Active Target Glow Ring */}
              {isSelected && (
                <circle
                  r="5.6"
                  fill="none"
                  stroke="#19c37d"
                  strokeWidth="0.9"
                  className="animate-pulse"
                />
              )}

              {/* Player Jersey Dot */}
              <circle
                r="3.6"
                fill={isSelected ? '#19c37d' : clubColor}
                stroke="#ffffff"
                strokeWidth="0.7"
                style={{
                  filter: isSelected ? 'drop-shadow(0 0 4px #19c37d)' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                }}
              />

              {/* Player Name / Position Label */}
              <text
                y="7"
                textAnchor="middle"
                className="font-sans font-bold select-none text-[3.2px]"
                fill="#ffffff"
                style={{
                  paintOrder: 'stroke',
                  stroke: '#0a3a22',
                  strokeWidth: '0.7px',
                }}
              >
                {name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Pitch tactical footer tag */}
      <div className="flex items-center justify-between text-[11px] text-mut mt-2 px-1">
        <span className="font-display font-semibold tracking-wide uppercase">
          Formation: {formation}
        </span>
        <span>Click node to set target role</span>
      </div>
    </div>
  );
};
