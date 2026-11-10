"use client";

import { memo, useCallback, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

export interface PageFlipLeaf {
  id?: string;
  /** An image URL, or any content for the page. */
  front: string | ReactNode;
  /** An image URL, or any content for the page. */
  back: string | ReactNode;
  frontAlt?: string;
  backAlt?: string;
}

export interface PageFlipProps {
  /** Leaves of the book, each with a front and a back. */
  pages?: PageFlipLeaf[];
  /** Width of a single leaf in pixels. */
  pageWidth?: number;
  /** Height of a single leaf in pixels. */
  pageHeight?: number;
  /** Corner radius of a leaf in pixels. */
  pageRadius?: number;
  /** Paper colour showing through while an image loads. */
  pageColor?: string;
  /** Perspective depth applied to the scene, in pixels. */
  perspective?: number;
  /** How far the book slides aside once a leaf is turned, in pixels. */
  spineShift?: number;
  /** Angle a turned leaf rotates through, in degrees. */
  turnAngle?: number;
  /** Angle an unopened leaf tilts to when the pointer is over it. */
  peekAngle?: number;
  /** Seconds a single turn takes. */
  duration?: number;
  /** Seconds added per leaf when the whole book closes at once. */
  stagger?: number;
  /** Easing curve of the turn. */
  ease?: "easeInOut" | "easeOut" | "circOut" | "backOut";
  /** Drop shadow strength behind each leaf, 0 removes it. */
  shadow?: number;
  /** Interaction that turns a leaf. Hover riffles through the book. */
  trigger?: "click" | "hover";
  /** Close every turned leaf when the pointer leaves the scene. */
  closeOnLeave?: boolean;
  /** Close every turned leaf on a click beside the book. */
  closeOnBackground?: boolean;
  /** Enable pointer and keyboard interaction. */
  interactive?: boolean;
  /** Let each leaf take keyboard focus; turn it off when the page gives the book controls of its own. */
  keyboard?: boolean;
  /** Number of turned leaves, to drive the book from outside; leave it out and the book keeps its own. */
  open?: number;
  /** Called with the number of turned leaves a click or hover asks for. */
  onOpenChange?: (open: number) => void;
  /** Optional className applied to the root. */
  className?: string;
  /** Optional inline style applied to the root. */
  style?: CSSProperties;
  /** Drawn under the leaves and moving with the book, such as the edges of its pages beside them. */
  children?: ReactNode;
}

const CURVES = {
  easeInOut: [0.65, 0, 0.35, 1],
  easeOut: [0.16, 1, 0.3, 1],
  circOut: [0, 0.55, 0.45, 1],
  backOut: [0.34, 1.56, 0.64, 1],
} as const;

const DEFAULT_PAGES: PageFlipLeaf[] = [
  {
    id: "atrium",
    front:
      "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=700&auto=format&fit=crop",
    back: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=700&auto=format&fit=crop",
    frontAlt: "Glass atrium seen from below",
    backAlt: "Corporate tower against an open sky",
  },
  {
    id: "vault",
    front:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=700&auto=format&fit=crop",
    back: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=700&auto=format&fit=crop",
    frontAlt: "White concrete facade in daylight",
    backAlt: "Repeating window lattice on a high rise",
  },
  {
    id: "terrace",
    front:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=700&auto=format&fit=crop",
    back: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=700&auto=format&fit=crop",
    frontAlt: "Terraced building stepping into the sky",
    backAlt: "Row of arches along a shaded walkway",
  },
  {
    id: "canopy",
    front:
      "https://images.unsplash.com/photo-1470075801209-17f9ec0cada6?q=80&w=700&auto=format&fit=crop",
    back: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=700&auto=format&fit=crop",
    frontAlt: "Steel canopy over a public square",
    backAlt: "Concrete stairwell curving upward",
  },
  {
    id: "ridge",
    front:
      "https://images.unsplash.com/photo-1470723710355-95304d8aece4?q=80&w=700&auto=format&fit=crop",
    back: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=700&auto=format&fit=crop",
    frontAlt: "Roofline ridge cutting across the skyline",
    backAlt: "Modern house framed by clean geometry",
  },
];

/** One side of a leaf: an image for a URL, otherwise the content as it is. */
function Face({
  content,
  alt,
  paper,
  radius,
  back = false,
}: {
  content: string | ReactNode;
  alt: string;
  paper: string;
  radius: number;
  back?: boolean;
}) {
  const style: CSSProperties = {
    background: paper,
    borderRadius: radius,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transform: back ? "rotateY(180deg) translateZ(1px)" : undefined,
  };
  if (typeof content === "string") {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- plain URLs stay plain images; pass next/image as content
      <img
        src={content}
        alt={alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={style}
      />
    );
  }
  return (
    <div className="absolute inset-0 overflow-hidden" style={style}>
      {content}
    </div>
  );
}

interface LeafProps {
  index: number;
  total: number;
  front: string | ReactNode;
  back: string | ReactNode;
  frontAlt: string;
  backAlt: string;
  turned: boolean;
  /** the uppermost leaf on its side of the spine: only it casts a shadow, or the stacked leaves' shadows add up */
  top: boolean;
  peek: boolean;
  delay: number;
  width: number;
  height: number;
  radius: number;
  paper: string;
  turnAngle: number;
  peekAngle: number;
  duration: number;
  curve: readonly number[];
  shadow: number;
  interactive: boolean;
  keyboard: boolean;
  onSelect: (index: number) => void;
  onReach: (index: number) => void;
  onRelease: () => void;
}

const Leaf = memo(function Leaf({
  index,
  total,
  front,
  back,
  frontAlt,
  backAlt,
  turned,
  top,
  peek,
  delay,
  width,
  height,
  radius,
  paper,
  turnAngle,
  peekAngle,
  duration,
  curve,
  shadow,
  interactive,
  keyboard,
  onSelect,
  onReach,
  onRelease,
}: LeafProps) {
  const spin = useMotionValue(0);
  const stack = useTransform(spin, (value) =>
    value < -turnAngle / 2 ? total + index + 1 : total - index,
  );
  const focusable = interactive && keyboard;

  return (
    <motion.div
      className="absolute"
      style={{
        width,
        height,
        rotateY: spin,
        zIndex: stack,
        transformOrigin: "left center",
        transformStyle: "preserve-3d",
        borderRadius: radius,
        cursor: interactive ? "pointer" : "default",
        boxShadow:
          shadow > 0 && top
            ? `${Math.round(4 * shadow)}px ${Math.round(6 * shadow)}px ${Math.round(
                34 * shadow,
              )}px rgba(0,0,0,${Math.min(shadow * 0.75, 1)})`
            : "none",
      }}
      animate={{ rotateY: turned ? -turnAngle : peek ? -peekAngle : 0 }}
      transition={{
        duration,
        delay,
        ease: curve as unknown as [number, number, number, number],
      }}
      onPointerEnter={() => onReach(index)}
      onPointerLeave={onRelease}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(index);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(index);
        }
      }}
      role={focusable ? "button" : undefined}
      aria-pressed={focusable ? turned : undefined}
      tabIndex={focusable ? 0 : -1}
    >
      <Face content={front} alt={frontAlt} paper={paper} radius={radius} />
      <Face content={back} alt={backAlt} paper={paper} radius={radius} back />
    </motion.div>
  );
});

