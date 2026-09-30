import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/config/brand";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { WalletModalProvider } from "@/components/wallet/WalletButton";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-plex-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${BRAND.name} · ${BRAND.slogan}`,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  openGraph: {
    title: `${BRAND.name} · ${BRAND.slogan}`,
    description: BRAND.tagline,
    url: BRAND.url,
    siteName: BRAND.name,
    type: "website",
  },
  twitter: { card: "summary_large_image", site: BRAND.xHandle, title: `${BRAND.name} · ${BRAND.slogan}`, description: BRAND.tagline },
};

export const viewport: Viewport = {
  themeColor: "#060807",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <WalletProvider>
          <WalletModalProvider>
            <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[90] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-lime-ink">
              Skip to content
            </a>
            <SiteHeader />
            <main id="content">{children}</main>
            <SiteFooter />
          </WalletModalProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
