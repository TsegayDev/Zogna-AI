"use client"

import * as React from 'react';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 60,
  strokeWidth = 4,
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-gray-200 dark:text-gray-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.35s',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
        {children}
      </div>
    </div>
  );
};
