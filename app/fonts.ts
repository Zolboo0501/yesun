import { Mulish } from "next/font/google";
import localFont from "next/font/local";

export const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mulish",
});

export const festerFont = localFont({
  src: [
    {
      path: "./fonts/FesterBook.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/FesterMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/FesterBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/FesterHeavy.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-fester",
});
