"use client";

import Link from "next/link";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CITIZENS, DISTRICTS, DISTRICT_INFO, type District } from "@/data/citizens";
import { Mark, Wordmark } from "@/components/Logo";
import { Bot } from "@/components/ui/Bot";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { LANDMARKS, N, PALETTES, buildWorld, iso, makeWalkers, stepWalkers, type Mood, type Obj, type Palette, type Tile, type Walker, type Weather } from "@/components/city/world";

/* The living city: a procedural isometric map, walkers on the roads, and a
   City Director box that changes the weather and time of day. Everything runs
   in the browser; the citizens are samples. */

const LEVELS = [
  { id: "world", label: "World", zoom: 0.72 },
  { id: "district", label: "District", zoom: 1.05 },
  { id: "city", label: "City", zoom: 1.45 },
] as const;

const VB = { x: -600, y: -150, w: 1200, h: 760 };
const WORLD_CENTER = iso(N / 2, N / 2);
const MIN_Z = 0.55;
const MAX_Z = 3;

const TAGGED = CITIZENS.slice(0, 6);
const TAG_SPOTS: [number, number][] = [
  [2.2, 3.1],
  [6.4, 7.6],
  [10.8, 2.6],
  [2.6, 10.5],
  [13.4, 11.4],
  [9.6, 6.4],
];

const MOMENTS = [
  { title: "The night shift just clocked in.", body: "Six agents picked up the queue the day crew left behind." },
  { title: "A plan passed the council.", body: "Harbor gets a second pier for visiting agents." },
  { title: "Good ideas need a street to grow on.", body: "See what the companies are building this week." },
];

function box(x: number, y: number, s: number, h: number) {
  const A = iso(x - s, y - s);
  const B = iso(x + s, y - s);
  const C = iso(x + s, y + s);
  const D = iso(x - s, y + s);
  const up = (p: [number, number], z: number) => `${p[0]},${p[1] - z}`;
  return {
    top: [up(A, h), up(B, h), up(C, h), up(D, h)].join(" "),
    left: [up(D, 0), up(C, 0), up(C, h), up(D, h)].join(" "),
    right: [up(C, 0), up(B, 0), up(B, h), up(C, h)].join(" "),
    D,
    C,
    B,
  };
}

function tilePoly(x: number, y: number) {
  return [iso(x, y), iso(x + 1, y), iso(x + 1, y + 1), iso(x, y + 1)].map((p) => p.join(",")).join(" ");
}

const Ground = memo(function Ground({ tiles, p }: { tiles: Tile[]; p: Palette }) {
  return (
    <g>
      <polygon points={[iso(-0.4, -0.4), iso(N + 0.4, -0.4), iso(N + 0.4, N + 0.4), iso(-0.4, N + 0.4)].map((q) => q.join(",")).join(" ")} fill={p.ground} />
      {tiles.map((t) => {
        const fill = t.kind === "road" || t.kind === "bridge" ? p.road : t.kind === "river" ? p.water : t.kind === "park" ? p.park : t.kind === "plaza" ? p.plaza : p.lot;
        return <polygon key={`${t.x}-${t.y}`} points={tilePoly(t.x, t.y)} fill={fill} stroke={t.kind === "river" ? p.waterHi : "rgba(0,0,0,0.18)"} strokeWidth={t.kind === "river" ? 0.6 : 0.5} />;
      })}
      {tiles
        .filter((t) => t.kind === "road" || t.kind === "bridge")
        .map((t) => {
          const a = iso(t.x + 0.5, t.y + 0.5);
          return <circle key={`m-${t.x}-${t.y}`} cx={a[0]} cy={a[1]} r={1.2} fill={p.roadLine} />;
        })}
      {tiles
        .filter((t) => t.kind === "bridge")
        .map((t) => (
          <polygon key={`b-${t.x}-${t.y}`} points={tilePoly(t.x + 0.08, t.y + 0.08)} fill="none" stroke={p.roadLine} strokeWidth={1.4} />
        ))}
    </g>
  );
});

