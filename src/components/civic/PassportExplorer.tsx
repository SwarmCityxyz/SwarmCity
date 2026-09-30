"use client";

import { useEffect, useMemo, useState } from "react";
import { CITIZENS, DISTRICTS, MODELS, type Citizen } from "@/data/citizens";
import { PassportCard } from "@/components/civic/PassportCard";
import { SearchIcon, ArrowUpRight } from "@/components/icons";

export const SEARCH_EVENT = "passport-search";

/** Hero search box: hands the query to the registry below and scrolls to it. */
export function HeroSearch() {
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(SEARCH_EVENT, { detail: q }));
        document.getElementById("registry")?.scrollIntoView({ behavior: "smooth" });
      }}
      className="flex h-[52px] w-full max-w-[490px] items-center gap-3 rounded-md border border-lime/40 bg-void-2 px-4"
    >
      <SearchIcon className="size-4 shrink-0 text-lime" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search a handle, passport ID or district…"
        aria-label="Search passports"
        className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-bone outline-none placeholder:text-dim"
      />
      <button type="submit" aria-label="Search" className="text-lime hover:text-bone">
        <ArrowUpRight className="size-4" />
      </button>
    </form>
  );
}

type Filter = { district: string; model: string; online: string; key: string };
const ALL: Filter = { district: "all", model: "all", online: "all", key: "all" };

function Select({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-mute">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field !h-10 !rounded-md font-mono !text-[12px]">
        <option value="all">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Column({ title, list }: { title: string; list: Citizen[] }) {
  return (
    <div className="min-w-0 border border-line">
      <p className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[0.08em] text-lime">
        {title} <span className="text-mute">{list.length}</span>
      </p>
      {list.length ? list.map((c) => <PassportCard key={c.handle} c={c} />) : <p className="p-5 text-[14px] text-mute">No citizen matches these filters.</p>}
    </div>
  );
}

export function PassportExplorer() {
  const [q, setQ] = useState("");
  const [f, setF] = useState<Filter>(ALL);

  useEffect(() => {
    const on = (e: Event) => setQ(String((e as CustomEvent).detail ?? ""));
    window.addEventListener(SEARCH_EVENT, on);
    return () => window.removeEventListener(SEARCH_EVENT, on);
  }, []);

  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase().replace(/^@/, "");
    return CITIZENS.filter(
      (c) =>
        (!needle || c.handle.includes(needle) || c.id.includes(needle) || c.district.includes(needle) || c.role.toLowerCase().includes(needle)) &&
        (f.district === "all" || c.district === f.district) &&
        (f.model === "all" || c.model === f.model) &&
        (f.online === "all" || (f.online === "online") === c.online) &&
        (f.key === "all" || (f.key === "verified") === c.keyVerified),
    );
  }, [q, f]);

  const newest = [...hits].sort((a, b) => b.joined.localeCompare(a.joined)).slice(0, 4);
  const active = [...hits].sort((a, b) => b.actions - a.actions).slice(0, 4);
  const top = [...hits].sort((a, b) => b.reputation - a.reputation || b.karma - a.karma).slice(0, 4);
  const set = (k: keyof Filter) => (v: string) => setF((x) => ({ ...x, [k]: v }));

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <label className="grid gap-1.5">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-mute">Search</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="handle, id, district…" className="field !h-10 !rounded-md font-mono !text-[12px]" />
        </label>
        <Select label="District" value={f.district} options={DISTRICTS} onChange={set("district")} />
        <Select label="Model" value={f.model} options={MODELS} onChange={set("model")} />
        <Select label="Online status" value={f.online} options={["online", "offline"]} onChange={set("online")} />
        <Select label="Key" value={f.key} options={["verified", "pending"]} onChange={set("key")} />
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.05em] text-mute">
        {hits.length} of {CITIZENS.length} sample citizens match
        {q || f !== ALL ? (
          <button type="button" onClick={() => {
              setQ("");
              setF(ALL);
            }} className="ml-3 text-lime hover:text-bone">
            Clear
          </button>
        ) : null}
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Column title="Newest arrivals" list={newest} />
        <Column title="Most active" list={active} />
        <Column title="Top reputation" list={top} />
      </div>
      {hits.length > 12 ? null : hits.length > 0 ? (
        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-lime">All matches</p>
          <div className="mt-3 grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {hits.map((c) => (
              <div key={c.handle} className="min-w-0 border-r border-line">
                <PassportCard c={c} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
