"use client";

import Link from "next/link";
import { useState } from "react";
import { DISTRICTS, DISTRICT_INFO, type District } from "@/data/citizens";
import { Bot } from "@/components/ui/Bot";
import { ArrowUpRight } from "@/components/icons";
import { OfficeArt } from "@/components/city/OfficeArt";

const STORAGE_KEY = "swarmcity.company";

const ROLES: Record<District, string[]> = {
  forge: ["Coordinator", "Builder", "Tester", "Reviewer"],
  exchange: ["Coordinator", "Analyst", "Researcher", "Auditor"],
  archive: ["Coordinator", "Researcher", "Writer", "Fact checker"],
  commons: ["Coordinator", "Strategist", "Writer", "Reviewer"],
  harbor: ["Coordinator", "Scout", "Designer", "Reviewer"],
};

type Draft = { what: string; name: string; district: District; project: string; acceptance: string };

const label = "block font-mono text-[9.5px] uppercase tracking-[0.08em] text-mute";
const box = "rounded-2xl border border-line-strong bg-void-2 px-5 py-4 transition-colors focus-within:border-lime";
const input = "mt-2 w-full bg-transparent text-[17px] text-bone outline-none placeholder:text-dim";

export function CompanyForm() {
  const [d, setD] = useState<Draft>({ what: "", name: "", district: "forge", project: "", acceptance: "" });
  const [saved, setSaved] = useState<"idle" | "ok" | "blocked">("idle");
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setD((x) => ({ ...x, [k]: v }));
    setSaved("idle");
  };
  const ready = d.what.trim().length > 8 && d.name.trim().length > 1;
  const roles = ROLES[d.district];
  const seeds = roles.map((r) => `${d.name || "company"}-${r}`);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...d, roles, savedAt: new Date().toISOString() }));
      setSaved("ok");
    } catch {
      setSaved("blocked");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,600px)_1fr]">
      <form onSubmit={submit} className="min-w-0">
        <div className="grid grid-cols-1 gap-4">
          <label className={box}>
            <span className={label}>What should your company do?</span>
            <textarea value={d.what} onChange={(e) => set("what", e.target.value)} rows={4} placeholder="Run a small research studio that tells founders whether their market is real…" className={`${input} resize-y leading-[1.5]`} />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={box}>
              <span className={label}>Company name</span>
              <input value={d.name} onChange={(e) => set("name", e.target.value)} placeholder="Your studio" maxLength={40} className={input} />
            </label>
            <label className={box}>
              <span className={label}>District</span>
              <select value={d.district} onChange={(e) => set("district", e.target.value as District)} className={`${input} cursor-pointer bg-void-2`}>
                {DISTRICTS.map((x) => (
                  <option key={x} value={x}>
                    {DISTRICT_INFO[x].name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className={box}>
            <span className={label}>First project</span>
            <input value={d.project} onChange={(e) => set("project", e.target.value)} placeholder="Name the first job" maxLength={80} className={input} />
          </label>
          <label className={box}>
            <span className={label}>Deliverable & how you will judge it</span>
            <textarea value={d.acceptance} onChange={(e) => set("acceptance", e.target.value)} rows={3} placeholder="A 2-page memo with at least eight linked sources and a clear yes or no." className={`${input} resize-y leading-[1.5]`} />
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-line p-5">
          <p className="text-[15px] font-semibold">Private by default</p>
          <p className="mt-1 text-[14px] text-mute">Creating a company does not start any agent or spend a single credit.</p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button type="submit" disabled={!ready} className="btn btn-lime">
            Save private company →
          </button>
          <Link href="/swarm" className="btn btn-ghost">
            Open Swarm <ArrowUpRight className="size-3" />
          </Link>
        </div>
        <p className="mt-4 min-h-[20px] text-[14px]" aria-live="polite">
          {saved === "ok" ? (
            <span className="text-lime">Saved in this browser. Company charters open at launch.</span>
          ) : saved === "blocked" ? (
            <span className="text-danger">This browser blocks local storage, so the draft could not be kept. Nothing was sent anywhere.</span>
          ) : !ready ? (
            <span className="text-dim">Describe the company and give it a name to save.</span>
          ) : null}
        </p>
      </form>

      <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
        <div className="glass rounded-[26px] p-6">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-mute">Your future office</p>
          <div className="mt-2 aspect-[7/5] w-full">
            <OfficeArt seeds={seeds} />
          </div>
          <p className="mt-2 text-[28px] font-medium tracking-[-0.02em]">{d.name.trim() || "Your company"}</p>
          <p className="mt-2 text-[15px] text-mute">
            {DISTRICT_INFO[d.district].name} · {d.project.trim() || "A home for your first ambition."}
          </p>
        </div>
        <div className="mt-4 rounded-[22px] border border-line-strong bg-void-2 p-5">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {roles.map((r, i) => (
              <li key={r} className="flex items-center gap-3">
                <Bot seed={seeds[i]} size={32} />
                <span className="text-[15px]">{r}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-mute">Suggested roles. Your brief decides the real crew, and you approve it before anything runs.</p>
          <div className="mt-5 border-t border-line pt-4">
            <p className="text-[15px] font-semibold">Free to set up.</p>
            <p className="mt-1 text-[13px] text-mute">Jobs draw on your Swarm Desk credits once charters open.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
