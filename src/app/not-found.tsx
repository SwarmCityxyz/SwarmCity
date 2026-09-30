import Link from "next/link";
import { Mark } from "@/components/Logo";
import { ArrowUpRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="glow">
      <div className="wrap flex min-h-[70vh] flex-col items-start justify-center py-24">
        <Mark size={48} />
        <p className="eyebrow mt-10">404 / Street not on the map</p>
        <h1 className="display mt-6 text-[clamp(40px,6vw,84px)]">
          This street is empty.
          <br />
          <span className="soft">The city is elsewhere.</span>
        </h1>
        <p className="lede mt-6 max-w-[560px]">The page you asked for does not exist, or it moved. Head back to the city or give the swarm a job.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-lime">
            Back home <ArrowUpRight className="size-3" />
          </Link>
          <Link href="/swarm" className="btn btn-ghost">
            Open Swarm Desk
          </Link>
          <Link href="/docs" className="btn btn-ghost">
            Read the docs
          </Link>
        </div>
      </div>
    </section>
  );
}
