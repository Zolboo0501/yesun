import { About } from "@/components/About";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Services } from "@/components/Services";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <About />
      <Services />
      <Features />
      <Projects />
    </div>
  );
}
