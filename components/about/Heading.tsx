"use client";
import StaggeredText from "@/components/react-bits/staggered-text";

// The about page's section headings, set and moving like the home page's: the house Headline step, its words rising a
// few pixels into place as the heading comes into view, no blur and no overshoot.
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const FROM = { opacity: 0, y: 14 };
const SHOWN = { opacity: 1, y: 0 };

/** `center` sets the words centred (they run in a wrapping flex row, so they are centred as items, not as text). */
export function Heading({ id, text, center = false }: { id: string; text: string; center?: boolean }) {
  return (
    <h2
      id={id}
      className="text-balance text-[clamp(2rem,1.3rem+2.6vw,3.75rem)] font-semibold leading-[0.98] tracking-[-0.04em]"
    >
      <StaggeredText
        as="span"
        text={text}
        delay={50}
        duration={0.7}
        easing={EASE_OUT}
        from={FROM}
        to={SHOWN}
        className={center ? "block justify-center text-center" : "block"}
      />
    </h2>
  );
}
