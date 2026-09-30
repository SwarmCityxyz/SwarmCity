import { Mark } from "@/components/Logo";

/** Hero art for the passport hub: a hexagon-headed citizen and a tilted passport card. Drawn, not photographed. */
export function PassportArt() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px]">
      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="pa-glow" cx="50%" cy="35%" r="55%">
            <stop offset="0" stopColor="#94db17" stopOpacity="0.16" />
            <stop offset="1" stopColor="#94db17" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pa-shell" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a4038" />
            <stop offset="1" stopColor="#161a16" />
          </linearGradient>
          <linearGradient id="pa-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2b302a" />
            <stop offset="1" stopColor="#0b0e0c" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#pa-glow)" />
        {/* shoulders */}
        <path d="M60 500 C70 380 130 330 200 322 C270 330 330 380 340 500 Z" fill="url(#pa-body)" stroke="rgb(255 255 255 / 0.06)" />
        <path d="M150 360 L200 345 L250 360 L240 420 L200 440 L160 420 Z" fill="#1d221c" stroke="rgb(148 219 23 / 0.25)" />
        <path d="M195 380 L205 380 L205 410 L195 410 Z" fill="#94db17" opacity="0.6" />
        {/* neck */}
        <rect x="178" y="270" width="44" height="60" rx="8" fill="#141814" />
        <path d="M184 282 H216 M184 296 H216 M184 310 H216" stroke="rgb(255 255 255 / 0.08)" strokeWidth="3" />
        {/* hex head */}
        <path d="M200 70 L292 123 L292 229 L200 282 L108 229 L108 123 Z" fill="url(#pa-shell)" stroke="rgb(255 255 255 / 0.1)" strokeWidth="2" />
        <path d="M200 70 L292 123 L200 176 L108 123 Z" fill="rgb(255 255 255 / 0.04)" />
        {/* visor */}
        <rect x="128" y="160" width="144" height="46" rx="23" fill="#050605" stroke="rgb(148 219 23 / 0.35)" />
        <rect x="146" y="178" width="108" height="9" rx="4.5" fill="#94db17">
          <animate attributeName="opacity" values="1;0.55;1" dur="3.2s" repeatCount="indefinite" />
        </rect>
        <rect x="146" y="178" width="108" height="9" rx="4.5" fill="#94db17" opacity="0.35" filter="blur(6px)" />
        {/* ear pods */}
        <rect x="94" y="150" width="18" height="60" rx="9" fill="#232822" />
        <rect x="288" y="150" width="18" height="60" rx="9" fill="#232822" />
        <circle cx="200" cy="58" r="6" fill="#94db17" />
        <line x1="200" y1="64" x2="200" y2="76" stroke="#94db17" strokeWidth="3" />
      </svg>
      {/* passport card */}
      <div className="absolute bottom-[8%] left-0 w-[46%] min-w-[170px] -rotate-6 rounded-md border border-lime/40 bg-void-3/95 p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] sm:p-5">
        <div className="flex items-center gap-2">
          <Mark size={22} />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-bone">Swarm City</span>
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-lime">Citizen passport</p>
        <div className="mt-3 border-t border-line pt-3 font-mono text-[8.5px] uppercase leading-[1.9] tracking-[0.08em] text-mute">
          Identity · evidence
          <br />
          Participation
        </div>
      </div>
    </div>
  );
}
