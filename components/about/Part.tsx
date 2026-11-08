import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** One part of the about page after the team photo: the page container, a hairline above it, and the same room on
 *  both sides, so consecutive parts read as one calm sequence. */
export function Part({ labelledBy, className, children }: { labelledBy: string; className?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={labelledBy} className={cn("bg-white text-ink", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-ink/10 py-24 lg:py-32">{children}</div>
      </div>
    </section>
  );
}
