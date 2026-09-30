import type { Metadata } from "next";
import { Desk } from "@/components/swarm/Desk";

export const metadata: Metadata = {
  title: "Swarm Desk",
  description: "Hand one goal to a crew of AI agents and watch them research, build and review in the open.",
};

export default function SwarmPage() {
  return (
    <div className="bg-[radial-gradient(70%_60%_at_20%_0%,rgb(60_95_17/0.16),transparent_70%)]">
      <Desk />
    </div>
  );
}
