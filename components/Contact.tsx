"use client";
import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Таны хүсэлтийг хүлээн авлаа! Бид тантай удахгүй холбогдох болно.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[#0100FD]/10 text-[#0100FD] rounded-full text-sm uppercase tracking-wider mb-4">
            Холбоо барих
          </span>
          <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
            Бидэнтэй <span className="text-[#0100FD]">холбогдох</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Та бидэнтэй дараах хаягаар холбогдож болно
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#0100FD] to-[#FE0002] rounded-xl flex items-center justify-center">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-3">Утас</h3>
                  <p className="text-gray-600 mb-2">+976 1123-4567</p>
                  <p className="text-gray-600">+976 9911-2233</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#0100FD] to-[#FE0002] rounded-xl flex items-center justify-center">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-3">Имэйл</h3>
                  <p className="text-gray-600 mb-2">info@ventcool.mn</p>
                  <p className="text-gray-600">sales@ventcool.mn</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#0100FD] to-[#FE0002] rounded-xl flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-3">Хаяг</h3>
                  <p className="text-gray-600">
                    Чингисийн өргөн чөлөө 15,
                    <br />
                    Сүхбаатар дүүрэг,
                    <br />
                    Улаанбаатар хот, Монгол улс
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#0100FD] to-[#FE0002] rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-3">Ажлын цаг</h3>
                  <p className="text-gray-600 mb-2">
                    Даваа - Баасан: 9:00 - 18:00
                  </p>
                  <p className="text-gray-600 mb-2">Бямба: 10:00 - 15:00</p>
                  <p className="text-[#FE0002] mt-3">
                    Яаралтай тохиолдолд: 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-10 shadow-lg">
              <h3 className="text-3xl text-gray-900 mb-8">
                Санал хүсэлт илгээх
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">
                      Овог, нэр <span className="text-[#FE0002]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0100FD] focus:border-transparent outline-none transition-all"
                      placeholder="Таны нэр"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">
                      Имэйл хаяг <span className="text-[#FE0002]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0100FD] focus:border-transparent outline-none transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2">
                      Утасны дугаар <span className="text-[#FE0002]">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0100FD] focus:border-transparent outline-none transition-all"
                      placeholder="9911-2233"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="service"
                      className="block text-gray-700 mb-2"
                    >
                      Үйлчилгээний төрөл{" "}
                      <span className="text-[#FE0002]">*</span>
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0100FD] focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Сонгох</option>
                      <option value="ventilation">Агааржуулалтын систем</option>
                      <option value="cooling">Хөргөлтийн төхөөрөмж</option>
                      <option value="piping">Хоолойн систем</option>
                      <option value="automation">Автоматжуулалт</option>
                      <option value="maintenance">Засвар үйлчилгээ</option>
                      <option value="consulting">Зөвлөх үйлчилгээ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">
                    Мессеж <span className="text-[#FE0002]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0100FD] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Таны хүсэлт, асуулт..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0100FD] to-[#FE0002] text-white px-8 py-5 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <Send className="w-6 h-6" />
                  Илгээх
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
