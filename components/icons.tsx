import type { SVGProps } from "react";

// A few line icons drawn at one weight (2px, round ends), so the header and hero need no icon library.
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8.5h16M4 15.5h16" />
    </svg>
  );
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 6.5h17v11h-17zM3.5 7l8.5 6.5L20.5 7" />
    </svg>
  );
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M8.2 3.5 10 8l-2.2 1.6a11 11 0 0 0 6.6 6.6L16 14l4.5 1.8v3.2a1.5 1.5 0 0 1-1.6 1.5C10.8 20 4 13.2 3.5 5.1A1.5 1.5 0 0 1 5 3.5Z" />
    </svg>
  );
}

/** The Facebook "f", filled, as the brand draws it. */
export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21Z" />
    </svg>
  );
}

/** The Messenger bubble with its bolt cut out, filled, as the brand draws it. */
export function MessengerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        d="M12 2.5c-5.3 0-9.5 3.9-9.5 9 0 2.8 1.3 5.3 3.4 7l.1 2.8c0 .5.6.8 1 .6l2.7-1.3c.7.2 1.5.3 2.3.3 5.3 0 9.5-3.9 9.5-9S17.3 2.5 12 2.5ZM6.5 14.3l3.6-4.7 3 2.3 4.4-2.2-3.6 4.7-3-2.3Z"
      />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
