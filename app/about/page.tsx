import { About } from "@/components/home/About";
import { VisionPurpose } from "@/components/home/VisionPurpose";
import { Purpose } from "@/components/home/Purpose";
import { Advantages } from "@/components/home/Advantages";
import { Facilities } from "@/components/home/Facilities";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Бидний тухай",
  "Есөн Бэлчир ХХК-ийн алсын хараа, зорилго, давуу тал болон үйлдвэрлэлийн хүчин чадлын тухай.",
  "/about",
);

const AboutPage = () => {
  return (
    <>
      <About hiddenButton={true} />
      <VisionPurpose />
      <Purpose />
      <Advantages />
      <Facilities />
    </>
  );
};

export default AboutPage;
