import { About } from "@/components/About";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { Projects } from "@/components/home/Projects";
import { Services } from "@/components/home/Services";
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
