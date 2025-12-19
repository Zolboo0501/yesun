"use client";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";

export function EngineeringTeam() {
  return (
    <section id="about" className="pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center justify-center flex">
        <motion.div className="relative flex-1 w-[80%] overflow-hidden shadow-xl max-h-[600px]">
          <ImageWithFallback
            src="/images/engineering6.JPG"
            alt="Modern building"
            className="w-full h-full object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
