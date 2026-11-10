"use client";
import { Heading } from "@/components/about/Heading";
import { Part } from "@/components/about/Part";
import About1 from "@/components/blocks/about-1";
import { engineers } from "@/constants/data";

/** The engineering team through the repo's about-1 block: the roster on the left, the portraits on the right. */
export function Engineers() {
  return (
    <Part id="engineers" labelledBy="engineers-title">
      <About1
        members={engineers}
        header={
          <>
            <Heading id="engineers-title" text="Инженер техникийн алба" />
            <p className="mt-5 max-w-[56ch] text-pretty text-step-body leading-[1.65] text-ink/70">
              Зураг төсөл, тооцоо, угсралт, ашиглалтыг нэг дор хариуцдаг мэргэшсэн баг.
            </p>
          </>
        }
      />
    </Part>
  );
}