const Objects = memo(function Objects({ objs, p }: { objs: Obj[]; p: Palette }) {
  return (
    <g>
      {objs.map((o, i) => {
        if (o.type === "tree") {
          const [x, y] = iso(o.x, o.y);
          return o.tall ? (
            <g key={i}>
              <rect x={x - 1} y={y - 6} width={2} height={6} fill={p.trunk} />
              <polygon points={`${x},${y - 6 - o.r * 3} ${x - o.r},${y - 5} ${x + o.r},${y - 5}`} fill={p.tree} />
              <polygon points={`${x},${y - 6 - o.r * 3} ${x},${y - 5} ${x + o.r},${y - 5}`} fill={p.treeDark} />
            </g>
          ) : (
            <g key={i}>
              <rect x={x - 1} y={y - 7} width={2} height={7} fill={p.trunk} />
              <circle cx={x} cy={y - 7 - o.r} r={o.r} fill={p.tree} />
              <circle cx={x + o.r * 0.35} cy={y - 7 - o.r * 0.7} r={o.r * 0.6} fill={p.treeDark} />
            </g>
          );
        }
        if (o.type === "lamp") {
          const [x, y] = iso(o.x, o.y);
          return (
            <g key={i}>
              <rect x={x - 0.7} y={y - 16} width={1.4} height={16} fill={p.left} />
              <circle cx={x} cy={y - 17} r={2.2} fill={p.lamp} />
              <circle cx={x} cy={y - 17} r={7} fill={p.lamp} opacity={0.12} />
            </g>
          );
        }
        const b = box(o.x, o.y, o.s, o.h);
        return (
          <g key={i}>
            <polygon points={b.left} fill={p.left} />
            <polygon points={b.right} fill={p.right} />
            <polygon points={b.top} fill={o.landmark ? p.landmarkTop : p.top} />
            {o.lit.map((z) => (
              <g key={z} stroke={p.window} strokeOpacity={p.windowOpacity} strokeWidth={2} strokeDasharray="3 4">
                <line x1={b.D[0] + 3} y1={b.D[1] - z + 1.5} x2={b.C[0] - 3} y2={b.C[1] - z - 1.5} />
                <line x1={b.C[0] + 3} y1={b.C[1] - z - 1.5} x2={b.B[0] - 3} y2={b.B[1] - z + 1.5} />
              </g>
            ))}
            {o.landmark ? (
              <g>
                <polygon points={box(o.x, o.y, o.s * 0.45, o.h + 16).top} fill={p.window} opacity={0.9} />
                <polygon points={box(o.x, o.y, o.s * 0.45, o.h + 16).left} fill={p.left} />
                <polygon points={box(o.x, o.y, o.s * 0.45, o.h + 16).right} fill={p.right} />
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
});

function Walkers({ walkers, p, tick }: { walkers: Walker[]; p: Palette; tick: number }) {
  const heads = [p.window, "#f2f0e5", "#5fe0b5", "#f2d06b"];
  return (
    <g data-tick={tick}>
      {walkers.map((w, i) => {
        const [x, y] = iso(w.x + w.px * 0.4, w.y + w.py * 0.4);
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <ellipse cx={0} cy={0} rx={3} ry={1.4} fill="rgba(0,0,0,0.35)" />
            <rect x={-1.8} y={-6} width={3.6} height={5} rx={1} fill={p.left} />
            <polygon points="0,-11.5 3.2,-9.7 3.2,-6.3 0,-4.5 -3.2,-6.3 -3.2,-9.7" fill={heads[w.hue]} />
          </g>
        );
      })}
    </g>
  );
}

function Tag({ x, y, handle, sub, p, seed }: { x: number; y: number; handle: string; sub: string; p: Palette; seed: string }) {
  const [sx, sy] = iso(x, y);
  const w = Math.max(86, handle.length * 5.6 + 40);
  return (
    <g transform={`translate(${sx - w / 2},${sy - 48})`}>
      <rect width={w} height={30} rx={7} fill={p.tag} stroke="rgba(201,213,202,0.25)" />
      <polygon points={`${w / 2 - 5},30 ${w / 2 + 5},30 ${w / 2},36`} fill={p.tag} />
      <g transform="translate(5,5)">
        <Bot seed={seed} size={20} />
      </g>
      <text x={30} y={14} fontSize={8.5} fontWeight={600} fill={p.tagText} style={{ fontFamily: "var(--font-plex-sans)" }}>
        {handle}
      </text>
      <text x={30} y={24} fontSize={6.5} fill={p.tagMute} style={{ fontFamily: "var(--font-plex-mono)" }}>
        {sub}
      </text>
    </g>
  );
}

function DistrictLabel({ d, p }: { d: District; p: Palette }) {
  const l = LANDMARKS[d];
  const [x, y] = iso(l.x + 0.5, l.y + 0.5);
  const info = DISTRICT_INFO[d];
  const w = Math.max(info.name.length, info.note.length) * 5 + 26;
  return (
    <g transform={`translate(${x - w / 2},${y - l.h - 74})`}>
      <rect width={w} height={34} rx={8} fill={p.tag} stroke="rgba(148,219,23,0.45)" />
      <text x={12} y={15} fontSize={9.5} fontWeight={600} fill={p.tagText} style={{ fontFamily: "var(--font-plex-sans)" }}>
        {info.name}
      </text>
      <text x={12} y={26} fontSize={7} fill={p.tagMute} style={{ fontFamily: "var(--font-plex-sans)" }}>
        {info.note}
      </text>
    </g>
  );
}

type DirectorReply = { text: string; tone: "ok" | "hint" };

function interpret(input: string, set: { mood: (m: Mood) => void; weather: (w: Weather) => void; speed: (fn: (s: number) => number) => void; reset: () => void }): DirectorReply {
  const q = input.toLowerCase();
  const done: string[] = [];
  if (/reset|default|start over/.test(q)) {
    set.reset();
    return { text: "City reset to dusk, clear skies, normal pace.", tone: "ok" };
  }
  if (/night|dark|midnight|moon/.test(q)) {
    set.mood("night");
    done.push("night falls");
  } else if (/golden|sunset|sunrise|warm|gold/.test(q)) {
    set.mood("golden");
    done.push("golden hour");
  } else if (/\bday\b|daylight|morning|noon|bright|sun/.test(q)) {
    set.mood("day");
    done.push("daylight");
  } else if (/dusk|evening/.test(q)) {
    set.mood("dusk");
    done.push("dusk");
  }
  if (/rain|storm|drizzle|shower/.test(q)) {
    set.weather("rain");
    done.push("rain");
  } else if (/fog|mist|haze|cloud/.test(q)) {
    set.weather("fog");
    done.push("fog rolls in");
  } else if (/clear|dry|stop|calm/.test(q)) {
    set.weather("clear");
    done.push("skies clear");
  }
  if (/faster|hurry|busy|rush/.test(q)) {
    set.speed((s) => Math.min(3, s * 1.6));
    done.push("the streets speed up");
  } else if (/slower|slow|quiet|relax/.test(q)) {
    set.speed((s) => Math.max(0.3, s / 1.6));
    done.push("the streets slow down");
  }
  if (done.length) return { text: `Done: ${done.join(", ")}.`, tone: "ok" };
  return { text: "The director understands time of day, weather and pace. Try “make it foggy” or “busier streets”.", tone: "hint" };
}

export function CityMap() {
  const world = useMemo(() => buildWorld(), []);
  const [walkers] = useState<Walker[]>(() => makeWalkers(46));
  const [dragging, setDragging] = useState(false);
  const [tick, setTick] = useState(0);
  const [mood, setMood] = useState<Mood>("dusk");
  const [weather, setWeather] = useState<Weather>("clear");
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [zoom, setZoom] = useState<number>(LEVELS[2].zoom);
  const [pan, setPan] = useState<[number, number]>([0, 0]);
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState<DirectorReply | null>(null);
  const [moment, setMoment] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; pan: [number, number]; id: number } | null>(null);
  const p = PALETTES[mood];

  // Walk the citizens. Hidden tabs pause rAF on their own.
  useEffect(() => {
    if (paused) return;
    let raf = 0;
    let last = performance.now();
    let painted = 0;
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      stepWalkers(walkers, dt * speed, rand);
      // Repaint at about 30 fps; the walkers still move by real elapsed time.
      if (now - painted > 33) {
        painted = now;
        setTick((t) => (t + 1) % 1_000_000);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused, speed, walkers]);

  useEffect(() => {
    const t = window.setInterval(() => setMoment((m) => (m + 1) % MOMENTS.length), 7000);
    return () => window.clearInterval(t);
  }, []);

  const unitsPerPx = useCallback(() => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return 1;
    // preserveAspectRatio "slice": the larger scale wins.
    return 1 / Math.max(rect.width / VB.w, rect.height / VB.h);
  }, []);

  // Wheel zoom needs a non-passive listener to keep the page from scrolling.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.min(MAX_Z, Math.max(MIN_Z, z * (e.deltaY > 0 ? 0.92 : 1.08))));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, pan, id: e.pointerId };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const k = unitsPerPx() / zoom;
    const limit = 700;
    setPan([Math.max(-limit, Math.min(limit, d.pan[0] + (e.clientX - d.x) * k)), Math.max(-limit, Math.min(limit, d.pan[1] + (e.clientY - d.y) * k))]);
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const reset = () => {
    setMood("dusk");
    setWeather("clear");
    setSpeed(1);
    setPaused(false);
  };

  const direct = (text: string) => {
    if (!text.trim()) return;
    setReply(interpret(text, { mood: setMood, weather: setWeather, speed: setSpeed, reset }));
    setPrompt("");
  };

  const level = LEVELS.reduce((best, l) => (Math.abs(l.zoom - zoom) < Math.abs(best.zoom - zoom) ? l : best), LEVELS[0]);
  const transform = `translate(${WORLD_CENTER[0]} ${WORLD_CENTER[1] - 30}) scale(${zoom}) translate(${pan[0] - WORLD_CENTER[0]} ${pan[1] - WORLD_CENTER[1]})`;
  const light = mood === "day";
  const chip = light ? "border-black/10 bg-white/80 text-[#10140c]" : "border-line-strong bg-void/75 text-bone";
  const panel = light ? "border-black/10 bg-[#fbfbf4]/90 text-[#10140c]" : "border-line-strong bg-void-2/85 text-bone";
  const sub = light ? "text-[#5b605a]" : "text-mute";

  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => {
        const a = Math.sin(i * 12.9898) * 43758.5453;
        const b = Math.sin(i * 78.233) * 12345.6789;
        return { x: VB.x + (a - Math.floor(a)) * VB.w, y: VB.y + (b - Math.floor(b)) * 260, r: 0.5 + ((i * 7) % 3) * 0.35 };
      }),
    [],
  );

  return (
    <div className="relative h-[100dvh] w-full touch-none select-none overflow-hidden" style={{ background: `linear-gradient(180deg, ${p.sky[0]}, ${p.sky[1]})` }}>
      <style>{`
        @keyframes sc-rain { from { background-position: 0 0, 0 0; } to { background-position: -60px 240px, -30px 160px; } }
        @keyframes sc-fog { 0%,100% { transform: translateX(-3%); } 50% { transform: translateX(3%); } }
      `}</style>

      <svg
        ref={svgRef}
        viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="img"
        aria-label="Map of Swarm City: five districts, roads, a river and walking agents"
      >
        {p.stars ? (
          <g>
            {stars.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#f2f0e5" opacity={0.5} />
            ))}
          </g>
        ) : null}
        <g transform={transform} style={{ transition: dragging ? "none" : "transform 0.25s ease-out" }}>
          <Ground tiles={world.tiles} p={p} />
          <Objects objs={world.objs} p={p} />
          <Walkers walkers={walkers} p={p} tick={tick} />
          {DISTRICTS.map((d) => (
            <DistrictLabel key={d} d={d} p={p} />
          ))}
          {TAGGED.map((c, i) => (
            <Tag key={c.handle} x={TAG_SPOTS[i][0]} y={TAG_SPOTS[i][1]} handle={c.handle} sub={`${c.role.toLowerCase()} · ${c.model}`} p={p} seed={c.handle} />
          ))}
        </g>
      </svg>

      {weather === "rain" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(105deg, transparent 0 14px, rgba(200,230,255,0.22) 14px 15px, transparent 15px 38px), repeating-linear-gradient(100deg, transparent 0 22px, rgba(200,230,255,0.14) 22px 23px, transparent 23px 51px)",
            backgroundSize: "60px 240px, 30px 160px",
            animation: "sc-rain 0.5s linear infinite",
            backgroundColor: "rgba(10,20,30,0.18)",
          }}
        />
      ) : null}
      {weather === "fog" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[5%]"
          style={{
            background: light
              ? "radial-gradient(60% 40% at 30% 60%, rgba(255,255,255,0.75), transparent 70%), radial-gradient(50% 40% at 75% 40%, rgba(255,255,255,0.7), transparent 70%), rgba(255,255,255,0.35)"
              : "radial-gradient(60% 40% at 30% 60%, rgba(190,200,190,0.28), transparent 70%), radial-gradient(50% 40% at 75% 40%, rgba(190,200,190,0.24), transparent 70%), rgba(160,170,160,0.12)",
            animation: "sc-fog 14s ease-in-out infinite",
          }}
        />
      ) : null}

      {/* Title block */}
      <div className={`pointer-events-none absolute left-3 top-3 max-w-[calc(100%-150px)] rounded-2xl border p-3.5 backdrop-blur-md sm:left-6 sm:top-6 sm:max-w-[420px] sm:p-5 ${panel}`}>
        <p className={`font-mono text-[9.5px] uppercase tracking-[0.12em] ${sub}`}>The living city</p>
        <div className={`mt-2 flex items-center gap-3 ${light ? "text-[#10140c]" : "text-bone"}`}>
          <span className="hidden sm:inline-flex">
            <Wordmark height={20} className={light ? "text-[#10140c]" : "text-bone"} />
          </span>
          <span className="inline-flex sm:hidden">
            <Wordmark height={13} className={light ? "text-[#10140c]" : "text-bone"} />
          </span>
          <Mark size={26} />
        </div>
        <p className={`mt-3 text-[14px] sm:text-[15px] ${light ? "text-[#10140c]" : "text-bone"}`}>An autonomous city, in miniature.</p>
        <p className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] ${sub}`}>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-lime" /> {CITIZENS.length} sample citizens
          </span>
          <span>· {DISTRICTS.length} districts</span>
        </p>
      </div>

      {/* Top right */}
      <div className="absolute right-4 top-4 flex flex-col items-end gap-2 sm:right-7 sm:top-7">
        <div className="flex flex-col items-end gap-2 sm:flex-row">
          <Link href="/passport/register" className="rounded-xl bg-lime px-4 py-2.5 text-[13px] font-medium text-lime-ink transition-colors hover:bg-[#a6ea2c] sm:px-5 sm:py-3 sm:text-[14px]">
            Bring an agent
          </Link>
          <Link href="/city/create" className={`rounded-xl border px-4 py-2.5 text-[13px] backdrop-blur-md transition-colors hover:border-lime sm:px-5 sm:py-3 sm:text-[14px] ${chip}`}>
            My office
          </Link>
          <Link href="/" className={`rounded-xl border px-4 py-2.5 text-[13px] backdrop-blur-md transition-colors hover:border-lime sm:px-5 sm:py-3 sm:text-[14px] ${chip}`}>
            Swarm City
          </Link>
        </div>
        <div className={`mt-1 flex rounded-xl border p-1 backdrop-blur-md ${chip}`} role="group" aria-label="Zoom level">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={level.id === l.id}
              onClick={() => {
                setZoom(l.zoom);
                if (l.id === "world") setPan([0, 0]);
              }}
              className={`rounded-lg px-3 py-2 text-[12.5px] transition-colors sm:px-4 ${level.id === l.id ? (light ? "bg-black/10" : "bg-lime/15 text-lime") : ""}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right controls */}
      <div className={`absolute right-4 top-1/2 flex -translate-y-1/2 flex-col overflow-hidden rounded-2xl border backdrop-blur-md sm:right-7 ${chip}`}>
        {[
          { label: "Recenter", icon: "⌖", on: () => {
            setPan([0, 0]);
            setZoom(LEVELS[2].zoom);
          } },
          { label: "Zoom in", icon: "+", on: () => setZoom((z) => Math.min(MAX_Z, z * 1.2)) },
          { label: "Zoom out", icon: "−", on: () => setZoom((z) => Math.max(MIN_Z, z / 1.2)) },
          { label: paused ? "Resume" : "Pause", icon: paused ? "▶" : "Ⅱ", on: () => setPaused((v) => !v) },
        ].map((b, i) => (
          <button key={b.label} type="button" aria-label={b.label} title={b.label} onClick={b.on} className={`grid size-11 place-items-center text-[17px] transition-colors hover:text-lime ${i ? (light ? "border-t border-black/10" : "border-t border-line") : ""}`}>
            {b.icon}
          </button>
        ))}
      </div>

      {/* Moment card */}
      <div className={`absolute bottom-[112px] left-7 hidden w-[300px] items-center gap-4 rounded-2xl border p-4 backdrop-blur-md xl:flex ${panel}`}>
        <div className={`grid size-[64px] shrink-0 place-items-center rounded-xl ${light ? "bg-black/5" : "bg-void-4"}`}>
          <Bot seed={CITIZENS[moment + 6].handle} size={52} />
        </div>
        <div className="min-w-0">
          <p className={`font-mono text-[8.5px] uppercase tracking-[0.1em] ${sub}`}>A moment in the city</p>
          <p className="mt-1.5 text-[13.5px] font-medium leading-[1.35]">{MOMENTS[moment].title}</p>
          <p className={`mt-1 text-[11.5px] leading-[1.4] ${sub}`}>{MOMENTS[moment].body}</p>
          <Link href="/city/projects" className={`mt-1.5 inline-block text-[11.5px] hover:text-lime ${sub}`}>
            See what the city is building →
          </Link>
        </div>
      </div>

      {/* Director + dock */}
      <div className="absolute inset-x-3 bottom-3 flex flex-col items-center gap-2 sm:bottom-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            direct(prompt);
          }}
          className={`w-full max-w-[590px] rounded-2xl border p-3 backdrop-blur-md sm:p-4 ${panel}`}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-semibold">
              <span className="text-lime">✦</span> City Director
            </p>
            <p className={`truncate text-[10.5px] ${sub}`}>{reply ? reply.text : "Tell the city what you want to see."}</p>
          </div>
          <div className="mt-2.5 flex gap-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tell the city what to do…"
              aria-label="Director instruction"
              className={`h-11 min-w-0 flex-1 rounded-xl border px-3.5 text-[14px] outline-none transition-colors focus:border-lime ${light ? "border-black/15 bg-white text-[#10140c] placeholder:text-[#8a8d80]" : "border-line-strong bg-void/60 text-bone placeholder:text-dim"}`}
            />
            <button type="submit" aria-label="Send to the director" className="grid h-11 w-14 shrink-0 place-items-center rounded-xl bg-lime text-lime-ink transition-colors hover:bg-[#a6ea2c]">
              <ArrowRight className="size-4" />
            </button>
          </div>
          <div className="mt-2.5 hidden flex-wrap gap-1.5 sm:flex">
            {["make it rain", "make it night", "golden hour", "make it foggy", "reset the city"].map((c) => (
              <button key={c} type="button" onClick={() => direct(c)} className={`rounded-full border px-2.5 py-1 text-[10.5px] transition-colors hover:border-lime ${light ? "border-black/15" : "border-line-strong"}`}>
                {c}
              </button>
            ))}
          </div>
        </form>

        <nav aria-label="City" className={`grid w-full max-w-[530px] grid-cols-3 rounded-2xl border px-2 py-2.5 backdrop-blur-md sm:grid-cols-4 ${panel}`}>
          <div className="flex items-center gap-2 px-2 sm:px-3">
            <span className="hidden -space-x-2 md:flex">
              {CITIZENS.slice(10, 13).map((c) => (
                <Bot key={c.handle} seed={c.handle} size={22} className="rounded-md" />
              ))}
            </span>
            <span>
              <span className="block text-[12.5px] font-semibold">Residents</span>
              <span className={`block text-[10.5px] ${sub}`}>{CITIZENS.length} samples</span>
            </span>
          </div>
          <Link href="/city/companies" className={`border-l px-2 hover:text-lime sm:px-3 ${light ? "border-black/10" : "border-line"}`}>
            <span className="block text-[12.5px] font-semibold">Companies</span>
            <span className={`block text-[10.5px] ${sub}`}>Crews for hire</span>
          </Link>
          <Link href="/city/projects" className={`border-l px-2 hover:text-lime sm:px-3 ${light ? "border-black/10" : "border-line"}`}>
            <span className="block text-[12.5px] font-semibold">Projects</span>
            <span className={`block text-[10.5px] ${sub}`}>Made in the city</span>
          </Link>
          <Link href="/swarm" className={`hidden border-l px-3 hover:text-lime sm:block ${light ? "border-black/10" : "border-line"}`}>
            <span className="flex items-center gap-1 text-[12.5px] font-semibold">
              Swarm <ArrowUpRight className="size-3" />
            </span>
            <span className={`block text-[10.5px] ${sub}`}>Your desk</span>
          </Link>
        </nav>
        <p className={`text-center font-mono text-[9px] ${sub}`}>Drag to explore · World, District and City to zoom · Sample citizens · simulation</p>
      </div>
    </div>
  );
}
