/* Starter crews: ready-made teams a workspace can adopt and rename. Each lists
   the skills its agents bring and four suggested roles. Rules as designed. */

export const CATEGORIES = ["Research & product", "Design & media", "Engineering", "Operations"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Company = {
  name: string;
  category: Category;
  promise: string;
  skills: string[];
  roles: { role: string; job: string }[];
};

const r = (role: string, job: string) => ({ role, job });

export const COMPANIES: Company[] = [
  {
    name: "Lamplight Research",
    category: "Research & product",
    promise: "Answer the market question before you spend a cent.",
    skills: ["Source gathering", "Competitor grids", "Evidence notes", "Second-agent check"],
    roles: [r("Lead scout", "Frames the question and scopes the sources"), r("Researcher", "Collects and summarises sources"), r("Analyst", "Builds the comparison grid"), r("Auditor", "Checks every claim has a link")],
  },
  {
    name: "Weathervane Desk",
    category: "Research & product",
    promise: "Spot the shifts worth reacting to this week.",
    skills: ["Change tracking", "Signal triage", "Weekly digest", "Second-agent check"],
    roles: [r("Watcher", "Monitors the feeds you choose"), r("Triage", "Ranks what changed by impact"), r("Writer", "Turns it into a short digest"), r("Auditor", "Verifies the top three items")],
  },
  {
    name: "Meridian Mapping",
    category: "Research & product",
    promise: "Lay out an unfamiliar field before you commit to it.",
    skills: ["Landscape maps", "Glossaries", "Key-player profiles", "Second-agent check"],
    roles: [r("Cartographer", "Draws the map of the field"), r("Researcher", "Profiles the main players"), r("Explainer", "Writes the plain-language glossary"), r("Auditor", "Flags gaps and weak sources")],
  },
  {
    name: "Scopewright",
    category: "Research & product",
    promise: "Shrink a big idea into something a crew can ship.",
    skills: ["Requirements", "Prioritising", "Milestone plans", "Second-agent check"],
    roles: [r("Product lead", "Writes the one-page brief"), r("Planner", "Breaks it into milestones"), r("Estimator", "Sizes each task honestly"), r("Auditor", "Challenges anything vague")],
  },
  {
    name: "Listening Post",
    category: "Research & product",
    promise: "Ask customers the questions that change the plan.",
    skills: ["Interview scripts", "Survey design", "Insight synthesis", "Second-agent check"],
    roles: [r("Interviewer", "Drafts scripts and surveys"), r("Researcher", "Sorts responses into themes"), r("Synthesiser", "Writes the findings memo"), r("Auditor", "Checks quotes match their source")],
  },
  {
    name: "Signet Studio",
    category: "Design & media",
    promise: "Give the brand a voice people remember.",
    skills: ["Brand voice", "Taglines", "Visual direction", "Editorial pass"],
    roles: [r("Creative lead", "Sets the direction"), r("Writer", "Drafts voice, lines and copy"), r("Designer", "Moodboards and palettes"), r("Editor", "Cuts it down to what matters")],
  },
  {
    name: "Frame by Frame",
    category: "Design & media",
    promise: "Plan a short film down to the last shot.",
    skills: ["Scripts", "Storyboards", "Shot lists", "Editorial pass"],
    roles: [r("Director", "Owns the story arc"), r("Scriptwriter", "Writes narration and captions"), r("Storyboarder", "Describes every frame"), r("Editor", "Checks pacing and length")],
  },
  {
    name: "Launchpad Press",
    category: "Design & media",
    promise: "Make launch day say one clear thing.",
    skills: ["Announcement copy", "Thread drafts", "Content calendar", "Editorial pass"],
    roles: [r("Strategist", "Picks the single message"), r("Writer", "Drafts posts and the release"), r("Scheduler", "Builds the two-week calendar"), r("Editor", "Keeps tone consistent")],
  },
  {
    name: "Quiet Ink",
    category: "Design & media",
    promise: "Turn what you know into writing people finish.",
    skills: ["Outlines", "Long-form drafts", "Fact notes", "Editorial pass"],
    roles: [r("Editor-in-chief", "Sets the angle"), r("Researcher", "Gathers facts and quotes"), r("Writer", "Drafts the piece"), r("Copy editor", "Tightens every paragraph")],
  },
  {
    name: "Palette & Grid",
    category: "Design & media",
    promise: "A design system that survives its second season.",
    skills: ["Type scales", "Colour tokens", "Component specs", "Design review"],
    roles: [r("Design lead", "Defines principles"), r("Designer", "Builds tokens and scales"), r("Spec writer", "Documents components"), r("Reviewer", "Tests contrast and consistency")],
  },
  {
    name: "Foundry Nine",
    category: "Engineering",
    promise: "From idea to working prototype in one sitting.",
    skills: ["Prototyping", "Sandbox runs", "Readme writing", "Code review"],
    roles: [r("Tech lead", "Chooses the stack"), r("Builder", "Writes the prototype"), r("Tester", "Runs it in the sandbox"), r("Reviewer", "Reads the diff line by line")],
  },
  {
    name: "Pageworks",
    category: "Engineering",
    promise: "A fast, honest landing page that loads everywhere.",
    skills: ["Responsive pages", "Copy fitting", "Accessibility", "Code review"],
    roles: [r("Builder", "Codes the page"), r("Designer", "Lays out sections"), r("Writer", "Fits copy to the design"), r("Reviewer", "Checks phones and screen readers")],
  },
  {
    name: "Cronworks",
    category: "Engineering",
    promise: "Automate the chore you do every Monday.",
    skills: ["Scripts", "Scheduled jobs", "Error handling", "Code review"],
    roles: [r("Automator", "Writes the script"), r("Integrator", "Wires inputs and outputs"), r("Tester", "Breaks it on purpose"), r("Reviewer", "Signs off the runbook")],
  },
  {
    name: "Datum & Dash",
    category: "Engineering",
    promise: "One dashboard that answers one question well.",
    skills: ["Data cleaning", "Charts", "Metric definitions", "Code review"],
    roles: [r("Analyst", "Defines the metric"), r("Engineer", "Cleans and joins data"), r("Designer", "Chooses the chart"), r("Reviewer", "Recomputes the headline number")],
  },
  {
    name: "Bugbear QA",
    category: "Engineering",
    promise: "Find the bugs before your users do.",
    skills: ["Test plans", "Browser checks", "Repro steps", "Second-agent check"],
    roles: [r("QA lead", "Writes the test plan"), r("Tester", "Clicks through every flow"), r("Reporter", "Writes clean repro steps"), r("Auditor", "Confirms fixes actually fix")],
  },
  {
    name: "Ledgerline",
    category: "Operations",
    promise: "Keep the numbers tidy and the budget honest.",
    skills: ["Budget sheets", "Cost tracking", "Monthly summaries", "Second-agent check"],
    roles: [r("Controller", "Owns the budget"), r("Bookkeeper", "Logs and categorises costs"), r("Analyst", "Spots drift early"), r("Auditor", "Reconciles the totals")],
  },
  {
    name: "Harbor Desk",
    category: "Operations",
    promise: "Answer customers kindly, quickly and correctly.",
    skills: ["Reply drafts", "FAQ upkeep", "Escalation rules", "Tone review"],
    roles: [r("Desk lead", "Sets tone and rules"), r("Responder", "Drafts replies"), r("Librarian", "Keeps the FAQ current"), r("Reviewer", "Checks answers against policy")],
  },
  {
    name: "Clearpath Ops",
    category: "Operations",
    promise: "Turn a messy process into a checklist that runs.",
    skills: ["Process maps", "Checklists", "Handoff notes", "Second-agent check"],
    roles: [r("Ops lead", "Maps the current process"), r("Designer", "Redraws the flow"), r("Writer", "Writes the checklist"), r("Auditor", "Dry-runs it end to end")],
  },
  {
    name: "Tidewater Hiring",
    category: "Operations",
    promise: "Write the role, screen fairly, schedule the calls.",
    skills: ["Job posts", "Screening rubrics", "Scheduling", "Bias review"],
    roles: [r("Recruiter", "Drafts the role"), r("Screener", "Applies the rubric"), r("Coordinator", "Books the calls"), r("Reviewer", "Checks for biased wording")],
  },
  {
    name: "Keystone Planning",
    category: "Operations",
    promise: "A business plan you can defend in one meeting.",
    skills: ["Positioning", "Pricing", "Forecasts", "Second-agent check"],
    roles: [r("Strategist", "Sets positioning"), r("Analyst", "Builds the forecast"), r("Writer", "Drafts the plan"), r("Auditor", "Stress-tests the assumptions")],
  },
];
