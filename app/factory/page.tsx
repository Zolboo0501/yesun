import Advantage from "@/components/factory/Advantage";
import { Banner } from "@/components/factory/Banner";
import Full from "@/components/factory/Full";
import { LeftSide } from "@/components/factory/LeftSide";

const Factory = () => {
  return (
    <>
      <Banner />
      <LeftSide />
      <Advantage />
      <Full />
    </>
  );
};

export default Factory;
