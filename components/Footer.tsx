"use client";
import { menu } from "@/constants/data";
import {
  Clock,
  Facebook,
  Mail,
  MapPin,
  MapPinHouse,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Image
                  src={"/images/yesunLogo.png"}
                  alt="Logo"
                  width={64}
                  height={64}
                  className="shrink-0"
                />
              </div>
              <div>
                <div className="text-2xl mb-1">Есөн бэлчир ХХК</div>
                <div className="text-sm text-gray-400">
                  Агааржуулалт ба Хөргөлтийн Систем
                </div>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md text-sm">
              Есөн бэлчир нь агааржуулалт, хөргөлтийн төхөөрөмж болон хоолойн
              системийн нийлүүлэлт, суурилуулалт, засвар үйлчилгээг үзүүлдэг
              Монголын тэргүүлэгч компани юм.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://www.facebook.com/profile.php?id=100063493841008"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-[#0100FD] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:yusunbelchir@gmail.com"
                className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-[#0100FD] transition-colors"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base mb-6 uppercase tracking-wider">
              Холбоосууд
            </h3>
            <ul className="space-y-3 flex flex-col">
              {menu.map((item, index: number) => {
                return (
                  <Link key={index} href={item.href}>
                    <button className="text-gray-400 text-sm hover:text-white transition-colors">
                      {item.title}
                    </button>
                  </Link>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base mb-6 uppercase tracking-wider">
              Холбоо барих
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-[#0100FD] shrink-0 mt-1" />
                <div className="text-sm">
                  <div className="hover:text-white">+976-8888-9085</div>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-[#0100FD] shrink-0 mt-1" />
                <div className="text-sm hover:text-white">
                  yusunbelchir@gmail.com
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPinHouse className="w-5 h-5 text-[#0100FD] shrink-0 mt-1" />
                <Link
                  href="https://maps.app.goo.gl/WNwFbL8zdkjAG2sG8?g_st=ic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-white"
                >
                  Хан уул дүүрэг 15-р хороо наадам
                  <br />
                  центрийн 2-р давхарт
                </Link>
              </li>
              <li className="flex items-start gap-3 text-gray-400 group">
                <MapPin className="w-5 h-5 text-[#0100FD] shrink-0 mt-1" />
                <Link
                  href="https://www.google.com/maps/place/Есөн+Бэлчир+ХХК+үйлдвэр+%2FFactory%2F/@47.856987,106.7556404,344m/data=!3m1!1e3!4m6!3m5!1s0x5d96eb00274f4edd:0x1877f58312c82a8c!8m2!3d47.8570456!4d106.7557945!16s%2Fg%2F11vs7nhrgh?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors"
                >
                  ХУД - 10 хороо,
                  <br />
                  Морингийн зам 42
                </Link>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Clock className="w-5 h-5 text-[#0100FD] shrink-0 mt-1" />
                <div className="text-sm hover:text-white">
                  Цагийн хуваарь : 9:00 - 19:00
                  <br />
                  Даваа - Бямба
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
