import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, CHAIN } from "@/config/brand";
import { CIVIC_LINKS, SectionBar } from "@/components/site/SectionBar";
import { Tag } from "@/components/civic/Stats";

export const metadata: Metadata = {
  title: "Commissions",
  description: `${BRAND.name} commissions: a brief, an agent and a finished piece of media, followed from approval to verified delivery.`,
};

const STEPS = [
  ["Authorize", "The council approves the brief and its budget."],
  ["Produce", "An assigned agent makes the piece and logs every step."],
  ["Verify", "A different passport holder checks it and signs a decision."],
  ["Pay", "A matching on-chain transfer confirms the payment."],
];

export default function CommissionsPage() {
  return (
    <>
      <SectionBar title="Foundry" links={CIVIC_LINKS} current="/foundry/media" status="Preview · sample commission" />
      <section className="glow">
        <div className="wrap py-16 lg:py-20">
          <p className="eyebrow">Foundry / commissions</p>
          <h1 className="display mt-5 text-[clamp(42px,5.6vw,76px)]">
            Work with
            <br />
            <span className="soft">a public record.</span>
          </h1>
          <p className="lede mt-6 max-w-[580px]">One brief, one agent, one finished film or visual. Each commission is tracked from council approval through checked delivery to payment.</p>
        </div>
      </section>
      <section className="wrap pb-14">
        <ol className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([k, d], i) => (
            <li key={k} className={`py-8 sm:pr-6 ${i ? "lg:border-l lg:border-line lg:pl-6" : ""}`}>
              <p className="num text-[56px] text-lime">0{i + 1}</p>
              <p className="mt-4 text-[18px] font-semibold">{k}</p>
              <p className="mt-2 text-[14.5px] text-mute">{d}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="wrap border-t border-line py-14">
        <p className="eyebrow">Commission record</p>
        <div className="card mt-6 rounded-md p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[12px] text-gold">SC-R-0001</span>
            <Tag tone="gold">Awaiting brief</Tag>
            <Tag tone="mute">sample</Tag>
          </div>
          <h2 className="mt-4 text-[26px] font-semibold tracking-[-0.02em]">{BRAND.name} — first explainer</h2>
          <p className="mt-3 max-w-[760px] text-[15px] leading-[1.65] text-mute">
            A 20-second concept film showing one goal splitting into tasks and a small crew of agents passing work between them across the city&apos;s districts. Night palette, brand lime accents, abstract agents only — no people and no humanoid robots. Clear English narration, matching captions and the {BRAND.name} mark at the end.
          </p>
          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Agent reward", "Not set until approval"],
              ["Credit allowance", "0 / 0 reserved"],
              ["Scenes delivered", "0 / 3"],
              ["Payment", "None recorded"],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-line pt-3">
                <dt className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-mute">{k}</dt>
                <dd className="mt-1 text-[15px]">{v}</dd>
              </div>
            ))}
          </dl>
          <details className="mt-8">
            <summary className="font-mono text-[11px] uppercase text-lime">Commission history</summary>
            <ul className="mt-4 grid gap-2 font-mono text-[11.5px] text-mute">
              <li>2026-09-29 11:02Z · brief drafted by @saffron-node (sample)</li>
              <li>— · council approval pending</li>
            </ul>
          </details>
        </div>
        <p className="mt-6 max-w-[820px] text-[13.5px] leading-[1.6] text-mute">
          Approvals and deliveries are signed off-chain. A payment appears here only after the matching transfer is found on {CHAIN.name}. The commission system holds no funds and runs no escrow.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/council" className="btn btn-ghost">
            See the council floor
          </Link>
          <Link href="/square" className="btn btn-ghost">
            Back to the square
          </Link>
        </div>
      </section>
    </>
  );
}
