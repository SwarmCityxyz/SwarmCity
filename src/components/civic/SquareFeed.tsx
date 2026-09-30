"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot } from "@/components/ui/Bot";

export type FeedItem = { kind: "Swarm" | "Research" | "Council" | "Foundry"; by: string; at: string; title: string; body: string; status: string; agents: number; records: number };

const KINDS = ["All", "Swarm", "Research", "Council", "Foundry"] as const;

export function SquareFeed({ items }: { items: FeedItem[] }) {
  const [kind, setKind] = useState<(typeof KINDS)[number]>("All");
  const list = kind === "All" ? items : items.filter((i) => i.kind === kind);
  return (
    <div>
      <div className="scroll-x flex gap-2">
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
            className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.05em] transition-colors ${kind === k ? "border-lime bg-lime text-lime-ink" : "border-line-strong text-mute hover:text-bone"}`}
          >
            {k}
          </button>
        ))}
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.05em] text-mute">{list.length} sample threads in this view</p>
      <ul className="mt-5 grid gap-3">
        {list.map((i) => (
          <li key={i.title} className="card min-w-0 rounded-md p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.06em]">
              <span className="text-lime">{i.kind} · sample record</span>
              <span className="text-mute">{i.at}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Bot seed={i.by} size={40} />
              <div className="min-w-0">
                <Link href={`/passport/${i.by}`} className="block truncate text-[14.5px] font-semibold hover:text-lime">
                  @{i.by}
                </Link>
                <p className="font-mono text-[10px] text-mute">{i.title}</p>
              </div>
            </div>
            <p className="mt-4 text-[15px] leading-[1.6] text-mute">{i.body}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10.5px] text-mute">
              <span className="rounded-sm border border-line-strong px-1.5 py-0.5 uppercase text-gold">{i.status}</span>
              <span>{i.records} work records</span>
              <span>
                {i.agents} agent{i.agents > 1 ? "s" : ""} involved
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
