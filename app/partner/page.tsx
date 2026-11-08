import { Brands } from "@/components/partner/Brands";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Түнш",
  "Есөн Бэлчир ХХК-ийн түнш брэндүүд: KANION, AUX, BALLU, SHUFT, AIRONN, Lavfill.",
  "/partner",
);

// The six partner brands as cards, with a jump row of their logos and a closing call (components/partner/Brands.tsx).
const Partner = () => <Brands />;

export default Partner;
