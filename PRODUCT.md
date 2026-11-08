# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary user: an organisation commissioning an HVAC project.** This means developers and owners of buildings, factories, offices, hotels and shopping centres who need ventilation (агаар сэлгэлт) and cooling (хөргөлт) designed, built and installed. They come to the site to judge whether Есөн Бэлчир can carry their project. A visit succeeds when they contact an engineer, by phone or through the contact page.

**Secondary users** (named by the client, lower priority):
- buyers of ventilation and cooling equipment;
- owners of existing systems who need repair or maintenance (засвар үйлчилгээ).

## Product Purpose

This is the corporate website of Есөн Бэлчир ХХК, an HVAC engineering company in Ulaanbaatar, Mongolia. Its job is to win projects. It shows:
- what the company designs, makes, supplies and installs;
- the projects it has delivered.

Then it turns a project client's visit into a conversation with an engineer.

## Positioning

The site presents the company as doing the whole job under one roof: calculation and design, its own duct fabrication, equipment supply, installation and after-sales service.

The figures behind that claim are **confirmed by the client** (2026-11-03):

- founded in 2011, and holds a special licence from the Ministry of Construction and Urban Development (БХБЯ);
- has its own duct and fittings factory of 1,800 m² with 12 machines;
- has installed systems at 150+ sites, in the capital and the provinces;
- is the official supplier of six brands: KANION, AUX, BALLU, SHUFT, AIRONN, LAVFILL;
- gives a 1–3 year quality warranty on installations and offers 24/7 emergency service.

## Operating Context

- **Language and market:** the site is in Mongolian (`lang="mn"`) and serves Ulaanbaatar and the provinces. The search terms the site targets are in `SEO_STRATEGY.md`.
- **How clients decide:** project clients compare contractors on the projects they have delivered, so the project list is the site's main proof.
- **Contact channels** (`constants/data.ts`): phones +976-8888-9085 and +976-8811-4570, email yusunbelchir@gmail.com, the company's Facebook page, and its Messenger (https://m.me/100063493841008, given by the user on 2026-11-09).
- **Opening hours:** the structured data says Mo–Sa 09:00–19:00. This is unconfirmed.

## Capabilities and Constraints

- **Stack:** Next.js 16 (App Router), React 19 and Tailwind v4. The site URL is https://yusunbelchir.mn (`NEXT_PUBLIC_SITE_URL`).
- **Pages:** home, about, our team, projects, factory, partner and contact, plus the director's and the engineering team's greetings.
- **Hidden products page:** `/products` exists but is hidden from the menu and noindexed. Whether to publish a product catalogue is undecided.
- **Home hero:** a scroll-driven 3D office and HVAC scene built with React Three Fiber. Blender generates the model with `scripts/scene3d/build_scene.py` from `scripts/scene3d/scene.json`, using the interior-3d-hero skill.
- **Product section:** sits on the factory page (`/factory`), after the factory's introduction (moved off the home page on 2026-11-07). It is a scroll-driven 3D run of fifteen duct products from the client's catalogue: rectangular, oval, spiral and insulated spiral ducts; rectangular, 45°, segmented 90° and stamped 90° bends; special shape, square-to-round and reducer pieces; lateral and straight tees; and aluminium and insulated flexible ducts, built by `scripts/scene3d/build_products.py`. Each product slides out of the run on its own step, beside its features.
- **Open question, office location:** the structured data gives 47.8864, 106.9057, but the hero overlay shows 47.9184° N 106.9177° E. Confirm which is the office before showing either one as fact.

## Brand Commitments

- **Name:** Есөн Бэлчир ХХК. The logo files are in `public/images`: `yesunLogo.png`, `yesunLogo-modern.svg` and `logo3.png`.
- **Overall feel:** the client asked for a professional, corporate site that does not read as AI-generated.
- **3D model:** it carries no lettering or brand text. The client had both removed.

## Evidence on Hand

**Delivered projects with years** (`app/projects/page.tsx`, `components/home/Projects.tsx`):

| Project | Year |
|---|---|
| Монголбанкны үндэсний цахим гүйлгээний төв | 2019 |
| Хүннү 2222 (several phases) | from 2020 |
| Чингис хаан музей | 2021 |
| Нисэх гарден хотхон | 2022 |
| Одод хотхон | 2022 |
| Platinum Tower | 2023 |
| Сансар Гарден | 2024 |
| Нийслэлийн нутгийн захиргааны төв цогцолбор | 2024 |
| Эрдэнэс Таван Толгойн нүүрс баяжуулах үйлдвэр | 2024 |

**Photos** (`public/images`):
- 13 project photos (`project*.webp`);
- 18 factory photos (`factory*.jpg`);
- portraits of the team and engineers;
- the director's portrait and signature;
- partner logos and product photos.

**Ratings on the projects page:** Ц.Хосбаяр is the engineer who led the listed projects. The five stars shown beside each project are not client ratings.

**Not on hand:** client testimonials, reviews or ratings, press coverage, certificates as images, and prices. Never invent them, and never present the stars as reviews.

## Product Principles

1. **Project clients come first.** Every page should help a commissioner judge the company's capacity, then reach an engineer.
2. **Proof beats claims.** Lead with delivered projects, the factory and the people. Keep unconfirmed figures out of new copy until the client confirms them.
3. **Mongolian first, local and factual.** Copy is written for Mongolian clients in their own terms.
