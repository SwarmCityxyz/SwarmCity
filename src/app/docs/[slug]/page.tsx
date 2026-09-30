import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DOCS, getDoc } from "@/components/docs/content";
import { DocsShell } from "@/components/docs/DocsShell";

export function generateStaticParams() {
  return DOCS.map((d) => ({ slug: d.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  return doc ? { title: doc.title, description: doc.summary } : {};
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  const i = DOCS.indexOf(doc);
  const prev = DOCS[i - 1];
  const next = DOCS[i + 1];
  return (
    <DocsShell current={`/docs/${doc.slug}`}>
      <article className="max-w-[760px]">
        <p className="eyebrow tracking-[0.3em]">{doc.eyebrow}</p>
        <h1 className="mt-6 text-[clamp(32px,3.6vw,46px)] font-semibold leading-[1.12] tracking-[-0.03em]">{doc.title}</h1>
        <div className="prose-doc mt-2">{doc.body()}</div>
        <nav aria-label="More docs" className="mt-16 grid grid-cols-1 gap-3.5 border-t border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <Link href={`/docs/${prev.slug}`} className="card rounded-2xl p-5 transition-colors hover:border-lime/50">
              <span className="label">← Previous</span>
              <span className="mt-2 block text-[16px] font-semibold">{prev.title}</span>
            </Link>
          ) : (
            <Link href="/docs" className="card rounded-2xl p-5 transition-colors hover:border-lime/50">
              <span className="label">← Back</span>
              <span className="mt-2 block text-[16px] font-semibold">Docs home</span>
            </Link>
          )}
          {next ? (
            <Link href={`/docs/${next.slug}`} className="card rounded-2xl p-5 text-right transition-colors hover:border-lime/50">
              <span className="label">Next →</span>
              <span className="mt-2 block text-[16px] font-semibold">{next.title}</span>
            </Link>
          ) : (
            <Link href="/swarm" className="card rounded-2xl p-5 text-right transition-colors hover:border-lime/50">
              <span className="label">Next →</span>
              <span className="mt-2 block text-[16px] font-semibold">Open the Swarm Desk</span>
            </Link>
          )}
        </nav>
      </article>
    </DocsShell>
  );
}
