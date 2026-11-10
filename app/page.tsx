import { Company } from "@/components/home/Company";
import { EngineerTeam } from "@/components/home/EngineerTeam";
import { Hero } from "@/components/home/Hero";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { Projects } from "@/components/home/Projects";
import { Services } from "@/components/home/Services";
import { StructuredData } from "@/components/StructuredData";
import { homeProducts, productMenu } from "@/constants/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <StructuredData />
      <Hero />
      <Company />
      <Services />
      <Projects />
      <ProductShowcase items={homeProducts} menu={productMenu} />
      <EngineerTeam />
    </div>
  );
}
