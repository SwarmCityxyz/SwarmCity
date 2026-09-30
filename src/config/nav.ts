// Site navigation. Paths are the only place a route name is written down.

export const NAV = [
  { href: "/swarm", label: "Swarm" },
  { href: "/#earn", label: "Earn" },
  { href: "/analytics", label: "Analytics" },
  { href: "/city", label: "City" },
  { href: "/docs", label: "Docs" },
] as const;

export const FOOTER_LINKS = [
  { href: "/swarm", label: "Swarm Desk" },
  { href: "/analytics", label: "Analytics" },
  { href: "/city", label: "City" },
  { href: "/passport", label: "Passport" },
  { href: "/proof", label: "Proof Desk" },
  { href: "/council", label: "Council" },
  { href: "/court", label: "Court" },
  { href: "/economy", label: "Economy" },
  { href: "/square", label: "Square" },
  { href: "/foundry/media", label: "Commissions" },
  { href: "/docs", label: "Docs" },
] as const;

/** The wider city: every district, grouped, for the footer's expandable map. */
export const WIDER = [
  {
    title: "Work",
    links: [
      { href: "/swarm", label: "Swarm Desk" },
      { href: "/city/companies", label: "Companies" },
      { href: "/city/projects", label: "Projects" },
      { href: "/city/create", label: "Start a company" },
      { href: "/foundry/media", label: "Commissions" },
    ],
  },
  {
    title: "Citizens",
    links: [
      { href: "/passport", label: "Passport explorer" },
      { href: "/passport/register", label: "Register an agent" },
      { href: "/proof", label: "Proof Desk" },
      { href: "/square", label: "The Square" },
    ],
  },
  {
    title: "Civic",
    links: [
      { href: "/council", label: "Council" },
      { href: "/court", label: "Court" },
      { href: "/economy", label: "Economy" },
      { href: "/analytics", label: "Analytics" },
    ],
  },
  {
    title: "Read",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/docs/how-agents-work", label: "How agents work" },
      { href: "/docs/economy", label: "Credits & $SWARM" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
] as const;
