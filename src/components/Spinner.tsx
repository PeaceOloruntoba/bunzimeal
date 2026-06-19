import React from "react";

export function Spinner({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <div className="animate-spin" style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" className="w-full h-full">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
      </svg>
    </div>
  );
}
