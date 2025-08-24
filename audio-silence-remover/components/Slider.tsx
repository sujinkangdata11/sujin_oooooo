
import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    value: number;
}

export function Slider({ label, value, ...props }: SliderProps): React.ReactNode {
  return (
    <div>
      <label htmlFor="slider" className="block text-sm font-medium text-slate-300 mb-2">
        {label}: <span className="font-bold text-cyan-400">{value} dB</span>
      </label>
      <input
        id="slider"
        type="range"
        value={value}
        {...props}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:accent-slate-600 disabled:cursor-not-allowed"
      />
    </div>
  );
}
