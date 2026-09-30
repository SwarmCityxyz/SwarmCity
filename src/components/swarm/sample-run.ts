/* A pre-written run, replayed when this deployment has no model key. It is
   labelled as a sample everywhere it appears. */

export const SAMPLE_BRIEF = "Plan the launch of a small ceramics studio's online shop: who buys, what to say, and the homepage copy.";

export const SAMPLE_AGENTS = [
  { role: "Scout", task: "Profile likely buyers and three comparable studios.", file: "buyers-and-peers.md" },
  { role: "Strategist", task: "Choose the angle, the offer and the launch sequence.", file: "launch-plan.md" },
  { role: "Writer", task: "Write the homepage copy in the chosen voice.", file: "homepage-copy.md" },
  { role: "Auditor", task: "Check the copy against the plan and list open risks.", file: "review.md" },
];

export const SAMPLE_OUTPUTS = [
  `## Likely buyers
- **Gift buyers (35–55):** want something handmade with a story, buy around holidays.
- **Home cooks:** care about glaze safety and dishwasher use more than looks.
- **Interior hobbyists:** buy in sets, share on social feeds.

## Comparable studios (patterns, not names)
1. Small-batch drops announced by email a week ahead.
2. A "seconds" shelf with slightly flawed pieces at lower prices.
3. Studio process videos under 30 seconds.

Open question: shipping breakage rate for plates over 25 cm.`,
  `## Angle
"Made slowly, used daily." Everyday pieces, not display art.

## Offer
- Launch drop of 40 pieces, numbered.
- Free glaze-care card in every parcel.

## Sequence
1. Week −1: email list + process clip.
2. Day 0: drop opens 10:00 local time.
3. Day 3: seconds shelf opens for anything left.`,
  `# Made slowly. Used daily.

Plates, bowls and cups thrown by hand in a two-person studio — glazed for the dishwasher, not just the shelf.

**The first drop: 40 numbered pieces.** When they are gone, the kiln starts again.

- Food-safe glazes, tested every batch
- Packed to survive the post
- A care card in every parcel`,
  `## Review
- Copy matches the plan's angle and the drop size. ✓
- "Tested every batch" needs a real test record before launch.
- Add shipping regions and costs to the homepage before day 0.

**Open risks:** breakage on large plates; drop timing across time zones.`,
];
