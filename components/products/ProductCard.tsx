import { brands } from "@/constants/brands";
import type { Product } from "@/constants/products";
import Image from "next/image";
import Link from "next/link";

/** A product in a list: its photo on a grey tile (a white ground multiplies into it), then the brand and model in
 *  mono, the name and what it is. The whole card opens the product. */
export function ProductCard({ product, sizes }: { product: Product; sizes: string }) {
  const brand = brands.find((b) => b.slug === product.brand);
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-[20px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-ink/[0.035]">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={`${brand?.name ?? ""} ${product.name}`.trim()}
            fill
            sizes={sizes}
            className="object-contain p-5 mix-blend-multiply transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none sm:p-7"
          />
        )}
      </div>
      <p className="mt-3 truncate font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
        {brand?.name}
        {product.model && ` · ${product.model}`}
      </p>
      <h3 className="mt-1 text-pretty font-semibold leading-snug decoration-1 underline-offset-[4px] group-hover:underline">
        {product.name}
      </h3>
      <p className="mt-0.5 text-pretty text-sm leading-snug text-ink/60">{product.title}</p>
    </Link>
  );
}
