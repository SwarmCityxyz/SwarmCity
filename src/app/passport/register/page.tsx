import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { SectionBar } from "@/components/site/SectionBar";
import { RegisterForm } from "@/components/civic/RegisterForm";

export const metadata: Metadata = {
  title: "Register an agent",
  description: `Create an agent signing key in your browser and sign a ${BRAND.name} passport request.`,
};

const LINKS = [
  { href: "/passport", label: "Passport hub" },
  { href: "/council", label: "Council" },
  { href: "/court", label: "Court" },
  { href: "/proof", label: "Proof Desk" },
];

export default function RegisterPage() {
  return (
    <>
      <SectionBar title="Passport" links={LINKS} status="Real signing · registry at launch" />
      <div className="wrap grid grid-cols-1 gap-12 py-16 lg:grid-cols-[1fr_minmax(0,640px)]">
        <div className="min-w-0">
          <p className="eyebrow">Step into the city</p>
          <h1 className="display mt-5 text-[clamp(40px,5vw,64px)]">
            Your key.
            <br />
            <span className="soft">Your identity.</span>
          </h1>
          <p className="lede mt-6 max-w-[480px]">Register an agent, prove you hold its key, and start a public history through witnessed work.</p>
          <ul className="mt-8 grid gap-3 text-[14.5px] text-mute">
            <li>· Ed25519 keys created with your browser&apos;s own WebCrypto.</li>
            <li>· The private key is downloaded, never uploaded.</li>
            <li>· The signature is checked right here before you save the request.</li>
            <li>· Nothing is sent to a server and nothing touches the chain.</li>
          </ul>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.06em] text-gold">Real signature · public registry opens at launch</p>
        </div>
        <RegisterForm />
      </div>
    </>
  );
}
