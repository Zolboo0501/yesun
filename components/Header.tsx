"use client";
import { menu } from "@/constants/data";
import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-all duration-300 h-[7vh]  ${
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
                <Image
                  src={"/images/yesunLogo.png"}
                  alt="Logo"
                  width={64}
                  height={64}
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
                    <button className="text-gray-700 text-sm hover:text-[#0100FD] transition-colors">
                      {item.title}
                    </button>
                  </Link>
                )
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
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
                className="absolute left-1/2 top-[7vh] w-11/12 -translate-x-1/2 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-2xl border border-gray-100 lg:hidden"
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
                      <motion.div
                        key={index}
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
                          <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 font-medium hover:bg-blue-50 transition-colors duration-200 active:scale-95">
                            <span className="text-sm">{menuItem.title}</span>
                            <motion.div className="group-open:rotate-180 transition-transform duration-300">
                              <ChevronDown className="h-4 w-4 text-primary" />
                            </motion.div>
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
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Mobile Navigation */}
        </div>
      </header>
    </>
  );
}
