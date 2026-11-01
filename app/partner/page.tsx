import AirOne from "@/components/partner/AirOne";
import Aux from "@/components/partner/Aux";
import Ballu from "@/components/partner/Ballu";
import { Banner } from "@/components/partner/Banner";
import Kanion from "@/components/partner/Kanion";
import Lavfill from "@/components/partner/Lavfill";
import Shuft from "@/components/partner/Shuft";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Түнш",
  "Есөн Бэлчир ХХК-ийн түнш брэндүүд: KANION, AUX, BALLU, SHUFT, AIRONN, Lavfill.",
  "/partner",
);

const Partner = () => {
  return (
    <>
      <Banner />
      <Kanion />
      <Aux />
      <Ballu />
      <Shuft />
      <AirOne />
      <Lavfill />
    </>
  );
};

export default Partner;
