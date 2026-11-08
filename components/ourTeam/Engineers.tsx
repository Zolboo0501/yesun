"use client";
import { Heading } from "@/components/about/Heading";
import { Part } from "@/components/about/Part";
import About1, { type About1Member } from "@/components/blocks/about-1";

// The engineers, from the old engineering greeting page (/greeting/engineering now leads to #engineers); the two
// safety engineers have no photo yet and show their initials.
const members: About1Member[] = [
  { name: "Н.Энхмэнд", role: "Ерөнхий менежер", image: "/images/member.jpg", text: "2011 оноос хойш" },
  { name: "Б.Бэхбат", role: "Инженерийн багийн ахлагч", image: "/images/member2.jpg", text: "17 жилийн туршлагатай" },
  { name: "Ц.Хосбаяр", role: "ХАС-ийн мэргэшсэн инженер", image: "/images/member3.jpg", text: "5 жилийн туршлагатай" },
  { name: "Д.Хангай", role: "ХАС-ийн мэргэшсэн инженер", image: "/images/member4.jpg", text: "5 жилийн туршлагатай" },
  { name: "С.Энхзаяа", role: "ХАБЭА-н инженер" },
  { name: "М.Далайсайхан", role: "ХАБЭА-н инженер" },
];

/** The engineering team through the repo's about-1 block: the roster on the left, the portraits on the right. */
export function Engineers() {
  return (
    <Part id="engineers" labelledBy="engineers-title">
      <About1
        members={members}
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
