"use client";
import { Heading } from "@/components/about/Heading";
import { Part } from "@/components/about/Part";
import Features8, { type Features8Item } from "@/components/blocks/features-8";
import { DraftingCompass, GraduationCap, ShieldCheck } from "lucide-react";

// The engineers' three strengths, from the old engineering greeting page, cut to three short points each
// (2026-11-09).
const advantages: Features8Item[] = [
  {
    Icon: GraduationCap,
    title: "Мэргэжлийн\nинженерүүд",
    points: ["Стандартад нийцсэн зураг төсөл", "Бодит туршлага", "Чанарын хяналт"],
  },
  {
    Icon: DraftingCompass,
    title: "Инженерийн\nүйлчилгээ",
    points: ["Зураг төсөл", "Тоног төхөөрөмжийн сонголт", "Угсралтын хяналт, тохируулга"],
  },
  {
    Icon: ShieldCheck,
    title: "Ажлын\nзарчим",
    points: ["Захиалагчийн хэрэгцээнд нийцсэн шийдэл", "Эрчим хүчний хэмнэлт", "Аюулгүй, найдвартай ажиллагаа"],
  },
];

/** What sets the engineers apart, through the repo's features-8 block: three centred columns under the heading. */
export function Advantages() {
  return (
    <Part labelledBy="advantages-title">
      <Heading id="advantages-title" text="Манай инженерүүдийн давуу тал" center />
      <Features8 items={advantages} className="mt-14 lg:mt-20" />
    </Part>
  );
}
