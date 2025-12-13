"use client";
import React from "react";
import {
  Shield,
  Clock,
  Award,
  Users,
  TrendingUp,
  Headphones,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Shield,
    title: "Баталгаатай",
    description: "1-3 жил баталгаа",
  },
  {
    icon: Clock,
    title: "24/7 Дэмжлэг",
    description: "Яаралтай үед",
  },
  {
    icon: Award,
    title: "ISO 9001",
    description: "Олон улсын стандарт",
  },
  {
    icon: Users,
    title: "50+ Баг",
    description: "Мэргэжилтнүүд",
  },
  {
    icon: TrendingUp,
    title: "98% Ханамж",
    description: "Үйлчлүүлэгчийн",
  },
  {
    icon: Headphones,
    title: "Зөвлөгөө",
    description: "Үнэ төлбөргүй",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-linear-to-br from-[#0100FD] to-[#0100FD]/90 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FE0002] rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 0 }}
                whileInView={{ opacity: 1, y: 10 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="inline-flex w-16 h-16 bg-white/10 backdrop-blur-sm  items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg mb-1">{feature.title}</h3>
                <p className="text-sm text-blue-200">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
