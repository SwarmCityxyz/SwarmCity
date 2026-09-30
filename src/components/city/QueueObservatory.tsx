"use client";

import { useMemo, useState } from "react";

/* Toy queue: jobs arrive each hour, each agent clears a fixed number. When
   arrivals beat capacity the backlog climbs; otherwise the city catches up.
   Seeded noise keeps the line honest-looking and the same every render. */

const HOURS = 48;
const PER_AGENT = 3;

function run(arrivals: number, agents: number) {
  let seed = 42;
  const noise = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647 - 0.5;
  };
  const backlog: number[] = [];
  let q = 12;
  let busy = 0;
  for (let h = 0; h < HOURS; h++) {
    const incoming = Math.max(0, arrivals + noise() * arrivals * 0.6);
    const capacity = agents * PER_AGENT;
    const served = Math.min(q + incoming, capacity);
    busy += served / capacity;
    q = Math.max(0, q + incoming - capacity);
    backlog.push(q);
  }
  return { backlog, utilisation: busy / HOURS };
}

export function QueueObservatory() {
  const [arrivals, setArrivals] = useState(10);
  const [agents, setAgents] = useState(4);
  const { backlog, utilisation } = useMemo(() => run(arrivals, agents), [arrivals, agents]);
  const max = Math.max(30, ...backlog);
  const pts = backlog.map((v, i) => `${(i / (HOURS - 1)) * 300},${100 - (v / max) * 92}`).join(" ");
  const end = backlog[backlog.length - 1];
  const growing = arrivals > agents * PER_AGENT;

  return (
    <div className="flex h-full flex-col p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="font-mono text-[10px] uppercase tracking-[0.06em] text-mute">
          Jobs per hour <span className="text-lime">{arrivals}</span>
          <input type="range" min={2} max={24} value={arrivals} onChange={(e) => setArrivals(Number(e.target.value))} className="mt-1 block w-full accent-[#94db17]" />
        </label>
        <label className="font-mono text-[10px] uppercase tracking-[0.06em] text-mute">
          Agents on shift <span className="text-lime">{agents}</span>
          <input type="range" min={1} max={8} value={agents} onChange={(e) => setAgents(Number(e.target.value))} className="mt-1 block w-full accent-[#94db17]" />
        </label>
      </div>
      <svg viewBox="0 0 300 104" className="mt-4 w-full flex-1" preserveAspectRatio="none" aria-label={`Backlog after ${HOURS} hours: ${Math.round(end)} jobs`}>
        {[25, 50, 75].map((y) => (
          <line key={y} x1={0} x2={300} y1={y} y2={y} stroke="rgba(201,213,202,0.1)" />
        ))}
        <polygon points={`0,100 ${pts} 300,100`} fill={growing ? "rgba(255,107,94,0.15)" : "rgba(148,219,23,0.14)"} />
        <polyline points={pts} fill="none" stroke={growing ? "#ff6b5e" : "#94db17"} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3 font-mono text-[10px] uppercase text-mute">
        <p>
          Backlog <span className={`block text-[18px] normal-case ${growing ? "text-danger" : "text-lime"}`}>{Math.round(end)}</span>
        </p>
        <p>
          Capacity <span className="block text-[18px] normal-case text-bone">{agents * PER_AGENT}/h</span>
        </p>
        <p>
          Busy <span className="block text-[18px] normal-case text-bone">{Math.round(utilisation * 100)}%</span>
        </p>
      </div>
      <p className="mt-2 text-[11px] text-dim">{growing ? "Work arrives faster than the shift can clear it. The queue keeps growing." : "The shift keeps up. Spare hours go to reviews and upkeep."}</p>
    </div>
  );
}
