import Hero from "@/components/ourTeam/Hero";
import Team from "@/components/ourTeam/Team";
import TeamMembers from "@/components/ourTeam/TeamMembers";
import { pageMetadata } from "@/lib/metadata";
import React from "react";

export const metadata = pageMetadata(
  "Хамт олон",
  "Есөн Бэлчир ХХК-ийн удирдлага, инженерүүд болон хамт олны танилцуулга.",
  "/ourTeam",
);

const OurTeam = () => {
  return (
    <>
      <Hero />
      <TeamMembers />
      <Team />
    </>
  );
};

export default OurTeam;
