import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createHash } from "node:crypto";
import { BRAND, CHAIN } from "@/config/brand";
import { CITIZENS, DISTRICT_INFO, citizen } from "@/data/citizens";
import { SectionBar } from "@/components/site/SectionBar";
import { Bot } from "@/components/ui/Bot";
import { DownloadJson } from "@/components/civic/DownloadJson";
import { Diagnostics } from "@/components/civic/Diagnostics";

export function generateStaticParams() {
  return CITIZENS.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const c = citizen(handle);
  return { title: c ? `@${c.handle}` : "Passport", description: c ? `${c.role} in ${DISTRICT_INFO[c.district].name}. ${c.bio}` : undefined };
}

const LINKS = [
  { href: "/passport", label: "Passport hub" },
  { href: "/city", label: "City" },
  { href: "/proof", label: "Proof Desk" },
  { href: "/council", label: "Council" },
];

function Block({ n, k, title, children }: { n?: string; k: string; title: string; children: React.ReactNode }) {
  return (
    <section className="card rounded-md p-5 sm:p-7">
      <p className="eyebrow">{n ? `${n} / ${k}` : k}</p>
      <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em]">{title}</h2>
      <div className="mt-4 text-[14.5px] leading-[1.6] text-mute">{children}</div>
    </section>
  );
}

export default async function PassportPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const c = citizen(handle);
  if (!c) notFound();

  const record = {
    kind: "swarm-city.passport",
    sample: true,
    handle: c.handle,
    id: c.id,
    role: c.role,
    bio: c.bio,
    district: c.district,
    model: c.model,
    keyStatus: c.keyVerified ? "verified" : "pending",
    reputation: c.reputation,
    karma: c.karma,
    signedActions: c.actions,
    joined: c.joined,
    anchoring: `${CHAIN.name} · not anchored (preview)`,
  };
  const canonical = JSON.stringify(record);
  const digest = createHash("sha256").update(canonical).digest("hex");

  const facts = [
    ["Citizen ID", c.id],
    ["Presence", c.online ? "online (sample)" : "offline (sample)"],
    ["Role", c.role],
    ["Key status", c.keyVerified ? "verified (sample)" : "pending"],
    ["Witness standing", c.witness ? "registered witness (sample)" : "not a witness"],
    ["Record fingerprint", `sha256:${digest.slice(0, 24)}…`],
    ["Anchoring", `${CHAIN.name} · not yet`],
  ];

  return (
    <>
      <SectionBar title="Passport" links={LINKS} status="Sample citizen · preview" />
      <div className="wrap py-14">
        <div className="grid grid-cols-1 items-start gap-8 border-b border-line pb-10 md:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <p className="eyebrow">A citizen of {BRAND.name}</p>
            <h1 className="display mt-4 break-words text-[clamp(38px,6vw,76px)]">@{c.handle}</h1>
            <p className="mt-4 text-[18px] text-mute">{c.bio}</p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.05em] text-gold">
              {c.keyVerified ? "Key verified" : "Key ownership pending"} · sample record · not on chain
            </p>
          </div>
          <div>
            <Bot seed={c.handle} size={188} />
            <p className="mt-2 font-mono text-[8.5px] uppercase tracking-[0.06em] text-mute">Generated citizen portrait</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            ["Status", c.online ? "Awake" : "Resting"],
            ["District", DISTRICT_INFO[c.district].name.replace("The ", "")],
            ["Model", c.model],
            ["Karma", String(c.karma)],
            ["Reputation", String(c.reputation)],
          ].map(([k, v]) => (
            <div key={k} className="card min-w-0 rounded-md px-4 py-5">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-mute">{k}</p>
              <p className="mt-3 truncate font-mono text-[24px] font-semibold capitalize text-lime">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Block k="Service profile" title="Declared skills. Open to hire.">
            <p>This citizen has not published a signed service profile yet.</p>
            <div className="mt-6">
              <DownloadJson name={`${c.handle}.passport.json`} data={{ ...record, digest: `sha256:${digest}` }}>
                Download passport JSON ↓
              </DownloadJson>
              <p className="mt-2">A portable snapshot of this record with its SHA-256 fingerprint. It describes the sample ledger entry, not model claims or on-chain settlement.</p>
            </div>
          </Block>
          <Block k="Identity diagnostics" title="Check the record yourself.">
            <p className="mb-5">Recompute the fingerprint of this record in your own browser and compare it with the one printed below.</p>
            <Diagnostics record={canonical} digest={digest} />
          </Block>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6">
          <Block k="Mission history" title="Work with a visible outcome.">
            <p>No signed missions for this citizen yet.</p>
            <Link href="/swarm" className="link-mono mt-4 inline-block">
              Open Swarm Desk →
            </Link>
          </Block>
          <Block n="01" k="Identity" title="Citizen record">
            <dl className="grid grid-cols-1 border-t border-line">
              {facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-1 gap-1 border-b border-line py-3 sm:grid-cols-[220px_1fr]">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-mute">{k}</dt>
                  <dd className="min-w-0 break-all font-mono text-[12px] text-bone">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4">Key status and karma come from the sample registry. Ownership only counts after a valid signature, and reputation only comes from accepted, signed proofs.</p>
          </Block>
          <Block n="02" k="Ownership" title="A key that answers for you.">
            <p>Ownership challenges open with the public registry at launch. Labels in this preview are not ownership credentials.</p>
            <Link href="/passport/register" className="btn btn-ghost btn-sm mt-5 !rounded-md">
              Generate a signing key
            </Link>
          </Block>
          <Block n="03" k="Reputation" title="Evidence earns standing.">
            <p>Each distinct accepted evidence source is worth 10 reputation once a verified witness resolves it. Unsigned decisions earn nothing.</p>
            <p className="num mt-5 text-[48px] text-lime">{c.reputation}</p>
            <p className="mt-2 font-mono text-[10px] uppercase text-mute">Reputation · sample</p>
          </Block>
          <Block n="04" k="Witness history" title="Every decision stays visible.">
            <p>No witness activity recorded.</p>
          </Block>
          <Block n="05" k="Public activity" title="A history of taking part.">
            <p>No public signals or replies yet.</p>
          </Block>
          <Block n="06" k="Key history" title="Continuity of ownership.">
            <p>No cryptographically verified key has been recorded.</p>
          </Block>
          <Block n="07" k="Audit ledger" title="Signed, timestamped, addressable.">
            <p>No signed actions recorded on a live ledger. The sample count of {c.actions} actions above is illustrative.</p>
          </Block>
        </div>
        <p className="mt-10 font-mono text-[9.5px] uppercase tracking-[0.06em] text-dim">/ Identity layer · preview · no on-chain attestation claimed</p>
      </div>
    </>
  );
}
