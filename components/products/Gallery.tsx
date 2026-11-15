"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

/** A product's photos: the chosen one large on a grey tile, the others as thumbnails under it (none for one photo). */
export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [at, setAt] = useState(0);
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[24px] bg-ink/[0.035]">
        {images[at] && (
          <Image
            key={images[at]}
            src={images[at]}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 680px, 100vw"
            className="animate-in object-contain p-8 mix-blend-multiply duration-300 fade-in sm:p-12"
          />
        )}
      </div>
      {images.length > 1 && (
        <ul className="mt-3 flex gap-3">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                aria-label={`Зураг ${i + 1}`}
                aria-pressed={i === at}
                onClick={() => setAt(i)}
                className={cn(
                  "relative block size-20 cursor-pointer overflow-hidden rounded-[14px] bg-ink/[0.035] transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:size-24",
                  i === at ? "shadow-[inset_0_0_0_2px_var(--color-ink)]" : "hover:shadow-[inset_0_0_0_1px_rgb(11_16_32/0.2)]",
                )}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-contain p-2 mix-blend-multiply" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
