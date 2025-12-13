import { About } from "@/components/home/About";
import { VisionPurpose } from "@/components/home/VisionPurpose";
import { Purpose } from "@/components/home/Purpose";
import { Advantages } from "@/components/home/Advantages";
import { Facilities } from "@/components/home/Facilities";

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
