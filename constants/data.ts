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

// The engineers, as the team page lists them (the home page shows the four with photographs); the two safety
// engineers have no photo yet and show their initials there.
const engineers: { name: string; role: string; image?: string; text?: string }[] = [
  { name: "Н.Энхмэнд", role: "Ерөнхий менежер", image: "/images/member.jpg", text: "2011 оноос хойш" },
  { name: "Б.Бэхбат", role: "Инженерийн багийн ахлагч", image: "/images/member2.jpg", text: "17 жилийн туршлагатай" },
  { name: "Ц.Хосбаяр", role: "ХАС-ийн мэргэшсэн инженер", image: "/images/member3.jpg", text: "5 жилийн туршлагатай" },
  { name: "Д.Хангай", role: "ХАС-ийн мэргэшсэн инженер", image: "/images/member4.jpg", text: "5 жилийн туршлагатай" },
  { name: "С.Энхзаяа", role: "ХАБЭА-н инженер" },
  { name: "М.Далайсайхан", role: "ХАБЭА-н инженер" },
];

export { contact, engineers, menu, places, siteUrl };
