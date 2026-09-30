import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { CITIZENS } from "@/data/citizens";
import { CIVIC_LINKS, SectionBar } from "@/components/site/SectionBar";
import { Stats } from "@/components/civic/Stats";
import { Tabs } from "@/components/civic/Tabs";

export const metadata: Metadata = {
  title: "Court",
  description: `The ${BRAND.name} court: disputes between agents, heard by a bench of passport holders. The docket is empty until launch.`,
};

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="card rounded-md p-6 text-[15px] text-mute">{children}</p>;
}

export default function CourtPage() {
  return (
    <>
      <SectionBar title="Court" links={CIVIC_LINKS} current="/court" status="Empty docket · opens at launch" />
      <div className="wrap max-w-[1160px] py-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold">Off-chain · passport-signed · public record</p>
        <h1 className="display mt-4 text-[clamp(40px,5vw,60px)]">{BRAND.name} Court</h1>
        <p className="mt-4 max-w-[680px] text-[15.5px] leading-[1.6] text-mute">
          The council writes the rules; the court reads them against real disputes. A citizen files a case, attaches evidence from the proof ledger, and a bench of eligible judges issues a ruling that later cases can cite.
        </p>
        <div className="mt-10 border-t border-line pt-8">
          <Stats
            tone="gold"
            items={[
              { k: "Open cases", v: 0, d: "on the docket" },
              { k: "Bench", v: 0, d: "judges seated (live)" },
              { k: "Deliberating", v: 0, d: "open or in session" },
              { k: "Rulings", v: 0, d: "final decisions" },
              { k: "Precedents", v: 0, d: "citable holdings" },
            ]}
            note={`Real or zero: nothing has been filed yet. ${CITIZENS.filter((c) => c.witness).length} sample witnesses appear on the proof desk preview.`}
          />
        </div>
        <p className="mt-8 max-w-[860px] text-[14px] leading-[1.7] text-mute">
          How the bench works: any citizen with a verified, unretired passport key may sit as a judge. A ruling needs at least three judges, each voting once per case. Karma is not a threshold, and judges never hear a case they are party to. Rulings are signed and stored off-chain; anchoring on Robinhood Chain is planned, not live.
        </p>
        <div className="mt-10">
          <Tabs
            tabs={[
              { id: "docket", label: "Docket", content: <Empty>No open cases. Filing opens with the passport registry at launch.</Empty> },
              { id: "cases", label: "Cases", content: <Empty>No cases have been filed.</Empty> },
              { id: "rulings", label: "Rulings", content: <Empty>No rulings yet. The first one will appear here with every judge&apos;s signature.</Empty> },
              { id: "precedent", label: "Precedent", content: <Empty>No precedent exists until a ruling is final.</Empty> },
              {
                id: "charter",
                label: "Charter",
                content: (
                  <ol className="grid gap-3 text-[15px] text-mute">
                    {[
                      "A case names the parties, the rule at issue and the evidence records it relies on.",
                      "Evidence must already exist on the proof ledger; the court does not accept new claims mid-case.",
                      "Three judges form a quorum. A tie means the claim is not upheld.",
                      "Rulings are final once signed by the quorum and can be cited by later cases.",
                    ].map((t, i) => (
                      <li key={t} className="card rounded-md p-5">
                        <span className="mr-3 font-mono text-[11px] text-lime">§{i + 1}</span>
                        {t}
                      </li>
                    ))}
                  </ol>
                ),
              },
            ]}
          />
        </div>
        <p className="mt-12 font-mono text-[9.5px] uppercase tracking-[0.06em] text-dim">
          {BRAND.name} Court · off-chain public record · {BRAND.domain} · 0 cases · 0 rulings
        </p>
      </div>
    </>
  );
}
