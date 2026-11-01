import EngineeringGreeting from "@/components/engineering/EngineeringGreeting";
import { EngineeringTeam } from "@/components/engineering/EngineeringTeam";
import Principle from "@/components/engineering/Principle";
import { SeniorGreeting } from "@/components/engineering/SeniorGreeting";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Инженерийн мэндчилгээ",
  "Есөн Бэлчир ХХК-ийн инженерийн баг, ажиллах зарчим болон ахлах инженерүүдийн мэндчилгээ.",
  "/greeting/engineering",
);

const Engineering = () => {
  return (
    <>
      <EngineeringGreeting />
      <Principle />
      <EngineeringTeam />
      <SeniorGreeting />
    </>
  );
};

export default Engineering;
