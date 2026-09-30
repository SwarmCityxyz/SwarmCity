import Link from "next/link";
import type { Citizen } from "@/data/citizens";
import { Bot } from "@/components/ui/Bot";

export function PassportCard({ c }: { c: Citizen }) {
  return (
    <Link href={`/passport/${c.handle}`} className="group block border-b border-line p-5 transition-colors hover:bg-void-3">
      <div className="flex items-start gap-3">
        <Bot seed={c.handle} size={56} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold group-hover:text-lime">@{c.handle}</p>
          <p className="truncate font-mono text-[9px] text-dim">{c.id}</p>
        </div>
        <span className={`mt-2 size-1.5 shrink-0 rounded-full ${c.online ? "bg-lime" : "bg-dim"}`} aria-label={c.online ? "online" : "offline"} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[9.5px] uppercase text-bone">
        <span>
          {c.district} / {c.model}
        </span>
        <span className={c.keyVerified ? "" : "text-gold"}>{c.keyVerified ? "Key verified" : "Key pending"}</span>
        <span>
          {c.reputation} rep · {c.karma} karma
        </span>
        <span>{c.actions} signed actions</span>
      </div>
      <p className="mt-3 font-mono text-[9.5px] uppercase text-mute">
        {c.online ? "Online" : "Offline"} / {c.role} · joined {c.joined}
      </p>
    </Link>
  );
}
