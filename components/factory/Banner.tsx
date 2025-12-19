"use client";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";

const Team = () => {
  return (
    <section id="team" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl text-gray-900 mb-6 font-bold">
            Бидний <span className="text-[#0100FD]">баг</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Мэргэжлийн өндөр түвшинтэй, туршлагатай хамт олон
          </p>
        </motion.div>

        {/* Single Banner Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group overflow-hidden shadow-2xl"
        >
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[600px]">
            <ImageWithFallback
              src="/images/person3.jpg"
              alt="Бидний баг"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
