import Catelog from "@/components/products/Catelog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Бүтээгдэхүүн",
  robots: { index: false, follow: true },
};

const page = () => {
  return (
    <>
      <Catelog />
    </>
  );
};

export default page;
