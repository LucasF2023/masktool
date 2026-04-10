import React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (val: number) => string;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue = (val) => val.toString(),
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-xs font-medium text-slate-700 font-mono bg-slate-100 px-2 py-0.5 rounded">
          {formatValue(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
      />
    </div>
  );
};