const PageFlip = ({
  pages = DEFAULT_PAGES,
  pageWidth = 220,
  pageHeight = 320,
  pageRadius = 4,
  pageColor = "#f4f4f4",
  perspective = 1200,
  spineShift = 110,
  turnAngle = 180,
  peekAngle = 10,
  duration = 0.55,
  stagger = 0.08,
  ease = "easeInOut",
  shadow = 0.3,
  trigger = "click",
  closeOnLeave = true,
  closeOnBackground = true,
  interactive = true,
  keyboard = true,
  open: openProp,
  onOpenChange,
  className,
  style,
  children,
}: PageFlipProps) => {
  const book = pages.length > 0 ? pages : DEFAULT_PAGES;
  const total = book.length;

  const [ownOpen, setOwnOpen] = useState(0);
  const open = openProp ?? ownOpen;
  const [hovered, setHovered] = useState(-1);
  const [cascade, setCascade] = useState(false);

  const curve = CURVES[ease] ?? CURVES.easeInOut;

  const change = useCallback(
    (next: number) => {
      if (openProp === undefined) setOwnOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const select = useCallback(
    (index: number) => {
      if (!interactive) return;
      setCascade(false);
      change(index < open ? index : index + 1);
    },
    [interactive, open, change],
  );

  const reach = useCallback(
    (index: number) => {
      if (!interactive) return;
      setHovered(index);
      if (trigger !== "hover") return;
      setCascade(false);
      change(index + 1);
    },
    [interactive, trigger, change],
  );

  const release = useCallback(() => {
    setHovered(-1);
  }, []);

  const shutAll = useCallback(() => {
    setCascade(true);
    change(0);
  }, [change]);

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        className,
      )}
      style={{ perspective: `${perspective}px`, ...style }}
      onClick={closeOnBackground ? shutAll : undefined}
      onPointerLeave={() => {
        setHovered(-1);
        if (closeOnLeave) shutAll();
      }}
    >
      <motion.div
        className="relative"
        style={{
          width: pageWidth,
          height: pageHeight,
          perspective: `${perspective}px`,
          transformStyle: "preserve-3d",
        }}
        // open, the spread is centred; shut on either cover, the closed book is
        animate={{ x: open <= 0 ? 0 : open >= total ? 2 * spineShift : spineShift }}
        transition={{
          duration: Math.max(duration * 0.8, 0.1),
          ease: "easeOut",
        }}
      >
        {children}
        {book.map((leaf, index) => {
          const turned = index < open;
          return (
            <Leaf
              key={leaf.id ?? `leaf-${index}`}
              index={index}
              total={total}
              front={leaf.front}
              back={leaf.back}
              frontAlt={leaf.frontAlt ?? ""}
              backAlt={leaf.backAlt ?? ""}
              turned={turned}
              top={index === open || index === open - 1}
              peek={
                interactive && !turned && hovered === index && index === open
              }
              delay={cascade && !turned ? (total - 1 - index) * stagger : 0}
              width={pageWidth}
              height={pageHeight}
              radius={pageRadius}
              paper={pageColor}
              turnAngle={turnAngle}
              peekAngle={peekAngle}
              duration={duration}
              curve={curve}
              shadow={shadow}
              interactive={interactive}
              keyboard={keyboard}
              onSelect={select}
              onReach={reach}
              onRelease={release}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export default PageFlip;
