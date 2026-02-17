import React from "react";

interface CircularProgressProps {
  current: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  isWarning?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  current,
  max,
  size = 24,
  strokeWidth = 3,
  isWarning = false,
}) => {
  const safeCurrent = Math.max(0, current);
  const percent = Math.min((safeCurrent / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  // Use theme CSS variables from index.css for consistent colors
  const progressColor = isWarning
    ? "var(--destructive, #ef4444)"
    : "var(--ring, #7c3aed)";
  const bgColor = "var(--border, rgba(0,0,0,0.1))";

  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
      </svg>

      {/* No inner text - small circular progress only */}
    </div>
  );
};

export default CircularProgress;
