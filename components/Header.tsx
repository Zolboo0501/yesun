"use client";
import { menu } from "@/constants/data";
import { Facebook, Mail, Menu, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ImageWithFallback } from "./ImageWithFallback";

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Main Header */}
      <div className="h-[4vh] bg-linear-to-l from-[#0100FD] w-full  to-[black]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full lg:px-8 h-full flex items-center">
          <div className="w-full flex flex-row justify-end">
            <button
              className="border-r border-white px-4 flex justify-center items-center"
              onClick={() => scrollToSection("footer")}
            >
              <Facebook color="white" size={16} />
            </button>
            <button
              className="border-r border-white px-4 flex justify-center items-center"
              onClick={() => scrollToSection("footer")}
            >
              <Mail color="white" size={16} />
            </button>
            <button
              className="pl-4 flex justify-center items-center"
              onClick={() => scrollToSection("footer")}
            >
              <Phone color="white" size={16} />
            </button>
          </div>
        </div>
      </div>

      <header
        className={`bg-white/95 backdrop-blur-sm transition-all duration-300 h-[7vh]  ${
          isScrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link
              href={"/"}
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <ImageWithFallback
                  src={"/images/yesunLogo.png"}
                  alt="header-logo"
                  width={64}
                  height={64}
                  className="w-24 h-12"
                />
              </div>
              <div className="hidden sm:block shrink-0">
                <div className="text-lg font-medium text-primary">
                  Есөн бэлчир ХХК{" "}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 justify-end w-full">
              {menu.map(
                (item: { title: string; href: string }, index: number) => (
                  <Link href={item.href} key={index}>
                    <button
                      className={`text-sm hover:border-b-2 hover:border-[#0100FD] hover:text-[#0100FD] transition-colors ${
                        pathname.includes(item.href)
                          ? "border-b-2 border-[#0100FD] text-[#0100FD]"
                          : "text-gray-700"
                      }`}
                    >
                      {item.title}
                    </button>
                  </Link>
                )
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                ref={toggleButtonRef}
                className="lg:hidden relative z-50"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                ref={mobileMenuRef}
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                  transition: {
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                    height: {
                      duration: 0.4,
                    },
                    opacity: {
                      duration: 0.25,
                      delay: 0.1,
                    },
                  },
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: -20,
                  transition: {
                    duration: 0.3,
                    ease: [0.4, 0, 1, 1],
                  },
                }}
                className="absolute left-1/2 top-[7vh] w-11/12 -translate-x-1/2 overflow-hidden overflow-y-auto bg-white shadow-2xl  border border-gray-100 lg:hidden"
              >
                <motion.div
                  className="space-y-2 p-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.07,
                        delayChildren: 0.2,
                      },
                    },
                    hidden: {},
                  }}
                >
                  {menu.map((menuItem, index) => {
                    return (
                      <Link
                        href={menuItem.href}
                        key={index}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: {
                              opacity: 1,
                              x: 0,
                              transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 24,
                              },
                            },
                          }}
                        >
                          <motion.details
                            className="group"
                            whileHover={{ scale: 1.02 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 17,
                            }}
                          >
                            <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-medium hover:bg-blue-50 transition-colors duration-200">
                              <span className="text-sm">{menuItem.title}</span>
                            </summary>
                            <motion.div
                              className="space-y-1 pl-4 pt-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              {/* Submenu items can be added here */}
                            </motion.div>
                          </motion.details>
                        </motion.div>
                      </Link>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Mobile Navigation */}
        </div>
      </header>
    </div>
  );
}
