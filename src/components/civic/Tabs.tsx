"use client";

import { useState } from "react";

/** Simple client tabs: underline style, content switches without navigation. */
export function Tabs({ tabs }: { tabs: { id: string; label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  return (
    <div>
      <div role="tablist" className="scroll-x flex gap-2 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
            className={`shrink-0 border-b-2 px-4 pb-3 pt-2 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${active === t.id ? "border-lime text-bone" : "border-transparent text-mute hover:text-bone"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" hidden={active !== t.id} className="pt-8">
          {t.content}
        </div>
      ))}
    </div>
  );
}
