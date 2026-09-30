"use client";

import { useState } from "react";

const BASES = [
  { name: "Lime", hue: 84 },
  { name: "Tide", hue: 170 },
  { name: "Ember", hue: 22 },
  { name: "Iris", hue: 262 },
];

/** Pick a base hue; the engine derives a four-step palette and shows it in type. */
export function BrandEngine() {
  const [i, setI] = useState(0);
  const h = BASES[i].hue;
  const swatches = [`hsl(${h} 45% 16%)`, `hsl(${h} 38% 38%)`, `hsl(${h} 70% 55%)`, `hsl(${h} 40% 92%)`];
  return (
    <div className="flex h-full flex-col justify-between p-5 sm:p-6" style={{ background: swatches[3], color: swatches[0] }}>
      <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.08em]">
        <span>Identity no. 0{i + 1}</span>
        <div className="flex gap-1.5" role="group" aria-label="Base colour">
          {BASES.map((b, n) => (
            <button key={b.name} type="button" aria-pressed={n === i} onClick={() => setI(n)} className={`rounded-full border px-2 py-0.5 transition-colors ${n === i ? "border-current" : "border-transparent opacity-60 hover:opacity-100"}`}>
              {b.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-6">
        <span className="text-[88px] font-semibold leading-none tracking-[-0.05em]">Aa</span>
        <svg viewBox="0 0 80 80" className="mb-3 size-16" aria-hidden>
          <path d="M8 72 L70 10 M34 10 H70 V46" fill="none" stroke={swatches[1]} strokeWidth={3} />
        </svg>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.08em]">Be recognised at a glance.</span>
        <span className="flex gap-2">
          {swatches.map((s) => (
            <span key={s} className="size-6 rounded-full border border-black/10" style={{ background: s }} />
          ))}
        </span>
      </div>
    </div>
  );
}
