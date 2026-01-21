"use client";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";

const teamMembers = [
  {
    id: 1,
    name: "Н.Энхмэнд",
    position: "Ерөнхий менежер",
    image: "/images/member.jpg",
    description:
      "Ерөнхий менежерээр анх үүсгэн байгуулагдсан 2011 оноос хойш ажиллаж байна.",
  },
  {
    id: 2,
    name: "Б.Бэхбат",
    position: "ХАС /Мэргэшсэн инженер/",
    image: "/images/member2.jpg",
    description:
      "ХАС-ийн инженерээр 17 жил ажиллаж Халаалт, агаар сэлгэлт, хөргөлтийн  системийн угсралт, засварын чиглэлээр ажил гүйцэтгэж байна.",
  },
  {
    id: 3,
    name: "Ц.Хосбаяр",
    position: "ХАС /Мэргэшсэн инженер/",
    image: "/images/member3.jpg",
    description:
      "ХАС-ийн инженерээр 5 жил ажиллаж Агаар сэлгэлт, хөргөлтийн  системийн угсралт, засварын чиглэлээр ажил гүйцэтгэж байна.",
  },
  {
    id: 4,
    name: "Д.Хангай",
    position: "ХАС /Мэргэшсэн инженер/",
    image: "/images/member4.jpg",
    description:
      "ХАС-ийн инженерээр 5 жил ажиллаж Агаар сэлгэлт, хөргөлтийн  системийн угсралт, засварын чиглэлээр ажил гүйцэтгэж байна.",
  },
  {
    id: 5,
    name: "С.Энхзаяа",
    position: "ХАБЭА-Инженер",
    image: "/images/woman.png",
  },
  {
    id: 6,
    name: "М.Далайсайхан",
    position: "ХАБЭА-Инженер",
    image: "/images/woman.png",
  },
];

const EngineeringGreeting = () => {
  return (
    <section id="team" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl lg:text-5xl uppercase border-b pb-2 border-b-black text-gray-900 mb-6 font-bold">
            <span className="text-[#0100FD] "> Инженер техникийн алба</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-4xl text-justify mx-auto">
            Есөн Бэлчир ХХК-ийн агаар сэлгэлт, хөргөлтийн инженерийн баг нь
            агаар сэлгэлт, хөргөлтийн системийн зураг төсөл, тооцоо, угсралт,
            ашиглалтыг нэгэн цогц байдлаар хэрэгжүүлдэг мэргэшсэн баг юм. Бид
            төслийн эхнээс дуусах хүртэл оновчтой инженерийн шийдэл, найдвартай
            гүйцэтгэлийг баталгаажуулна.
          </p>
        </motion.div>
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className="bg-gray-50  shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-row h-full">
                    <div className="w-2/5 relative">
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-3/5 p-4 flex flex-col justify-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm font-semibold text-[#0100FD] mb-2">
                        {member.position}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed text-justify">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default EngineeringGreeting;
