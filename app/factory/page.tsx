import Advantage from "@/components/factory/Advantage";
import { Intro } from "@/components/factory/Intro";
import { Plant } from "@/components/factory/Plant";
import { Products } from "@/components/factory/Products";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Үйлдвэрлэл",
  "Есөн Бэлчир ХХК-ийн агаар сэлгэлтийн хоолой, төхөөрөмжийн үйлдвэрлэл болон түүний давуу талууд.",
  "/factory",
);

// The opening with the plant's figures, what it makes (the 3D run), what sets it apart, then the plant itself.
const Factory = () => {
  return (
    <>
      <Products />
      <Intro />
      {/* what the factory makes: the fifteen duct products as one installed run, one per scroll step */}

      <Advantage />
      <Plant />
    </>
  );
};

export default Factory;
