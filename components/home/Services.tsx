"use client";
import ScrollStack from "@/components/react-bits/scroll-stack";
import StaggeredText from "@/components/react-bits/staggered-text";
import { useInView, useReducedMotion } from "motion/react";
import { useRef, useState, type ComponentType } from "react";
import { CoolIcon, FactoryIcon, Glyph, ServiceIcon, VentIcon, type Draw } from "./ServiceIcons";

// The client's four services, as the site carried them before the redesign (one typo set right: дэвшилтэт).
const services: { title: string; text: string; Icon: ComponentType<Draw> }[] = [
  {
    title: "Агааржуулалтын систем",
    text: "Орчин үеийн агааржуулалтын системийн зураг төсөл, суурилуулалт, засвар үйлчилгээ. Барилга байгууламжид тохирсон оновчтой шийдэл.",
    Icon: VentIcon,
  },
  {
    title: "Хөргөлтийн төхөөрөмж",
    text: "Аж үйлдвэр, худалдаа, зочид буудалд зориулсан хөргөлтийн системийн нийлүүлэлт, суурилуулалт, техникийн үйлчилгээ.",
    Icon: CoolIcon,
  },
  {
    title: "Үйлдвэрлэл",
    text: "Манай үйлдвэр нь орчин үеийн дэвшилтэт тоног төхөөрөмжөөс бүрдсэн бөгөөд нийт 12 тоног төхөөрөмжтэй ажиллаж байна.",
    Icon: FactoryIcon,
  },
  {
    title: "Засвар үйлчилгээ",
    text: "Урьдчилан сэргийлэх, яаралтай засвар үйлчилгээ. 24/7 дэмжлэг, сэлбэг хэрэгсэл солих, техникийн туслалцаа.",
    Icon: ServiceIcon,
  },
];

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const FROM = { opacity: 0, y: 14 };
const SHOWN = { opacity: 1, y: 0 };

/** One service as a card of the stack: graphite on the night ground, rounded, with no border, set off by its shadow
 *  (up onto the card behind it and down onto the ground); its icon large in the middle, and at the foot its name (two
 *  lines, the second set in) on one side and its line on the other (stacked on phones). */
function Card({
  service,
  seen,
  active,
  reduced,
}: {
  service: (typeof services)[number];
  seen: boolean;
  active: boolean;
  reduced: boolean;
}) {
  const [first, ...rest] = service.title.split(" ");
  const { Icon } = service;
  return (
    <article className="flex h-full flex-col rounded-[20px] bg-graphite p-6 text-white shadow-[0_-14px_36px_-12px_rgb(0_0_0/0.55),0_40px_80px_-28px_rgb(0_0_0/0.8)] sm:p-8 lg:rounded-[28px] lg:p-12">
      <div className="flex min-h-0 flex-1 items-center justify-center pb-6 lg:pb-4">
        <Glyph seen={seen} active={active} reduced={reduced} className="aspect-square h-full max-h-[22rem] w-auto">
          <Icon seen={seen} reduced={reduced} />
        </Glyph>
      </div>
      <div className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16">
        <h3 className="text-[clamp(1.875rem,1rem+2.4vw,3rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
          <span className="block">{first}</span>
          {rest.length > 0 && <span className="block pl-[0.9em]">{rest.join(" ")}</span>}
        </h3>
        <p className="max-w-[40ch] text-pretty text-step-body leading-[1.55] text-white/75 lg:justify-self-end">
          {service.text}
        </p>
      </div>
    </article>
  );
}

/** What the company does, after the company itself and before its projects: the heading set like the stages' copy,
 *  then the four services as a stack of cards that pins under the header, each new one sliding up over the last,
 *  which steps back, shrinks a little and darkens with its top edge showing above (react-bits ScrollStack). Each
 *  card's icon draws in when the card comes to the front and moves only while it is there. */
export function Services() {
  const reduced = useReducedMotion() ?? false;
  const stack = useRef<HTMLDivElement>(null);
  // the stack counts as reached once its top is two fifths up the screen
  const near = useInView(stack, { margin: "0px 0px -40% 0px" });
  const [front, setFront] = useState(0);

  return (
    <section id="services" aria-labelledby="services-title" className="relative bg-night text-white">
      <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <div className="text-[clamp(2rem,1.3rem+2.6vw,3.75rem)]">
          <h2 id="services-title" className="font-semibold leading-[0.98] tracking-[-0.04em]">
            <StaggeredText
              as="span"
              text={"Манай\nүйлчилгээ."}
              delay={60}
              duration={0.7}
              easing={EASE_OUT}
              from={FROM}
              to={SHOWN}
              className="block pl-[0.9em] indent-[-0.9em] *:indent-0"
            />
          </h2>
          <div className="mt-[0.45em] flex items-start gap-5 pl-[0.9em]">
            <span aria-hidden className="mt-[0.8rem] h-px w-12 shrink-0 bg-white/60 sm:w-16" />
            <p className="max-w-[38ch] text-pretty text-step-body leading-[1.55] text-white/80">
              Бид агааржуулалт, хөргөлтийн системийн бүрэн шийдлийг мэргэжлийн түвшинд үзүүлдэг.
            </p>
          </div>
        </div>
      </div>
      <div ref={stack}>
        <ScrollStack
          label="Үйлчилгээнүүд"
          variant="stack"
          scrollLength={0.9}
          peek={28}
          scaleStep={0.06}
          blur={0}
          dim={0.5}
          smooth={0.14}
          depth={3}
          cardWidth={1216}
          cardHeight={0.74}
          borderRadius={28}
          showCounter={false}
          onIndexChange={setFront}
        >
          {services.map((service, i) => (
            <Card
              key={service.title}
              service={service}
              seen={near && front >= i}
              active={near && front === i}
              reduced={reduced}
            />
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}
