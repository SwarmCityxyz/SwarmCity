import { BRAND } from "@/config/brand";

const mask = (url: string): React.CSSProperties => ({
  WebkitMaskImage: `url(${url})`,
  maskImage: `url(${url})`,
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
});

/**
 * The owner's hexagon "S" mark (public/brand/mark.webp), drawn as a mask so it
 * takes the text colour it sits in. Brand lime by default.
 */
export function Mark({ size = 28, className = "text-lime" }: { size?: number; className?: string }) {
  return <span aria-hidden="true" className={`inline-block shrink-0 bg-current ${className}`} style={{ width: size, height: size, ...mask("/brand/mark.webp") }} />;
}

/** The SWARMCITY wordmark, lifted from the owner's banner (public/brand/wordmark.webp). */
export function Wordmark({ height = 18, className = "text-bone" }: { height?: number; className?: string }) {
  // The source artwork is 916 x 86.
  return (
    <span
      role="img"
      aria-label={BRAND.name}
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{ height, width: Math.round((height * 916) / 86), ...mask("/brand/wordmark.webp") }}
    />
  );
}

export function Logo({ size = 34, wordmark = 17, className = "" }: { size?: number; wordmark?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark size={size} />
      <Wordmark height={wordmark} />
    </span>
  );
}
