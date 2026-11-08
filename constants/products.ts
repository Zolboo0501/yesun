// The product catalog (/products): each partner brand's products as its own website shows them, the photos saved into
// public/images/products/<brand>/ as WebP. Names, model codes and figures are the brand's; the Mongolian titles,
// summaries and features are written for this site.

export const categories = [
  { id: "air-conditioner", label: "Агааржуулагч" },
  { id: "multi-vrf", label: "Мульти ба VRF систем" },
  { id: "heat-pump", label: "Дулааны насос" },
  { id: "air-curtain", label: "Дулааны хөшиг" },
  { id: "heater", label: "Конвектор, халаагуур" },
  { id: "ahu", label: "Агаар боловсруулах төхөөрөмж" },
  { id: "chiller", label: "Чиллер" },
  { id: "fan", label: "Үйлдвэрийн ба галын сэнс" },
  { id: "exhaust-fan", label: "Ахуйн агаар сорогч" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type Product = {
  slug: string;
  /** a brand slug from constants/brands.ts */
  brand: string;
  name: string;
  model: string;
  category: CategoryId;
  /** what it is, in Mongolian: the card's second line */
  title: string;
  summary: string;
  specs: { label: string; value: string }[];
  features: string[];
  images: string[];
  /** the product's page on the brand's site */
  source: string;
};

export const categoryLabel = (id: CategoryId) => categories.find((c) => c.id === id)?.label ?? id;

export const products: Product[] = [
  {
    "slug": "kanion-premium-r32",
    "brand": "kanion",
    "name": "Premium Series A+++ R32 Wall Split Type 3D DC Inverter 50Hz",
    "model": "",
    "category": "air-conditioner",
    "title": "Ханын инвертер агааржуулагч (R32)",
    "summary": "Европын зах зээлд зориулсан R32 хөргөлтийн бодистой, A+++ ангийн ханын инвертер агааржуулагч. Хөргөлт, халаалт, чийг бууруулах горимтой.",
    "specs": [
      {
        "label": "Чадал",
        "value": "9000 / 12000 / 18000 / 24000 Btu"
      },
      {
        "label": "Хөргөлтийн бодис",
        "value": "R32"
      },
      {
        "label": "Эрчим хүчний анги",
        "value": "A+++"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220-240V 50Hz"
      }
    ],
    "features": [
      "Хөргөлт, халаалт, чийг бууруулах, цэвэр агаарын горимтой",
      "Пультээр удирдана, апп-аар удирдах нь нэмэлт",
      "Өндөр нягтралтай шүүлтүүртэй",
      "Дулаан солилцуурт зэврэлтээс хамгаалсан бүрээстэй"
    ],
    "images": [
      "/images/products/kanion/kanion-premium-r32-1.webp",
      "/images/products/kanion/kanion-premium-r32-2.webp"
    ],
    "source": "https://kanionco.com/product/premium-r32-split-dc-inverter-50hz-european/"
  },
  {
    "slug": "kanion-high-erp-3d-dc-inverter",
    "brand": "kanion",
    "name": "High ERP 3D DC Inverter Wall Split AC Units",
    "model": "",
    "category": "air-conditioner",
    "title": "Ханын 3D DC инвертер агааржуулагч",
    "summary": "Гэр болон жижиг худалдаа, үйлчилгээний талбайд зориулсан ERP стандартын ханын инвертер агааржуулагч.",
    "specs": [
      {
        "label": "Төрөл",
        "value": "Ханын 3D DC инвертер"
      },
      {
        "label": "Цувралын нэр",
        "value": "Deluxe Series"
      }
    ],
    "features": [
      "3D DC инвертер технологитой",
      "Орон сууц болон худалдаа, үйлчилгээний зориулалттай"
    ],
    "images": [
      "/images/products/kanion/kanion-high-erp-3d-dc-inverter-1.webp",
      "/images/products/kanion/kanion-high-erp-3d-dc-inverter-2.webp"
    ],
    "source": "https://kanionco.com/product/kanion-co-high-erp-3d-dc-inverter-wall-split-ac-units/"
  },
  {
    "slug": "kanion-aeolus-kfs-60",
    "brand": "kanion",
    "name": "Aeolus Series Floor Standing Air Conditioner",
    "model": "KFS-60IR410AHFAE",
    "category": "air-conditioner",
    "title": "Шалны инвертер агааржуулагч",
    "summary": "Танхим, үзэсгэлэнгийн заал, оффис зэрэг том талбайд зориулсан R410A хөргөлтийн бодистой шалны төрлийн инвертер агааржуулагч.",
    "specs": [
      {
        "label": "Хөргөлтийн чадал",
        "value": "60000 Btu"
      },
      {
        "label": "Халаалтын чадал",
        "value": "65000 Btu"
      },
      {
        "label": "EER / COP",
        "value": "3.15 / 3.22 W/W"
      },
      {
        "label": "Дуу чимээ (дотор / гадна)",
        "value": "52 / 60 dB(A)"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "380-415V 3 фаз 50Hz"
      },
      {
        "label": "Хөргөлтийн бодис",
        "value": "R410A"
      },
      {
        "label": "Хэмжээ (дотор, Ө×Ү×З)",
        "value": "960×325×240 мм"
      }
    ],
    "features": [
      "Хөргөлт, халаалтын инвертер систем",
      "T1 уур амьсгалын ангилал"
    ],
    "images": [
      "/images/products/kanion/kanion-aeolus-kfs-60-1.webp",
      "/images/products/kanion/kanion-aeolus-kfs-60-2.webp"
    ],
    "source": "https://kanionco.com/product/aeolus-series-floor-standing-air-conditioner/"
  },
  {
    "slug": "kanion-commercial-duct-48000",
    "brand": "kanion",
    "name": "Commercial Duct 48,000BTU Series",
    "model": "",
    "category": "air-conditioner",
    "title": "Сувгийн төрлийн агааржуулагч",
    "summary": "Худалдаа, үйлчилгээний зориулалттай 48000 Btu чадлын сувгийн агааржуулагч.",
    "specs": [
      {
        "label": "Чадал",
        "value": "48000 Btu"
      },
      {
        "label": "Төрөл",
        "value": "Сувгийн (Duct)"
      }
    ],
    "features": [
      "Жижиг худалдаа, үйлчилгээний зориулалттай"
    ],
    "images": [
      "/images/products/kanion/kanion-commercial-duct-48000-1.webp",
      "/images/products/kanion/kanion-commercial-duct-48000-2.webp"
    ],
    "source": "https://kanionco.com/product/commercial-duct-48000btu-series/"
  },
  {
    "slug": "kanion-split-awhp-6-20kw",
    "brand": "kanion",
    "name": "Split Air to Water Heat Pump 6-20 kW",
    "model": "KATWHP-6-16KWR32S1NAE / KATWHP-9-20KWR32S1NAE",
    "category": "heat-pump",
    "title": "Агаар-усны хуваалттай дулааны насос",
    "summary": "Гэр болон жижиг барилгад зориулсан 6-20 кВт-ын хуваалттай дулааны насос. Халаалт, хөргөлт, ахуйн халуун усыг хангана.",
    "specs": [
      {
        "label": "Чадлын хүрээ",
        "value": "6-20 кВт"
      },
      {
        "label": "Эрчим хүчний анги",
        "value": "ERP A+++"
      },
      {
        "label": "Ажиллах гадаад температур",
        "value": "-25 °C хүртэл"
      },
      {
        "label": "Хөргөлтийн бодис",
        "value": "R32"
      }
    ],
    "features": [
      "Халаалт, хөргөлт, ахуйн халуун ус",
      "Инвертер компрессортой",
      "Европын зах зээлд зориулсан"
    ],
    "images": [
      "/images/products/kanion/kanion-split-awhp-6-20kw-1.webp",
      "/images/products/kanion/kanion-split-awhp-6-20kw-2.webp"
    ],
    "source": "https://kanionco.com/product/split-air-to-water-heat-pump-6-20-kw/"
  },
  {
    "slug": "kanion-deluxe-r290-mono",
    "brand": "kanion",
    "name": "Deluxe Series R290 Mono Air to Water Heat Pump",
    "model": "KATWHP-4KWR290M1N - KATWHP-16KWR290M1N",
    "category": "heat-pump",
    "title": "Агаар-усны моно дулааны насос (R290)",
    "summary": "R290 байгалийн хөргөлтийн бодистой, нэг гадна блоктой дулааны насос. Халаалт, хөргөлт, ахуйн халуун усанд ашиглана.",
    "specs": [
      {
        "label": "Чадлын хүрээ",
        "value": "4-16 кВт"
      },
      {
        "label": "Хөргөлтийн бодис",
        "value": "R290"
      },
      {
        "label": "GWP",
        "value": "3"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220-240V ~50Hz"
      }
    ],
    "features": [
      "3D DC инвертер технологитой",
      "Халаалт, хөргөлт, ахуйн халуун ус нэг гадна блокоор",
      "R290 нь ODP тэг, GWP 3"
    ],
    "images": [
      "/images/products/kanion/kanion-deluxe-r290-mono-1.webp"
    ],
    "source": "https://kanionco.com/product/kanion-deluxe-series-r290-mono-heat-pump/"
  },
  {
    "slug": "aux-halo",
    "brand": "aux",
    "name": "Halo",
    "model": "AUX-09HA, AUX-12HA, AUX-18HA, AUX-24HA",
    "category": "air-conditioner",
    "title": "Ханын инвертер агааржуулагч",
    "summary": "Halo цувааны ханын агааржуулагч нь 2.75–7.3 кВт хөргөлтийн чадалтай, R32 хөргөлтийн бодистой. Агаар ионжуулагч, PM2.5 шүүлтүүртэй загвар.",
    "specs": [
      {
        "label": "Хөргөлтийн чадал",
        "value": "2,75 / 3,60 / 5,50 / 7,30 кВт"
      },
      {
        "label": "Халаалтын чадал",
        "value": "3,10 / 3,80 / 5,90 / 7,30 кВт"
      },
      {
        "label": "Эрчим хүчний анги",
        "value": "A++ (хөргөлт), A+ (халаалт)"
      },
      {
        "label": "SEER / SCOP",
        "value": "6,16 / 4,17 (09HA)"
      },
      {
        "label": "Хөргөлтийн бодис",
        "value": "R32"
      },
      {
        "label": "Агаарын урсгал",
        "value": "600–1150 м³/ц"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220-240 В, 50 Гц, 1 фаз"
      },
      {
        "label": "Гадна орчны температур",
        "value": "хөргөлт -10°C, халаалт -20°C хүртэл"
      }
    ],
    "features": [
      "Агаар ионжуулагч",
      "PM2.5 болон бактерийн эсрэг шүүлтүүр",
      "Шөнийн, чимээгүй, «I FEEL» горимтой",
      "Хөргөлт, халаалтын хоёр горим"
    ],
    "images": [
      "/images/products/aux/aux-halo-1.webp"
    ],
    "source": "https://auxcool.com/products/room-air-conditioners/halo/"
  },
  {
    "slug": "aux-j-smart",
    "brand": "aux",
    "name": "J-Smart",
    "model": "AUX-09J2O, AUX-12J2O, AUX-18J2O, AUX-24J2O",
    "category": "air-conditioner",
    "title": "Ханын инвертер агааржуулагч",
    "summary": "J-Smart цуврал нь 2.7–7.2 кВт хөргөлтийн чадалтай ханын инвертер агааржуулагч. 2019 онд iF Design Award хүртсэн дизайнтай.",
    "specs": [
      {
        "label": "Хөргөлтийн чадал",
        "value": "2,70 / 3,50 / 5,30 / 7,20 кВт"
      },
      {
        "label": "Халаалтын чадал",
        "value": "3,00 / 3,80 / 5,60 / 7,20 кВт"
      },
      {
        "label": "Эрчим хүчний анги",
        "value": "A++ (хөргөлт), A+ (халаалт)"
      },
      {
        "label": "SEER / SCOP",
        "value": "6,20 / 4,00 (09)"
      },
      {
        "label": "Хөргөлтийн бодис",
        "value": "R32"
      },
      {
        "label": "Агаарын урсгал",
        "value": "600–1300 м³/ц"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220-240 В, 50 Гц, 1 фаз"
      },
      {
        "label": "Гадна орчны температур",
        "value": "хөргөлт -10°C, халаалт -22°C хүртэл"
      }
    ],
    "features": [
      "UV гэрлийн ариутгал",
      "PM2.5 болон бактерийн эсрэг шүүлтүүр",
      "iF Design Award 2019",
      "Хөргөлт, халаалтын хоёр горим"
    ],
    "images": [
      "/images/products/aux/aux-j-smart-1.webp"
    ],
    "source": "https://auxcool.com/products/room-air-conditioners/j-smart/"
  },
  {
    "slug": "aux-q-smart-plus-ii",
    "brand": "aux",
    "name": "Q-Smart Plus II",
    "model": "AUX-09Q2C, AUX-12QC, AUX-12Q2C, AUX-18Q2C, AUX-24QC",
    "category": "air-conditioner",
    "title": "Ханын инвертер агааржуулагч",
    "summary": "Q-Smart Plus II нь 2.7–7.3 кВт хөргөлтийн чадалтай нимгэн хийцтэй ханын инвертер агааржуулагч. R32 хөргөлтийн бодистой.",
    "specs": [
      {
        "label": "Хөргөлтийн чадал",
        "value": "2,70 / 3,50 / 5,30 / 7,30 кВт"
      },
      {
        "label": "Халаалтын чадал",
        "value": "3,00 / 3,80 / 5,40 / 7,30 кВт"
      },
      {
        "label": "Эрчим хүчний анги",
        "value": "A++ (хөргөлт), A+ (халаалт)"
      },
      {
        "label": "SEER / SCOP",
        "value": "6,20 / 4,00 (09)"
      },
      {
        "label": "Хөргөлтийн бодис",
        "value": "R32"
      },
      {
        "label": "Агаарын урсгал",
        "value": "600–1300 м³/ц"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220-240 В, 50 Гц, 1 фаз"
      },
      {
        "label": "Гадна орчны температур",
        "value": "хөргөлт -10°C, халаалт -20°C хүртэл"
      }
    ],
    "features": [
      "Өндөр нягтралтай болон бактерийн эсрэг шүүлтүүр",
      "Чимээгүй, шөнийн, чийг арилгах горим",
      "«I FEEL» температур мэдрэгч",
      "Хөргөлт, халаалтын хоёр горим"
    ],
    "images": [
      "/images/products/aux/aux-q-smart-plus-ii-1.webp"
    ],
    "source": "https://auxcool.com/products/room-air-conditioners/q-smart-plus-ii/"
  },
  {
    "slug": "aux-cassette-cac",
    "brand": "aux",
    "name": "Cassette units CAC",
    "model": "AUX-C-12CAC … AUX-C-60CAC",
    "category": "air-conditioner",
    "title": "Тааз суулгах кассет агааржуулагч",
    "summary": "Оффис, хурлын өрөө, ресторан, худалдааны талбайд зориулсан кассет төрлийн инвертер агааржуулагч. 3.52–16 кВт хүртэл хөргөлтийн чадалтай.",
    "specs": [
      {
        "label": "Хөргөлтийн чадал",
        "value": "3,52 – 16,0 кВт"
      },
      {
        "label": "Халаалтын чадал",
        "value": "3,81 – 17,6 кВт"
      },
      {
        "label": "Эрчим хүчний анги",
        "value": "A++ (хөргөлт), A+ (халаалт)"
      },
      {
        "label": "SEER / SCOP",
        "value": "6,10 / 4,00 (12–36)"
      },
      {
        "label": "Хөргөлтийн бодис",
        "value": "R32"
      },
      {
        "label": "Агаарын урсгал",
        "value": "700–2000 м³/ц"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220-240 В 1 фаз; 48, 60 загвар 380-415 В 3 фаз"
      },
      {
        "label": "Дотор блокийн хэмжээ",
        "value": "570x570x260 – 840x840x288 мм"
      }
    ],
    "features": [
      "360° тойрог чиглэлд агаар түгээнэ",
      "Конденсат шахуурга (120 см хүртэл өргөх)",
      "Гаднаас цэвэр агаар авах нүхтэй",
      "Инвертер ротор компрессор"
    ],
    "images": [
      "/images/products/aux/aux-cassette-cac-1.webp"
    ],
    "source": "https://auxcool.com/products/commercial-air-conditioners/cassette-units/"
  },
  {
    "slug": "aux-floor-ceiling-caf",
    "brand": "aux",
    "name": "Floor / ceiling units CAF",
    "model": "AUX-C-18CAF … AUX-C-60CAF",
    "category": "air-conditioner",
    "title": "Шал/тааз суурилуулдаг агааржуулагч",
    "summary": "Шалан дээр ханын дагуу эсвэл таазанд өлгөж суурилуулах боломжтой инвертер агааржуулагч. 5.3–16 кВт хөргөлтийн чадалтай.",
    "specs": [
      {
        "label": "Хөргөлтийн чадал",
        "value": "5,30 – 16,0 кВт"
      },
      {
        "label": "Халаалтын чадал",
        "value": "5,70 – 17,0 кВт"
      },
      {
        "label": "Эрчим хүчний анги",
        "value": "A++ (хөргөлт), A+ (халаалт)"
      },
      {
        "label": "SEER / SCOP",
        "value": "6,10 / 4,00 (18–36)"
      },
      {
        "label": "Хөргөлтийн бодис",
        "value": "R32"
      },
      {
        "label": "Агаарын урсгал",
        "value": "900–2160 м³/ц"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220-240 В 1 фаз; 48, 60 загвар 380-415 В 3 фаз"
      },
      {
        "label": "Дотор блокийн зузаан",
        "value": "235 мм"
      }
    ],
    "features": [
      "Шал болон таазны аль алинд суурилуулна",
      "235 мм нимгэн хийц",
      "Фэний 3 шатлалт хурд",
      "Инвертер ротор компрессор"
    ],
    "images": [
      "/images/products/aux/aux-floor-ceiling-caf-1.webp"
    ],
    "source": "https://auxcool.com/products/commercial-air-conditioners/floor-ceiling-units/"
  },
  {
    "slug": "aux-duct-cad",
    "brand": "aux",
    "name": "Duct units CAD",
    "model": "AUX-C-12CAD … AUX-C-60CAD",
    "category": "air-conditioner",
    "title": "Сувгийн агааржуулагч",
    "summary": "Таазны дотор нуух сувгийн төрлийн инвертер агааржуулагч. 3.52–16 кВт хөргөлтийн чадалтай, 245 мм өндөртэй.",
    "specs": [
      {
        "label": "Хөргөлтийн чадал",
        "value": "3,52 – 16,0 кВт"
      },
      {
        "label": "Халаалтын чадал",
        "value": "3,81 – 17,0 кВт"
      },
      {
        "label": "Эрчим хүчний анги",
        "value": "A++ (хөргөлт), A+ (халаалт)"
      },
      {
        "label": "SEER / SCOP",
        "value": "6,10 / 4,00 (12–36)"
      },
      {
        "label": "Хөргөлтийн бодис",
        "value": "R32"
      },
      {
        "label": "Агаарын урсгал",
        "value": "720–2300 м³/ц"
      },
      {
        "label": "Статик даралт",
        "value": "0–160 Па"
      },
      {
        "label": "Дотор блокийн өндөр",
        "value": "245 мм"
      }
    ],
    "features": [
      "Таазанд нуугдаж суурилна",
      "Статик даралтыг автоматаар тохируулна",
      "Конденсат шахуурга нэмэлтээр (70 см хүртэл)",
      "Агаар авалтыг ар болон доороос сонгож болно"
    ],
    "images": [
      "/images/products/aux/aux-duct-cad-1.webp"
    ],
    "source": "https://auxcool.com/products/commercial-air-conditioners/duct-units/"
  },
  {
    "slug": "aux-multi-split",
    "brand": "aux",
    "name": "AUX Multi split systems",
    "model": "AUX-M2-14LCLH … AUX-M5-42LCLH",
    "category": "multi-vrf",
    "title": "Мульти сплит систем",
    "summary": "Нэг гадна блокд 2–5 дотор блок холбодог мульти сплит систем. Гадна блокийн хөргөлтийн чадал 4.1–12.0 кВт.",
    "specs": [
      {
        "label": "Хөргөлтийн чадал",
        "value": "4,10 – 12,0 кВт"
      },
      {
        "label": "Халаалтын чадал",
        "value": "4,80 – 13,0 кВт"
      },
      {
        "label": "Холбох дотор блок",
        "value": "2–5"
      },
      {
        "label": "Хөргөлтийн бодис",
        "value": "R32"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220-240 В, 50 Гц, 1 фаз"
      },
      {
        "label": "Хоолойн нийт урт",
        "value": "30–70 м"
      },
      {
        "label": "Ажиллах температур",
        "value": "хөргөлт -15…52°C, халаалт -22…24°C"
      }
    ],
    "features": [
      "12 төрлийн дотор блок (хана, кассет, суваг, шал/тааз, консол) холбож болно",
      "Дотор блокийг дараа нь нэмж болно",
      "Инвертер ротор компрессор"
    ],
    "images": [
      "/images/products/aux/aux-multi-split-1.webp"
    ],
    "source": "https://auxcool.com/products/multi-systems/"
  },
  {
    "slug": "aux-arv7",
    "brand": "aux",
    "name": "ARV7",
    "model": "ARV-H250/SR1MV … ARV-H610/SR1MV",
    "category": "multi-vrf",
    "title": "VRF төвлөрсөн агааржуулалтын систем",
    "summary": "Оффис, зочид буудал, худалдаа, орон сууцны барилгад зориулсан ARV7 VRF систем. Нийт чадал 404 кВт хүртэл системд нэгтгэх боломжтой.",
    "specs": [
      {
        "label": "Хөргөлтийн чадал",
        "value": "25,2 – 61,5 кВт (8–22 HP модуль)"
      },
      {
        "label": "Халаалтын чадал",
        "value": "25,2 – 61,5 кВт"
      },
      {
        "label": "EER / COP",
        "value": "4,75 / 5,48 (8 HP)"
      },
      {
        "label": "Хөргөлтийн бодис",
        "value": "R410A"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "380-415 В, 3 фаз, 50/60 Гц"
      },
      {
        "label": "Компрессор",
        "value": "DC инвертер"
      },
      {
        "label": "Ажиллах температур",
        "value": "хөргөлт -15…55°C, халаалт -30…24°C"
      },
      {
        "label": "Дотор/гадна блокийн чадлын харьцаа",
        "value": "50–200 %"
      }
    ],
    "features": [
      "DC инвертер компрессор, уур шахалтын технологи",
      "VER технологи: үндсэн, турбо, өндөр үр ашигтай горим",
      "Eurovent гэрчилгээтэй",
      "Дотор блокт цэвэр агаар авах боломжтой"
    ],
    "images": [
      "/images/products/aux/aux-arv7-1.webp"
    ],
    "source": "https://auxcool.com/arv7-systems/"
  },
  {
    "slug": "ballu-eco-smart-dc-bsyi-09hn8",
    "brand": "ballu",
    "name": "Eco Smart DC",
    "model": "BSYI-09HN8/ES_21Y",
    "category": "air-conditioner",
    "title": "Ханын инвертер агааржуулагч",
    "summary": "Eco Smart DC цувралын инвертер агааржуулагч, ойролцоогоор 26 м² хүртэлх өрөөнд зориулсан. Wi-Fi модулийг нэмэлтээр холбож болно.",
    "specs": [
      {
        "label": "Хөргөлтийн чадал (нэрлэсэн)",
        "value": "2.78 кВт"
      },
      {
        "label": "Халаалтын чадал (нэрлэсэн)",
        "value": "3.22 кВт"
      },
      {
        "label": "Хөргөлтийн бодис",
        "value": "R32"
      },
      {
        "label": "Эрчим хүчний анги",
        "value": "A"
      },
      {
        "label": "Дотор блокийн дуу чимээ",
        "value": "22 дБ"
      },
      {
        "label": "Агаарын урсгал (хамгийн их)",
        "value": "500 м³/ц"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220-240 В"
      },
      {
        "label": "Өрөөний талбай",
        "value": "~26 м² хүртэл"
      }
    ],
    "features": [
      "Инвертер технологи",
      "Wi-Fi модулийг нэмэлтээр холбох боломжтой",
      "Гаднах блок -15 °С хүртэл ажиллана"
    ],
    "images": [
      "/images/products/ballu/ballu-eco-smart-dc-bsyi-09hn8-1.webp",
      "/images/products/ballu/ballu-eco-smart-dc-bsyi-09hn8-2.webp"
    ],
    "source": "https://ballu.kg/product/eco-smart-dc-bsyi-09hn8-es_21y/"
  },
  {
    "slug": "ballu-platinum-black-bspi-10hn1",
    "brand": "ballu",
    "name": "DC Platinum Black Edition",
    "model": "BSPI-10HN1/BL/EU",
    "category": "air-conditioner",
    "title": "Ханын инвертер агааржуулагч (хар өнгөтэй)",
    "summary": "Хар өнгийн дотор блоктой Platinum Black Edition инвертер агааржуулагч, ойролцоогоор 29 м² хүртэлх өрөөнд зориулсан.",
    "specs": [
      {
        "label": "Хөргөлтийн чадал (хамгийн их)",
        "value": "3 кВт"
      },
      {
        "label": "Халаалтын чадал (хамгийн их)",
        "value": "3 кВт"
      },
      {
        "label": "Эрчим хүчний анги",
        "value": "A+"
      },
      {
        "label": "Дотор блокийн дуу чимээ",
        "value": "21 дБ"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220 В"
      },
      {
        "label": "Өрөөний талбай",
        "value": "29 м² хүртэл"
      },
      {
        "label": "Дотор блокийн хэмжээ (өндөр × өргөн × гүн)",
        "value": "270 × 780 × 212 мм"
      }
    ],
    "features": [
      "Инвертер технологи",
      "5 шатлалт агаар цэвэрлэгээ, ионжуулалт",
      "Хар өнгийн дотор блок"
    ],
    "images": [
      "/images/products/ballu/ballu-platinum-black-bspi-10hn1-1.webp",
      "/images/products/ballu/ballu-platinum-black-bspi-10hn1-2.webp"
    ],
    "source": "https://ballu.kg/product/ballu-bspi-10hn1-bl-eu/"
  },
  {
    "slug": "ballu-eco-edge-dc-bsli-09hn1",
    "brand": "ballu",
    "name": "Eco Edge DC inverter",
    "model": "BSLI-09HN1/EE/EU_20Y",
    "category": "air-conditioner",
    "title": "Ханын инвертер агааржуулагч",
    "summary": "Eco Edge DC inverter цувралын ханын агааржуулагч, ойролцоогоор 26 м² хүртэлх өрөөнд зориулсан.",
    "specs": [
      {
        "label": "Хөргөлтийн чадал (хамгийн их)",
        "value": "3 кВт"
      },
      {
        "label": "Халаалтын чадал (хамгийн их)",
        "value": "3.0 кВт"
      },
      {
        "label": "Эрчим хүчний анги",
        "value": "A"
      },
      {
        "label": "Дотор блокийн дуу чимээ",
        "value": "25 дБ"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220-240 В"
      },
      {
        "label": "Өрөөний талбай",
        "value": "26 м² хүртэл"
      },
      {
        "label": "Дотор блокийн хэмжээ (өндөр × өргөн × гүн)",
        "value": "270 × 780 × 214 мм"
      }
    ],
    "features": [
      "Инвертер технологи",
      "Гаднах блок -10 °С хүртэл ажиллана",
      "Пульттэй, цифр дэлгэцтэй"
    ],
    "images": [
      "/images/products/ballu/ballu-eco-edge-dc-bsli-09hn1-1.webp"
    ],
    "source": "https://ballu.kg/product/ballu-bsli-09hn1-ee-eu_20y/"
  },
  {
    "slug": "ballu-curtain-bhc-h10t12-ps",
    "brand": "ballu",
    "name": "BHC-H10T12-PS",
    "model": "BHC-H10T12-PS",
    "category": "air-curtain",
    "title": "Цахилгаан дулааны хөшиг",
    "summary": "PS цувралын 12 кВт цахилгаан дулааны хөшиг, 4.5 м хүртэл өндөртэй хаалганд зориулсан. Босоо болон хэвтээ байрлалаар суурилуулна.",
    "specs": [
      {
        "label": "Хамгийн их хүчин чадал",
        "value": "12 кВт"
      },
      {
        "label": "Агаарын халалт (Δt)",
        "value": "20 °С"
      },
      {
        "label": "Суурилуулах хамгийн их өндөр",
        "value": "4.5 м"
      },
      {
        "label": "Халаалтын элемент",
        "value": "Хоолойн халаах элемент"
      },
      {
        "label": "Хэмжээ (өндөр × өргөн × гүн)",
        "value": "280 × 1120 × 294 мм"
      },
      {
        "label": "Жин",
        "value": "22.6 кг"
      },
      {
        "label": "Удирдлага",
        "value": "Электрон, пульттэй"
      }
    ],
    "features": [
      "3 халаалтын горимтой, халаалтгүй горимтой",
      "Хэт халалтаас хамгаалалттай",
      "Босоо эсвэл хэвтээ суурилуулна"
    ],
    "images": [
      "/images/products/ballu/ballu-curtain-bhc-h10t12-ps-1.webp"
    ],
    "source": "https://ballu.kg/product/bhc-h10t12-ps/"
  },
  {
    "slug": "ballu-curtain-bhc-l10-s06",
    "brand": "ballu",
    "name": "BHC-L10-S06",
    "model": "BHC-L10-S06",
    "category": "air-curtain",
    "title": "Цахилгаан дулааны хөшиг",
    "summary": "S2 цувралын 6 кВт нарийн, жижиг хэмжээтэй дулааны хөшиг, 2.5 м хүртэл өндөртэй нээлхийд зориулсан.",
    "specs": [
      {
        "label": "Хамгийн их хүчин чадал",
        "value": "6 кВт"
      },
      {
        "label": "Агаарын халалт (Δt)",
        "value": "26 °С"
      },
      {
        "label": "Суурилуулах хамгийн их өндөр",
        "value": "2.5 м"
      },
      {
        "label": "Дуу чимээ (5 м зайд)",
        "value": "52 дБ"
      },
      {
        "label": "Халаалтын элемент",
        "value": "Зүү хэлбэрийн"
      },
      {
        "label": "Хэмжээ (өндөр × өргөн × гүн)",
        "value": "150 × 1090 × 155 мм"
      },
      {
        "label": "Жин",
        "value": "8.4 кг"
      }
    ],
    "features": [
      "3 халаалтын горимтой, халаалтгүй горимтой",
      "Хэт халалтаас хамгаалалттай",
      "Хэвтээ суурилуулна",
      "ОХУ-д үйлдвэрлэсэн"
    ],
    "images": [
      "/images/products/ballu/ballu-curtain-bhc-l10-s06-1.webp"
    ],
    "source": "https://ballu.kg/product/bhc-l10-s06brc-e/"
  },
  {
    "slug": "ballu-convector-bec-eve-1500",
    "brand": "ballu",
    "name": "Evolution",
    "model": "BEC/EVE-1500",
    "category": "heater",
    "title": "Цахилгаан конвектор",
    "summary": "Evolution цувралын 1.5 кВт цахилгаан конвектор, 20 м² хүртэлх өрөөнд зориулсан. Хана болон шалны дугуйтай тавиур дээр байрлуулна.",
    "specs": [
      {
        "label": "Хамгийн их хүчин чадал",
        "value": "1.5 кВт"
      },
      {
        "label": "Халаалтын шатлал",
        "value": "0.75 / 1.50 кВт"
      },
      {
        "label": "Өрөөний талбай",
        "value": "20 м² хүртэл"
      },
      {
        "label": "Хамгаалалтын анги",
        "value": "IP24"
      },
      {
        "label": "Термостат",
        "value": "Электрон"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220 В"
      },
      {
        "label": "Хэмжээ (өндөр × өргөн × гүн)",
        "value": "413 × 640 × 111 мм"
      }
    ],
    "features": [
      "Х хэлбэрийн монолит халаалтын элемент",
      "Хэт халалтаас хамгаалалттай",
      "2 шатлалт халаалт"
    ],
    "images": [
      "/images/products/ballu/ballu-convector-bec-eve-1500-1.webp",
      "/images/products/ballu/ballu-convector-bec-eve-1500-2.webp"
    ],
    "source": "https://ballu.kg/product/ballu-bec-eve-1500/"
  },
  {
    "slug": "ballu-infrared-bih-apl-1-5",
    "brand": "ballu",
    "name": "BIH-APL",
    "model": "BIH-APL-1.5",
    "category": "heater",
    "title": "Цахилгаан хэт улаан туяат халаагуур",
    "summary": "BIH-APL цувралын 1.5 кВт хавтгай хэт улаан туяат халаагуур, 15 м² хүртэлх талбайд зориулсан.",
    "specs": [
      {
        "label": "Хамгийн их хүчин чадал",
        "value": "1.5 кВт"
      },
      {
        "label": "Өрөөний талбай",
        "value": "15 м² хүртэл"
      },
      {
        "label": "Халаалтын элемент",
        "value": "Хавтан хэлбэрийн"
      },
      {
        "label": "Хэмжээ (өндөр × өргөн × гүн)",
        "value": "40 × 1630 × 130 мм"
      },
      {
        "label": "Термостат",
        "value": "Байхгүй"
      }
    ],
    "features": [
      "Нимгэн хавтгай хэлбэртэй",
      "Хэт улаан туяагаар халаана"
    ],
    "images": [
      "/images/products/ballu/ballu-infrared-bih-apl-1-5-1.webp",
      "/images/products/ballu/ballu-infrared-bih-apl-1-5-2.webp"
    ],
    "source": "https://ballu.kg/product/bih-apl-1-5/"
  },
  {
    "slug": "shuft-unimax-p-sw-a",
    "brand": "shuft",
    "name": "UniMAX-P 1000 SW-A",
    "model": "UniMAX-P 1000 SW-A",
    "category": "ahu",
    "title": "Дулаан сэргээгчтэй агаар хангах, сорох төхөөрөмж",
    "summary": "Хавтан дулаан сэргээгчтэй, усан халаагууртай агаар нийлүүлэх, сорох төхөөрөмж. Жижиг, дунд оврын оффис, дэлгүүр, орон сууцны өрөөнд зориулагдсан.",
    "specs": [
      {
        "label": "Агаарын дээд урсгал",
        "value": "1000 м³/ц"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "380 В"
      },
      {
        "label": "Халаагуур",
        "value": "Усан"
      },
      {
        "label": "Дулаан сэргээгч",
        "value": "Хавтан"
      },
      {
        "label": "Жин (цэвэр)",
        "value": "150 кг"
      },
      {
        "label": "Гаднах агаарын температур",
        "value": "-30...+50 °C"
      }
    ],
    "features": [
      "Цайрдсан гангаар хийсэн, дулаан дууны тусгаарлагчтай хайрцаг",
      "Хоёр шатлалт хурд, утастай хяналтын самбартай",
      "Шүүлтүүр солих заагчтай, хэт халалтаас хамгаална",
      "Хөргөгч (усан эсвэл фреон) нэмж холбох боломжтой"
    ],
    "images": [
      "/images/products/shuft/shuft-unimax-p-sw-a-1.webp"
    ],
    "source": "https://www.shuft.pro/product/ustanovka-pritochno-vytiazhnaia-shuft-unimax-p-1000-sw-a-20586/"
  },
  {
    "slug": "shuft-unimax-p-vel-ec",
    "brand": "shuft",
    "name": "UniMAX-P 2000 VEL-EC",
    "model": "UniMAX-P 2000 VEL-EC",
    "category": "ahu",
    "title": "Дулаан сэргээгчтэй агаар хангах, сорох төхөөрөмж",
    "summary": "EC моторт, цахилгаан халаагууртай босоо байрлалын агаар нийлүүлэх, сорох төхөөрөмж. Дулаан сэргээгч нь хавтан хэлбэртэй.",
    "specs": [
      {
        "label": "Агаарын дээд урсгал",
        "value": "2000 м³/ц"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220-240 В"
      },
      {
        "label": "Халаагуур",
        "value": "Цахилгаан"
      },
      {
        "label": "Дулаан сэргээгч",
        "value": "Хавтан"
      },
      {
        "label": "Дууны дээд түвшин",
        "value": "60 дБ"
      },
      {
        "label": "Жин (цэвэр)",
        "value": "300 кг"
      }
    ],
    "features": [
      "Босоо байрлалаар суурилуулна",
      "Цайрдсан гангаар хийсэн хайрцагтай",
      "Wi-Fi модуль нэмэлтээр холбогдоно",
      "Гаднах агаарын температур -30...+50 °C"
    ],
    "images": [
      "/images/products/shuft/shuft-unimax-p-vel-ec-1.webp"
    ],
    "source": "https://www.shuft.pro/product/ustanovka-pritochno-vytiazhnaia-shuft-unimax-p-2000-vel-es-20480/"
  },
  {
    "slug": "shuft-star-pvs",
    "brand": "shuft",
    "name": "Star PVS-650",
    "model": "PVS-650",
    "category": "ahu",
    "title": "Дулаан сэргээгчтэй компакт агаар хангах, сорох төхөөрөмж",
    "summary": "Жижиг өрөөнд зориулсан компакт агаар нийлүүлэх, сорох төхөөрөмж. Хавтан дулаан сэргээгчтэй, ямар ч өнцгөөр суурилуулж болно.",
    "specs": [
      {
        "label": "Агаарын дээд урсгал",
        "value": "650 м³/ц"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220-240 В"
      },
      {
        "label": "Хамгийн их чадал",
        "value": "200 Вт"
      },
      {
        "label": "Дууны түвшин",
        "value": "29-39 дБ"
      },
      {
        "label": "Дулаан сэргээгч",
        "value": "Хавтан"
      },
      {
        "label": "Жин (цэвэр)",
        "value": "43 кг"
      },
      {
        "label": "Гаднах агаарын температур",
        "value": "-10...+40 °C"
      }
    ],
    "features": [
      "Ямар ч өнцгөөр суурилуулна",
      "Гурван хурдтай, пультаар удирдана",
      "Шүүлтүүр солих заагчтай",
      "Гадна цахилгаан халаагуур холбох боломжтой"
    ],
    "images": [
      "/images/products/shuft/shuft-star-pvs-1.webp",
      "/images/products/shuft/shuft-star-pvs-2.webp"
    ],
    "source": "https://www.shuft.pro/product/ustanovka-pritochno-vytiazhnaia-shuft-star-pvs-650-21533/"
  },
  {
    "slug": "shuft-universe-rvx",
    "brand": "shuft",
    "name": "Universe RVX-350 inv",
    "model": "RVX-350 inv",
    "category": "ahu",
    "title": "Дулаан сэргээгчтэй компакт агаар хангах, сорох төхөөрөмж",
    "summary": "Жижиг өрөөнд зориулсан DC моторт агаар нийлүүлэх, сорох төхөөрөмж. Мембран хавтан дулаан сэргээгчтэй.",
    "specs": [
      {
        "label": "Агаарын дээд урсгал",
        "value": "350 м³/ц"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "220-240 В"
      },
      {
        "label": "Хамгийн их чадал",
        "value": "115 Вт"
      },
      {
        "label": "Дууны дээд түвшин",
        "value": "37 дБ"
      },
      {
        "label": "Дулаан сэргээгч",
        "value": "Хавтан"
      },
      {
        "label": "Жин (цэвэр)",
        "value": "44 кг"
      },
      {
        "label": "Гаднах агаарын температур",
        "value": "-30...+50 °C"
      }
    ],
    "features": [
      "Ямар ч өнцгөөр суурилуулна",
      "Хурдыг тасралтгүй тохируулна (DC мотор)",
      "Wi-Fi модуль нэмэлтээр холбогдоно",
      "Шүүлтүүр солих заагчтай"
    ],
    "images": [
      "/images/products/shuft/shuft-universe-rvx-1.webp",
      "/images/products/shuft/shuft-universe-rvx-2.webp"
    ],
    "source": "https://www.shuft.pro/product/ustanovka-pritochno-vytiazhnaia-shuft-universe-rvx-350-inv-21525/"
  },
  {
    "slug": "shuft-cfk-max",
    "brand": "shuft",
    "name": "CFk 160 MAX",
    "model": "CFk 160 MAX",
    "category": "fan",
    "title": "Сувгийн төвөөс зугтах сэнс",
    "summary": "Дугуй сувагт холбогдох төвөөс зугтах сувгийн сэнс. Цайрдсан гангаар хийгдсэн.",
    "specs": [
      {
        "label": "Агаарын дээд урсгал",
        "value": "810 м³/ц"
      },
      {
        "label": "Дээд даралт",
        "value": "450 Па"
      },
      {
        "label": "Сувгийн диаметр",
        "value": "160 мм"
      },
      {
        "label": "Хамгийн их чадал",
        "value": "100 Вт"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "230 В"
      },
      {
        "label": "Эргэлт",
        "value": "2500 эрг/мин"
      },
      {
        "label": "Жин (цэвэр)",
        "value": "4 кг"
      }
    ],
    "features": [
      "Ажиллах температур -40...+70 °C",
      "Ямар ч өнцгөөр суурилуулна",
      "Хурд тохируулагддаг",
      "Ашиглалтын хугацаа 10 жил"
    ],
    "images": [
      "/images/products/shuft/shuft-cfk-max-1.webp"
    ],
    "source": "https://www.shuft.pro/product/ventiliator-kanalnyi-tsentrobezhnyi-shuft-cfk-160-max-20513/"
  },
  {
    "slug": "shuft-rmvd-vim",
    "brand": "shuft",
    "name": "RMVD 400/600-4 VIM",
    "model": "RMVD 400/600-4 VIM",
    "category": "fan",
    "title": "Дээврийн төвөөс зугтах сорох сэнс",
    "summary": "Дээвэрт суурилуулах төвөөс зугтах сорох сэнс. 600×600 мм суурьтай, IP54 хамгаалалттай.",
    "specs": [
      {
        "label": "Агаарын дээд урсгал",
        "value": "4100 м³/ц"
      },
      {
        "label": "Дээд даралт",
        "value": "440 Па"
      },
      {
        "label": "Хамгийн их чадал",
        "value": "460 Вт"
      },
      {
        "label": "Цахилгаан тэжээл",
        "value": "400 В"
      },
      {
        "label": "Эргэлт",
        "value": "1360 эрг/мин"
      },
      {
        "label": "Дууны дээд түвшин",
        "value": "70 дБ"
      },
      {
        "label": "Тоосны, чийгийн хамгаалалт",
        "value": "IP54"
      },
      {
        "label": "Жин (цэвэр)",
        "value": "32 кг"
      }
    ],
    "features": [
      "Суурийн хэмжээ 600×600 мм",
      "Ажиллах температур -20...+60 °C",
      "Ашиглалтын хугацаа 10 жил"
    ],
    "images": [
      "/images/products/shuft/shuft-rmvd-vim-1.webp"
    ],
    "source": "https://www.shuft.pro/product/ventiliator-kryshnyi-shuft-rmvd-400-600-4-vim-20618/"
  },
  {
    "slug": "aironn-axial-smoke-exhaust",
    "brand": "aironn",
    "name": "Axial Smoke Exhaust Fan Series",
    "model": "400-2-6 … 1250-4-9",
    "category": "fan",
    "title": "Утаа зайлуулах тэнхлэгийн сэнс",
    "summary": "Галын үед утаа зайлуулах тэнхлэгийн сэнсний цуврал. EN 12101-3 стандартаар 300 °C болон 400 °C-д 2 цагийн гэрчилгээтэй.",
    "specs": [
      {
        "label": "Галд тэсвэрлэх",
        "value": "300 °C-2 цаг ба 400 °C-2 цаг (EN 12101-3)"
      },
      {
        "label": "Сэнсний диаметр",
        "value": "400–1600 мм"
      },
      {
        "label": "Туршилтын стандарт",
        "value": "AMCA 210-07"
      },
      {
        "label": "Хөдөлгүүр",
        "value": "IP 55, H ангиллын тусгаарлагч"
      },
      {
        "label": "Хайрцаг",
        "value": "Халуун аргаар цайрдсан ган"
      },
      {
        "label": "Далбааны өнцөг",
        "value": "Тохируулгатай"
      }
    ],
    "features": [
      "Богино болон урт биетэй загвартай, босоо болон хэвтээ суурилуулж болно",
      "Далбааны өнцгийг тохируулж урсгалыг нарийн тааруулна",
      "Нэг болон хоёр хурдтай хөдөлгүүр, хүсвэл инвертертэй ашиглана"
    ],
    "images": [
      "/images/products/aironn/aironn-axial-smoke-exhaust-1.webp"
    ],
    "source": "https://aironn.com.tr/en/products/smoke-exhaust-fans/axial-smoke-exhaust-fan-series"
  },
  {
    "slug": "aironn-silencer-body-smoke-exhaust",
    "brand": "aironn",
    "name": "Axial Type Silencer Body Smoke Exhaust Fan",
    "model": "400-4-6 … 1250-4-9",
    "category": "fan",
    "title": "Дуу намсгагч биетэй утаа зайлуулах сэнс",
    "summary": "Дуу намсгагч биетэй, патентлагдсан загвартай тэнхлэгийн утаа зайлуулах сэнс. 300 °C ба 400 °C-д 2 цагийн гэрчилгээтэй.",
    "specs": [
      {
        "label": "Галд тэсвэрлэх",
        "value": "300 °C-2 цаг ба 400 °C-2 цаг (EN 12101-3)"
      },
      {
        "label": "Сэнсний диаметр",
        "value": "400–1250 мм"
      },
      {
        "label": "Туршилтын стандарт",
        "value": "AMCA 210-07"
      },
      {
        "label": "Хөдөлгүүр",
        "value": "IP 55, H ангиллын тусгаарлагч"
      },
      {
        "label": "Дуу шингээгч",
        "value": "Шатдаггүй чулуун ноос 70 кг/м³"
      }
    ],
    "features": [
      "Хоёр давхар биеийн дотор шатдаггүй чулуун ноос дуу шингээнэ",
      "Далбааны өнцөг тохируулгатай",
      "Цахилгааны хайрцаг хөнгөн цагаан"
    ],
    "images": [
      "/images/products/aironn/aironn-silencer-body-smoke-exhaust-1.webp"
    ],
    "source": "https://aironn.com.tr/en/products/smoke-exhaust-fans/axial-type-silencer-body-smoke-exhaust-fan"
  },
  {
    "slug": "aironn-unilateral-jet-fan",
    "brand": "aironn",
    "name": "Axial Type Unilateral Jet Fan",
    "model": "",
    "category": "fan",
    "title": "Нэг чиглэлт тэнхлэгийн жет сэнс",
    "summary": "Авто зогсоол, туннелийн агааржуулалт болон утаа зайлуулалтад зориулсан нэг чиглэлт жет сэнс. EN 12101-3 стандартаар 300 °C ба 400 °C-д 2 цагийн гэрчилгээтэй.",
    "specs": [
      {
        "label": "Галд тэсвэрлэх",
        "value": "300 °C-2 цаг ба 400 °C-2 цаг (EN 12101-3)"
      },
      {
        "label": "Сэнсний диаметр",
        "value": "290–400 мм"
      },
      {
        "label": "Туршилтын стандарт",
        "value": "AMCA 250-12"
      },
      {
        "label": "Хөдөлгүүр",
        "value": "IP 55, H ангиллын тусгаарлагч"
      },
      {
        "label": "Хайрцаг",
        "value": "Цайрдсан гангийн бие"
      }
    ],
    "features": [
      "Агаар үлээх болон сорох талд хамгаалалтын тор стандарт",
      "Гулсдаг хөдөлгүүрийн суурь нь засвар үйлчилгээг хөнгөвчилнө",
      "Цахилгааны хайрцаг цайрдсан гангийн биеийн дотор"
    ],
    "images": [
      "/images/products/aironn/aironn-unilateral-jet-fan-1.webp"
    ],
    "source": "https://aironn.com.tr/en/products/jet-fans/axial-type-unilateral-jet-fan"
  },
  {
    "slug": "aironn-silencer-body-fresh-air",
    "brand": "aironn",
    "name": "Axial Type Silencer Body Fresh Air Fan",
    "model": "400-2-6 … 1250-4-9",
    "category": "fan",
    "title": "Дуу намсгагч биетэй тэнхлэгийн сэнс",
    "summary": "Дуу намсгагч биетэй, патентлагдсан загвартай тэнхлэгийн цэвэр агаарын сэнс.",
    "specs": [
      {
        "label": "Ажлын дээд температур",
        "value": "55 °C"
      },
      {
        "label": "Сэнсний диаметр",
        "value": "400–1250 мм"
      },
      {
        "label": "Туршилтын стандарт",
        "value": "AMCA 210-07"
      },
      {
        "label": "Хөдөлгүүр",
        "value": "IP 55, F ангиллын тусгаарлагч"
      },
      {
        "label": "Дуу шингээгч",
        "value": "Шатдаггүй чулуун ноос 70 кг/м³"
      }
    ],
    "features": [
      "Хоёр давхар биеийн дотор чулуун ноос дуу шингээнэ",
      "Далбааны өнцөг тохируулгатай",
      "Цахилгааны хайрцаг IP 55, хуванцар"
    ],
    "images": [
      "/images/products/aironn/aironn-silencer-body-fresh-air-1.webp"
    ],
    "source": "https://aironn.com.tr/en/products/axial-fans/axial-type-silencer-body-fresh-air-fan"
  },
  {
    "slug": "aironn-roof-hf-axial",
    "brand": "aironn",
    "name": "Roof Type HF Axial Fresh Air Fan Series",
    "model": "400-2-6 … 1250-4-9",
    "category": "fan",
    "title": "Дээврийн тэнхлэгийн сэнс (хэвтээ үлээлттэй)",
    "summary": "Дээвэрт суурилуулах тэнхлэгийн цэвэр агаарын сэнсний цуврал. Бүх загвар хэвтээ болон босоо чиглэлд агаар үлээх боломжтой.",
    "specs": [
      {
        "label": "Загварын хэмжээ",
        "value": "400–1250"
      },
      {
        "label": "Хөдөлгүүр",
        "value": "IP 55, F ангиллын тусгаарлагч"
      },
      {
        "label": "Хайрцаг",
        "value": "Халуун аргаар цайрдсан ган"
      },
      {
        "label": "Цахилгааны хайрцаг",
        "value": "IP 55, хуванцар"
      }
    ],
    "features": [
      "Хэвтээ болон босоо үлээлтийн сонголттой",
      "Нэг болон хоёр хурдтай хөдөлгүүр, хүсвэл инвертертэй",
      "Биеийн үзлэгийн цонх сонголтоор"
    ],
    "images": [
      "/images/products/aironn/aironn-roof-hf-axial-1.webp"
    ],
    "source": "https://aironn.com.tr/en/products/roof-type-fans/roof-type-hf-axial-fresh-air-fan-series"
  },
  {
    "slug": "aironn-round-duct-air-ykf",
    "brand": "aironn",
    "name": "Round Duct Fan Series",
    "model": "AIR-YKF 200 A 1 … AIR-YKF 315 B",
    "category": "fan",
    "title": "Дугуй сувгийн сэнс",
    "summary": "Урагш муруй олон далбаатай дугуйтай дугуй сувгийн сэнс. Өндөр даралт шаардсан үед тохиромжтой.",
    "specs": [
      {
        "label": "Ажлын дээд температур",
        "value": "55 °C"
      },
      {
        "label": "Загварын тоо",
        "value": "5"
      },
      {
        "label": "Хөдөлгүүр",
        "value": "B ангиллын тусгаарлагч, агаарын урсгал дотор"
      },
      {
        "label": "Цахилгааны хайрцаг",
        "value": "IP 55, хуванцар"
      },
      {
        "label": "Хайрцаг",
        "value": "Цайрдсан ган, цахилгаан статик будагтай"
      }
    ],
    "features": [
      "Урагш муруй олон далбаатай дугуй",
      "Нугалдаг хөдөлгүүрийн таг угсралтыг хөнгөвчилнө",
      "Хөдөлгүүрийн хэт халалтаас хамгаалах термостат сонголтоор"
    ],
    "images": [
      "/images/products/aironn/aironn-round-duct-air-ykf-1.webp"
    ],
    "source": "https://aironn.com.tr/en/products/duct-type-fans/round-duct-fan-series"
  }
];
