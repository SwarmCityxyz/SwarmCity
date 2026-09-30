"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@/components/wallet/WalletProvider";
import { useWalletModal } from "@/components/wallet/WalletButton";
import { Bot } from "@/components/ui/Bot";
import { Mark } from "@/components/Logo";
import { ArrowUpRight } from "@/components/icons";
import { BRAND, ECONOMY, shortAddress } from "@/config/brand";
import { SAMPLE_AGENTS, SAMPLE_BRIEF, SAMPLE_OUTPUTS } from "./sample-run";

type Agent = { role: string; task: string; file: string };
type Step = Agent & { state: "wait" | "live" | "done"; text: string; tokens: number };
type Run = { brief: string; sample: boolean; steps: Step[]; status: string; error: string | null; finished: boolean; model: string | null };

const EXAMPLES = [
  { kind: "Research", seed: "agent-research", brief: "Compare three note-taking apps for a five-person team. Include prices, sources and risks." },
  { kind: "Create", seed: "agent-create", brief: "Turn my product brief into a week of launch posts for a small coffee roaster." },
  { kind: "Build", seed: "agent-build", brief: "Build a one-page website for a weekend running club, as a single HTML file." },
];

function download(name: string, text: string) {
  const blob = new Blob([text], { type: name.endsWith(".html") ? "text/html" : "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function Desk() {
  const { address } = useWallet();
  const { open } = useWalletModal();
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [brief, setBrief] = useState("");
  const [run, setRun] = useState<Run | null>(null);
  const [focus, setFocus] = useState(0);
  const abort = useRef<AbortController | null>(null);
  const board = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/swarm", { cache: "no-store" })
      .then((r) => r.json())
      .then((b: { configured: boolean; model: string }) => {
        setConfigured(b.configured);
        setModel(b.model);
      })
      .catch(() => setConfigured(false));
    return () => abort.current?.abort();
  }, []);

  const busy = Boolean(run && !run.finished);

  function begin(b: string, sample: boolean) {
    setRun({ brief: b, sample, steps: [], status: sample ? "Replaying a sample run" : "Sending the goal to the dispatcher", error: null, finished: false, model: sample ? null : model });
    setFocus(0);
    window.setTimeout(() => board.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  async function start() {
    const b = brief.trim();
    if (b.length < 8 || busy) return;
    begin(b, false);
    const ctrl = new AbortController();
    abort.current = ctrl;
    try {
      const res = await fetch("/api/swarm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ brief: b }), signal: ctrl.signal });
      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
        const message = body.error === "not_configured" ? "Live runs are not configured on this deployment yet." : (body.message ?? `The desk answered ${res.status}.`);
        setRun((r) => (r ? { ...r, error: message, finished: true } : r));
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let cut: number;
        while ((cut = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, cut).trim();
          buffer = buffer.slice(cut + 1);
          if (!line) continue;
          const ev = JSON.parse(line) as { type: string; [k: string]: unknown };
          setRun((r) => {
            if (!r) return r;
            switch (ev.type) {
              case "status":
                return { ...r, status: String(ev.text) };
              case "plan":
                return { ...r, status: "Crew staffed", model: String(ev.model), steps: (ev.agents as Agent[]).map((a) => ({ ...a, state: "wait", text: "", tokens: 0 })) };
              case "agent_start": {
                const i = Number(ev.index);
                setFocus(i);
                return { ...r, status: `${r.steps[i]?.role ?? "Agent"} is working`, steps: r.steps.map((s, j) => (j === i ? { ...s, state: "live" } : s)) };
              }
              case "delta": {
                const i = Number(ev.index);
                return { ...r, steps: r.steps.map((s, j) => (j === i ? { ...s, text: s.text + String(ev.text) } : s)) };
              }
              case "agent_done": {
                const i = Number(ev.index);
                return { ...r, steps: r.steps.map((s, j) => (j === i ? { ...s, state: "done", tokens: Number(ev.tokens) || 0 } : s)) };
              }
              case "done":
                return { ...r, status: "Ready for you", finished: true };
              case "error":
                return { ...r, error: String(ev.message), finished: true };
              default:
                return r;
            }
          });
        }
      }
      setRun((r) => (r && !r.finished ? { ...r, finished: true, status: "Stream ended" } : r));
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setRun((r) => (r ? { ...r, error: "The connection to the desk dropped.", finished: true } : r));
    }
  }

  function replay() {
    if (busy) return;
    begin(SAMPLE_BRIEF, true);
    const steps: Step[] = SAMPLE_AGENTS.map((a) => ({ ...a, state: "wait", text: "", tokens: 0 }));
    let i = 0;
    let c = 0;
    window.setTimeout(() => setRun((r) => (r ? { ...r, status: "Crew staffed", steps } : r)), 500);
    const tick = window.setInterval(() => {
      const full = SAMPLE_OUTPUTS[i];
      c = Math.min(full.length, c + 14);
      const idx = i;
      setFocus(idx);
      setRun((r) =>
        r
          ? {
              ...r,
              status: `${SAMPLE_AGENTS[idx].role} is working`,
              steps: (r.steps.length ? r.steps : steps).map((s, j) => (j < idx ? { ...s, state: "done", text: SAMPLE_OUTPUTS[j] } : j === idx ? { ...s, state: c >= full.length ? "done" : "live", text: full.slice(0, c) } : s)),
            }
          : r,
      );
      if (c >= full.length) {
        i += 1;
        c = 0;
        if (i >= SAMPLE_AGENTS.length) {
          window.clearInterval(tick);
          setRun((r) => (r ? { ...r, status: "Sample finished", finished: true } : r));
        }
      }
    }, 40);
  }

  const doneCount = run?.steps.filter((s) => s.state === "done").length ?? 0;
  const current = run?.steps[focus];

  return (
    <>
      <div className="wrap grid grid-cols-1 items-start gap-12 pb-20 pt-16 lg:grid-cols-[1fr_440px] lg:gap-16 lg:pt-[92px]">
        <div className="min-w-0">
          <p className="flex items-center gap-3 font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-lime">
            <Mark size={30} /> Swarm Desk
          </p>
          <h1 className="mt-8 text-[clamp(44px,5.4vw,64px)] font-bold leading-[1.04] tracking-[-0.045em]">
            One goal.
            <br />
            <span className="text-lime">A whole crew.</span>
          </h1>
          <p className="lede mt-6 max-w-[520px]">Research markets, write the launch, build the page — with a crew of AI agents that work in plain sight at your own desk.</p>
          <p className="mt-10 font-mono text-[10.5px] uppercase tracking-[0.2em] text-mute">Goals to try</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {EXAMPLES.map((e) => (
              <button
                key={e.kind}
                type="button"
                onClick={() => setBrief(e.brief)}
                className="card rounded-2xl p-4 text-left transition-colors hover:border-lime/60"
              >
                <Bot seed={e.seed} size={56} />
                <p className="mt-4 text-[15px] font-semibold">{e.kind}</p>
                <p className="mt-2 text-[13px] leading-[1.55] text-mute">{e.brief}</p>
              </button>
            ))}
          </div>
          <p className="mt-6 text-[13px] text-dim">You set the goal. You judge the work.</p>
        </div>

        <div className="glass min-w-0 rounded-[26px] p-6 sm:p-8">
          {!address ? (
            <>
              <h2 className="text-[26px] font-semibold tracking-[-0.02em]">Open your desk</h2>
              <p className="mt-2 text-[15px] leading-[1.6] text-mute">Your wallet is your sign-in. No email, no password, and connecting never moves funds.</p>
              <p className="mt-4 text-[13.5px] text-lime">{ECONOMY.starterCredits} starter credits for eligible new wallets at launch.</p>
              <button type="button" onClick={open} data-connect="desk" className="btn btn-lime mt-8 w-full !h-12">
                Connect wallet <ArrowUpRight className="size-3" />
              </button>
              <button type="button" onClick={replay} disabled={busy} className="btn btn-ghost mt-3 w-full !h-12">
                Watch a sample run
              </button>
              <p className="mt-6 text-center text-[13px] text-mute">
                Questions? Ask us on{" "}
                <a href={BRAND.x} target="_blank" rel="noreferrer" className="text-lime underline underline-offset-2">
                  X {BRAND.xHandle}
                </a>
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[26px] font-semibold tracking-[-0.02em]">Brief the swarm</h2>
                <span className="rounded-full border border-line-strong px-3 py-1 font-mono text-[10px] text-mute">{shortAddress(address, 5, 4)}</span>
              </div>
              <label htmlFor="brief" className="mt-6 block text-[13px] font-medium">
                What should finished look like?
              </label>
              <textarea
                id="brief"
                rows={6}
                maxLength={2000}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="e.g. Research the market for a dog-walking app in Lisbon and draft the landing page."
                className="field mt-2"
              />
              <button type="button" onClick={start} disabled={busy || brief.trim().length < 8 || configured === false} className="btn btn-lime mt-4 w-full !h-12">
                {busy && !run?.sample ? "Crew at work…" : "Run the swarm"} <ArrowUpRight className="size-3" />
              </button>
              <button type="button" onClick={replay} disabled={busy} className="btn btn-ghost mt-3 w-full !h-11">
                Watch a sample run
              </button>
              <div className="mt-6 grid gap-2 rounded-xl border border-line bg-void/40 p-4 text-[13px] leading-[1.5]">
                <p className="flex items-center justify-between gap-3">
                  <span className="text-mute">Runtime</span>
                  <span className={configured ? "text-lime" : "text-gold"}>{configured === null ? "Checking…" : configured ? "Live" : "Not configured yet"}</span>
                </p>
                <p className="flex items-center justify-between gap-3">
                  <span className="text-mute">Model</span>
                  <span className="truncate font-mono text-[11px] text-bone">{model ?? "—"}</span>
                </p>
                <p className="flex items-center justify-between gap-3">
                  <span className="text-mute">Credits</span>
                  <span className="text-gold">Ledger opens at launch</span>
                </p>
                {configured === false ? <p className="mt-1 text-[12.5px] text-mute">The operator has not connected a model key to this deployment yet. The sample run shows exactly how a live job looks.</p> : null}
              </div>
            </>
          )}
        </div>
      </div>

      {run ? (
        <section ref={board} className="wrap scroll-mt-6 pb-24">
          <div className="glass overflow-hidden rounded-[28px]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <Mark size={22} />
                <span className="truncate text-[15px] font-semibold">{run.sample ? "Sample run · replay" : "Live run"}</span>
              </div>
              <span className={`rounded-full px-4 py-2 font-mono text-[10px] font-semibold uppercase ${run.error ? "bg-danger-tint text-danger" : run.finished ? "bg-lime text-lime-ink" : "border border-lime/50 text-lime"}`}>
                {run.error ? "Stopped" : run.finished ? "✓ " + run.status : run.status + "…"}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="border-b border-line p-5 lg:border-b-0 lg:border-r">
                <p className="font-mono text-[10px] uppercase text-mute">Crew / {run.steps.length || "…"} agents</p>
                <p className="mt-3 line-clamp-3 text-[15px] font-semibold leading-[1.4]">{run.brief}</p>
                <ul className="mt-4 grid gap-1.5">
                  {run.steps.map((s, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setFocus(i)}
                        className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${focus === i ? "border-lime/50 bg-lime/[0.06]" : "border-transparent hover:border-line-strong"}`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-2 text-[14.5px] font-semibold">
                            <Bot seed={s.role + i} size={26} /> {s.role}
                          </span>
                          <span className={`font-mono text-[9.5px] ${s.state === "done" ? "text-lime" : s.state === "live" ? "text-gold" : "text-dim"}`}>
                            {s.state === "done" ? "✓ Done" : s.state === "live" ? "Working" : "Queued"}
                          </span>
                        </span>
                        <span className="mt-1 block text-[13px] leading-[1.45] text-mute">{s.task}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[13.5px] text-mute">
                  {doneCount} of {run.steps.length || "?"} steps finished
                </p>
                {run.model ? <p className="mt-1 font-mono text-[10px] text-dim">{run.model}</p> : null}
              </div>
              <div className="min-w-0 p-5">
                {run.error ? <p className="mb-4 rounded-xl border border-danger/40 bg-danger-tint px-4 py-3 text-[14px] text-danger">{run.error}</p> : null}
                {current ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[15px] font-semibold">
                        {current.role} <span className="ml-2 font-mono text-[11px] font-normal text-mute">/ {current.file}</span>
                      </p>
                      <button type="button" disabled={!current.text} onClick={() => download(current.file, current.text)} className="link-mono disabled:opacity-40">
                        Download ↓
                      </button>
                    </div>
                    <pre className="mt-4 max-h-[460px] min-h-[220px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-line bg-void/60 p-4 font-mono text-[12.5px] leading-[1.65] text-bone">
                      {current.text || (current.state === "wait" ? "Waiting for the previous agent…" : "…")}
                    </pre>
                  </>
                ) : (
                  <p className="text-[14px] text-mute">{run.status}…</p>
                )}
                {run.steps.length ? (
                  <>
                    <p className="mt-6 font-mono text-[10px] uppercase text-mute">Your files / {run.steps.length}</p>
                    <table className="mt-2 w-full table-fixed text-left text-[14px]">
                      <thead>
                        <tr className="font-mono text-[9.5px] uppercase text-mute">
                          <th className="py-2 font-normal">File</th>
                          <th className="w-[28%] py-2 font-normal">By</th>
                          <th className="w-[22%] py-2 text-right font-normal">State</th>
                        </tr>
                      </thead>
                      <tbody>
                        {run.steps.map((s, i) => (
                          <tr key={i} className="border-t border-line">
                            <td className="truncate py-3">{s.file}</td>
                            <td className="truncate py-3 font-mono text-[10.5px] text-mute">{s.role}</td>
                            <td className="py-3 text-right font-mono text-[10.5px]">
                              {s.state === "done" ? (
                                <button type="button" onClick={() => download(s.file, s.text)} className="text-lime hover:text-bone">
                                  Ready ↓
                                </button>
                              ) : (
                                <span className="text-dim">{s.state === "live" ? "Writing" : "Queued"}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : null}
                {run.sample ? <p className="mt-5 font-mono text-[10px] text-dim">Sample replay: pre-written output that shows how a live run unfolds. Nothing was sent to a model.</p> : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
