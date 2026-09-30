import Link from "next/link";
import { DOCS } from "@/components/docs/content";

const PRODUCT = [
  { href: "/", label: "Home" },
  { href: "/swarm", label: "Swarm Desk" },
  { href: "/passport", label: "Passport" },
  { href: "/city", label: "The city" },
];

/** Docs layout: grouped sidebar on desktop, a scrolling strip on phones. */
export function DocsShell({ current, children }: { current: string; children: React.ReactNode }) {
  const pages = [{ href: "/docs", label: "Docs home" }, ...DOCS.map((d) => ({ href: `/docs/${d.slug}`, label: d.title.replace(/\?$/, "") }))];
  const link = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      aria-current={current === href ? "page" : undefined}
      className={`block text-[14px] transition-colors hover:text-bone ${current === href ? "text-lime" : "text-mute"}`}
    >
      {label}
    </Link>
  );
  return (
    <div className="wrap grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden border-r border-line py-10 pr-8 lg:block">
        <div className="sticky top-8">
          <p className="label !text-dim">Documentation</p>
          <nav aria-label="Documentation" className="mt-5 grid gap-3.5">
            {pages.map((p) => link(p.href, p.label))}
          </nav>
          <p className="label mt-10 !text-dim">Product</p>
          <nav aria-label="Product" className="mt-5 grid gap-3.5">
            {PRODUCT.map((p) => link(p.href, p.label))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0">
        <nav aria-label="Documentation" className="scroll-x -mx-[var(--gutter)] flex gap-5 border-b border-line px-[var(--gutter)] py-3 lg:hidden">
          {pages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.05em] ${current === p.href ? "text-lime" : "text-mute"}`}
            >
              {p.label}
            </Link>
          ))}
        </nav>
        <div className="py-10 lg:py-14 lg:pl-14">{children}</div>
      </div>
    </div>
  );
}
