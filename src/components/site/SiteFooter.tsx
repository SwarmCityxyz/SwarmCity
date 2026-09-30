"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/config/brand";
import { FOOTER_LINKS, WIDER } from "@/config/nav";
import { Logo } from "@/components/Logo";
import { CaBlock } from "@/components/CopyCa";

export function SiteFooter() {
  const pathname = usePathname() || "/";
  if (pathname === "/city") return null;
  return (
    <footer className="border-t border-line">
      <div className="wrap py-12">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Link href="/" aria-label="Swarm City home">
            <Logo size={30} wordmark={15} />
          </Link>
          <Link href="/swarm" className="link-mono">
            Put the swarm to work →
          </Link>
        </div>

        <nav aria-label="Footer" className="mt-10 flex flex-wrap gap-x-5 gap-y-3">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="font-mono text-[9.5px] font-medium uppercase tracking-[0.05em] text-mute transition-colors hover:text-lime">
              {l.label}
            </Link>
          ))}
        </nav>

        <details className="group mt-8">
          <summary className="flex list-none items-center gap-2 text-[14px] text-mute transition-colors hover:text-bone [&::-webkit-details-marker]:hidden">
            <span className="text-[10px] transition-transform group-open:rotate-90">▶</span> The wider {BRAND.name}
          </summary>
          <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {WIDER.map((g) => (
              <div key={g.title}>
                <p className="label">{g.title}</p>
                <ul className="mt-3 grid gap-2">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[14px] text-mute hover:text-bone">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>

        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-line pt-10 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-[520px]">
            <p className="text-[22px] font-semibold tracking-[-0.02em]">{BRAND.slogan}</p>
            <p className="mt-2 text-[15px] text-mute">{BRAND.tagline}</p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.05em] text-dim">
              © {new Date().getFullYear()} {BRAND.name} · {BRAND.domain} · Not financial advice. {BRAND.symbol} is a utility token for product credits and governance.
            </p>
          </div>
          <CaBlock />
        </div>
      </div>
    </footer>
  );
}
