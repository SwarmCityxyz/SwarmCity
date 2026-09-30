import Link from "next/link";
import { BRAND, ECONOMY } from "@/config/brand";
import { getCatalog } from "@/lib/models";
import { ArrowUpRight } from "@/components/icons";
import { ExecutionCard } from "@/components/home/ExecutionCard";
import { Marquee } from "@/components/home/Marquee";
import { Showcase } from "@/components/home/Showcase";

export const revalidate = 3600;

const EARN = [
  { k: "01 / Begin", v: String(ECONOMY.starterCredits), t: "Starter credits", d: "Enough to hand the swarm its first real job today." },
  { k: "02 / Ship", v: `+${ECONOMY.firstJobBonus}`, t: "First finished job", d: "Finish one useful job and the city tops you up." },
  { k: "03 / Bring", v: `+${ECONOMY.referralBonus}`, t: "Active referral", d: "Paid once the person you invite runs a job of their own." },
  { k: "04 / Hold", v: String(ECONOMY.holderCap), t: "Up to / day", d: `Holding ${BRAND.symbol} in a verified wallet earns daily work credits.` },
];

const STEPS = [
  { n: "01", k: "Brief", t: "Say what finished looks like." },
  { n: "02", k: "Staff", t: "The swarm picks its specialists." },
  { n: "03", k: "Work", t: "Agents run tools in the open." },
  { n: "04", k: "Hand over", t: "Files and receipts land with you." },
];

const USES = [
  { k: "Launch", d: "Research, design, build and review a product in one run" },
  { k: "Research", d: "Market scans, competitor teardowns, sourced briefs" },
  { k: "Build", d: "Websites, apps, prototypes and small automations" },
  { k: "Content", d: "Editorial calendars, threads, launch copy" },
  { k: "Strategy", d: "Business plans, positioning, pricing" },
  { k: "Create", d: "Brand direction, identity sketches, design systems" },
  { k: "Review", d: "QA passes, fact checks, a second agent on every result" },
];

