"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/config/nav";
import { Logo, Mark } from "@/components/Logo";
import { NavCaPill } from "@/components/CopyCa";
import { NavWallet } from "@/components/wallet/WalletButton";

/** Routes that draw their own full-screen chrome (the city map). */
const BARE = ["/city"];

export function SiteHeader() {
  const pathname = usePathname() || "/";
  if (BARE.includes(pathname)) return null;
  const active = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

  const links = NAV.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      aria-current={active(item.href) ? "page" : undefined}
      className={`font-mono text-[10px] font-medium uppercase tracking-[0.05em] transition-colors hover:text-lime ${active(item.href) ? "text-bone" : "text-mute"}`}
    >
      {item.label}
    </Link>
  ));

  return (
    <header className="relative z-40 border-b border-line bg-void/80 backdrop-blur-md">
      <div className="wrap">
        {/* Desktop: logo, centred pill nav, token + wallet. */}
        <div className="hidden h-[79px] grid-cols-[1fr_auto_1fr] items-center gap-7 lg:grid">
          <Link href="/" aria-label="Swarm City home" className="justify-self-start">
            <Logo />
          </Link>
          <nav aria-label="Main" className="glass flex h-[46px] items-center gap-[34px] rounded-full px-[34px]">
            {links}
          </nav>
          <div className="flex items-center gap-2.5 justify-self-end">
            <NavCaPill />
            <NavWallet />
          </div>
        </div>

        {/* Phones and tablets: logo and actions, then the pill nav on its own row. */}
        <div className="lg:hidden">
          <div className="flex h-[64px] items-center justify-between gap-2">
            <Link href="/" aria-label="Swarm City home" className="flex min-w-0 items-center">
              <span className="sm:hidden">
                <Mark size={30} />
              </span>
              <span className="hidden sm:inline-flex">
                <Logo size={30} wordmark={15} />
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <NavCaPill compact />
              <NavWallet compact />
            </div>
          </div>
          <nav aria-label="Main" className="glass mb-3 flex h-[42px] items-center justify-between gap-3 overflow-x-auto rounded-full px-5 sm:justify-center sm:gap-9">
            {links}
          </nav>
        </div>
      </div>
    </header>
  );
}
