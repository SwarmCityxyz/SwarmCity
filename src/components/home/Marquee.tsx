const WORDS = ["Research", "Design", "Build", "Browser", "Sandbox", "Files", "Review", "Memory", "Many agents"];

export function Marquee() {
  const run = WORDS.map((w) => `${w} · `).join("");
  return (
    <div className="overflow-hidden bg-lime py-[27px] text-lime-ink" aria-label={WORDS.join(", ")}>
      <div className="flex w-max animate-marquee whitespace-nowrap font-mono text-[12px] font-semibold uppercase tracking-[0.08em]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="pr-2">
            {run.replace(/ · /g, "  ·  ")}
          </span>
        ))}
      </div>
    </div>
  );
}
