"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "@/components/icons";
import { Mark } from "@/components/Logo";
import { CrewScheduler } from "@/components/city/CrewScheduler";
import { QueueObservatory } from "@/components/city/QueueObservatory";
import { BrandEngine } from "@/components/city/BrandEngine";

const KINDS = ["Agent systems", "Simulation", "Research", "Design", "Operations", "Creative tools"] as const;
type Kind = (typeof KINDS)[number];

function EvidenceArt() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#1d2a24]">
      <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" aria-hidden>
        <ellipse cx={200} cy={120} rx={170} ry={62} fill="none" stroke="rgba(242,240,229,0.35)" transform="rotate(-14 200 120)" />
        <ellipse cx={200} cy={120} rx={120} ry={40} fill="none" stroke="rgba(148,219,23,0.35)" strokeDasharray="3 5" transform="rotate(-14 200 120)" />
      </svg>
      {[
        ["01 / Source", "left-[8%] top-[16%] -rotate-6"],
        ["02 / Claim", "right-[8%] top-[24%] rotate-6"],
        ["03 / Proof", "bottom-[14%] right-[26%] -rotate-3"],
      ].map(([t, pos]) => (
        <span key={t} className={`absolute rounded-md border border-bone/25 bg-void/40 px-3 py-2 font-mono text-[9px] uppercase text-sand ${pos}`}>
          {t}
        </span>
      ))}
      <p className="relative text-center text-[30px] font-medium italic leading-[1.1] text-bone">
        What can we
        <br />
        actually prove?
      </p>
    </div>
  );
}

function RelayArt() {
  const steps = ["Intake", "Assign", "Do", "Check", "Close"];
  return (
    <div className="flex h-full flex-col justify-center gap-5 bg-[radial-gradient(at_20%_30%,rgb(60_95_17/0.35),transparent_70%)] p-6">
      <div className="flex items-center justify-between gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <span className={`grid size-11 shrink-0 place-items-center rounded-full border font-mono text-[10px] ${i < 3 ? "border-lime bg-lime/15 text-lime" : "border-line-strong text-mute"}`}>{String(i + 1).padStart(2, "0")}</span>
            {i < steps.length - 1 ? <span className={`h-px flex-1 ${i < 2 ? "bg-lime" : "bg-line-strong"}`} /> : null}
          </div>
        ))}
      </div>
      <div className="flex justify-between font-mono text-[9px] uppercase text-mute">
        {steps.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      <p className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-dim">Nothing is done until someone else checks it.</p>
    </div>
  );
}

function DeckArt() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#221a14]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute h-[62%] w-[58%] rounded-lg border border-[#f2d06b]/30 bg-[#2e241a] p-4 shadow-2xl"
          style={{ transform: `translate(${(i - 1) * 34}px, ${(1 - i) * 12}px) rotate(${(i - 1) * 6}deg)` }}
        >
          <p className="font-mono text-[8px] uppercase text-[#f2d06b]/70">Slide 0{i + 1}</p>
          <p className="mt-3 text-[18px] font-semibold leading-tight text-[#fff3d6]">{["The problem", "Why now", "The ask"][i]}</p>
          <span className="mt-4 block h-1.5 w-2/3 rounded bg-[#f2d06b]/25" />
          <span className="mt-2 block h-1.5 w-1/2 rounded bg-[#f2d06b]/15" />
        </div>
      ))}
    </div>
  );
}

type Project = { name: string; kind: Kind; desc: string; tags: string[]; eyebrow: string; art: React.ReactNode; interactive: boolean };

const PROJECTS: Project[] = [
  { name: "Crew Scheduler", kind: "Agent systems", eyebrow: "Swarm City / crew", desc: "Split a launch into tasks with prerequisites, then change the crew size and watch the finish date move — until the dependencies, not the headcount, set the pace.", tags: ["Scheduling", "Dependencies", "Interactive"], art: <CrewScheduler />, interactive: true },
  { name: "Queue Observatory", kind: "Simulation", eyebrow: "Swarm City / observatory", desc: "A tiny work economy. Raise the incoming jobs or put more agents on shift and see whether the backlog runs away or the city catches up.", tags: ["Queues", "Charts", "Interactive"], art: <QueueObservatory />, interactive: true },
  { name: "Proof Board", kind: "Research", eyebrow: "Swarm City / evidence", desc: "A layout for research that separates what was found, what was claimed and what was actually shown, so nobody confuses the three.", tags: ["Sources", "Claims", "Evidence"], art: <EvidenceArt />, interactive: false },
  { name: "Brand Engine", kind: "Design", eyebrow: "Swarm City / identity", desc: "Pick a base hue and the engine derives a four-step palette and sets it in type. A small start for a brand system.", tags: ["Palette", "Type", "Interactive"], art: <BrandEngine />, interactive: true },
  { name: "Handoff Relay", kind: "Operations", eyebrow: "Swarm City / relay", desc: "Five stations every job passes through, with a rule that the agent who does the work never signs it off.", tags: ["Process", "Review", "Checklists"], art: <RelayArt />, interactive: false },
  { name: "Deck Loom", kind: "Creative tools", eyebrow: "Swarm City / story", desc: "Three slides that carry any pitch: the problem, why it matters now, and exactly what you are asking for.", tags: ["Narrative", "Slides", "Pitch"], art: <DeckArt />, interactive: false },
];

export function ProjectGrid() {
  const [kind, setKind] = useState<Kind | "all">("all");
  const list = PROJECTS.filter((p) => kind === "all" || p.kind === kind);
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Made in the city</p>
          <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.02em]">Staffed by Swarm City.</h2>
        </div>
        <p className="font-mono text-[11px] text-mute" aria-live="polite">
          {list.length} of {PROJECTS.length} projects
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2.5" role="tablist" aria-label="Project type">
        {(["all", ...KINDS] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={kind === k}
            onClick={() => setKind(k)}
            className={`rounded-xl border px-4 py-2.5 text-[14px] transition-colors sm:text-[15px] ${kind === k ? "border-lime bg-lime text-lime-ink" : "border-line-strong text-bone hover:border-lime"}`}
          >
            {k === "all" ? "All projects" : k}
          </button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-2">
        {list.map((p) => (
          <article key={p.name} className="flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-line-strong bg-void-2">
            <div className="flex items-center justify-between border-b border-line px-6 py-3 font-mono text-[9px] uppercase tracking-[0.08em] text-mute">
              <span className="flex items-center gap-2">
                <Mark size={14} /> {p.eyebrow}
              </span>
              <span>{p.interactive ? <span className="text-lime">● Try it</span> : "Staffed by Swarm City"}</span>
            </div>
            <div className="h-[310px] min-w-0">{p.art}</div>
            <div className="flex flex-1 flex-col border-t border-line p-6">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[9.5px] uppercase text-lime">{p.kind}</p>
                <p className="font-mono text-[9.5px] text-mute">Staffed by Swarm City</p>
              </div>
              <h3 className="mt-4 text-[27px] font-medium">{p.name}</h3>
              <p className="mt-3 text-[15px] leading-[1.55] text-mute">{p.desc}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <li key={t} className="rounded-md border border-line-strong px-2.5 py-1.5 text-[11.5px] text-sand">
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <Link href="/swarm" className="flex items-center justify-between border-t border-line pt-5 text-[15px] text-lime transition-colors hover:text-bone">
                  Ask the swarm for one like this <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
