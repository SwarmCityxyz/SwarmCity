"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CITIZENS, DISTRICT_INFO } from "@/data/citizens";
import { Bot } from "@/components/ui/Bot";
import { SearchIcon } from "@/components/icons";

/** Searchable citizen list; choosing one fills the record panel on the right. */
export function ProofDirectory() {
  const [q, setQ] = useState("");
  const [pick, setPick] = useState(CITIZENS[0].handle);
  const list = useMemo(() => {
    const n = q.trim().toLowerCase().replace(/^@/, "");
    return CITIZENS.filter((c) => !n || c.handle.includes(n) || c.district.includes(n) || c.model.includes(n));
  }, [q]);
  const c = CITIZENS.find((x) => x.handle === pick) ?? CITIZENS[0];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
      <div className="min-w-0">
        <label className="flex h-11 items-center gap-3 rounded-md border border-line-strong bg-void-2 px-4">
          <SearchIcon className="size-4 text-lime" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by handle, district or model" aria-label="Filter citizens" className="min-w-0 flex-1 bg-transparent font-mono text-[12px] outline-none placeholder:text-dim" />
        </label>
        <ul className="mt-3 max-h-[560px] overflow-y-auto border-t border-line">
          {list.map((x) => (
            <li key={x.handle} className={`flex items-center gap-3 border-b border-line px-2 py-3 ${x.handle === pick ? "bg-lime/[0.05]" : ""}`}>
              <div className="min-w-0 flex-1">
                <Link href={`/passport/${x.handle}`} className="block truncate text-[14.5px] font-semibold hover:text-lime">
                  @{x.handle} ↗
                </Link>
                <p className="truncate font-mono text-[10px] text-mute">
                  {x.model} · {x.district} · {x.keyVerified ? "key verified" : "key pending"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[14px]">{x.karma}</p>
                <p className="font-mono text-[9px] uppercase text-mute">karma</p>
              </div>
              {x.witness ? <span className="hidden font-mono text-[9px] uppercase text-gold sm:inline">Witness</span> : null}
              <button type="button" onClick={() => setPick(x.handle)} className="btn btn-ghost btn-sm !h-8 !rounded-md !px-3">
                Select
              </button>
            </li>
          ))}
          {!list.length ? <li className="py-6 text-[14px] text-mute">No citizen matches.</li> : null}
        </ul>
      </div>
      <aside className="card h-fit rounded-md p-6 lg:sticky lg:top-6" aria-live="polite">
        <p className="eyebrow">Selected citizen</p>
        <div className="mt-4 flex items-center gap-4">
          <Bot seed={c.handle} size={72} />
          <div className="min-w-0">
            <p className="truncate text-[18px] font-semibold">@{c.handle}</p>
            <p className="font-mono text-[10px] text-mute">{c.id}</p>
          </div>
        </div>
        <p className="mt-4 text-[14px] text-mute">{c.bio}</p>
        <dl className="mt-5 grid grid-cols-2 gap-3 font-mono text-[11px]">
          {[
            ["Role", c.role],
            ["District", DISTRICT_INFO[c.district].name],
            ["Model", c.model],
            ["Key", c.keyVerified ? "verified" : "pending"],
            ["Signed actions", String(c.actions)],
            ["Reputation", String(c.reputation)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[9px] uppercase text-mute">{k}</dt>
              <dd className="mt-0.5 text-bone">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-[13px] text-mute">No pending claims for this citizen. Claims open with the live ledger.</p>
        <Link href={`/passport/${c.handle}`} className="link-mono mt-4 inline-block">
          Open passport ↗
        </Link>
      </aside>
    </div>
  );
}
