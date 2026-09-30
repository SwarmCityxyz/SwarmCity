/*
 * Procedural isometric city. Everything is generated from a fixed seed so the
 * map is identical on every visit and on the server. Units are tiles; `iso`
 * turns a tile position into SVG coordinates.
 */
import { DISTRICTS, type District } from "@/data/citizens";

export const N = 16;
export const TW = 64;
export const TH = 32;

export function iso(x: number, y: number): [number, number] {
  return [(x - y) * (TW / 2), (x + y) * (TH / 2)];
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ROAD_X = new Set([3, 8, 12]);
const ROAD_Y = new Set([4, 9, 13]);

export const isRoad = (x: number, y: number) => x >= 0 && y >= 0 && x < N && y < N && (ROAD_X.has(x) || ROAD_Y.has(y));
const isRiver = (x: number, y: number) => x - y === 6 || x - y === 7;

/** Landmark tile and label anchor for each district. */
export const LANDMARKS: Record<District, { x: number; y: number; h: number }> = {
  forge: { x: 1, y: 1, h: 78 },
  exchange: { x: 10, y: 1, h: 96 },
  commons: { x: 5, y: 6, h: 58 },
  archive: { x: 1, y: 11, h: 64 },
  harbor: { x: 14, y: 10, h: 46 },
};

export type Tile = {
  x: number;
  y: number;
  kind: "road" | "bridge" | "river" | "lot" | "park" | "plaza";
  district: District;
};

export type Obj =
  | { type: "building"; x: number; y: number; s: number; h: number; landmark?: District; lit: number[] }
  | { type: "tree"; x: number; y: number; r: number; tall: boolean }
  | { type: "lamp"; x: number; y: number };

function nearestDistrict(x: number, y: number): District {
  let best: District = "commons";
  let dist = Infinity;
  for (const d of DISTRICTS) {
    const l = LANDMARKS[d];
    const dd = (l.x - x) ** 2 + (l.y - y) ** 2;
    if (dd < dist) {
      dist = dd;
      best = d;
    }
  }
  return best;
}

export function buildWorld() {
  const r = rng(4663);
  const tiles: Tile[] = [];
  const objs: Obj[] = [];
  const landmarkAt = new Map<string, District>();
  for (const d of DISTRICTS) landmarkAt.set(`${LANDMARKS[d].x},${LANDMARKS[d].y}`, d);

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const district = nearestDistrict(x, y);
      const road = isRoad(x, y);
      const river = isRiver(x, y);
      const lm = landmarkAt.get(`${x},${y}`);
      let kind: Tile["kind"] = "lot";
      if (road && river) kind = "bridge";
      else if (road) kind = "road";
      else if (river) kind = "river";
      else if (lm === "commons") kind = "plaza";
      tiles.push({ x, y, kind, district });
      if (kind !== "lot" && kind !== "plaza") continue;

      const cx = x + 0.5;
      const cy = y + 0.5;
      if (lm) {
        objs.push({ type: "building", x: cx, y: cy, s: 0.44, h: LANDMARKS[lm].h, landmark: lm, lit: litRows(r, LANDMARKS[lm].h) });
        continue;
      }
      const roll = r();
      if (roll < 0.52) {
        const h = 14 + Math.floor(r() * (district === "exchange" ? 70 : 44));
        objs.push({ type: "building", x: cx, y: cy, s: 0.3 + r() * 0.1, h, lit: litRows(r, h) });
      } else if (roll < 0.86) {
        const count = 1 + Math.floor(r() * 3);
        for (let i = 0; i < count; i++) objs.push({ type: "tree", x: x + 0.2 + r() * 0.6, y: y + 0.2 + r() * 0.6, r: 5 + r() * 4, tall: r() > 0.55 });
        tiles[tiles.length - 1].kind = "park";
      } else {
        tiles[tiles.length - 1].kind = "park";
        if (r() > 0.5) objs.push({ type: "lamp", x: cx, y: cy });
      }
    }
  }
  objs.sort((a, b) => a.x + a.y - (b.x + b.y));
  return { tiles, objs };
}

function litRows(r: () => number, h: number) {
  const rows: number[] = [];
  for (let z = 8; z < h - 4; z += 7) if (r() > 0.28) rows.push(z);
  return rows;
}

/** Road tiles walkers can stand on. */
export function roadNeighbours(x: number, y: number) {
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ].filter(([a, b]) => isRoad(a, b));
}

export type Walker = { x: number; y: number; tx: number; ty: number; px: number; py: number; speed: number; hue: number };

export function makeWalkers(count: number): Walker[] {
  const r = rng(1237);
  const roads: [number, number][] = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (isRoad(x, y)) roads.push([x, y]);
  return Array.from({ length: count }, () => {
    const [x, y] = roads[Math.floor(r() * roads.length)];
    const next = roadNeighbours(x, y);
    const [tx, ty] = next[Math.floor(r() * next.length)];
    const off = () => (r() - 0.5) * 0.5;
    return { x: x + 0.5, y: y + 0.5, tx, ty, px: off(), py: off(), speed: 0.35 + r() * 0.45, hue: Math.floor(r() * 4) };
  });
}

