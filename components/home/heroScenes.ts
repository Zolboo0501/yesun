// The hero's four scenes, in the order they slide in: each is a model built by scripts/scene3d (office.glb from
// scene.json, the others from kindergarten.json, school.json and building.json), its camera shots and its copy.
// Shots are three.js coordinates: x, y up, z towards the camera (Blender's -y). Every camera sits outside the
// room or the building's cut, so a stop between two shots never lands inside a wall.

export type Vec = [number, number, number];
export type Shot = {
  pos: Vec;
  target: Vec;
  fov: number;
  /** how far right of the copy the subject sits on desktop, as a share of the width */
  shift: number;
  /** suspended ceilings in place (1) or faded out to show the ducts above (0) */
  ceiling: number;
  /** slab or structure shown (1) or faded out (0); in between it is a ghost the system shows through */
  slab: number;
  /** the whole system pulled apart (1) */
  sys: number;
  /** the air handling unit opened up (1) */
  ahu: number;
  /** fit-out, glazing and street faded out (1) with the system left in place; 0 when unset */
  fade?: number;
  /** the floor (0 = ground) whose network is in focus, the other floors' dimmed; all alike when unset */
  floor?: number;
};
export type Step = { tag: string; title: string; text: string; cta?: boolean };
export type HeroSceneConfig = {
  id: string;
  /** shown in the scene list and the counter */
  name: string;
  model: string;
  label: string;
  /** the light's mood: what reflections see, the sun, the glazing and the room's own lamps */
  mood: { background: string; sun: string; sunIntensity: number; daylight: string; pendant: string };
  sun: { position: Vec; extent: number; far: number };
  /** office-style area and lamp lights inside the room; off for the building, which is lit from outside */
  interior: boolean;
  /** an outdoor scene's distance haze; its colour matches the backdrop at the horizon so the ground melts into it */
  fog?: { color: string; near: number; far: number };
  /** CSS background behind the canvas (a sky for an outdoor scene); the page's panel colour shows when unset */
  backdrop?: string;
  shots: Shot[];
  steps: Step[];
};

const service: Step = {
  tag: "Үйлчилгээ",
  title: "Баталгаатай ажиллуулна.",
  text: "Угсралтдаа 1–3 жилийн чанарын баталгаа өгч, яаралтай үед 24/7 засвар үйлчилгээ үзүүлнэ.",
  cta: true,
};

// The rooms share one shell and light, but each has a system of its own (the office's in build_scene.py, the
// kindergarten's and the school's in systems.py), so each frames its own: pulled apart from above, the ducts from
// just over the slab, the unit opened up, the ceiling from below.
const roomLight = { position: [-12, 6.5, 2.5] as Vec, extent: 8, far: 30 };

