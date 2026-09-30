"use client";

import { useMemo, useState } from "react";

/* Dependency-aware crew schedule. Each task needs its prerequisites finished;
   at most `crew` agents work at once. Greedy list scheduling, longest task
   first among the ready ones. Change the crew and the plan redraws. */

const TASKS = [
  { id: "brief", label: "Brief", d: 2, deps: [] as string[] },
  { id: "scan", label: "Market scan", d: 4, deps: ["brief"] },
  { id: "rivals", label: "Rival teardown", d: 3, deps: ["brief"] },
  { id: "voice", label: "Brand voice", d: 3, deps: ["scan"] },
  { id: "copy", label: "Page copy", d: 3, deps: ["voice", "rivals"] },
  { id: "design", label: "Layout", d: 4, deps: ["voice"] },
  { id: "build", label: "Build page", d: 5, deps: ["design", "copy"] },
  { id: "plan", label: "Launch plan", d: 3, deps: ["scan", "rivals"] },
  { id: "qa", label: "Review", d: 2, deps: ["build", "plan"] },
];

type Slot = { id: string; label: string; start: number; end: number; lane: number };

function schedule(crew: number): Slot[] {
  const done = new Map<string, number>();
  const slots: Slot[] = [];
  const laneFree = Array.from({ length: crew }, () => 0);
  const left = new Set(TASKS.map((t) => t.id));
  while (left.size) {
    const ready = TASKS.filter((t) => left.has(t.id) && t.deps.every((d) => done.has(d))).sort((a, b) => b.d - a.d);
    for (const t of ready) {
      const earliest = Math.max(0, ...t.deps.map((d) => done.get(d) ?? 0));
      let lane = 0;
      for (let i = 1; i < crew; i++) if (Math.max(laneFree[i], earliest) < Math.max(laneFree[lane], earliest)) lane = i;
      const start = Math.max(laneFree[lane], earliest);
      const end = start + t.d;
      laneFree[lane] = end;
      done.set(t.id, end);
      slots.push({ id: t.id, label: t.label, start, end, lane });
      left.delete(t.id);
    }
  }
  return slots;
}

function criticalPath() {
  const memo = new Map<string, number>();
  const f = (id: string): number => {
    if (memo.has(id)) return memo.get(id)!;
    const t = TASKS.find((x) => x.id === id)!;
    const v = t.d + Math.max(0, ...t.deps.map(f));
    memo.set(id, v);
    return v;
  };
  return Math.max(...TASKS.map((t) => f(t.id)));
}

export function CrewScheduler() {
  const [crew, setCrew] = useState(3);
  const slots = useMemo(() => schedule(crew), [crew]);
  const span = Math.max(...slots.map((s) => s.end));
  const floor = criticalPath();
  const serial = TASKS.reduce((a, t) => a + t.d, 0);
  const scale = 100 / serial;

  return (
    <div className="flex h-full flex-col p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="crew" className="font-mono text-[10px] uppercase tracking-[0.06em] text-mute">
          Crew size <span className="text-lime">{crew}</span>
        </label>
        <input id="crew" type="range" min={1} max={5} value={crew} onChange={(e) => setCrew(Number(e.target.value))} className="w-40 accent-[#94db17]" />
      </div>
      <div className="relative mt-4 grid flex-1 content-start gap-1.5">
        {Array.from({ length: crew }, (_, lane) => (
          <div key={lane} className="relative h-7 rounded-md bg-void/50">
            {slots
              .filter((s) => s.lane === lane)
              .map((s) => (
                <span
                  key={s.id}
                  title={`${s.label}: day ${s.start}–${s.end}`}
                  className="absolute top-0.5 flex h-6 items-center overflow-hidden whitespace-nowrap rounded-[5px] border border-lime/40 bg-lime/15 px-1.5 text-[9.5px] text-bone transition-all duration-500"
                  style={{ left: `${s.start * scale}%`, width: `calc(${(s.end - s.start) * scale}% - 2px)` }}
                >
                  {s.label}
                </span>
              ))}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-3 font-mono text-[10px] uppercase text-mute">
        <p>
          Finish <span className="block text-[18px] normal-case text-lime">{span} days</span>
        </p>
        <p>
          Floor <span className="block text-[18px] normal-case text-bone">{floor} days</span>
        </p>
        <p>
          One agent <span className="block text-[18px] normal-case text-bone">{serial} days</span>
        </p>
      </div>
      <p className="mt-2 text-[11px] text-dim">{span === floor ? "The crew is as fast as the dependencies allow. More agents will not help." : "Dependencies are waiting on free hands. Add an agent to shorten the plan."}</p>
    </div>
  );
}
