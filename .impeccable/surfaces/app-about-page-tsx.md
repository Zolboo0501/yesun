---
version: 1
slug: "app-about-page-tsx"
primary_target: "app/about/page.tsx"
related_targets:
  [
    "components/about/Intro.tsx",
    "components/about/Team.tsx",
    "components/about/Statements.tsx",
    "components/about/Strengths.tsx",
    "components/about/Factory.tsx",
  ]
---

# About page (/about)

Brief confirmed by the user on 2026-11-08 (impeccable shape). No direction contract: the page stays inside the established night world in DESIGN.md.

Scope: the `/about` route, rebuilt from the current minimal page in `components/about`. Header, the shared Partners block, the footer and the home page stay untouched.
Mode: Persuade.
Audience: project commissioners (building developers and owners) arriving from the menu or a search to judge whether Есөн Бэлчир can carry their building; equipment buyers and service clients after them.
Job: trust the company's capacity, then contact an engineer. The contact call is the footer's closing statement ("Төслөө бидэнтэй ярилцъя." with "Инженертэй холбогдох"); the page adds no second call.
Proof: founded 2011 under the БХБЯ special licence; 150+ objects in the capital and the provinces; own factory commissioned 2021 (1 800 m², 12 machines) and a 216 m² warehouse; the team photograph; delivered projects by year 2019–2024; 1–3 year warranty. Confirmed facts only.

Direction: inside the night world, minimal. One focal moment, the whole team opened by the repo's react-bits ScrollMask iris; everything else calm: hairlines, wide margins, headings whose words rise (the repo's react-bits StaggeredText), blocks fading up once.
Sequence: opening with the confirmed figures → the team → the timeline (new) → the factory → the advantages → vision, mission and objective → Partners and footer.
Timeline (redrawn 2026-11-08 at the user's request, after a reference of a winding 3D road timeline; the user then asked for the line to be just like the reference): one 3D ribbon laid down the page from 2011 to Өнөөдөр as the reader scrolls and taken up when they scroll back, its top in the brand's blues (brand blue to azure) with a white rim and pale stripes, standing on a light side, round discs at the years. At lg it turns at alternate edges of the page, each year on a bend, the title and line in the middle third and a photo in the far third; on phones and tablets it runs in a lane at the left, swinging gently between the years. Each year's title, line and photo come in when the ribbon reaches it.
Anti-goals: no stat-tile hero, no cards with shadows, no carousel, no invented milestones, testimonials or ratings.
Constraints: Mongolian copy; react-bits only from the repo (StaggeredText, ScrollMask); photos through next/image or Next's optimizer; reduced motion keeps the reveal scroll-driven without easing or zoom, and fades only.

## Copy (approved 2026-11-08)

Timeline:

- 2011 — БХБЯ-ны тусгай зөвшөөрөлтэйгөөр байгуулагдсан.
- 2019 — Монгол банкны үндэсний цахим гүйлгээний төв.
- 2020 — Хүннү 2222, олон ээлжийн хамтын ажиллагаа эхэлсэн.
- 2021 — Өөрийн үйлдвэр ашиглалтад орсон; Чингис хаан музей.
- 2022 — Нисэх гарден хотхон, Одод хотхон, Хүннү 2222 Канад сургууль.
- 2023 — Platinum Tower.
- 2024 — Сансар Гарден, Нийслэлийн захиргааны төв, Эрдэнэс Таван Толгой.
- Өнөөдөр — Нийслэл, орон нутагт 150 гаруй объект.

Timeline titles (added 2026-11-08 with the curved timeline, drawn from the facts above and the projects list; approved the same day). Where a title now carries a name, the line drops it:

- 2011 — Эхлэл / БХБЯ-ны тусгай зөвшөөрөлтэйгөөр байгуулагдсан.
- 2019 — Монгол банк / Үндэсний цахим гүйлгээний төв.
- 2020 — Хүннү 2222 / Олон ээлжийн хамтын ажиллагаа эхэлсэн.
- 2021 — Өөрийн үйлдвэр / Үйлдвэр ашиглалтад орсон; Чингис хаан музей.
- 2022 — Хотхон ба сургууль / Нисэх гарден хотхон, Одод хотхон, Хүннү 2222 Канад сургууль.
- 2023 — Platinum Tower / Хоёр блок барилга, нэгдсэн гражийн агаар сэлгэлт, хөргөлтийн систем. (the scope from the projects list)
- 2024 — Орон сууц, төр, уул уурхай / Сансар Гарден, Нийслэлийн захиргааны төв, Эрдэнэс Таван Толгой.
- Өнөөдөр — 150 гаруй объект / Нийслэл, орон нутагт. Зураг төслөөс угсралт, засвар үйлчилгээ хүртэл нэг дор. (the footer's line)

Алсын хараа: Улс, нийгмийнхээ хөгжилд хувь нэмрээ оруулсан, салбартаа манлайлсан, олон нийтэд нээлттэй аж ахуйн нэгж байх.

Эрхэм зорилго: Орчин үеийн шийдэл, технологийг нэвтрүүлж, эрүүл аюулгүй ажиллагаа, хурд, чанар, стандартыг эрхэмлэнэ. Бидний оролцсон бүтээн байгуулалт бүр Монгол Улсын хөгжилд бодит хувь нэмэр оруулна.

Зорилт: Салбарын хууль, журам, норм стандартыг тууштай мөрдөж, шинэ технологи нэвтрүүлэн хотын хөгжилд бодит хувь нэмэр оруулах; дотоодын шилдэг, нийгмийн хариуцлагатай аж ахуйн нэгж байх.

Давуу тал:

1. Төслийн эхнээс дуустал захиалагчтай холбоотой ажиллаж, явц, өөрчлөлт бүрийг цаг тухайд нь мэдээлнэ.
2. Зураг төслөө өөрсдөө боловсруулж, гүйцэтгэлийн бүх хариуцлагыг хүлээнэ.
3. Угсралт, суурилуулалтын олон жилийн туршлагатай.
4. Орчин үеийн дэвшилтэт технологийг цаг тухайд нь нэвтрүүлнэ.
5. Агаар сэлгэлтийн системийн эд ангийг өөрийн бүрэн тоноглогдсон үйлдвэрт хийнэ.
6. Олон жилийн туршлагатай хамт олон мэргэжлийн зөвлөгөө өгнө.
7. Тоног төхөөрөмжийн ашиглалтын заавар, зөвлөгөө өгнө.
8. Угсралтдаа урт хугацааны чанарын баталгаа гаргана.

Advantage titles (2026-11-08, with the icon cards, drawn from each line; to confirm with the client): 1 Тогтмол мэдээлэл, 2 Зураг төсөл, хариуцлага, 3 Угсралтын туршлага, 4 Шинэ технологи, 5 Өөрийн үйлдвэр, 6 Мэргэжлийн зөвлөгөө, 7 Ашиглалтын заавар, 8 Чанарын баталгаа.

Үйлдвэр:

- Үйлдвэр — 2021 онд ашиглалтад орсон, 72 м × 24 м, 7,35 м өндөр, 1 800 м² хоёр давхар барилга.
- Агуулах — 18 м × 12 м, 216 м² нэг давхар. Хөргөх, хөлдөөх камертай.
- Тоног төхөөрөмж — Орчин үеийн 12 тоног төхөөрөмж.

Unresolved: none. The vision's garbled phrase ("түүхүйн хүүдсэг нэмж") is dropped and advantage 6 reads "эд анги" for the unclear "бөөлөг", both approved with the copy above.
