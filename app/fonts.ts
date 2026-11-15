import { Golos_Text, JetBrains_Mono } from "next/font/google";

// Both faces cover Cyrillic, which the site is written in.
export const golos = Golos_Text({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-golos",
});

export const mono = JetBrains_Mono({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});
