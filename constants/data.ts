const menu = [
  {
    title: "Бидний тухай",
    href: "/about",
  },
  {
    title: "Хамт олон",
    href: "/ourTeam",
  },

  {
    title: "Төслүүд",
    href: "/projects",
  },
  {
    title: "Үйлдвэрлэл",
    href: "/factory",
  },

  {
    title: "Түнш",
    href: "/partner",
  },
  {
    title: "Бүтээгдэхүүн",
    href: "/products",
  },
  {
    title: "Холбоо барих",
    href: "/contact",
  },
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yusunbelchir.mn";

const contact = {
  facebook: "https://www.facebook.com/profile.php?id=100063493841008",
  messenger: "https://m.me/100063493841008",
  email: "yusunbelchir@gmail.com",
  phone: "+976-8888-9085",
  phone2: "+976-8811-4570",
};

// The office and the factory: their addresses and pins (the office's decoded from its plus code WW36+6W8, the
// factory's from its Google Maps link). The contact page shows each on a map, and the footer links to them there.
const places = [
  { id: "office", label: "Оффис", lines: ["Хан-Уул дүүрэг, 15-р хороо", "Наадам центр, 2 давхар"], pin: [47.903037, 106.912328] },
  { id: "factory", label: "Үйлдвэр", lines: ["Хан-Уул дүүрэг, 10-р хороо", "Морингийн зам 42"], pin: [47.8570456, 106.7557945] },
] as const;

export { contact, menu, places, siteUrl };
