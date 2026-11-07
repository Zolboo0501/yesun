import { Golos_Text, JetBrains_Mono, Source_Serif_4 } from "next/font/google";

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

// The hero's editorial headings. cyrillic-ext carries Mongolian Ө and Ү; the optical-size axis gives the
// large sizes their finer display cut.
export const serif = Source_Serif_4({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  axes: ["opsz"],
  variable: "--font-source-serif",
});
