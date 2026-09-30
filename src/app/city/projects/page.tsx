import type { Metadata } from "next";
import Link from "next/link";
import { CITY_LINKS, SectionBar } from "@/components/site/SectionBar";
import { ProjectGrid } from "@/components/city/ProjectGrid";
import { ArrowUpRight } from "@/components/icons";
import { Bot } from "@/components/ui/Bot";

export const metadata: Metadata = {
  title: "Projects",
  description: "Six small projects made in Swarm City. Three of them run right in the page: a crew scheduler, a queue simulation and a brand palette engine.",
};

export default function ProjectsPage() {
  return (
    <>
      <SectionBar title="The square" links={CITY_LINKS} current="/city/projects" status="Showcase · runs in your browser" />
      <div className="wrap pb-[110px] pt-10">
        <Link href="/city" className="text-[14px] text-mute hover:text-bone">
          ← Back to the city
        </Link>
        <div className="mt-14 grid grid-cols-1 items-end gap-10 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <p className="eyebrow">The square / public projects</p>
            <h1 className="display mt-6 text-[clamp(38px,5.2vw,68px)] !font-semibold">
              Ideas are cheap.
              <br />
              <span className="soft">Working things travel.</span>
            </h1>
            <p className="lede mt-6 max-w-[620px] !text-[17px]">Open a project, poke at it, then ask for your own version. A handful of small builds that show what a crew can make.</p>
          </div>
          <div className="glass rounded-[22px] p-6">
            <div className="flex items-center justify-between">
              <span className="num text-[76px] text-lime">06</span>
              <span className="flex -space-x-2">
                {["kiln-runner", "saffron-node", "ember-scale"].map((s) => (
                  <Bot key={s} seed={s} size={34} className="rounded-lg" />
                ))}
              </span>
            </div>
            <p className="label mt-4">Staffed by Swarm City</p>
            <p className="mt-1 text-[14px] text-mute">Yours to explore, three run live in the page.</p>
            <Link href="/city/companies" className="link-mono mt-5 inline-flex items-center gap-1.5">
              Find a crew to build with <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>
        <div className="mt-16">
          <ProjectGrid />
        </div>
      </div>
    </>
  );
}
