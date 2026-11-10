"use client";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/** Smooth wheel scrolling for the whole site. Lenis eases the page's own scroll, so the sticky stages and every
 *  scroll-linked animation follow it with no change of their own. Touch keeps the device's scroll and reduced motion
 *  tracks the wheel 1:1 (Lenis's defaults); while a drawer has locked the page (body overflow hidden), the wheel is
 *  left to the browser so the page behind stays put and the drawer scrolls itself. */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      stopInertiaOnNavigate: true,
      virtualScroll: () => document.body.style.overflow !== "hidden",
    });
    // A press ends the glide where it is, so a button that scrolls the page itself (a scene tab, a step line, a
    // filter) is not overridden by a glide still running from the wheel.
    const settle = () => {
      if (lenis.isScrolling === "smooth") lenis.scrollTo(lenis.actualScroll, { immediate: true });
    };
    window.addEventListener("pointerdown", settle);
    return () => {
      window.removeEventListener("pointerdown", settle);
      lenis.destroy();
    };
  }, []);
  return null;
}
