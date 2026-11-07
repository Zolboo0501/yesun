import Advantage from "@/components/factory/Advantage";
import { Banner } from "@/components/factory/Banner";
import Full from "@/components/factory/Full";
import { LeftSide } from "@/components/factory/LeftSide";
import { Products } from "@/components/factory/Products";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Үйлдвэрлэл",
  "Есөн Бэлчир ХХК-ийн агаар сэлгэлтийн хоолой, төхөөрөмжийн үйлдвэрлэл болон түүний давуу талууд.",
  "/factory",
);

const Factory = () => {
  return (
    <>
      <Banner />
      <LeftSide />
      {/* what the factory makes: the fifteen duct products as one installed run, one per scroll step */}
      <Products />
      <Advantage />
      <Full />
    </>
  );
};

export default Factory;