export const heroScenes: HeroSceneConfig[] = [
  {
    id: "office",
    name: "Оффис",
    model: "/models/hvac/office.glb",
    label: "Цонхоор нар тусах оффис, модон рейкэн тааз, таазны дээрх агаар сэлгэлт, хөргөлтийн систем",
    mood: { background: "#8f8a83", sun: "#fff2df", sunIntensity: 3.8, daylight: "#eaf1ff", pendant: "#ffcf94" },
    sun: roomLight,
    interior: true,
    shots: [
      { pos: [1.4, 1.55, 6.2], target: [-0.9, 2.0, -1.0], fov: 46, shift: 0.06, ceiling: 1, slab: 1, sys: 0, ahu: 0 },
      { pos: [7.4, 11.2, 10.4], target: [-0.6, 4.0, 0], fov: 32, shift: 0.17, ceiling: 1, slab: 0, sys: 1, ahu: 0 },
      { pos: [2.7, 4.4, 1.7], target: [0.75, 3.42, -0.15], fov: 34, shift: 0.15, ceiling: 1, slab: 0, sys: 0, ahu: 0 },
      { pos: [-1.3, 4.15, 5.6], target: [-2.75, 3.75, 0.3], fov: 40, shift: 0.17, ceiling: 1, slab: 0, sys: 0, ahu: 1 },
      { pos: [2.2, 1.3, 5.2], target: [0.4, 3.0, 0.5], fov: 44, shift: 0.12, ceiling: 0, slab: 1, sys: 0, ahu: 0 },
      { pos: [-2.6, 1.6, 6.4], target: [0.2, 1.85, -1.0], fov: 46, shift: 0.06, ceiling: 1, slab: 1, sys: 0, ahu: 0 },
    ],
    steps: [
      {
        tag: "Есөн Бэлчир",
        title: "Цэвэр агаарын инженерүүд.",
        text: "Агаар сэлгэлт, хөргөлтийн системийг тооцоолж, үйлдвэрлэж, угсардаг инженерийн компани.",
      },
      {
        tag: "Тооцоолол",
        title: "Өрөө бүрээр тооцоолно.",
        text: "Агаарын солилцоо, хөргөлтийн ачааллыг тооцоолж, зураг төслийг өөрсдөө боловсруулдаг. 2011 оноос хойш Барилга, хот байгуулалтын яамны тусгай зөвшөөрөлтэй.",
      },
      {
        tag: "Үйлдвэрлэл",
        title: "Сувгаа өөрсдөө хийнэ.",
        text: "Агаарын суваг, фасон эдлэлийг 1 800 м² талбайтай, 12 тоног төхөөрөмжтэй үйлдвэртээ хийдэг.",
      },
      {
        tag: "Төхөөрөмж",
        title: "Дэлхийн 6 брэнд.",
        text: "KANION, AUX, BALLU, SHUFT, AIRONN, LAVFILL брэндийн хөргөлт, агаар сэлгэлтийн төхөөрөмжийг албан ёсоор нийлүүлнэ.",
      },
      {
        tag: "Угсралт",
        title: "150 гаруй объект.",
        text: "Нийслэл, орон нутгийн оффис, үйлдвэр, зочид буудал, худалдааны төвд угсралт хийсэн.",
      },
      service,
    ],
  },
  {
    id: "kindergarten",
    name: "Цэцэрлэг",
    model: "/models/hvac/kindergarten.glb",
    label: "Цэцэрлэгийн бүлгийн өрөө, хавтан тааз, таазны дээрх рекуператор, дугуй спираль суваг, эргүүлэгт диффузор",
    mood: { background: "#b4b8bd", sun: "#fff6ea", sunIntensity: 3.4, daylight: "#eef4ff", pendant: "#fff1dc" },
    sun: roomLight,
    interior: true,
    shots: [
      { pos: [2.2, 1.45, 6.3], target: [-0.4, 1.0, -0.8], fov: 46, shift: 0.06, ceiling: 1, slab: 1, sys: 0, ahu: 0 },
      { pos: [6.4, 11.4, 10.2], target: [-1.9, 4.1, 0.3], fov: 32, shift: 0.17, ceiling: 1, slab: 0, sys: 1, ahu: 0 },
      { pos: [2.9, 5.6, 3.9], target: [-0.4, 3.3, 0.3], fov: 40, shift: 0.15, ceiling: 1, slab: 0, sys: 0, ahu: 0 },
      { pos: [-1.0, 4.7, 6.4], target: [-2.3, 3.3, 1.9], fov: 36, shift: 0.2, ceiling: 1, slab: 0, sys: 0, ahu: 1 },
      { pos: [2.0, 1.3, 5.2], target: [0.2, 3.0, 0.2], fov: 44, shift: 0.12, ceiling: 0, slab: 1, sys: 0, ahu: 0 },
      { pos: [-2.4, 1.4, 6.4], target: [1.6, 1.0, -0.6], fov: 46, shift: 0.06, ceiling: 1, slab: 1, sys: 0, ahu: 0 },
    ],
    steps: [
      {
        tag: "Цэцэрлэг",
        title: "Хүүхдийн өрөөнд цэвэр агаар.",
        text: "Олон хүүхэд нэг өрөөнд өдөржин байдаг тул агаарыг тасралтгүй сэлгэх систем хэрэгтэй.",
      },
      {
        tag: "Тооцоолол",
        title: "Хүүхэд бүрт хүрэх агаар.",
        text: "Өрөөний хэмжээ, хүүхдийн тоогоор агаарын солилцоог тооцоолж, сувгийн сүлжээг төлөвлөнө.",
      },
      {
        tag: "Суваг",
        title: "Чимээгүй дугуй суваг.",
        text: "Агаар дугуй спираль сувгаар өрөөний голоор явж, салаагаар диффузор бүрт хүрнэ. Унтах цагийг бодож сувагт чимээ намсгагч суурилуулна.",
      },
      {
        tag: "Рекуператор",
        title: "Дулааныг нь буцааж авна.",
        text: "Рекуператор гарах агаарын дулаанаар гаднаас орох хүйтэн агаарыг халааж, шүүгээд өрөөнд нийлүүлнэ.",
      },
      {
        tag: "Тараалт",
        title: "Зөөлөн, жигд тараана.",
        text: "Эргүүлэгт диффузорууд агаарыг өрөөнд жигд тарааж, тавган хавхлагууд бохир агаарыг сорно.",
      },
      service,
    ],
  },
  {
    id: "school",
    name: "Сургууль",
    model: "/models/hvac/school.glb",
    label: "Сургуулийн анги, самбар, хавтан тааз, таазны дээрх агаар боловсруулах төхөөрөмж, гол суваг, шугаман диффузор",
    mood: { background: "#b4b8bd", sun: "#fff6ea", sunIntensity: 3.4, daylight: "#eef4ff", pendant: "#fff1dc" },
    sun: roomLight,
    interior: true,
    shots: [
      { pos: [0.9, 1.5, 6.6], target: [0.3, 1.55, -2.0], fov: 44, shift: 0.06, ceiling: 1, slab: 1, sys: 0, ahu: 0 },
      { pos: [7.0, 11.6, 10.0], target: [-1.1, 4.1, -0.2], fov: 32, shift: 0.17, ceiling: 1, slab: 0, sys: 1, ahu: 0 },
      { pos: [3.8, 5.9, 3.4], target: [0.4, 3.25, -0.6], fov: 42, shift: 0.15, ceiling: 1, slab: 0, sys: 0, ahu: 0 },
      { pos: [-0.6, 5.5, 5.2], target: [-1.7, 3.35, -2.4], fov: 28, shift: 0.22, ceiling: 1, slab: 0, sys: 0, ahu: 1 },
      { pos: [-2.0, 1.3, 5.2], target: [0.0, 3.0, 0.0], fov: 44, shift: 0.12, ceiling: 0, slab: 1, sys: 0, ahu: 0 },
      { pos: [-3.0, 1.6, 6.2], target: [1.5, 1.4, -1.5], fov: 46, shift: 0.06, ceiling: 1, slab: 1, sys: 0, ahu: 0 },
    ],
    steps: [
      {
        tag: "Сургууль",
        title: "Анги бүрт цэвэр агаар.",
        text: "Ангид олон сурагч удаан суудаг тул агаар хурдан бохирддог. Агаарыг тогтмол сэлгэвэл хичээлийн орчин сайжирна.",
      },
      {
        tag: "Тооцоолол",
        title: "Ангийн агаарыг тооцоолно.",
        text: "Ангийн эзэлхүүн, сурагчдын тоогоор шаардагдах агаарыг тооцоолж, зураг төслийг өөрсдөө гаргана.",
      },
      {
        tag: "Суваг",
        title: "Гол суваг, хөндлөн салаа.",
        text: "Ангийн дагуух гол суваг, хөндлөн гурван салаа суваг шугаман диффузор бүрт агаар хүргэнэ.",
      },
      {
        tag: "Төхөөрөмж",
        title: "Төвийн агаар боловсруулалт.",
        text: "Төхөөрөмж агаарыг уутан шүүлтүүрээр шүүж, халааж, сэнсээр нийлүүлнэ. Урсгал тохируулагч агаарыг ангийн хэрэгцээнд тааруулна.",
      },
      {
        tag: "Төсөл",
        title: "Хүннү 2222 Канад сургууль.",
        text: "Хүннү 2222 төслийн Канад сургууль, спорт цогцолбор бол бидний 2022 оны төслүүдийн нэг.",
      },
      service,
    ],
  },
  {
    id: "building",
    name: "Барилга",
    model: "/models/hvac/building.glb?v=2",
    label: "Олон давхар барилгын зүсэлт: дээврийн төхөөрөмж, босоо суваг, давхар бүрийн суваг, зогсоолын сэнс",
    mood: { background: "#b9c6d3", sun: "#fff4e6", sunIntensity: 4.2, daylight: "#eaf1ff", pendant: "#fff1dc" },
    sun: { position: [-22, 34, 26], extent: 22, far: 90 },
    interior: false,
    fog: { color: "#16171b", near: 55, far: 130 },
    shots: [
      { pos: [-12, 12, 42], target: [1, 7.5, 0], fov: 38, shift: 0.15, ceiling: 1, slab: 1, sys: 0, ahu: 0 },
      { pos: [-6, 24, 10.5], target: [-1.4, 19.2, -1.2], fov: 36, shift: 0.12, ceiling: 1, slab: 1, sys: 0, ahu: 1 },
      { pos: [3.6, 9.6, 17], target: [2.55, 9.2, -4.3], fov: 36, shift: 0.12, ceiling: 0, slab: 1, sys: 0, ahu: 0 },
      // every floor's network in place: the structure ghosted, the fit-out and the street faded
      { pos: [-15, 23.5, 37.5], target: [0.5, 8.2, 0], fov: 40, shift: 0.15, ceiling: 0, slab: 0.07, sys: 0, ahu: 0, fade: 1 },
      // then down the floors from the top, one step each with that floor in focus (floor 4 is the fifth, 0 the ground):
      // each floor whole, the camera leaning towards what its step names (the damper and control box by the shaft,
      // the main stepping down, the diffusers, the return along the back, the air curtain over the entrance)
      { pos: [-8.3, 25.9, 13.2], target: [0.2, 17.4, -1.3], fov: 40, shift: 0.2, ceiling: 0, slab: 0.07, sys: 0, ahu: 0, fade: 1, floor: 4 },
      { pos: [-9.1, 22.3, 14.5], target: [-0.6, 13.8, 0], fov: 40, shift: 0.2, ceiling: 0, slab: 0.07, sys: 0, ahu: 0, fade: 1, floor: 3 },
      { pos: [-9.9, 18.7, 14.2], target: [-1.4, 10.2, -0.3], fov: 40, shift: 0.2, ceiling: 0, slab: 0.07, sys: 0, ahu: 0, fade: 1, floor: 2 },
      { pos: [-9.7, 15.1, 12.9], target: [-1.2, 6.6, -1.6], fov: 40, shift: 0.2, ceiling: 0, slab: 0.07, sys: 0, ahu: 0, fade: 1, floor: 1 },
      { pos: [-15.5, 8.5, 12], target: [-5.2, 2.6, -0.4], fov: 40, shift: 0.2, ceiling: 0, slab: 0.07, sys: 0, ahu: 0, fade: 1, floor: 0 },
      { pos: [2.5, -1.4, 10.5], target: [-1.5, -2.2, -1.2], fov: 44, shift: 0.12, ceiling: 1, slab: 1, sys: 0, ahu: 0 },
      { pos: [-14, 15, 46], target: [1, 9.5, 0], fov: 36, shift: 0.15, ceiling: 0, slab: 0, sys: 1, ahu: 0 },
    ],
    steps: [
      {
        tag: "Барилга",
        title: "Дээврээс зогсоол хүртэл.",
        text: "Олон давхар барилгын бүх давхар, газар доорх зогсоолын агаарыг нэг систем хариуцна.",
      },
      {
        tag: "Дээвэр",
        title: "Дээвэр дээрх төхөөрөмж.",
        text: "Агаар боловсруулах төхөөрөмж, конденсатор, яндангийн сэнсийг дээвэр дээр байрлуулна.",
      },
      {
        tag: "Босоо суваг",
        title: "Бүх давхар нэг шахтаар.",
        text: "Нийлүүлэх, сорох, яндангийн босоо сувгууд шахтаар дамжиж давхар бүрийг холбоно.",
      },
      {
        tag: "Давхар",
        title: "Давхар бүр өөрийн сүлжээтэй.",
        text: "Таван давхар тус бүр шахтаас тусдаа салаа авч, өөрийн нийлүүлэх, сорох сүлжээгээр ажиллана.",
      },
      {
        tag: "5 давхар",
        title: "Шахтаас давхар луу.",
        text: "Нийлүүлэх агаар шахтаас галын хаалтаар гарч, урсгал тохируулагч хайрцгаар тухайн давхарт хэрэгтэй хэмжээгээр орно.",
      },
      {
        tag: "4 давхар",
        title: "Гол суваг нарийсна.",
        text: "Гол суваг давхрын дундуур явж, эхний салааны дараа нарийсна. Ингэж агаарын хурдыг сувгийн дагуу жигд барина.",
      },
      {
        tag: "3 давхар",
        title: "Диффузор бүрт салаа.",
        text: "Гурван салаа суваг урд, хойд эгнээний зургаан диффузорт агаар хүргэж, өрөөнд жигд тараана.",
      },
      {
        tag: "2 давхар",
        title: "Бохир агаарыг сорно.",
        text: "Арын сорох суваг дөрвөн сараалжаар өрөөний агаарыг сорж, шахтаар дээвэр дээрх төхөөрөмж рүү буцаана.",
      },
      {
        tag: "1 давхар",
        title: "Үүдэнд агаарын хөшиг.",
        text: "Орох хаалганы дээрх агаарын хөшиг өвлийн хүйтэн агаарыг лоббид оруулахгүй. Лобби бусад давхрын адил өөрийн сүлжээтэй.",
      },
      {
        tag: "Зогсоол",
        title: "Зогсоолын агаар сэлгэлт.",
        text: "Газар доорх зогсоолын утаа, хийг тийрэлтэт сэнс, яндангийн сувгаар гадагшлуулна.",
      },
      {
        tag: "Систем",
        title: "Нэг сүлжээ, нэг гүйцэтгэгч.",
        text: "Тооцооллоос угсралт, засвар үйлчилгээ хүртэл бүх системийг нэг дор хариуцна. 150 гаруй объектод угсралт хийсэн.",
        cta: true,
      },
    ],
  },
];
