"use client";
import { rise, stagger } from "@/lib/reveal";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState, type ComponentType } from "react";
import { Heading } from "./Heading";
import { Part } from "./Part";
import {
  AdviceIcon,
  DraftIcon,
  FactoryIcon,
  InstallIcon,
  ManualIcon,
  TechIcon,
  UpdatesIcon,
  WarrantyIcon,
  type Play,
} from "./StrengthIcons";

// The client's list, shortened; the wording was approved on 2026-11-08. The short titles are drawn from each line.
const advantages: { title: string; text: string; Icon: ComponentType<Play> }[] = [
  {
    title: "Тогтмол мэдээлэл",
    text: "Төслийн эхнээс дуустал захиалагчтай холбоотой ажиллаж, явц, өөрчлөлт бүрийг цаг тухайд нь мэдээлнэ.",
    Icon: UpdatesIcon,
  },
  {
    title: "Зураг төсөл, хариуцлага",
    text: "Зураг төслөө өөрсдөө боловсруулж, гүйцэтгэлийн бүх хариуцлагыг хүлээнэ.",
    Icon: DraftIcon,
  },
  {
    title: "Угсралтын туршлага",
    text: "Угсралт, суурилуулалтын олон жилийн туршлагатай.",
    Icon: InstallIcon,
  },
  {
    title: "Шинэ технологи",
    text: "Орчин үеийн дэвшилтэт технологийг цаг тухайд нь нэвтрүүлнэ.",
    Icon: TechIcon,
  },
  {
    title: "Өөрийн үйлдвэр",
    text: "Агаар сэлгэлтийн системийн эд ангийг өөрийн бүрэн тоноглогдсон үйлдвэрт хийнэ.",
    Icon: FactoryIcon,
  },
  {
    title: "Мэргэжлийн зөвлөгөө",
    text: "Олон жилийн туршлагатай хамт олон мэргэжлийн зөвлөгөө өгнө.",
    Icon: AdviceIcon,
  },
  {
    title: "Ашиглалтын заавар",
    text: "Тоног төхөөрөмжийн ашиглалтын заавар, зөвлөгөө өгнө.",
    Icon: ManualIcon,
  },
  {
    title: "Чанарын баталгаа",
    text: "Угсралтдаа урт хугацааны чанарын баталгаа гаргана.",
    Icon: WarrantyIcon,
  },
];

/** One advantage as a card, after the client's reference: a soft grey rounded card with its icon in a round white
 *  badge, its short title and its line, all centred (the badge beside the text on phones). Under the pointer the card
 *  turns white with a hairline and a soft shadow, the badge greys, and the icon acts its advantage out again; it acts
 *  it out once of its own when the card comes into view. */
function Card({ item }: { item: (typeof advantages)[number] }) {
  const card = useRef<HTMLLIElement>(null);
  const seen = useInView(card, { once: true, amount: 0.6 });
  const reduced = useReducedMotion() ?? false;
  const [run, setRun] = useState(0);
  const { Icon } = item;
  return (
    <motion.li
      ref={card}
      variants={rise}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setRun((r) => r + 1);
      }}
      className="group flex gap-5 rounded-[20px] bg-ink/[0.035] p-5 ring-1 ring-transparent transition-[background-color,box-shadow] duration-300 hover:bg-white hover:shadow-[0_1px_2px_rgb(11_16_32/0.04),0_16px_36px_-20px_rgb(11_16_32/0.3)] hover:ring-ink/10 sm:flex-col sm:items-center sm:gap-6 sm:px-6 sm:py-10 sm:text-center"
    >
      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-ink transition-colors duration-300 group-hover:bg-ink/[0.05] sm:size-[4.5rem]">
        <span className="size-6 sm:size-8">
          <Icon key={`${seen}-${run}`} play={seen && !reduced} />
        </span>
      </span>
      <div>
        <h3 className="text-base font-semibold tracking-[-0.01em] text-ink sm:text-lg">{item.title}</h3>
        <p className="mt-1.5 max-w-[34ch] text-pretty text-sm leading-relaxed text-ink/65 sm:mx-auto sm:mt-2">
          {item.text}
        </p>
      </div>
    </motion.li>
  );
}

/** The company's strengths, after the client's reference: the heading centred over a grid of eight icon cards (four
 *  across at lg, two from sm, one on phones). */
export function Strengths() {
  return (
    <Part labelledBy="strengths-title">
      <div className="mx-auto max-w-3xl">
        <Heading id="strengths-title" text="Манай компанийн давуу тал" center />
      </div>
      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="mt-14 grid gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-4"
      >
        {advantages.map((item) => (
          <Card key={item.title} item={item} />
        ))}
      </motion.ul>
    </Part>
  );
}
