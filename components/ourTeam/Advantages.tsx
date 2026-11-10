"use client";
import { Heading } from "@/components/about/Heading";
import { Part } from "@/components/about/Part";
import Features4, { type Features4Item } from "@/components/blocks/features-4";
import { DraftingCompass, GraduationCap, ShieldCheck } from "lucide-react";

// The engineers' three strengths with their points as the old engineering page listed them (copy-edited); each tab's
// line sums up its points.
const advantages: Features4Item[] = [
  {
    Icon: GraduationCap,
    title: "Мэргэжлийн инженерүүд",
    description: "Барилга, үйлдвэрийн бодит туршлагатай, мэргэжлийн боловсролтой инженерүүд.",
    points: ["Стандартад нийцсэн зураг төсөл", "Барилга, үйлдвэрийн бодит туршлага", "Талбайн хяналт, чанарын шалгалт"],
  },
  {
    Icon: DraftingCompass,
    title: "Инженерийн үйлчилгээ",
    description: "Системийн зураг төслөөс ашиглалтад оруулах хүртэлх бүх шатыг хариуцна.",
    points: [
      "Агаар сэлгэлт, хөргөлтийн системийн зураг төсөл",
      "Тоног төхөөрөмжийн сонголт",
      "Угсралтын инженерийн хяналт",
      "Ашиглалтад оруулах, тохируулах ажил",
    ],
  },
  {
    Icon: ShieldCheck,
    title: "Ажлын зарчим",
    description: "Захиалагчийн хэрэгцээнд нийцсэн, аюулгүй, найдвартай шийдэл.",
    points: [
      "Захиалагчийн хэрэгцээг гүнзгий ойлгох",
      "Эрчим хүчний хэмнэлттэй шийдэл",
      "Аюулгүй ажиллагаа, стандартыг чанд мөрдөх",
      "Урт хугацааны найдвартай ажиллагаа",
    ],
  },
];

/** What sets the engineers apart, through the repo's features-4 block: the three strengths as tabs, each opening its
 *  points in the panel beside them. */
export function Advantages() {
  return (
    <Part labelledBy="advantages-title">
      <Heading id="advantages-title" text="Манай инженерүүдийн давуу тал" center />
      <Features4 items={advantages} label="Инженерүүдийн давуу тал" className="mt-14 lg:mt-20" />
    </Part>
  );
}
