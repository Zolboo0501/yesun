"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

const Contact = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            БИДЭНТЭЙ ХОЛБОО БАРИХЫГ ХҮСВЭЛ
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <motion.div
              whileHover={{ scale: 1.02, x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6  shadow-lg "
            >
              <div className="flex items-start space-x-4">
                <div className="shrink-0">
                  <Phone className="w-6 h-6 text-[#0100FD]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Утас
                  </h3>
                  <p className="text-gray-700 text-base">
                    +976-8811-4506, +976-8888-9085
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6  shadow-lg "
            >
              <div className="flex items-start space-x-4">
                <div className="shrink-0">
                  <Mail className="w-6 h-6 text-[#0100FD]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Email
                  </h3>
                  <p className="text-gray-700 text-base">
                    yusunbelchir@gmail.com
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6 shadow-lg "
            >
              <div className="flex items-start space-x-4">
                <div className="shrink-0">
                  <MapPin className="w-6 h-6 text-[#0100FD]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Хаяг
                  </h3>
                  <p className="text-gray-700 text-base">
                    Оффис: Хан уул дүүрэг 15-р хороо наадам центрийн 2-р давхарт
                  </p>
                  <p className="text-gray-700 text-base mt-2">
                    Үйлдвэр: ХУД - 10 хороо, Морингийн зам 42
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Office Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative overflow-hidden shadow-2xl"
            >
              <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
                <Image
                  src="/images/building.jpg"
                  alt="Office"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
