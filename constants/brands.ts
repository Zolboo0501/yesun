// The six official partner brands, shared by the partner page (components/partner/Brands.tsx) and the footer's
// partners orbit (components/Footer.tsx).

export type Brand = {
  slug: string;
  name: string;
  logo: string;
  /** the logo files carry different margins; this evens their size */
  logoScale: number;
  /** the same for the footer orbit's round discs (components/Footer.tsx), each logo's box filling its disc */
  orbitScale: number;
  country: string;
  since?: string;
  category: string;
  summary: string;
  points: string[];
  url: string;
  domain: string;
  photos: { src: string; alt: string }[];
};

// The six brands from the old partner page, each cut to one line and three facts, all from the client's own copy.
export const brands: Brand[] = [
  {
    slug: "kanion",
    logoScale: 1.9,
    orbitScale: 0.66,
    name: "KANION",
    logo: "/images/kanon.webp",
    country: "Хятад",
    category: "Агааржуулагч, дулааны насос",
    summary: "Сүүлийн үеийн технологиор эрчим хүч хэмнэсэн агааржуулагч, дулааны насос үйлдвэрлэдэг.",
    points: ["3D DC инвертер", "Нам чимээ", "Эрчим хүч хэмнэлт"],
    url: "https://www.kanionco.com/",
    domain: "kanionco.com",
    photos: [
      { src: "/images/kanon2.webp", alt: "KANION агааржуулагчийн дотор, гадна блок" },
      { src: "/images/kanon3.jpg", alt: "KANION орон сууцны агааржуулагч" },
    ],
  },
  {
    slug: "aux",
    logoScale: 1,
    orbitScale: 0.64,
    name: "AUX",
    logo: "/images/aux.png",
    country: "Хятад",
    since: "1986",
    category: "Агааржуулагч, мульти систем",
    summary: "2018–2020 онд агааржуулагчийн борлуулалтаар дэлхийд тэргүүлсэн, 100 гаруй оронд хүрдэг брэнд.",
    points: ["R32 хөргөгч", "Инвертер", "4.1–12 кВт"],
    url: "https://www.auxcool.com",
    domain: "auxcool.com",
    photos: [
      { src: "/images/aux2.webp", alt: "AUX агааржуулагчийн гадна блок" },
      { src: "/images/aux3.jpg", alt: "AUX орон сууцны агааржуулагч" },
    ],
  },
  {
    slug: "ballu",
    logoScale: 1.1,
    orbitScale: 0.58,
    name: "BALLU",
    logo: "/images/ballu.png",
    country: "Орос",
    category: "Агааржуулагч, дулааны хөшиг, конвектор",
    summary: "Цаг уурын тоног төхөөрөмжөөрөө Орос, ТУХН-д тэргүүлж, 30 гаруй оронд нийлүүлдэг.",
    points: ["30+ орон", "Олон улсын стандарт", "Ногоон технологи"],
    url: "https://www.ballu.ru/",
    domain: "ballu.ru",
    photos: [
      { src: "/images/ballu2.webp", alt: "BALLU агааржуулагчийн иж бүрдэл" },
      { src: "/images/ballu3.webp", alt: "BALLU агааржуулагчийн дотор блок" },
    ],
  },
  {
    slug: "shuft",
    logoScale: 1.25,
    orbitScale: 0.88,
    name: "SHUFT",
    logo: "/images/shuft.png",
    country: "Орос",
    since: "1998",
    category: "Агаар боловсруулах төхөөрөмж, хөргөгч",
    summary: "Агаар сэлгэлтийн тоног төхөөрөмж үйлдвэрлэдэг Оросын хамгийн том үйлдвэр.",
    points: ["10 МВт хүртэл хөргөгч", "Агаар хуваарилагч", "Утаа зайлуулах систем"],
    url: "https://www.shuft.ru/",
    domain: "shuft.ru",
    photos: [
      { src: "/images/shuft2.webp", alt: "SHUFT агаар боловсруулах төхөөрөмж" },
      { src: "/images/shuft3.jpg", alt: "SHUFT хөргөгч" },
    ],
  },
  {
    slug: "aironn",
    logoScale: 1.6,
    orbitScale: 0.54,
    name: "AIRONN",
    logo: "/images/aironn.png",
    country: "Турк",
    since: "2011",
    category: "Галын болон үйлдвэрийн сэнс",
    summary: "Утаа зайлуулах, туннелийн агааржуулалтын сэнс үйлдвэрлэж, 45 гаруй оронд экспортолдог.",
    points: ["CE, ISO, EN 12101", "Жилд 20 000 сэнс", "45+ орон"],
    url: "https://aironn.com.tr/en",
    domain: "aironn.com.tr",
    photos: [
      { src: "/images/aironn2.jpg", alt: "AIRONN тэнхлэгийн сэнс" },
      { src: "/images/aironn3.jpg", alt: "AIRONN сувгийн сэнс" },
    ],
  },
  {
    slug: "lavfill",
    logoScale: 1.9,
    orbitScale: 0.74,
    name: "LAVFILL",
    logo: "/images/lavfill.jpg",
    country: "Хятад",
    since: "1999",
    category: "Агаар сорогч сэнс",
    summary: "Ариун цэврийн өрөө, гал тогоонд зориулсан нам чимээтэй, хэмнэлттэй сэнс үйлдвэрлэдэг.",
    points: ["ISO 9001", "CE, TUV, RoHS", "Нам чимээ"],
    url: "https://lavfill.en.alibaba.com/",
    domain: "lavfill.en.alibaba.com",
    photos: [
      { src: "/images/lavfill2.jpg", alt: "LAVFILL агаар сорогч сэнс" },
      { src: "/images/lavfill3.jpg", alt: "LAVFILL ханын сэнс" },
    ],
  },
];
