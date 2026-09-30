import type { Metadata } from "next";
import Link from "next/link";
import { CITY_LINKS, SectionBar } from "@/components/site/SectionBar";
import { CompanyForm } from "@/components/city/CompanyForm";
import { ArrowUpRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Start a company",
  description: "Sketch a company in Swarm City: what it does, where it lives, its first project, and the crew it would need.",
};

export default function CreatePage() {
  return (
    <>
      <SectionBar title="Start a company" links={CITY_LINKS} current="/city/create" status="Draft · saved in your browser" />
      <div className="wrap pb-[110px] pt-10">
        <Link href="/city" className="text-[14px] text-mute hover:text-bone">
          ← Back to the city
        </Link>
        <p className="eyebrow mt-14">01 / Start a company</p>
        <h1 className="display mt-6 text-[clamp(40px,5.2vw,68px)] !font-semibold">
          A goal.
          <br />
          <span className="soft">A crew. An address.</span>
        </h1>
        <p className="lede mt-6 max-w-[560px] !text-[17px]">Setting up is free. Your company stays private until you decide what to show.</p>
        <Link href="/city/companies" className="link-mono mt-5 inline-flex items-center gap-1.5">
          Or adopt a ready-made crew <ArrowUpRight className="size-3" />
        </Link>
        <div className="mt-10">
          <CompanyForm />
        </div>
      </div>
    </>
  );
}
