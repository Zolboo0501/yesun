import { Greeting } from "@/components/director/Greeting";
import { pageMetadata } from "@/lib/metadata";
import React from "react";

export const metadata = pageMetadata(
  "Захирлын мэндчилгээ",
  "Есөн Бэлчир ХХК-ийн захирлын мэндчилгээ.",
  "/greeting/director",
);

const Director = () => {
  return (
    <>
      <Greeting />
    </>
  );
};

export default Director;
