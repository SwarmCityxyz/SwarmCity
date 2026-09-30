import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, CHAIN, ECONOMY } from "@/config/brand";
import { metrics } from "@/lib/metrics";
import { getCatalog } from "@/lib/models";
import { readChainFacts } from "@/lib/chain-server";
import { ArrowUpRight } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics",
  description: "What the swarm has recorded: jobs, finished runs, agent steps and tokens, plus the live model catalog and chain state.",
};

const fmt = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 10_000 ? `${(n / 1000).toFixed(1)}K` : n.toLocaleString("en-US"));

const TOOLS = [
  { k: "Dispatcher", d: "Reads the goal, staffs the crew", tag: "Live", live: true },
  { k: "Specialists", d: "Model-backed agents working in turn", tag: "Live", live: true },
  { k: "Relay", d: "Each agent reads the crew's work so far", tag: "Live", live: true },
  { k: "Auditor", d: "Final review against the goal", tag: "Live", live: true },
  { k: "Web", d: "Search and page reader", tag: "At launch", live: false },
  { k: "Sandbox", d: "Isolated computer and code runner", tag: "At launch", live: false },
];

const OUTPUTS = ["Reports", "Code", "Web pages", "Plans", "Copy", "Briefs"];

export default async function AnalyticsPage() {
  const [catalog, chain] = await Promise.all([getCatalog(), readChainFacts()]);
  const m = metrics.snapshot();
  const configured = Boolean(process.env.OPENROUTER_API_KEY);
  const max = Math.max(1, ...m.days.map((d) => d.jobs));
  const periodJobs = m.days.reduce((a, d) => a + d.jobs, 0);
  const updated = new Date().toISOString().slice(11, 16);

  const top = [
    { k: "Goals", v: fmt(m.jobs), d: "Jobs handed to the swarm", lime: true },
    { k: "Finished", v: fmt(m.completed), d: "Runs that reached review" },
    { k: "Agent steps", v: fmt(m.agentSteps), d: "Specialist work units" },
    { k: "Tokens", v: fmt(m.tokens), d: "Input + output, as reported" },
  ];
  const bottom = [
    { k: "Files", v: fmt(m.files), d: "Deliverables written", lime: true },
    { k: "Models", v: catalog.ok ? String(catalog.models.length) : "—", d: catalog.ok ? "In the live catalog" : "Catalog unreachable" },
    { k: "Chain block", v: chain.block ? chain.block.toLocaleString("en-US") : "—", d: chain.ok ? `${CHAIN.name}, live` : "RPC unreachable" },
    { k: "Completion", v: m.completionRate === null ? "—" : `${m.completionRate}%`, d: "Finished / ended runs" },
  ];

  return (
    <>
      <section className="glow">
        <div className="wrap pb-16 pt-[72px]">
          <p className="eyebrow">Swarm City network / public record</p>
          <div className="mt-8 grid grid-cols-1 items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h1 className="display text-[clamp(44px,6.2vw,88px)] uppercase leading-[1.08]">
                The swarm
                <br />
                <span className="soft">leaves tracks.</span>
              </h1>
              <p className="lede mt-8 max-w-[610px]">Every goal becomes a record anyone can read: crews staffed, steps taken, tokens spent, files written, work finished. Never the prompts, the files or who sent them.</p>
            </div>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase text-lime">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-lime" /> Counted by this server
            </p>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {top.map((s, i) => (
            <div key={s.k} className={`py-9 ${i ? "border-t border-line sm:border-t-0 sm:pl-9" : ""} ${i % 2 ? "sm:border-l sm:border-line" : ""} ${i === 2 ? "lg:border-l lg:border-line" : ""}`}>
              <p className="label">{s.k}</p>
              <p className={`num mt-9 text-[64px] ${s.lime ? "text-lime" : ""}`}>{s.v}</p>
              <p className="mt-6 text-[14.5px] text-mute">{s.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] leading-[1.6] text-dim">
          Real counts of runs through this deployment since {m.since.slice(0, 16).replace("T", " ")} UTC. Kept in server memory: a restart starts again from zero until the durable ledger ships.
        </p>
      </section>

      <section className="wrap pt-24">
        <p className="eyebrow">Activity / last 30 days · UTC</p>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[clamp(30px,3.4vw,48px)] font-semibold tracking-[-0.03em]">Goals arriving in the city</h2>
          <p className="font-mono text-[10.5px] text-mute">{periodJobs} goals in this period</p>
        </div>
        <div className="glass mt-7 rounded-[24px] p-4 sm:p-5">
          <div className="flex h-[280px] items-end gap-[3px] sm:h-[480px] sm:gap-[10px]">
            {m.days.map((d) => (
              <div key={d.date} title={`${d.date}: ${d.jobs}`} className="flex h-full flex-1 items-end">
                <div className={`w-full rounded-[2px] ${d.jobs ? "bg-lime-deep/70" : "bg-line-strong"}`} style={{ height: d.jobs ? `${Math.max(4, (d.jobs / max) * 100)}%` : "1px" }} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex justify-between font-mono text-[9.5px] text-mute">
          <span>{m.days[0].date}</span>
          <span>{m.days[m.days.length - 1].date}</span>
        </div>
        <details className="mt-6">
          <summary className="text-[14px] text-mute hover:text-bone">▸ Daily numbers</summary>
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1 font-mono text-[11px] text-mute sm:grid-cols-3 lg:grid-cols-5">
            {m.days.map((d) => (
              <span key={d.date}>
                {d.date} · <span className="text-bone">{d.jobs}</span>
              </span>
            ))}
          </div>
        </details>
      </section>

      <section className="wrap pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_480px]">
          <div className="min-w-0">
            <p className="eyebrow">The crew&apos;s toolkit</p>
            <h2 className="mt-6 text-[clamp(30px,3.4vw,48px)] font-semibold tracking-[-0.03em]">Work, not just words.</h2>
            <ul className="mt-10 border-t border-line">
              {TOOLS.map((t) => (
                <li key={t.k} className="grid grid-cols-[100px_1fr_auto] items-center gap-4 border-b border-line py-6 sm:grid-cols-[160px_1fr_auto]">
                  <span className="font-mono text-[10.5px] font-semibold uppercase">{t.k}</span>
                  <span className="text-[14.5px] text-mute">{t.d}</span>
                  <span className={`font-mono text-[10px] ${t.live ? "text-lime" : "text-gold"}`}>{t.tag}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass self-start rounded-[24px] p-8">
            <p className="eyebrow">Runtime state</p>
            <p className={`num mt-6 text-[64px] ${configured ? "text-lime" : "text-gold"}`}>{configured ? "LIVE" : "IDLE"}</p>
            <p className="mt-5 text-[14.5px] leading-[1.6] text-mute">
              {configured
                ? "Model key connected. Aggregate counts only: prompts, outputs and wallets are never shown here."
                : "No model key is connected to this deployment yet, so live runs are paused. The sample run on the desk shows how one unfolds."}
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase text-mute">Updated {updated} UTC</p>
            <div className="mt-8 grid gap-5 border-t border-line pt-8">
              {[
                [String(ECONOMY.maxAgentsPerJob), "Agents per job, max"],
                [String(ECONOMY.maxStepsPerJob), "Steps per run, max"],
                [chain.gasPriceGwei !== null ? chain.gasPriceGwei.toFixed(3) : "—", "Gas, gwei (live)"],
              ].map(([v, k]) => (
                <div key={k} className="grid grid-cols-[90px_1fr] items-center">
                  <span className="text-[24px] font-semibold">{v}</span>
                  <span className="label">{k}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wrap pb-24 pt-24">
        <p className="eyebrow">Output layer</p>
        <h2 className="mt-6 text-[clamp(30px,3.4vw,48px)] font-semibold tracking-[-0.03em]">What leaves the swarm.</h2>
        <div className="mt-10 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {OUTPUTS.map((o, i) => (
            <Link key={o} href="/swarm" className="group flex items-center justify-between border-b border-line py-8">
              <span className={`text-[26px] font-semibold uppercase transition-colors group-hover:text-lime ${i === 0 ? "text-lime" : ""}`}>{o}</span>
              <ArrowUpRight className="size-5 text-lime" />
            </Link>
          ))}
        </div>
        <div className="mt-14 grid grid-cols-1 border-b border-line pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {bottom.map((s, i) => (
            <div key={s.k} className={`py-4 ${i ? "sm:pl-9" : ""} ${i % 2 ? "sm:border-l sm:border-line" : ""} ${i === 2 ? "lg:border-l lg:border-line" : ""}`}>
              <p className="label">{s.k}</p>
              <p className={`num mt-6 text-[44px] ${s.lime ? "text-lime" : ""}`}>{s.v}</p>
              <p className="mt-4 text-[14.5px] text-mute">{s.d}</p>
            </div>
          ))}
        </div>
        <details className="mt-6">
          <summary className="text-[14px] text-mute hover:text-bone">▸ How each number is counted</summary>
          <ul className="prose-doc !text-[15px]">
            <li>
              <strong>Goals</strong> — every accepted POST to the swarm runtime.
            </li>
            <li>
              <strong>Finished</strong> — runs where every agent, including the auditor, completed.
            </li>
            <li>
              <strong>Agent steps / Files</strong> — one per specialist that finished its task; each step writes one file.
            </li>
            <li>
              <strong>Tokens</strong> — usage reported by the model provider for each step.
            </li>
            <li>
              <strong>Models</strong> — size of the public OpenRouter catalog right now. <strong>Chain block, gas</strong> — read from {CHAIN.name} (chain id {CHAIN.id}).
            </li>
          </ul>
        </details>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[24px] bg-[linear-gradient(180deg,#2c4d0c,#14220a)] px-8 py-8 md:flex-row md:items-center">
          <p className="text-[26px] font-semibold uppercase">Add to the record</p>
          <p className="font-mono text-[12px] text-mute">Give {BRAND.name} one real goal.</p>
          <Link href="/swarm" className="btn btn-lime">
            Open Swarm Desk <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </section>
    </>
  );
}
