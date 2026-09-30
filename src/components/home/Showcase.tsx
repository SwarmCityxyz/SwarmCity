import Link from "next/link";
import { Mark } from "@/components/Logo";
import { ArrowUpRight } from "@/components/icons";

const TEAM = [
  { role: "Scout", task: "Map local bike shops" },
  { role: "Designer", task: "Set the look and voice" },
  { role: "Builder", task: "Ship the booking page", active: true },
  { role: "Auditor", task: "Test links + mobile" },
];

const LOG = [
  { from: "Scout → Designer", note: "Rivals, price bands and gaps in weekday service mapped." },
  { from: "Designer → Builder", note: "Palette, type and tone signed off. Page built." },
  { from: "Auditor → You", note: "Links, forms and phone layout checked. Files are yours." },
];

const FILES = [
  { file: "index.html", kind: "Website" },
  { file: "local-market.md", kind: "Research" },
  { file: "opening-week.md", kind: "Launch plan" },
];

/** The "watch the work" panel on the landing page. An illustrated example, labelled as one. */
export function Showcase() {
  return (
    <div className="glass overflow-hidden rounded-[28px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Mark size={24} />
          <span className="text-[15px] font-semibold">Swarm Desk</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[10px] uppercase text-mute sm:inline">Sample job</span>
          <span className="rounded-full bg-lime px-4 py-2 font-mono text-[10px] font-semibold uppercase text-lime-ink">✓ Ready for you</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr_1.35fr]">
        {/* Team */}
        <div className="flex flex-col border-b border-line p-5 lg:border-b-0 lg:border-r">
          <p className="font-mono text-[10px] uppercase text-mute">Crew / 4 agents</p>
          <p className="mt-4 text-[18px] font-semibold">Open Northloop Cycles</p>
          <ul className="mt-4 grid gap-1.5">
            {TEAM.map((t) => (
              <li key={t.role} className={`rounded-xl border px-3.5 py-3 ${t.active ? "border-lime/40 bg-lime/[0.06]" : "border-transparent"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-semibold">{t.role}</span>
                  <span className="font-mono text-[9.5px] text-lime">✓ Done</span>
                </div>
                <p className="mt-1 text-[14px] text-mute">{t.task}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl bg-void px-3.5 py-4">
            <p className="label">Relay</p>
            <p className="mt-2 text-[14px]">Scout → Designer</p>
            <p className="text-[14px]">Builder → Auditor</p>
          </div>
          <p className="mt-4 text-[14px] text-mute">4 of 4 steps finished</p>
        </div>

        {/* Conversation */}
        <div className="flex flex-col border-b border-line p-5 lg:border-b-0 lg:border-r">
          <p className="text-[18px] font-semibold">One goal in, finished work out</p>
          <div className="mt-5 rounded-2xl bg-void-4/60 p-4">
            <p className="font-mono text-[10px] uppercase text-mute">You</p>
            <p className="mt-2 text-[14px] leading-[1.5]">Help me open a bike repair shop. Check the local market, make the website and plan the opening week.</p>
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase text-lime">Swarm City</p>
          <p className="mt-2 text-[14px] leading-[1.5]">I am calling in a scout, a designer, a builder and an auditor. Each handoff shows up here as it happens.</p>
          <ul className="mt-5 grid gap-4">
            {LOG.map((l) => (
              <li key={l.from} className="text-[14px] leading-[1.45]">
                <span className="text-bone">✓ {l.from}</span>
                <br />
                <span className="text-mute">{l.note}</span>
              </li>
            ))}
          </ul>
          <Link href="/swarm" className="mt-auto block rounded-2xl border border-line-strong bg-void-3/60 p-4 pt-4 transition-colors hover:border-lime lg:mt-10">
            <span className="block text-[14px] text-mute">Hand your own goal to the swarm</span>
            <span className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase text-lime">
              Open Swarm Desk <ArrowUpRight className="size-3" />
            </span>
          </Link>
        </div>

        {/* Preview + files */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold">
              Preview <span className="ml-3 font-mono text-[11px] font-normal text-mute">/ index.html</span>
            </p>
            <span className="font-mono text-[9px] uppercase text-lime">Sample output</span>
          </div>
          <div className="mt-4 rounded-md bg-[#eef1e4] p-6 text-[#10140c] sm:p-7">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold tracking-[0.02em]">NORTHLOOP CYCLES</span>
              <span className="font-mono text-[11px]">Book a fix ↗</span>
            </div>
            <p className="mt-8 text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[36px]">
              Back on the road
              <br />
              by Friday.
            </p>
            <p className="mt-5 text-[14px] leading-[1.5] text-[#4d5446]">
              Same-week repairs, honest quotes.
              <br />
              Drop it off before work, ride it home after.
            </p>
            <ul className="mt-6 text-[14px]">
              {[
                ["01", "Tune-up", "Gears · Brakes"],
                ["02", "Wheel true", "Spokes · Hubs"],
              ].map(([n, t, d]) => (
                <li key={n} className="flex items-center justify-between border-t border-[#10140c]/15 py-3">
                  <span className="font-semibold">
                    {n}&nbsp;&nbsp;{t}
                  </span>
                  <span className="font-mono text-[10.5px] text-[#4d5446]">{d} ↗</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase text-mute">Your files / 3</p>
          <table className="mt-2 w-full text-left text-[14px]">
            <thead>
              <tr className="font-mono text-[9.5px] uppercase text-mute">
                <th className="py-2 font-normal">File</th>
                <th className="py-2 font-normal">Kind</th>
                <th className="py-2 text-right font-normal">State</th>
              </tr>
            </thead>
            <tbody>
              {FILES.map((f) => (
                <tr key={f.file} className="border-t border-line">
                  <td className="py-3">{f.file}</td>
                  <td className="py-3 font-mono text-[10.5px] text-mute">{f.kind}</td>
                  <td className="py-3 text-right font-mono text-[10.5px] text-lime">Ready ↗</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
