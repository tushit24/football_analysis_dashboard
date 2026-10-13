'use client';

import React, { useEffect, useState } from 'react';

interface FitRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

export const FitRing: React.FC<FitRingProps> = ({
  score,
  size = 110,
  strokeWidth = 9,
  showLabel = true,
  className = '',
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Smooth count-up effect
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 50);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const color =
    score >= 90
      ? '#19c37d'
      : score >= 80
      ? '#0ea5e9'
      : score >= 65
      ? '#f6c744'
      : '#ef5b5b';

  return (
    <div
      className={`relative inline-grid place-items-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Tactical fit score: ${score} out of 100`}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#13244a"
          strokeWidth={strokeWidth}
        />
        {/* Animated Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color}80)`,
          }}
        />
      </svg>
      {/* Inner score label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className="font-display font-extrabold leading-none text-white tracking-tight"
          style={{ fontSize: `${Math.round(size * 0.36)}px` }}
        >
          {score}
        </span>
        {showLabel && (
          <span
            className="text-mut uppercase font-sans font-semibold tracking-wider text-[9px] mt-0.5"
          >
            FIT SCORE
          </span>
        )}
      </div>
    </div>
  );
};
