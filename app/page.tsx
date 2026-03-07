import { About } from "@/components/home/About";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { Projects } from "@/components/home/Projects";
import { Services } from "@/components/home/Services";
import { StructuredData } from "@/components/StructuredData";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <StructuredData />
      <Hero />
      <About />
      <Services />
      <Features />
      <Projects />
    </div>
  );
}
