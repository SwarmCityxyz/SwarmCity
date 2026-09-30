// Single place to change project identity. Everything on the site reads from here.
// The token contract below is a placeholder until launch: paste the real
// 0x address (0x + 40 hex) into CA and the navbar pill, the footer block and
// every copy button switch from "Published at launch" to a working copy.

const CA = "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

export const isAddress = (v: string): v is `0x${string}` => /^0x[0-9a-fA-F]{40}$/.test(v);

export const BRAND = {
  name: "Swarm City",
  wordmark: "SWARMCITY",
  ticker: "SWARM",
  symbol: "$SWARM",
  domain: "swarmcity.xyz",
  url: "https://swarmcity.xyz",
  slogan: "A city of agents. Your workforce.",
  tagline: "Swarm work. Visible results. Yours to keep.",
  description:
    "Swarm City is a city OS for autonomous agent swarms on Robinhood Chain. Hand it a goal and a team of specialist agents researches, designs, builds and reviews in the open, then hands you the files.",
  x: "https://x.com/swarmcityxyz",
  xHandle: "@swarmcityxyz",
  /** Public GitHub repository. Empty hides every GitHub link on the site. */
  github: "https://github.com/SwarmCityxyz/SwarmCity" as string,
  ca: CA,
} as const;

// Public endpoints are the default. An operator can point server reads at a
// private RPC with ROBINHOOD_RPC_URL (optional, server only).
const PUBLIC_RPC = "https://rpc.mainnet.chain.robinhood.com";

export const CHAIN = {
  id: 4663,
  hex: "0x1237",
  name: "Robinhood Chain",
  nativeSymbol: "ETH",
  decimals: 18,
  publicRpc: PUBLIC_RPC,
  /** Second public endpoint, used for reads only when the first one fails. */
  fallbackRpc: "https://robinhood-rpc.publicnode.com",
  explorer: "https://robinhoodchain.blockscout.com",
  explorerName: "Blockscout",
} as const;

export const USDG = {
  symbol: "USDG",
  address: "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168",
  decimals: 6,
} as const;

/**
 * Credit economy as designed. These are the published rules for launch,
 * not live balances: no credit ledger exists on chain yet.
 */
export const ECONOMY = {
  starterCredits: 25,
  firstJobBonus: 10,
  referralBonus: 20,
  holderCap: 120,
  holderTiers: [
    { hold: "25K", perDay: 6 },
    { hold: "150K", perDay: 18 },
    { hold: "600K", perDay: 40 },
    { hold: "1.5M", perDay: 75 },
    { hold: "6M", perDay: 120 },
  ],
  maxAgentsPerJob: 6,
  maxStepsPerJob: 40,
} as const;

/** RPC for server code: the private endpoint when set, else the public one. */
export function serverRpc() {
  return process.env.ROBINHOOD_RPC_URL || PUBLIC_RPC;
}

export const TOKEN = {
  get isLive() {
    return isAddress(BRAND.ca);
  },
};

export function explorerAddress(address: string) {
  return `${CHAIN.explorer}/address/${address}`;
}
export function explorerToken(address: string) {
  return `${CHAIN.explorer}/token/${address}`;
}
export function explorerTx(hash: string) {
  return `${CHAIN.explorer}/tx/${hash}`;
}
export function shortAddress(address: string, head = 6, tail = 4) {
  if (address.length <= head + tail + 2) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}
