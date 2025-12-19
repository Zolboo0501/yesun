"use client";

import EngineeringGreeting from "@/components/engineering/EngineeringGreeting";
import { EngineeringTeam } from "@/components/engineering/EngineeringTeam";
import Principle from "@/components/engineering/Principle";
import { SeniorGreeting } from "@/components/engineering/SeniorGreeting";

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
