import { Advantages } from "@/components/ourTeam/Advantages";
import { Crew } from "@/components/ourTeam/Crew";
import { DirectorGreeting } from "@/components/ourTeam/DirectorGreeting";
import { Engineers } from "@/components/ourTeam/Engineers";
import { LeadGreeting } from "@/components/ourTeam/LeadGreeting";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Хамт олон",
  "Есөн Бэлчир ХХК-ийн удирдлага, инженерүүд болон хамт олны танилцуулга.",
  "/ourTeam",
);

// The director's greeting first, then the engineers, what sets them apart and their lead's greeting, then the crew.
const OurTeam = () => (
  <>
    <h1 className="sr-only">Хамт олон</h1>
    <DirectorGreeting />
    <Engineers />
    <Advantages />
    <LeadGreeting />
    <Crew />
  </>
);

export default OurTeam;
