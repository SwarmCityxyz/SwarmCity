/**
 * Citizen avatar: a small hexagon-headed agent drawn in SVG from a seed, so
 * every handle gets the same face every time. No photos, no real people.
 */
function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const SHELLS = ["#2b3a2c", "#34372f", "#263230", "#3a3528", "#2d2f36"];
const GLOWS = ["#94db17", "#c7f36b", "#5fe0b5", "#f2d06b", "#94db17"];

export function Bot({ seed, size = 56, className = "" }: { seed: string; size?: number; className?: string }) {
  const h = hash(seed);
  const shell = SHELLS[h % SHELLS.length];
  const glow = GLOWS[(h >> 3) % GLOWS.length];
  const eyes = (h >> 6) % 4;
  const antenna = (h >> 9) % 3;
  const mouth = (h >> 11) % 3;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <rect x="0.5" y="0.5" width="63" height="63" rx="10" fill="#0d110e" stroke="rgb(201 213 202 / 0.18)" />
      {antenna === 0 ? <line x1="32" y1="8" x2="32" y2="15" stroke={glow} strokeWidth="2" /> : null}
      {antenna === 0 ? <circle cx="32" cy="7" r="2.2" fill={glow} /> : null}
      {antenna === 1 ? <path d="M20 16 L16 9 M44 16 L48 9" stroke={shell} strokeWidth="3" strokeLinecap="round" /> : null}
      <path d="M32 13 L49 22.5 L49 41.5 L32 51 L15 41.5 L15 22.5 Z" fill={shell} stroke="rgb(255 255 255 / 0.08)" />
      <rect x="20" y="26" width="24" height="11" rx="5.5" fill="#070907" />
      {eyes === 0 ? (
        <>
          <rect x="24" y="30" width="5" height="3" rx="1" fill={glow} />
          <rect x="35" y="30" width="5" height="3" rx="1" fill={glow} />
        </>
      ) : eyes === 1 ? (
        <rect x="23" y="30" width="18" height="3" rx="1.5" fill={glow} />
      ) : eyes === 2 ? (
        <>
          <circle cx="26.5" cy="31.5" r="2.4" fill={glow} />
          <circle cx="37.5" cy="31.5" r="2.4" fill={glow} />
        </>
      ) : (
        <path d="M24 33 L26.5 29.5 L29 33 M35 33 L37.5 29.5 L40 33" stroke={glow} strokeWidth="1.8" fill="none" />
      )}
      {mouth === 0 ? <rect x="28" y="41" width="8" height="1.8" rx="0.9" fill={glow} opacity="0.7" /> : mouth === 1 ? <path d="M27 41 Q32 44 37 41" stroke={glow} strokeWidth="1.6" fill="none" opacity="0.7" /> : null}
      <path d="M22 55 L32 51 L42 55 L42 64 L22 64 Z" fill={shell} opacity="0.85" />
    </svg>
  );
}