export default async function Home() {
  const catalog = await getCatalog();
  return (
    <>
      {/* Hero */}
      <section className="glow relative overflow-hidden">
        <span aria-hidden className="pointer-events-none absolute right-[-4vw] top-[80px] select-none whitespace-nowrap text-[clamp(120px,15vw,230px)] font-bold leading-none tracking-[-0.05em] text-lime/[0.05]">
          SWARM
        </span>
        <div className="wrap relative grid grid-cols-1 items-center gap-12 pb-[82px] pt-[60px] lg:grid-cols-[1fr_minmax(0,655px)] lg:pt-[76px]">
          <div className="min-w-0 animate-rise">
            <p className="eyebrow">Swarm City / {ECONOMY.starterCredits} starter credits</p>
            <h1 className="display mt-7 text-[clamp(42px,6.7vw,96px)] tracking-[-0.035em]">{BRAND.slogan}</h1>
            <p className="lede mt-8 max-w-[570px]">
              Give Swarm City a goal and it staffs a crew of specialist agents. They research, design, build, browse and check each other in the open, then hand you the finished files.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/swarm" className="btn btn-lime">
                Start with {ECONOMY.starterCredits} credits <ArrowUpRight className="size-3" />
              </Link>
            </div>
            <p className="mt-6 font-mono text-[9.5px] uppercase tracking-[0.05em] text-bone">
              Run a swarm · earn credits · hold {BRAND.symbol} · keep the city working
            </p>
            <a href="#how-it-works" className="mt-10 inline-block font-mono text-[9.5px] uppercase tracking-[0.05em] text-gold hover:text-lime">
              Scroll to watch a run ↓
            </a>
          </div>
          <div className="min-w-0 animate-rise [animation-delay:120ms]">
            <ExecutionCard />
          </div>
        </div>
      </section>

      <Marquee />

      {/* Manifesto */}
      <section className="wrap pb-[70px] pt-[100px]">
        <p className="eyebrow">The idea</p>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_520px]">
          <h2 className="h2 !text-[clamp(38px,4.7vw,68px)]">
            Not one assistant.
            <br />
            <span className="soft">A swarm you can watch.</span>
          </h2>
          <p className="lede lg:pt-4">The goal splits into tasks, the right agents step forward, tools switch on, the sandbox moves, files get written and the result arrives — all on screen, nothing hidden.</p>
        </div>
      </section>

      {/* Earn */}
      <section id="earn" className="wrap border-t border-line pb-[110px] pt-[80px]">
        <p className="eyebrow">Swarm City earn / work credits</p>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_590px]">
          <h2 className="h2">
            Start with credits.
            <br />
            <span className="soft">Earn more by working.</span>
          </h2>
          <div>
            <p className="lede">
              Every new workspace opens with {ECONOMY.starterCredits} credits. Finish real jobs, verify your wallet, bring people who actually build, or hold {BRAND.symbol} to keep the swarm running.
            </p>
            <Link href="/swarm" className="btn btn-lime mt-8">
              Open Swarm Desk <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 border-y border-line sm:grid-cols-2 lg:grid-cols-4">
          {EARN.map((e, i) => (
            <div key={e.k} className={`px-0 py-9 sm:px-7 ${i > 0 ? "border-t border-line sm:border-t-0" : ""} ${i % 2 ? "sm:border-l sm:border-line" : ""} ${i === 2 ? "lg:border-l lg:border-line" : ""} ${i >= 2 ? "sm:border-t lg:border-t-0" : ""}`}>
              <p className="label">{e.k}</p>
              <p className="num mt-8 text-[72px] text-lime">{e.v}</p>
              <p className="mt-6 font-mono text-[11px] font-semibold uppercase text-bone">{e.t}</p>
              <p className="mt-4 max-w-[260px] text-[15px] leading-[1.5] text-mute">{e.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-[1.35fr_1fr]">
          <div className="flex flex-col gap-6 border border-line p-6 sm:flex-row sm:items-center sm:p-7">
            <p className="label shrink-0 sm:w-[140px]">Daily holder credits</p>
            <div className="grid flex-1 grid-cols-3 gap-5 sm:grid-cols-5">
              {ECONOMY.holderTiers.map((t) => (
                <div key={t.hold}>
                  <p className="text-[17px] font-semibold">{t.hold}</p>
                  <p className="mt-1 font-mono text-[9.5px] text-mute">{t.perDay}/day</p>
                </div>
              ))}
            </div>
          </div>
          <Link href="/privacy" className="glass group block rounded-[22px] p-6 sm:p-7">
            <p className="eyebrow">Private by default</p>
            <p className="mt-4 text-[24px] font-semibold tracking-[-0.02em]">What you make stays yours.</p>
            <p className="mt-4 text-[14px] leading-[1.55] text-mute">No third-party trackers inside the Swarm Desk. Your prompts, files and outputs are never sold and never used to train models.</p>
            <p className="link-mono mt-5 group-hover:text-bone">Read the privacy promise ↗</p>
          </Link>
        </div>
        <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.05em] text-dim">Credit rules as designed for launch. No credit ledger is live yet.</p>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="wrap border-t border-line pb-[100px] pt-[72px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.n} className={`py-6 sm:pr-8 ${i ? "lg:border-l lg:border-line lg:pl-9" : ""} ${i % 2 ? "sm:border-l sm:border-line sm:pl-9" : ""}`}>
              <p className="num text-[88px] text-lime">{s.n}</p>
              <p className="label mt-7">{s.k}</p>
              <p className="mt-4 text-[18px] leading-[1.45]">{s.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section className="bg-[radial-gradient(at_45%_50%,rgb(60_95_17/0.14),transparent_70%)]">
        <div className="wrap pb-[110px] pt-[24px]">
          <p className="eyebrow">Swarm Desk / watch it happen</p>
          <h2 className="mt-7 text-[clamp(36px,4.3vw,62px)] font-semibold leading-[1.15] tracking-[-0.035em]">
            Your agents. Their work.
            <br />
            <span className="soft">One room with glass walls.</span>
          </h2>
          <p className="lede mt-8">Hand the swarm a job. Follow every agent, open every file, keep what they ship.</p>
          <div className="mt-10">
            <Showcase />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              ["01 / The crew", "See which agent holds which task."],
              ["02 / The relay", "Read every decision and handoff."],
              ["03 / The result", "Open the files. Check the receipts."],
            ].map(([k, t]) => (
              <div key={k}>
                <p className="eyebrow">{k}</p>
                <p className="mt-3 text-[18px] font-semibold">{t}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-[10px] text-mute">Illustrated example. The goal, agents and files above are a product sample.</p>
            <Link href="/swarm" className="link-mono">
              Try your own goal ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="wrap pb-[90px] pt-[40px]">
        <p className="eyebrow">What it takes on</p>
        <h2 className="mt-8 text-[clamp(34px,3.9vw,56px)] font-semibold leading-[1.15] tracking-[-0.035em]">One swarm. Every kind of work.</h2>
        <ul className="mt-12 border-t border-line">
          {USES.map((u, i) => (
            <li key={u.k}>
              <Link href="/swarm" className="group grid grid-cols-[40px_1fr_auto] items-center gap-4 border-b border-line py-7 sm:grid-cols-[104px_1fr_1.35fr_auto] sm:py-8">
                <span className="font-mono text-[11px] text-lime">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[24px] font-semibold uppercase transition-colors group-hover:text-lime sm:text-[30px]">{u.k}</span>
                <span className="col-span-3 col-start-2 row-start-2 text-[16px] text-mute sm:col-span-1 sm:col-start-auto sm:row-start-auto sm:text-[17px]">{u.d}</span>
                <ArrowUpRight className="col-start-3 row-start-1 size-5 text-lime transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:col-start-auto sm:row-start-auto" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Infrastructure */}
      <section className="wrap pb-[80px]">
        <p className="eyebrow">Under the city</p>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="flex items-center gap-8">
            <span className="num text-[88px] text-lime">{ECONOMY.maxAgentsPerJob}</span>
            <span className="label">Agents per job, max</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="num text-[88px]">{ECONOMY.maxStepsPerJob}</span>
            <span className="label">Steps per run, max</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="num text-[88px]">{catalog.ok ? catalog.models.length : "—"}</span>
            <span className="label">
              Models on call
              <br />
              <span className="text-lime">{catalog.ok ? "live catalog" : "catalog offline"}</span>
            </span>
          </div>
        </div>
        <Link href="/analytics" className="mt-10 inline-block font-mono text-[11px] text-lime hover:text-bone">
          See what the city has recorded ↗
        </Link>
      </section>
    </>
  );
}