/** Advances each walker toward its next road tile; picks a new one on arrival. */
export function stepWalkers(walkers: Walker[], dt: number, rand: () => number) {
  for (const w of walkers) {
    const gx = w.tx + 0.5;
    const gy = w.ty + 0.5;
    const dx = gx - w.x;
    const dy = gy - w.y;
    const d = Math.hypot(dx, dy);
    const step = w.speed * dt;
    if (d <= step) {
      w.x = gx;
      w.y = gy;
      const next = roadNeighbours(w.tx, w.ty);
      const [nx, ny] = next[Math.floor(rand() * next.length)];
      w.tx = nx;
      w.ty = ny;
    } else {
      w.x += (dx / d) * step;
      w.y += (dy / d) * step;
    }
  }
}

export type Mood = "dusk" | "night" | "golden" | "day";
export type Weather = "clear" | "rain" | "fog";

export type Palette = {
  sky: [string, string];
  ground: string;
  lot: string;
  park: string;
  plaza: string;
  road: string;
  roadLine: string;
  water: string;
  waterHi: string;
  top: string;
  left: string;
  right: string;
  landmarkTop: string;
  window: string;
  windowOpacity: number;
  tree: string;
  treeDark: string;
  trunk: string;
  lamp: string;
  tag: string;
  tagText: string;
  tagMute: string;
  stars: boolean;
};

export const PALETTES: Record<Mood, Palette> = {
  dusk: {
    sky: ["#0a0f0b", "#060807"],
    ground: "#0c110d",
    lot: "#121913",
    park: "#14230f",
    plaza: "#1b241a",
    road: "#1b211c",
    roadLine: "rgba(148,219,23,0.18)",
    water: "#0d2626",
    waterHi: "#1b3d39",
    top: "#2a332b",
    left: "#161c17",
    right: "#1f2720",
    landmarkTop: "#34422f",
    window: "#94db17",
    windowOpacity: 0.75,
    tree: "#2c4a1c",
    treeDark: "#1d3413",
    trunk: "#2b2419",
    lamp: "#c7f36b",
    tag: "rgba(14,17,15,0.9)",
    tagText: "#f2f0e5",
    tagMute: "#aaa799",
    stars: false,
  },
  night: {
    sky: ["#03050a", "#020303"],
    ground: "#070a09",
    lot: "#0b100d",
    park: "#0c170a",
    plaza: "#10160f",
    road: "#121712",
    roadLine: "rgba(148,219,23,0.26)",
    water: "#071619",
    waterHi: "#10292b",
    top: "#1b221c",
    left: "#0c100d",
    right: "#131914",
    landmarkTop: "#243020",
    window: "#b8f53c",
    windowOpacity: 1,
    tree: "#1b3212",
    treeDark: "#12220c",
    trunk: "#1c1811",
    lamp: "#e6ff9a",
    tag: "rgba(8,10,9,0.92)",
    tagText: "#f2f0e5",
    tagMute: "#8f8d80",
    stars: true,
  },
  golden: {
    sky: ["#3a2a12", "#140e07"],
    ground: "#2a2114",
    lot: "#3a2f1c",
    park: "#46511f",
    plaza: "#5a4a2a",
    road: "#4a3d27",
    roadLine: "rgba(255,214,120,0.35)",
    water: "#2f4a44",
    waterHi: "#5c7a62",
    top: "#b88f52",
    left: "#6b4f2c",
    right: "#8e6a3b",
    landmarkTop: "#d7ad63",
    window: "#ffd978",
    windowOpacity: 0.55,
    tree: "#6f8a2a",
    treeDark: "#4f6a1c",
    trunk: "#4b3520",
    lamp: "#ffe9a8",
    tag: "rgba(30,22,12,0.88)",
    tagText: "#fff3d6",
    tagMute: "#d8bf8f",
    stars: false,
  },
  day: {
    sky: ["#e9ecdc", "#dfe4cf"],
    ground: "#d9dcc6",
    lot: "#e6e6d3",
    park: "#b9d08a",
    plaza: "#efeadb",
    road: "#cfd0bb",
    roadLine: "rgba(95,148,16,0.35)",
    water: "#8fc0b8",
    waterHi: "#b7dcd3",
    top: "#f4f1e4",
    left: "#bdbca6",
    right: "#d7d5c2",
    landmarkTop: "#fffbee",
    window: "#5f9410",
    windowOpacity: 0.55,
    tree: "#7fae3c",
    treeDark: "#5d8a2a",
    trunk: "#7a6440",
    lamp: "#5f9410",
    tag: "rgba(255,255,250,0.94)",
    tagText: "#10140c",
    tagMute: "#5b605a",
    stars: false,
  },
};
