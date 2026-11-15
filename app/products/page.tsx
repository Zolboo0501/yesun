import { Catalog } from "@/components/products/Catalog";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Бүтээгдэхүүн",
  "Есөн Бэлчир ХХК-ийн албан ёсны түнш брэндүүдийн агааржуулагч, сэнс, агаар боловсруулах төхөөрөмж. Ангилал, брэндээр нь шүүж, хайж болно.",
  "/products",
);

// The partner brands' products: filters by kind and brand down the left, a search, the products
// (components/products/Catalog.tsx); each opens /products/[slug].
const Products = () => <Catalog />;

export default Products;
