import { contact } from "@/constants/data";
import { FacebookIcon, MailIcon, MessengerIcon, PhoneIcon } from "./icons";

// The channels in the order the client asked for. One without a link yet (Messenger, for now) is left out.
const channels = [
  { name: "Facebook", tip: "Facebook", href: contact.facebook, Icon: FacebookIcon, away: true },
  { name: "Messenger", tip: "Messenger", href: contact.messenger, Icon: MessengerIcon, away: true },
  { name: `Залгах: ${contact.phone}`, tip: contact.phone, href: `tel:${contact.phone}`, Icon: PhoneIcon },
  { name: `Имэйл бичих: ${contact.email}`, tip: contact.email, href: `mailto:${contact.email}`, Icon: MailIcon },
].filter((channel) => channel.href);

/** The company's channels on every page, in a white pill: down the left edge, halfway up the screen, from lg; along
 *  the foot of the screen on phones and tablets, where a bar at the side would cover the text. Each name shows beside its icon
 *  under the pointer or on focus. */
export function ContactBar() {
  return (
    <nav
      aria-label="Холбоо барих сувгууд"
      className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex justify-center lg:inset-x-auto lg:bottom-auto lg:left-5 lg:top-1/2 lg:-translate-y-1/2"
    >
      <ul className="pointer-events-auto flex gap-1 rounded-full border border-ink/[0.08] bg-white p-1.5 text-ink lg:p-1 shadow-[0_18px_40px_-16px_rgb(11_16_32/0.4)] lg:flex-col">
        {channels.map(({ name, tip, href, Icon, away }) => (
          <li key={href} className="group relative">
            <a
              href={href}
              {...(away && { target: "_blank", rel: "noopener noreferrer" })}
              aria-label={away ? `${name} (шинэ цонхонд нээгдэнэ)` : name}
              className="grid size-11 place-items-center rounded-full transition-colors duration-200 hover:bg-ink/[0.06] hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:size-10"
            >
              <Icon className="size-5 lg:size-[18px]" />
            </a>
            <span
              aria-hidden
              className="pointer-events-none absolute left-full top-1/2 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 lg:block"
            >
              {tip}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
