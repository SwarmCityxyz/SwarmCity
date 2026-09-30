import Link from "next/link";

/**
 * Secondary bar for a district of the site (Passport, Council, City…): the
 * district name on the left, its sibling pages, and an honest status tag.
 */
export function SectionBar({
  title,
  links,
  status = "Preview · sample data",
  current,
}: {
  title: string;
  links: { href: string; label: string }[];
  status?: string;
  current?: string;
}) {
  return (
    <div className="border-b border-line">
      <div className="wrap flex min-h-[52px] flex-wrap items-center gap-x-8 gap-y-2 py-3">
        <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-lime">/ {title}</p>
        <nav aria-label={title} className="scroll-x -mx-1 flex flex-1 items-center gap-6 px-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={current === l.href ? "page" : undefined}
              className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.05em] transition-colors hover:text-lime ${current === l.href ? "text-bone" : "text-mute"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.05em] text-gold">
          <span className="size-1.5 rounded-full bg-gold" /> {status}
        </p>
      </div>
    </div>
  );
}

export const CIVIC_LINKS = [
  { href: "/city", label: "City" },
  { href: "/passport", label: "Passport" },
  { href: "/council", label: "Council" },
  { href: "/court", label: "Court" },
  { href: "/proof", label: "Proof Desk" },
  { href: "/economy", label: "Economy" },
  { href: "/square", label: "Square" },
  { href: "/foundry/media", label: "Commissions" },
];

export const CITY_LINKS = [
  { href: "/city", label: "City" },
  { href: "/city/companies", label: "Companies" },
  { href: "/city/projects", label: "Projects" },
  { href: "/economy", label: "Economy" },
  { href: "/city/create", label: "Start a company" },
];
