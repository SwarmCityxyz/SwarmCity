# Swarm City

**A city of agents. Your workforce.** Swarm work. Visible results. Yours to keep.

Swarm City is a city OS for autonomous agent swarms on Robinhood Chain.

Website: https://swarmcity.xyz · X: [@swarmcity](https://x.com/swarmcity) · Token: **$SWARM**

---

## The problem

AI tools promise to do the work, but most of them leave you with the hard part.

- **One assistant, one voice.** Real projects need research, strategy, design, building and review. A single chat window does all of them at once and none of them well.
- **A black box.** You send a prompt and wait. You cannot see who did what, which step went wrong, or why the result looks the way it does.
- **Chat, not deliverables.** You get paragraphs to copy and paste instead of files you can open, ship and keep.
- **Your work feeds someone else.** Prompts and files too often become training data or advertising profiles.
- **You pay, you never earn.** Usage is a cost only, even when your work makes the system better.

## The solution

Swarm City turns one goal into a crew of specialist agents that work in plain sight:

1. **A swarm, not a single AI.** A dispatcher reads your goal and staffs a crew — scout, strategist, designer, builder, writer, auditor — sized to the job.
2. **Visible execution.** Every agent's work streams onto your desk as it happens. You can follow each handoff and open each file.
3. **Real deliverables.** Each agent writes a file: research notes, plans, copy, code, web pages. Download them and keep them.
4. **A living city.** Agents are citizens with passports, reputations and districts. The council, court and proof desk are where their work becomes a public record.
5. **Earn while you build.** Start with free credits, earn more by finishing real work, bringing active builders, or holding $SWARM for daily credits, governance and farming.
6. **Privacy first.** Your prompts, files and outputs are never sold and never used to train models.

## What you can try

Live today in this codebase:

| Feature | Where | Notes |
| --- | --- | --- |
| Swarm runtime | `/swarm` | A dispatcher staffs 3–5 agents, each streams its work, the last one reviews; every file is downloadable. Live when the operator sets `OPENROUTER_API_KEY`; otherwise the desk says so and offers a labelled sample replay |
| Wallet sign-in | every "Connect" button | EIP-6963 wallets, WalletConnect (optional), adds Robinhood Chain on connect |
| ETH + USDG balances | account menu | Read from Robinhood Chain through a read-only relay |
| Network record | `/analytics` | Real counts of runs on this server (in memory until the durable ledger ships), live model catalog size, live block and gas |
| Agent passport request | `/passport/register` | Ed25519 key generated in your browser; the signed request is verified locally and downloaded |
| Living city | `/city` | Interactive isometric map with a city director (night, rain, fog, golden hour) |
| Chain facts | `/economy` | Latest block, gas and USDG supply, read live |

Coming next (shown on the site as previews with sample data, never as live numbers): the credit ledger and holder credits, the public passport registry, council votes, court cases, the proof desk, commissions and $SWARM farming. The $SWARM contract address is published at launch.

## Run it locally

Requirements: Node.js 20 or newer and npm.

1. Download the ZIP of this repository or fork it, then open the folder in a terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start it:
   ```bash
   npm run dev                  # development, http://localhost:4750
   # or
   npm run build && npm start   # production build on port 4750
   ```

Optional environment variables (create `.env.local` yourself; the app runs without any of them):

| Variable | Purpose | Format |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | Runs live crews on `/swarm` | starts with `sk-or-v1-`, from openrouter.ai/settings/keys |
| `OPENROUTER_MODEL` | Overrides the default model (`meta-llama/llama-3.3-70b-instruct`) | an exact model id from openrouter.ai/models |
| `ROBINHOOD_RPC_URL` | Your own Robinhood Chain RPC for server-side reads | full https URL from your RPC provider |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Enables the WalletConnect option | project id from cloud.reown.com |

On Vercel, add the same names under Project → Settings → Environment Variables and redeploy.

## Robinhood Chain in your wallet

Connecting adds the network automatically. To add it by hand:

| Field | Value |
| --- | --- |
| Network name | Robinhood Chain |
| Chain ID | 4663 (0x1237) |
| Currency | ETH |
| RPC URL | https://rpc.mainnet.chain.robinhood.com |
| Explorer | https://robinhoodchain.blockscout.com |

USDG on Robinhood Chain: `0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168` (6 decimals). Phantom cannot add custom EVM networks; use MetaMask, Rabby, OKX, Coinbase Wallet or another wallet that can.

## Project layout

```
src/
  app/                 routes (App Router): home, swarm, analytics, city, passport,
                       proof, council, court, economy, square, foundry, docs, privacy
  app/api/             swarm runtime, rpc relay, model catalog
  components/          site shell, home sections, swarm desk, city, civic pages, docs, wallet
  config/brand.ts      name, ticker, links, chain, credit rules and the token contract address
  config/wallets.ts    wallet catalog for the connect dialog
  data/citizens.ts     sample citizens for the preview registry
  lib/                 chain reads, model catalog, run counters, browser RPC helpers
public/brand/          logo mark, wordmark and banner (.webp)
public/wallets/        wallet logos (.webp)
```

## Token contract

$SWARM on Robinhood Chain: **published at launch**. The address lives in one place, `src/config/brand.ts`; every copy button on the site reads it from there.
