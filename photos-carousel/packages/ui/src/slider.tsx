import type { ChangeEventHandler } from 'react';
import { cn } from './utils.js';

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  label?: string;
}

export function Slider({ value, min = 0, max = 100, step = 1, onChange, label }: SliderProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-white">
      {label && <span className="text-sm uppercase tracking-wide text-white/60">{label}</span>}
      <input
        type="range"
        className={cn('h-2 w-full appearance-none rounded-full bg-white/20 accent-blue-500')}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
      />
    </label>
  );
}
