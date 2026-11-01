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
  // {
  //   title: "Бүтээгдэхүүн",
  //   href: "/products",
  // },
  {
    title: "Холбоо барих",
    href: "/contact",
  },
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yusunbelchir.mn";

const contact = {
  facebook: "https://www.facebook.com/profile.php?id=100063493841008",
  email: "yusunbelchir@gmail.com",
  phone: "+976-8888-9085",
  phone2: "+976-8811-4570",
};

export { contact, menu, siteUrl };
