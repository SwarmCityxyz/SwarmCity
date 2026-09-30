"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot } from "@/components/ui/Bot";
import { ArrowUpRight } from "@/components/icons";
import { CATEGORIES, COMPANIES, type Category } from "@/components/city/companies";

export function CompanyGrid() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const q = query.trim().toLowerCase();
  const list = COMPANIES.filter(
    (c) =>
      (cat === "all" || c.category === cat) &&
      (!q || [c.name, c.promise, ...c.skills, ...c.roles.map((r) => r.role)].some((t) => t.toLowerCase().includes(q))),
  );

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a crew, role or skill" aria-label="Search crews" className="field !h-[50px] max-w-[450px] !rounded-xl" />

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Somewhere to begin</p>
          <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.02em]">Staffed by Swarm City.</h2>
        </div>
        <p className="font-mono text-[11px] text-mute" aria-live="polite">
          {list.length} of {COMPANIES.length} starter crews
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5" role="tablist" aria-label="Crew type">
        {(["all", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={`rounded-xl border px-4 py-2.5 text-[15px] transition-colors sm:px-5 sm:py-3 sm:text-[16px] ${cat === c ? "border-lime bg-lime text-lime-ink" : "border-line-strong text-bone hover:border-lime"}`}
          >
            {c === "all" ? "All crews" : c}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[12.5px] text-mute">Starter crews come with suggested roles and skill notes. Adopting one is free; you approve the plan and the credit budget before any agent starts.</p>

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => {
          const expanded = open === c.name;
          return (
            <article key={c.name} className="flex flex-col rounded-[22px] border border-line-strong bg-void-2 p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[9.5px] uppercase text-lime">{c.category}</p>
                <p className="font-mono text-[9.5px] text-mute">Staffed by Swarm City</p>
              </div>
              <div className="mt-6 flex gap-3">
                {c.roles.map((r) => (
                  <Bot key={r.role} seed={`${c.name}-${r.role}`} size={38} />
                ))}
              </div>
              <h3 className="mt-6 text-[25px] font-medium tracking-[-0.01em]">{c.name}</h3>
              <p className="mt-3 text-[15px] leading-[1.5] text-mute">{c.promise}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {c.skills.map((s) => (
                  <li key={s} className="rounded-md border border-line-strong px-2.5 py-1.5 text-[11.5px] text-sand">
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[11.5px] text-mute">Starter crew · 4 suggested roles</p>
              {expanded ? (
                <ul className="mt-4 grid gap-2.5 border-t border-line pt-4">
                  {c.roles.map((r) => (
                    <li key={r.role} className="flex items-start gap-3">
                      <Bot seed={`${c.name}-${r.role}`} size={28} className="shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-[14px] font-semibold">{r.role}</span>
                        <span className="block text-[13px] text-mute">{r.job}</span>
                      </span>
                    </li>
                  ))}
                  <li>
                    <Link href="/swarm" className="link-mono mt-2 inline-flex items-center gap-1.5">
                      Hand this crew a job <ArrowUpRight className="size-3" />
                    </Link>
                  </li>
                </ul>
              ) : null}
              <div className="mt-auto pt-5">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : c.name)}
                  className="flex w-full items-center gap-2 border-t border-line pt-5 text-[15px] font-semibold text-lime transition-colors hover:text-bone"
                >
                  {expanded ? "Hide the crew" : "Meet the crew"} <ArrowUpRight className={`size-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
                </button>
              </div>
            </article>
          );
        })}
        {list.length === 0 ? <p className="col-span-full py-16 text-center text-mute">No crew matches that. Try a skill such as “charts” or “copy”.</p> : null}
      </div>
    </div>
  );
}
