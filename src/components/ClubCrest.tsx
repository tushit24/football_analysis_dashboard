'use client';

import React from 'react';
import { CLUB_THEME_COLORS } from '@/lib/theme';

interface ClubCrestProps {
  name: string;
  size?: number;
  className?: string;
  customUrl?: string;
}

export const ClubCrest: React.FC<ClubCrestProps> = ({
  name,
  size = 40,
  className = '',
  customUrl,
}) => {
  const color = CLUB_THEME_COLORS[name] || '#19c37d';
  // 3-letter initials code
  const code = name.length <= 4 ? name.toUpperCase() : name.slice(0, 3).toUpperCase();

  if (customUrl) {
    return (
      <img
        src={customUrl}
        alt={`${name} crest`}
        className={`rounded-full object-cover shadow-sm ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const fontSize = Math.max(10, Math.round(size * 0.36));

  return (
    <div
      role="img"
      aria-label={`${name} club crest placeholder`}
      className={`inline-grid place-items-center rounded-full font-display font-extrabold text-white flex-shrink-0 select-none transition-transform duration-200 shadow-inner ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        fontSize: `${fontSize}px`,
        boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.25)',
      }}
    >
      <span>{code}</span>
    </div>
  );
};
