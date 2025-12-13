"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MENU } from "@/constants/data";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 mb-12 flex h-[7vh] w-full items-center px-4 sm:px-6  bg-white md:px-[10%]`}
      >
        <div className="flex">
          <Link
            href={`/`}
            onClick={() => setMobileMenuOpen(false)}
            className="flex flex-row items-center gap-2"
          >
            <Image
              src={"/images/yesunLogo.png"}
              alt="logo"
              width={100}
              height={100}
              className="h-7 w-auto"
            />
            <span className="text-lg text-primary font-medium">
              Есөн бэлчир ХХК{" "}
            </span>
          </Link>
        </div>

        <nav className="hidden h-full lg:flex ml-auto">
          <NavigationMenu className="flex h-full">
            <NavigationMenuList className="flex h-full items-center gap-12">
              {MENU.map((menuItem, index) => {
                return (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={"/"}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center text-foreground px-4 py-2 text-sm hover:text-primary transition-colors"
                      >
                        {menuItem}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* <div
        ref={mobileRef}
        className={`absolute left-1/2 top-[7vh] w-11/12 -translate-x-1/2 transform overflow-hidden overflow-y-auto bg-white shadow-lg transition-[max-height,opacity] duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen
            ? "max-h-[70vh] space-y-2 p-4 opacity-100"
            : "max-h-0 space-y-0 p-0 opacity-0"
        }`}
      >
        {menus.map((menuItem) => {
          const sections = menuItem.menu ?? menuItem.menuEn ?? [];
          const isPriorityMobile =
            menuItem.titleEn === "Priority" || menuItem.title === "Priority";
          return (
            <div key={menuItem.title}>
              {isPriorityMobile ? (
                <Link
                  href={`/${locale}/priority`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-medium"
                >
                  {menuItem.title}
                </Link>
              ) : sections.length === 0 ? (
                <Link
                  href={toRoute(menuItem)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-medium"
                >
                  {menuItem.title}
                </Link>
              ) : (
                <details className="group">
                  <summary className="!hover:bg-gray-100 flex cursor-pointer items-center justify-between rounded px-3 py-2 font-medium">
                    {menuItem.title}
                    <HiChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="space-y-1 pl-4">
                    {sections.map((section, idx) => {
                      const subs =
                        menuItem.submenus?.[idx] ??
                        menuItem.submenusEn?.[idx] ??
                        [];

                      return (
                        <div className="px-3 pb-2" key={section}>
                          <div className="text-sm font-bold">{section}</div>
                          <div className="space-y-1 pl-2">
                            {(subs as SubmenuItem[]).map((sub) => {
                              const href =
                                typeof sub === "string"
                                  ? toSubRoute(menuItem, section, sub)
                                  : sub.link;
                              const name =
                                typeof sub === "string" ? sub : sub.name;
                              return (
                                <Link
                                  key={name}
                                  href={href}
                                  target={
                                    href?.startsWith("http")
                                      ? "_blank"
                                      : "_self"
                                  }
                                  rel={
                                    href?.startsWith("http")
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  className="block rounded-xl px-3 py-1 text-sm hover:bg-gray-100"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  - {name}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </details>
              )}
            </div>
          );
        })}
      </div> */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <motion.button
            className="lg:hidden relative z-50"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
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
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              ref={mobileRef}
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
                {MENU.map((menuItem, index) => {
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
                          <span className="text-sm">{menuItem}</span>
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
      </header>
    </>
  );
};

export default Header;
