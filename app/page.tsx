import { Company } from "@/components/home/Company";
import { Hero } from "@/components/home/Hero";
import { Projects } from "@/components/home/Projects";
import { StructuredData } from "@/components/StructuredData";
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
      <Projects />
    </div>
  );
}
