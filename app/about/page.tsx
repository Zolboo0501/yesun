import { Factory } from "@/components/about/Factory";
import { Intro } from "@/components/about/Intro";
import { Statements } from "@/components/about/Statements";
import { Strengths } from "@/components/about/Strengths";
import { Team } from "@/components/about/Team";
import { Timeline } from "@/components/about/Timeline";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Бидний тухай",
  "Есөн Бэлчир ХХК-ийн алсын хараа, зорилго, давуу тал болон үйлдвэрлэлийн хүчин чадлын тухай.",
  "/about",
);

// The brief in .impeccable/surfaces/app-about-page-tsx.md: proof first, values last, and the footer's closing statement
// as the one call to contact an engineer.
const AboutPage = () => (
  <>
    <Intro />
    <Team />
    <Timeline />
    <Factory />
    <Strengths />
    <Statements />
  </>
);

export default AboutPage;
