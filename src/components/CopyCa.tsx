"use client";

import { useState } from "react";
import { BRAND, CHAIN, TOKEN, explorerToken, shortAddress } from "@/config/brand";
import { CheckIcon, CopyIcon, GithubIcon, XIcon } from "@/components/icons";

function useCopyCa() {
  const [copied, setCopied] = useState(false);
  const live = TOKEN.isLive;
  const copy = async () => {
    if (!live) return;
    try {
      await navigator.clipboard.writeText(BRAND.ca);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the address stays visible to select by hand.
    }
  };
  return { live, copied, copy };
}

/** Compact navbar pill: ticker plus a copy icon. Calm until the CA is published. */
export function NavCaPill({ compact = false }: { compact?: boolean }) {
  const { live, copied, copy } = useCopyCa();
  return (
    <button
      type="button"
      onClick={copy}
      data-copy-ca="nav"
      title={live ? `Copy ${BRAND.symbol} contract address` : `${BRAND.symbol} contract is published at launch`}
      aria-label={live ? `Copy ${BRAND.symbol} contract address` : `${BRAND.symbol} contract address, published at launch`}
      className={`flex shrink-0 items-center gap-2 rounded-full border border-line-strong bg-glass text-bone transition-colors hover:border-lime ${
        compact ? "h-9 px-3" : "h-11 px-4"
      } ${live ? "" : "cursor-default"}`}
    >
      <span className="font-mono text-[10.5px] font-semibold tracking-[0.04em] text-lime">{BRAND.symbol}</span>
      <span className="hidden font-mono text-[10px] uppercase tracking-[0.05em] text-mute 2xl:inline">{live ? shortAddress(BRAND.ca, 4, 4) : "CA at launch"}</span>
      {copied ? <CheckIcon className="size-3.5 text-lime" /> : <CopyIcon className={`size-3.5 ${live ? "" : "opacity-40"}`} />}
    </button>
  );
}

/** Token contract block for the footer. */
export function CaBlock() {
  const { live, copied, copy } = useCopyCa();
  return (
    <div className="w-full max-w-[420px]">
      <p className="label">
        {BRAND.symbol} contract · {CHAIN.name}
      </p>
      <div className="mt-3 flex items-center gap-2 rounded-full border border-line-strong bg-void-2 p-1.5 pl-4">
        <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-bone">{live ? shortAddress(BRAND.ca, 10, 8) : "Published at launch"}</span>
        <button
          type="button"
          onClick={copy}
          disabled={!live}
          data-copy-ca="footer"
          aria-label="Copy contract address"
          className="grid size-9 place-items-center rounded-full border border-line-strong text-bone transition-colors hover:border-lime disabled:opacity-40"
        >
          {copied ? <CheckIcon className="size-4 text-lime" /> : <CopyIcon className="size-4" />}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-5 text-[14px] text-mute">
        {live && (
          <a href={explorerToken(BRAND.ca)} target="_blank" rel="noreferrer" className="hover:text-bone">
            Explorer
          </a>
        )}
        <a href={BRAND.x} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-bone">
          <XIcon className="size-4" /> {BRAND.xHandle}
        </a>
        {BRAND.github && (
          <a href={BRAND.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-bone">
            <GithubIcon className="size-4" /> GitHub
          </a>
        )}
      </div>
    </div>
  );
}
