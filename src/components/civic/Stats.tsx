/** A row of stat cells: mono label, big figure, one-line note. */
export function Stats({ items, note, tone = "lime" }: { items: { k: string; v: string | number; d: string }[]; note?: string; tone?: "lime" | "gold" }) {
  const cols = items.length >= 5 ? "lg:grid-cols-5" : items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <div>
      <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${cols}`}>
        {items.map((s) => (
          <div key={s.k} className="card rounded-md px-4 py-4">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-mute">{s.k}</p>
            <p className={`num mt-3 text-[34px] ${tone === "gold" ? "text-gold" : "text-lime"}`}>{s.v}</p>
            <p className="mt-2 text-[12.5px] text-mute">{s.d}</p>
          </div>
        ))}
      </div>
      {note ? <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.05em] text-dim">{note}</p> : null}
    </div>
  );
}

/** Pill tag: OPEN / PASSED / SAMPLE and friends. */
export function Tag({ children, tone = "lime" }: { children: React.ReactNode; tone?: "lime" | "gold" | "danger" | "mute" }) {
  const c =
    tone === "lime" ? "border-lime/40 bg-lime/10 text-lime" : tone === "gold" ? "border-gold/40 bg-gold/10 text-gold" : tone === "danger" ? "border-danger/40 bg-danger-tint text-danger" : "border-line-strong text-mute";
  return <span className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.06em] ${c}`}>{children}</span>;
}

/** Numbered section heading used across civic pages. */
export function Numbered({ n, k, title, children }: { n: string; k: string; title: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow">
        {n} / {k}
      </p>
      <h2 className="mt-3 text-[clamp(26px,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.03em]">{title}</h2>
      {children ? <div className="mt-3 max-w-[680px] text-[15px] leading-[1.6] text-mute">{children}</div> : null}
    </div>
  );
}
