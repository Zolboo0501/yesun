import { ProductDetail } from "@/components/products/ProductDetail";
import { brands } from "@/constants/brands";
import { products } from "@/constants/products";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

// every product is a static page; any other slug is a 404
export const dynamicParams = false;
export const generateStaticParams = () => products.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  const brand = brands.find((b) => b.slug === product.brand)?.name ?? "";
  const meta = pageMetadata(`${brand} ${product.name}`.trim(), product.summary, `/products/${product.slug}`);
  // share the product's own photo rather than the company mark
  return { ...meta, openGraph: { ...meta.openGraph, images: product.images.slice(0, 1) } };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
