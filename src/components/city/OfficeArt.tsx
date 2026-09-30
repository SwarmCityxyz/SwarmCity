import { Bot } from "@/components/ui/Bot";

/* Isometric office drawn in SVG: a floor, a back wall with windows, desks
   and one agent per suggested role. */

const TW = 60;
const TH = 30;
const iso = (x: number, y: number, z = 0): [number, number] => [(x - y) * (TW / 2), (x + y) * (TH / 2) - z];
const pts = (...p: [number, number][]) => p.map((q) => q.join(",")).join(" ");

function Desk({ x, y }: { x: number; y: number }) {
  const h = 12;
  const s = 0.42;
  const A = iso(x - s, y - s, h);
  const B = iso(x + s, y - s, h);
  const C = iso(x + s, y + s, h);
  const D = iso(x - s, y + s, h);
  const scr = iso(x - 0.1, y - 0.25, h);
  return (
    <g>
      <polygon points={pts(D, C, iso(x + s, y + s, 0), iso(x - s, y + s, 0))} fill="#1a201b" />
      <polygon points={pts(C, B, iso(x + s, y - s, 0), iso(x + s, y + s, 0))} fill="#222a23" />
      <polygon points={pts(A, B, C, D)} fill="#2e382f" />
      <rect x={scr[0] - 10} y={scr[1] - 18} width={20} height={13} rx={1.5} fill="#0b0e0c" stroke="#94db17" strokeOpacity={0.6} />
      <line x1={scr[0] - 6} y1={scr[1] - 13} x2={scr[0] + 5} y2={scr[1] - 13} stroke="#94db17" strokeWidth={1.2} />
      <line x1={scr[0] - 6} y1={scr[1] - 9.5} x2={scr[0] + 2} y2={scr[1] - 9.5} stroke="#94db17" strokeOpacity={0.5} strokeWidth={1.2} />
    </g>
  );
}

export function OfficeArt({ seeds }: { seeds: string[] }) {
  const W = 6;
  const wallH = 70;
  const desks: [number, number][] = [
    [1.5, 1.6],
    [3.9, 1.6],
    [1.5, 4.1],
    [3.9, 4.1],
  ];
  return (
    <svg viewBox="-210 -90 420 300" className="h-full w-full" role="img" aria-label="Isometric sketch of your future office">
      <ellipse cx={0} cy={112} rx={200} ry={62} fill="rgba(148,219,23,0.05)" />
      {/* floor */}
      <polygon points={pts(iso(0, 0), iso(W, 0), iso(W, W), iso(0, W))} fill="#121813" stroke="rgba(201,213,202,0.18)" />
      {Array.from({ length: W - 1 }, (_, i) => (
        <g key={i} stroke="rgba(201,213,202,0.06)">
          <line x1={iso(i + 1, 0)[0]} y1={iso(i + 1, 0)[1]} x2={iso(i + 1, W)[0]} y2={iso(i + 1, W)[1]} />
          <line x1={iso(0, i + 1)[0]} y1={iso(0, i + 1)[1]} x2={iso(W, i + 1)[0]} y2={iso(W, i + 1)[1]} />
        </g>
      ))}
      {/* back walls */}
      <polygon points={pts(iso(0, 0), iso(W, 0), iso(W, 0, wallH), iso(0, 0, wallH))} fill="#1a211b" />
      <polygon points={pts(iso(0, 0), iso(0, W), iso(0, W, wallH), iso(0, 0, wallH))} fill="#141a15" />
      {[0.8, 2.2, 3.6].map((x) => (
        <polygon key={x} points={pts(iso(x, 0, 22), iso(x + 1.1, 0, 22), iso(x + 1.1, 0, 60), iso(x, 0, 60))} fill="rgba(148,219,23,0.12)" stroke="rgba(148,219,23,0.35)" />
      ))}
      <polygon points={pts(iso(0, 1.4, 30), iso(0, 3.4, 30), iso(0, 3.4, 56), iso(0, 1.4, 56))} fill="#0b0e0c" stroke="rgba(201,213,202,0.25)" />
      {[35, 41, 47].map((z) => (
        <line key={z} x1={iso(0, 1.7, z)[0]} y1={iso(0, 1.7, z)[1]} x2={iso(0, 3.0, z)[0]} y2={iso(0, 3.0, z)[1]} stroke="#94db17" strokeOpacity={0.55} strokeWidth={1.4} />
      ))}
      {/* plants */}
      {[
        [5.4, 5.3],
        [5.4, 3],
        [0.6, 5.4],
      ].map(([x, y]) => {
        const [px, py] = iso(x, y);
        return (
          <g key={`${x}${y}`}>
            <rect x={px - 4} y={py - 8} width={8} height={8} fill="#2a2419" />
            <circle cx={px} cy={py - 15} r={8} fill="#2c4a1c" />
            <circle cx={px + 3} cy={py - 13} r={5} fill="#1d3413" />
          </g>
        );
      })}
      {desks.map(([x, y], i) => (
        <g key={i}>
          <Desk x={x} y={y} />
          <g transform={`translate(${iso(x + 0.35, y + 0.75)[0] - 11},${iso(x + 0.35, y + 0.75)[1] - 26})`}>
            <Bot seed={seeds[i] ?? `seat-${i}`} size={22} />
          </g>
        </g>
      ))}
    </svg>
  );
}
