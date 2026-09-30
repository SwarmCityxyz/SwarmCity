import "server-only";

/*
 * Run counters kept by this server process. They are real (every run through
 * /api/swarm is counted) but not durable: a restart or a new serverless
 * instance starts from zero. The analytics page says exactly that.
 */

type Day = { jobs: number; completed: number };

type State = {
  since: string;
  jobs: number;
  completed: number;
  failed: number;
  agentSteps: number;
  tokens: number;
  files: number;
  days: Map<string, Day>;
};

// Route bundles can hold separate module copies, so the counters live on
// globalThis to stay shared by the runtime route and the analytics page.
const holder = globalThis as unknown as { __swarmMetrics?: State };
const state: State = (holder.__swarmMetrics ??= {
  since: new Date().toISOString(),
  jobs: 0,
  completed: 0,
  failed: 0,
  agentSteps: 0,
  tokens: 0,
  files: 0,
  days: new Map<string, Day>(),
});

const today = () => new Date().toISOString().slice(0, 10);

function day() {
  const key = today();
  let d = state.days.get(key);
  if (!d) {
    d = { jobs: 0, completed: 0 };
    state.days.set(key, d);
  }
  return d;
}

export const metrics = {
  jobStarted() {
    state.jobs += 1;
    day().jobs += 1;
  },
  agentStep(tokens: number) {
    state.agentSteps += 1;
    state.tokens += Math.max(0, tokens);
    state.files += 1;
  },
  addTokens(tokens: number) {
    state.tokens += Math.max(0, tokens);
  },
  jobFinished(ok: boolean) {
    if (ok) {
      state.completed += 1;
      day().completed += 1;
    } else state.failed += 1;
  },
  snapshot() {
    const days: { date: string; jobs: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
      days.push({ date, jobs: state.days.get(date)?.jobs ?? 0 });
    }
    const terminal = state.completed + state.failed;
    return {
      since: state.since,
      jobs: state.jobs,
      completed: state.completed,
      failed: state.failed,
      agentSteps: state.agentSteps,
      tokens: state.tokens,
      files: state.files,
      completionRate: terminal ? Math.round((state.completed / terminal) * 100) : null,
      days,
    };
  },
};
