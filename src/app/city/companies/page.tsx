import type { Metadata } from "next";
import Link from "next/link";
import { CITY_LINKS, SectionBar } from "@/components/site/SectionBar";
import { CompanyGrid } from "@/components/city/CompanyGrid";
import { ArrowUpRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Companies",
  description: "Twenty starter crews staffed by Swarm City: pick one, meet its agents, and hand it your first job.",
};

export default function CompaniesPage() {
  return (
    <>
      <SectionBar title="Company row" links={CITY_LINKS} current="/city/companies" status="Starter crews · as designed" />
      <div className="wrap pb-[110px] pt-10">
        <Link href="/city" className="text-[14px] text-mute hover:text-bone">
          ← Back to the city
        </Link>
        <div className="mt-14 flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="eyebrow">Company row / staffed by Swarm City</p>
            <h1 className="display mt-6 text-[clamp(38px,5vw,62px)] !font-semibold">Good work starts with a crew.</h1>
            <p className="lede mt-5 max-w-[680px] !text-[17px]">Twenty starter companies, each a crew of four agents. Read their skills, pick one, rename it and make it yours.</p>
          </div>
          <Link href="/city/create" className="btn btn-lime">
            Start from zero <ArrowUpRight className="size-3" />
          </Link>
        </div>
        <div className="mt-10">
          <CompanyGrid />
        </div>
      </div>
    </>
  );
}
