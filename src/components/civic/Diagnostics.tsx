"use client";

import { useState } from "react";

/**
 * Recomputes the SHA-256 fingerprint of this citizen's public record in the
 * browser and compares it with the one the page was rendered with.
 */
export function Diagnostics({ record, digest }: { record: string; digest: string }) {
  const [out, setOut] = useState<string | null>(null);
  async function run() {
    try {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(record));
      const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
      setOut(hex === digest ? `Match · ${hex.slice(0, 16)}… recomputed in your browser.` : `Mismatch · got ${hex.slice(0, 16)}…`);
    } catch {
      setOut("This browser cannot compute SHA-256 here.");
    }
  }
  return (
    <div>
      <button type="button" onClick={run} className="btn btn-ghost btn-sm !rounded-md">
        Run diagnostics
      </button>
      {out ? <p className="mt-3 font-mono text-[11px] text-lime">{out}</p> : null}
    </div>
  );
}
