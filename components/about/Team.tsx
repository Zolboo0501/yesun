"use client";
import { ScrollMask } from "@/components/react-bits/scroll-mask";
import { useReducedMotion } from "motion/react";
import { getImageProps } from "next/image";

const team = {
  src: "/images/person3.jpg",
  width: 2048,
  height: 1365,
  alt: "Есөн Бэлчирийн хамт олон барилгын талбай дээр",
};
// ScrollMask draws a plain img, so the photo goes through Next's optimizer here, at its full width
const teamSrc = getImageProps({ ...team, sizes: "100vw" }).props.src;

/** The whole team, opened through react-bits' ScrollMask: a soft iris widens from the middle of the group from the
 *  moment the stage scrolls into view, and opens fully while it is pinned under the header, square-cornered on the
 *  white ground. Under reduced motion the iris follows the scroll without easing and the photo does not zoom. */
export function Team() {
  const reduced = useReducedMotion() ?? false;
  return (
    <ScrollMask
      variant="iris"
      src={teamSrc}
      alt={team.alt}
      scrollLength={1.1}
      lead={1}
      settle={0.8}
      feather={18}
      originX={50}
      originY={45}
      zoom={reduced ? 1 : 1.08}
      calm={reduced}
      radius={0}
      background="var(--color-white)"
    >
      <p className="absolute bottom-5 left-5 text-sm font-medium text-white/85 sm:bottom-7 sm:left-7">
        Есөн Бэлчирийн хамт олон
      </p>
    </ScrollMask>
  );
}
