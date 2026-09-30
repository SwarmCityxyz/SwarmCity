"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { n: "01", role: "Scout", title: "Market scan", detail: "Search + source notes", verb: "Research" },
  { n: "02", role: "Strategist", title: "Angle & offer", detail: "Positioning memo", verb: "Plan" },
  { n: "03", role: "Builder", title: "Launch page", detail: "Code in a sandbox", verb: "Make" },
  { n: "04", role: "Auditor", title: "Second pass", detail: "Checks + evidence", verb: "Verify" },
];

/**
 * Hero card: one example job moving through four specialists. It loops on a
 * timer so the page shows the handoff instead of describing it. Example only.
 */
export function ExecutionCard() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setStep((s) => (s + 1) % (STEPS.length + 2)), 1500);
    return () => window.clearInterval(t);
  }, []);
  const done = step >= STEPS.length;

  return (
    <div className="glass relative w-full rounded-[28px] p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">Sample run</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.05em] text-mute">4 agents</p>
      </div>
      <div className="mt-6 flex gap-4 rounded-2xl border border-line-strong bg-void/40 px-5 py-4">
        <span className="pt-1 font-mono text-[9px] uppercase text-gold">Goal</span>
        <p className="text-[15px] leading-[1.45] text-bone">Take a meal-kit idea to launch in a week: size the market, pick the angle, ship the page.</p>
      </div>

      <ol className="mt-7">
        {STEPS.map((s, i) => {
          const state = i < step ? "done" : i === step ? "live" : "wait";
          return (
            <li key={s.n} className="relative grid grid-cols-[34px_1fr] gap-4 pb-7 last:pb-0 sm:grid-cols-[34px_100px_1fr_auto]">
              {i < STEPS.length - 1 ? <span aria-hidden className={`absolute left-[16px] top-[34px] h-[calc(100%-34px)] w-px ${i < step ? "bg-lime" : "bg-line-strong"}`} /> : null}
              <span
                className={`grid size-[34px] place-items-center rounded-full border font-mono text-[10px] transition-colors duration-500 ${
                  state === "done" ? "border-lime bg-lime text-lime-ink" : state === "live" ? "border-lime text-lime shadow-[0_0_0_4px_rgb(148_219_23/0.12)]" : "border-line-strong text-mute"
                }`}
              >
                {state === "done" ? "✓" : s.n}
              </span>
              <span className="hidden pt-2.5 font-mono text-[10px] font-semibold uppercase text-bone sm:block">{s.role}</span>
              <span className="pt-1.5">
                <span className="block text-[14px] font-medium uppercase text-bone">
                  <span className="sm:hidden">{s.role} · </span>
                  {s.title}
                </span>
                <span className="block text-[12.5px] text-mute">{s.detail}</span>
              </span>
              <span className={`hidden pt-2.5 font-mono text-[9.5px] uppercase transition-colors sm:block ${state === "wait" ? "text-dim" : "text-gold"}`}>{s.verb}</span>
            </li>
          );
        })}
      </ol>

      <div
        className={`mt-7 flex items-center gap-3 rounded-2xl border px-5 py-4 font-mono text-[11px] transition-colors duration-500 sm:ml-[50px] ${
          done ? "border-lime/60 bg-lime/[0.07] text-bone" : "border-line bg-void/30 text-dim"
        }`}
      >
        <span className={done ? "text-lime" : ""}>{done ? "✓" : "…"}</span>
        <span className="min-w-0 truncate">Delivered / go-to-market.md + index.html</span>
      </div>
      <p className="mt-4 text-[12.5px] text-mute sm:ml-[50px]">A sample of how one goal travels through the swarm.</p>
    </div>
  );
}
