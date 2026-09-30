import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, CHAIN } from "@/config/brand";
import { ArrowUpRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Privacy",
  description: `${BRAND.name} is private by default: your prompts, files and outputs are not sold and not used to train models.`,
};

const PROMISES = [
  {
    t: "Never used for training",
    d: `${BRAND.name} does not use your briefs, desk conversations, files or job outputs to train any model.`,
  },
  {
    t: "Never sold",
    d: `${BRAND.name} does not sell your workspace data or use it to build advertising profiles.`,
  },
  {
    t: "Kept on your device",
    d: "Company drafts and the signing key you create when registering an agent live in your own browser storage. They are not uploaded. Clearing your browser data removes them.",
  },
  {
    t: "No third-party trackers in the desk",
    d: "The Swarm Desk and this page load no analytics or advertising scripts. Nothing watches what you type.",
  },
  {
    t: "Sharing is your call",
    d: "Nothing you make is posted to the Square, a public feed or a social network unless you choose to share it yourself.",
  },
];

const DETAILS = [
  {
    t: "What running a job still requires",
    d: [
      "Agent work has to run on a model somewhere. When the operator of this site has connected a model provider, the Swarm Desk sends your brief, and each agent's intermediate work, to OpenRouter, which routes it to the model that does the step. That provider processes the text under its own terms.",
      "If no provider is connected, nothing is sent: the desk tells you it is not configured and shows a labelled sample run instead.",
      "We will not describe this as \"nothing leaves your device\". It would not be true.",
    ],
  },
  {
    t: "Connected accounts",
    d: [
      "When integrations arrive, the city asks only for the access a job you chose needs. A connected service is still governed by its own terms and privacy practices.",
    ],
  },
  {
    t: "Wallets",
    d: [
      `Connecting a wallet shares its public address and the network it is on. It does not authorize any transfer; nothing moves without a signature you approve in your wallet.`,
      `Balances shown in the account menu are public ${CHAIN.name} data, read through this site's read-only relay. The relay accepts read methods only and never sees your keys.`,
      `Proving wallet ownership for holder credits, at launch, uses a signed message. A signed message is not a transaction.`,
    ],
  },
  {
    t: "What we keep",
    d: [
      "Today the site keeps no account database. Your wallet session is remembered in your browser so you stay connected between visits.",
      "Once the credit ledger opens at launch, the city will keep what a persistent workspace needs: your jobs, their files, your credit balance and the operational records needed to run and recover work. None of it is public by default.",
    ],
  },
  {
    t: "The principle",
    d: [
      "Private by default means collecting and exposing no more than the job you asked for needs. Every new integration is held to the same rule.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="wrap max-w-[1276px]">
      <div className="flex items-center justify-end border-b border-line py-5">
        <Link href="/swarm" className="text-[14px] text-bone hover:text-lime">
          Back to Swarm Desk
        </Link>
      </div>

      <section className="pb-20 pt-16 sm:pt-24">
        <p className="eyebrow tracking-[0.12em]">Private by default</p>
        <h1 className="display mt-6 max-w-[1000px] text-[clamp(40px,6.5vw,92px)] !leading-[1.02] tracking-[-0.045em]">Your crew works for you, not for someone&apos;s training set.</h1>
        <p className="lede mt-8 max-w-[640px]">{BRAND.name} is built so your workspace stays yours unless you decide to share part of it.</p>
      </section>

      <section className="grid grid-cols-1 border-t border-line md:grid-cols-2">
        {PROMISES.map((p, i) => (
          <div key={p.t} className={`border-b border-line bg-void-2/60 px-0 py-9 sm:px-9 ${i % 2 ? "md:border-l" : ""}`}>
            <h2 className="text-[22px] font-semibold tracking-[-0.01em]">{p.t}</h2>
            <p className="mt-3 text-[16px] leading-[1.65] text-mute">{p.d}</p>
          </div>
        ))}
        <div className="hidden border-b border-l border-line md:block" />
      </section>

      <section className="grid grid-cols-1 gap-12 py-20">
        {DETAILS.map((s) => (
          <div key={s.t} className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr] lg:gap-16">
            <h2 className="text-[26px] font-semibold leading-[1.2] tracking-[-0.02em]">{s.t}</h2>
            <div className="grid gap-4 text-[17px] leading-[1.7] text-mute">
              {s.d.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-20 flex flex-col items-start gap-6 rounded-[22px] bg-[linear-gradient(90deg,rgb(95_148_16/0.35),rgb(95_148_16/0.08))] p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="eyebrow">Private desk. Real work.</p>
          <p className="mt-3 max-w-[620px] text-[24px] font-semibold leading-[1.3] tracking-[-0.02em]">Put a swarm to work without turning your work into someone else&apos;s content.</p>
        </div>
        <Link href="/swarm" className="btn btn-lime">
          Open Swarm Desk <ArrowUpRight className="size-3" />
        </Link>
      </section>
    </div>
  );
}
