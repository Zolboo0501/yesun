---
name: Есөн Бэлчир
description: The engineered-air system for the home page of an Ulaanbaatar HVAC engineering company.
colors:
  ink: "#0b1020"
  soft: "#4f5a6e"
  panel: "#e9ebee"
  brand: "#0100fd"
  graphite: "#1f2226"
  night: "#16171b"
  mist: "#aeb2b8"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.1rem + 4.2vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 2.6vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  figure:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "-0.03em"
    fontFeature: "\"tnum\""
  title:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.56
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.625
  caption:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  menu:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  button:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.33
  nav:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.43
  small:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "0.16em"
  micro:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.16em"
rounded:
  none: "0px"
  sm: "3px"
  full: "9999px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "32px"
  section: "96px"
  section-lg: "128px"
  container: "80rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.white}"
  button-primary-on-dark:
    backgroundColor: "{colors.white}"
    textColor: "{colors.night}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "12px 20px"
  button-primary-on-dark-hover:
    backgroundColor: "#ffffffd9"
    textColor: "{colors.night}"
  link-secondary:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  link-secondary-hover:
    textColor: "{colors.brand}"
  fact:
    textColor: "{colors.ink}"
    typography: "{typography.figure}"
---

# Design System: Есөн Бэлчир

Scope: this records the home page (`app/page.tsx`) as it ships: the shared header (`components/Header.tsx`), Hero, Company, Services, Projects, plus the shared Partners block and footer in `components/Footer.tsx`; and the 3D product run, Products (`components/factory/Products.tsx`), which since 2026-11-07 sits on the factory page (`/factory`) after the factory's introduction. The about page follows this system since 2026-11-08 (`components/about`), and the team page (`/ourTeam`, `components/ourTeam`) since 2026-11-09; the two greeting pages now redirect to it. The projects page (`/projects`, `components/projects/ProjectBook.tsx`) follows it since 2026-11-09 too. The factory page's own blocks follow it since 2026-11-09 as well (`components/factory/Intro.tsx`, `Advantage.tsx`, `Plant.tsx`). The partner page (`/partner`, `components/partner/Brands.tsx`) follows it since 2026-11-09. The contact page (`/contact`, `components/contact/Contact.tsx`) follows it since 2026-11-09 as well, and so does the products catalog (`/products` and `/products/[slug]`, `components/products/Catalog.tsx`, `ProductCard.tsx`, `ProductDetail.tsx`, `Gallery.tsx`). Every route now follows this system.

## Overview

**Creative North Star: "The Engineered Air"**

The site shows the company's subject, air moving through a building, as something you can see. It does not illustrate it. Each scroll stage is a working view: an x-rayed office, a run of fabricated duct pieces, a turning network sphere of the company's sites beside its four parts, and delivered buildings flying in one after another. Around them sits the plain apparatus of an engineering drawing: cool grey and graphite grounds, near-black ink type, small mono uppercase labels, square buttons, and one saturated electric blue used sparingly.

The layout is calm and sparse. A section carries one headline, one or two sentences, real figures and one call to action. The 3D or WebGL image does the persuading. Type is set large and tight. Everything else is small, mono and quiet. The house draws no rounded corners and no shadows; depth comes from the rendered scenes and from alternating light and dark grounds.

The world is local and factual. All copy is Mongolian. Every figure shown is one the client has confirmed.

**Key Characteristics:**
- The home page is night from the header to the footer (Hero, Company, Projects, the Partners block and the footer), one dark run. Every other page is white, the header, the Partners block and the footer included (since 2026-11-08): the shared blocks read the route and take the `light` variant off the home page (`@custom-variant light` in globals.css). On the factory page, Products keeps its graphite ground.
- One accent, electric brand blue. It appears as small squares, hairline progress rules, focus outlines and the hover fill of buttons.
- Semibold Golos Text headlines with tight negative tracking, sized with clamp().
- JetBrains Mono uppercase, tracked at 0.16em, is the voice of annotation: column labels, meta lines, the brand list and measurements. Buttons and links speak Golos.
- Square corners on surfaces, pill buttons (every button fully rounded since 2026-11-10, at the user's request). No shadows.
- The scenes are driven by scroll, are paused when off screen, hold still under reduced motion, and run a lighter path on phones.

**The header and the hero's first screen are the exception (dark cinematic, since 2026-11-07, after the client's reference image).** One deep charcoal, night `#16171b` (a token in `globals.css`), runs from the header into the hero, the way a full-bleed photograph runs under a transparent menu. Everything on it is white: the logo (drawn white with a filter), uppercase Golos links (semibold, 13px, 0.05em, from 1280px; the current page at 45% white), and one white button with a 3px radius. Hero headings are large Golos semibold (`clamp(2.5rem, 1.1rem + 4.2vw, 6rem)`, line-height 0.95, tracking -0.035em) in two lines, the second set in by 0.9em, with a short white rule and the step text beside it. On first load a night curtain lies over the header and the hero, and scroll-mask's iris (`components/react-bits/scroll-mask.tsx`) opens it from the subject once the first 3D frame is drawn (1.6 s; skipped under reduced motion; a CSS timer lifts it after 4 s if the script never runs), the 3D settling from a slight zoom and the heading's words running as the iris reaches them. Each step's heading and text come in word by word, fading in as they rise a few pixels into place and stopping there (no blur, no overshoot), whenever that step or its scene arrives (`components/react-bits/staggered-text.tsx`). Over the stage, a mouse brings up a white drafting crosshair with rulers and a mono coordinate chip; a drag measures and a click pins a point, and the step lines name their step in the chip (`components/react-bits/drafting-cursor.tsx`; fine pointers only). Icons are the inline set in `components/icons.tsx`. Brand blue appears in neither. Every rule below still holds for the rest of the home page.

## Colors

A cool, nearly neutral palette of blue-black, blue-grey and graphite, carrying a single electric blue.

### Primary
- **Electric Signal Blue** (brand): the only accent. It is used for:
  - the hero progress rules;
  - focus outlines on light grounds;
  - the hover fill of every primary button.

  Selected text is not blue (since 2026-11-09, the user's call): a neutral grey (ink 60% into white) behind white letters, readable on the night and the white grounds alike.

  It is never used as a ground or as body text.

### Neutral
- **Blueprint Ink** (ink): headings and primary text on light grounds. It is the resting fill of the primary button on light grounds (and was the footer ground until 2026-11-08). Body copy uses it at 80% opacity, and hairline dividers use it at 15%.
- **Drafting Slate** (soft): secondary text on light grounds, such as fact labels and the frame annotations of the Hero and Company stages.
- **Plaster Panel** (panel): a light ground (the Hero's, and the partner logo tiles', until both changed on 2026-11-07).
- **Mist** (mist, #aeb2b8): a cool mid grey, the Company ground until the network sphere moved it onto night (2026-11-07); the token stays for later use.
- **Graphite** (graphite): the dark ground of Products on the factory page (Projects moved to night on 2026-11-07). On graphite, text is white at stepped opacities: 100% for headings, 85–90% for leads, 70% for body and 50–60% for annotations.
- **White** (white): the ground of every page but the home page, with its header, Partners block and footer; on dark grounds the text, the resting fill of the primary button, and the partners orbit's logo discs and centre mark.

### Named Rules
**The One Signal Rule.** Brand blue only marks things: a point, a rule, a bracket, a focus ring or a hover. It covers a few square millimetres of any screen. If an interface fill is larger than a button, it is wrong. This rule covers the interface, not the light inside a rendered scene: the Company network is white on night, and brand blue only lights the nodes under the pointer and the pulse a click sends round it. The about page's timeline ribbon is the one exception: a band of the brand's blues, laid at the user's request after the client's reference (2026-11-08).

**The Alternating Ground Rule.** Consecutive sections change ground between light (panel or white) and dark (graphite or ink), a new section taking the opposite ground from the one before it. The home page is the one exception: from the header through the footer it stays on the night ground. Every other page is white throughout, its header and footer included.

## Typography

**Display Font:** Golos Text (with ui-sans-serif, system-ui), weights 400, 500 and 600, with the Cyrillic subset.
**Body Font:** Golos Text.
**Label/Mono Font:** JetBrains Mono (with ui-monospace), weights 400 and 500, with the Cyrillic subset.

**Character:** a clear, modern Cyrillic grotesque set heavy and tight for statements, paired with a technical mono for labels and controls. Together they read like a specification sheet.

### Hierarchy
- **Display** (600, clamp 2.5–6rem, line-height 0.95, tracking -0.035em, the second line set in by 0.9em): the statements of the scroll stages, the hero's steps (the h1 is the first), the Projects opening, and the footer's closing h2 "Төслөө хамтдаа ярилцъя." (centred since 2026-11-10 in the repo's `components/blocks/cta-3.tsx`: three glassy tiles with the air, headset and cooling icons over slowly turning dashed rings, the line, a pill button, then the engineers' faces and the phones, email and hours as outlined pills).
- **Headline** (600, clamp 2–3.75rem, line-height 0.98, tracking -0.04em, balanced): the section headings that carry a sentence or a short claim, Company's four parts and the Partners heading. Each project's name in the Projects stage is a caption-sized step between the two, clamp 2.25–2.875rem.
- **Figure** (600, 1.5rem, tracking -0.03em, tabular numerals): proof values in the facts list.
- **Title** (600, 1.125rem, tracking -0.01em): the Products lead line.
- **Body** (400, fluid 1.0625–1.1875rem, line-height 1.625): every supporting paragraph, with a measure of 44–56ch.
- **Caption** (400, 16px, line-height 1.55): the hero's step text, each project's "systems · year" line and the footer's address and menu lists. 16px is the floor for anything read.
- **Small** (400, fluid 0.8125–0.875rem): fact labels and the WebGL fallback text.
- **Button** (600, 14px, sentence case): every button label on every page, the header's included (one size since the 2026-11-10 typeset pass; they had drifted between 11, 12 and 14px); a secondary link beside a button is the same size at 500, underlined.
- **Nav** (500, 14px, sentence case): the header's page links in the flat bar of `components/blocks/navigation-15.tsx` (since 2026-11-10, at the user's request, after navigation-12's floating pill): a 72px bar across the page (`--header-h`) with a hairline under it, white on every page (the home page too since 2026-11-10, when its sections after the 3D hero turned white and the globe's lines black), the logo at 24px, the links white 60% (ink 60% on white) with a 1px line under the current page that slides to the link pointed at or focused, and "Холбоо барих" as an outlined pill with an arrow that fills under the pointer. The links show from 1280px; below that the menu button opens a drawer from the right (full width on phones, 28rem from sm, over a dimmed page): the links large with arrows, then the phones, the email and the button; it is a dialog (focus moves in and back, the page holds still, Escape or the backdrop closes it). Products opens its panel as a card under the bar. The hero's building tabs are 13px at 500.
- **Menu** (600, 1.75rem, tracking -0.02em): the page links in the phone menu sheet.
- **Label** (mono 400, 0.75rem, uppercase, tracking 0.16em): the Company brand list.
- **Micro** (mono 400, 11px, uppercase, tracking 0.16em, 0.2em when set vertically; 11px is the floor, nothing on the site is set smaller): the frame annotations around the scroll stages, the footer's column labels.

### Named Rules
**The Tight Statement Rule.** Headings are semibold, sized with clamp(), balanced with text-wrap, and tracked between -0.035em (Display) and -0.04em (Headline), never tighter. Never set a heading at regular weight or with neutral tracking. Supporting prose is set with text-wrap: pretty, so no line ends on one word.

**The Mono Voice Rule.** Mono annotates: column labels, meta lines, the brand list, counters and the drafting cursor's coordinates, uppercase with wide tracking. Anything that acts (buttons and links) speaks Golos, and running text is never mono.

## Layout

- **Container and grid:** content sits in an 80rem container. Side gutters are 16px, rising to 24px at sm and 32px at lg. At lg, sections use a 12-column grid with 32px gaps.
- **Section padding:** static sections open with 96px of top padding, or 128px at lg.
- **Scroll stages:** Hero (home) and Products (factory page) are pinned stages. The sticky frame sits right under the header (top `var(--header-h)`, 4rem) and fills the rest of the viewport. Hero takes 100svh of scroll per step and Products 70svh. Each step holds still for the first and last fifth of its scroll, then travels. Company is not pinned: its parts scroll as ordinary blocks over a sticky scene.
- **Step copy:** at lg the copy floats bottom-left (5vw in, about 40–46vw wide) on its own ground at 80–85% opacity. Below lg it docks as a solid band along the bottom.
- **Company:** four parts stacked down the page, each one stage tall (100svh − `--header-h`), over a sticky full-stage scene that the blocks overlap with a negative top margin. At lg each part's copy takes one half, alternating right, left, right, left, vertically centred and at most 36rem wide; its outer edge sits on the page container's edge, max(2rem, 50vw − 38rem), and its inner edge is 4vw from the centre line. The copy fades with its distance from the stage and is fully opaque when its part fills it. The network sphere stands in the other half and crosses between parts. On phones each part's copy sits at the bottom of its block over a night shade, and the sphere sits above it, swaying a little between parts. The part rows let the pointer through to the sphere; only the copy takes it. Each part's copy condenses out of white vapor (react-bits VaporType, `components/react-bits/vapor-type.tsx`) as its part reaches the stage: at lg the heading, the line and the figures' values, on phones only the heading (the lite path), the rest fading in with the part. The vapor is mounted when the part comes within 0.6 of a part of the stage and unmounted once it is a whole part away, when its copy has faded out (until then the same text stands there unseen, so nothing moves and readers already have it); so at most two parts hold WebGL canvases at once (eight at lg, two on phones), and every arrival condenses the copy again, for 1.6 s, sweeping in from the shell's side, then it holds. Only the heading answers the pointer; running text would scatter under a reader's mouse. Fact labels, the brand list and the actions fade with the part. Under reduced motion, or without WebGL, it is plain text. The section clips its overflow sideways (overflow-x: clip, which keeps the sticky stage) because the vapor's canvas bleeds about 1.5em past its text.
- **Services** (since 2026-11-08, the client's four services from the site before the redesign, on the user's request; `components/home/Services.tsx`): between Company and Projects, on the night ground. The heading "Манай / үйлчилгээ." at the Headline step, set like the stage copy (second line set in by 0.9em, its words rising), with the client's line beside a short white rule; then the four services as a react-bits ScrollStack (`components/react-bits/scroll-stack.tsx`, variant stack): a stage pinned under the header (100svh − `--header-h`) with 90svh of scroll per card, each card 74% of the stage tall and as wide as the page container, sliding up from below over the last, which steps back 28px, shrinks 6% and darkens by half, its top edge showing above, all through the stack's own damping (0.14); a 1px white progress rule under the stack. Each card is graphite with no border, rounded (28px at lg, 20px below) and set off by its shadow, cast up onto the card behind it (0 −14px 36px −12px, black 55%) and down onto the ground (0 40px 80px −28px, black 80%), at the user's request on 2026-11-08: the service's icon large in the middle (at most 22rem), and at the foot the service's name in two lines set in (clamp 1.875–3rem) on the left and its line on the right (Body step, white 75%; stacked below lg). The icons (`components/home/ServiceIcons.tsx`, since 2026-11-08) are drawn after the client's reference, a line icon on a 512 grid: 22-unit rounded lines inside a scanner's four corners, all in white (the user asked for white only). Ventilation is a fan turning in its housing with air running out under it; cooling a wall unit with cold air falling either side of a turning snowflake; manufacturing the works under a sawtooth roof, its windows lit one after another and smoke rings leaving the stack; service a cog turning behind a wrench that rocks at it (lucide's wrench, filled with the card so it covers the cog). Each icon's lines draw in when its card reaches the front (1.1 s, the corners first) and go again above the stack; its motion runs only while its card is in front, and not at all under reduced motion (globals.css: `orbit`, `flow`, `puff`, `glow`, `rock`). The repo's ScrollStack was changed to pin under the sticky header and measure its run from there, to leave a card in full view unclipped so its shadow shows (cards round their own corners), to take a `label` for its section, to size cards to the stage, and to fade cards out of play to transparent rather than hide them, so assistive tech reads all four.
- **Projects:** a scroll stage like the hero's, one screen of scroll per step: the opening, then one step per project (eleven in all), under a sticky stage (100svh − `--header-h`). The copy is the hero's (components/home/Step.tsx): the opening carries "Хэрэгжүүлсэн төслүүд." at the hero heading size, one plain sentence under it a size up ("Музейгээс уурхай хүртэл 150 гаруй объектод агаар сэлгэлт, хөргөлт угсарсан.") and the white "Бүх төсөл" button. Each project step is a caption beside its photo: the name a size down (clamp 2.25–2.875rem) in a column of min(25rem, 32vw) at lg that ends before the photo, and "systems · year" at body size, the year kept on the line of the word before it. The gallery stands in the right 60% at lg (the top 60% on phones), so the photo is the largest thing on each step; a night shade darkens only the copy's side (night to 8%, 80% at 24%, 25% at 34%, clear from 42%) and the bottom on phones, and the hero's step lines run down the right edge.

## Elevation & Depth

The house is flat. There are no box-shadows on the home page but one: the partners orbit's centre disc carries a soft white glow (0 0 90px −20px, white at 22%), the night ground's answer to the shade round the hub in the client's reference. Depth comes from three things:
- the rendered scenes themselves: R3F lighting, SSAO and bloom in the hero and products, and the Company network sphere;
- semi-opaque copy grounds over the scenes (panel or graphite at 80–85%);
- the light/dark alternation between sections.

### Named Rules
**The Lit-Not-Lifted Rule.** Depth comes from light in the scene, never from shadows on the interface. Panels over a scene are translucent ground, not floating cards. The about page's timeline and the home page's service cards are the exceptions the user asked for: the ribbon is drawn as a raised object with a lit side and a soft shadow, its photos as stickers casting their own, and the service cards cast a shadow on the cards behind them and on the ground.

## Shapes

Every corner the house draws is square (0px), copy panels and the brand squares included; buttons are the exception, fully rounded pills on every page since 2026-11-10 (the user's request). The one round figure is the partners orbit (its dashed rings and white discs, after the client's reference), and the about page's timeline ribbon (after the client's reference too) is the one curve, with round discs at its years; its photos (20px), the home page's service cards (28px) and the footer's contact card (24px, its list 18px, with round faces; since 2026-11-09) are the rounded exceptions, each at the user's request. Otherwise the recurring geometry is rectilinear:
- small solid squares of brand blue (6px list bullets in Products);
- 1px hairline dividers at 15% opacity above each fact and above the Company brand list;
- a thin progress rule (1px track, filled brand in Hero, white in Products and ink in Company).


## Components

### Buttons
Small, white and direct, the hero's button everywhere on the home page (hero, Company, Projects, footer). Every button carries a forward arrow.
- **Primary on dark grounds:** white fill, night label in the Button style (Golos 12px semibold, sentence case), fully rounded (a pill), padding 12px 20px; a 14px ArrowUpRight follows the label after an 8px gap.
- **Hover / Focus:** the fill dims to 85% white and the arrow nudges 1px up and to the right; on press the button scales to 0.98; focus shows a 2px white outline offset by 2px.
- **Beside it:** the phone as a 12px medium link at 85% white, or a secondary link at the same size, underlined in white 30% that turns full white on hover. They sit 24px to the right and wrap below.
- **On light grounds** (the older pages): ink fill with white text, otherwise the same.

### Facts List
A two-column definition list. Each fact sits under a 15% ink hairline, with the value above in the Figure style and the label below in soft text. It carries real, confirmed figures only. A related variant is the Company brand list: the six official brands in mono Label style, laid out in 3 columns under one hairline.

### Scroll Stage (signature)
A pinned 3D or WebGL scene with a technical frame of micro annotations: a vertical label at the top left and a step counter at the bottom right.
- **Hero** (dark cinematic, see Overview): five buildings (office, kindergarten, school, shop, building) slide in one after another on the night ground. The shop is the one room with an open ceiling: its spiral ducts and jet nozzles show from the first step, and its plant stands in one casing on the roof. Each scene is shaded like a photograph under type: a light overall dim, dark under the copy (the left on desktop, the bottom on phones) and along the top and bottom edges, open where the building stands; the building's fog melts its far ground into the night. In the building's fourth step the structure turns to a faint ghost and the fit-out, glazing and street fade, so every floor's ductwork shows in place, each duct in its air's site-tape colour (sky supply, butter return, peach exhaust); the same colours carry the exploded view at the end. After it the camera comes down the five floors one step each, from the top: that floor's network at full strength, the others dimmed, and each floor's copy naming one part of the system (the fire damper and control box by the shaft, the main stepping down, the diffusers, the return along the back, the air curtain over the entrance). The step copy floats without a panel: the two-line heading, the rule and the text, and on the last step the white button with the phone beside it. Around it, as in the reference: one short line per step down the right edge (six for a room, eleven for the building; the current one long and bright, sliding to the next as you scroll; each a jump link), the five building names small at the bottom left (the current one white, each a jump link), and Facebook, email and phone icons at the bottom right from `sm` up (on phones the site's contact bar carries them and the names take the row).
- **Products:** a "Гүйлгэж танилцана" progress rule at the bottom left. Since 2026-11-09 (the user's call) its step copy is the home page's (`components/home/Step.tsx`), with no panel or corner brackets: the product's name in two lines with the second set in (clamp 2.25–2.875rem; the opening's at the hero size, as the page's h1), a rule with its sentence beside it, its points in one small white 55% line, and on the last step the white "Инженертэй холбогдох" button with the phone beside it. It sits low on the left at lg (5vw in, 12% up, under the product list and clear of the product) and at the foot on phones, over a graphite shade (dark under the copy, open where the product is).

Products also adds a jump index of its 15 items at the top left, at lg; the current item is at full opacity and the rest at 45%.

Step copy fades as the scene moves away from it and fades back once the scene has settled. Steps that are not showing are set to visibility hidden.

### Network Sphere (Company)
The 150+ sites as one network (components/react-bits/astral-shell.tsx): 2,200 nodes (1,200 on phones) clustered on a sphere, each linked to its nearest neighbours with a few chords across, white on the night ground, drawn additively so it glows. It turns slowly on a tilted axis; the pointer lights the nodes and links near it in brand blue, and a click sends a pulse round the shell. Dragging is off, so a swipe over it still scrolls the page. It draws only while in view.

It stands in the half the part's copy leaves free (centre 27% or 73% across, radius 0.32 of the stage height; on phones 40% or 60% across, 75% up, radius 0.23). Between two parts it holds for the first and last fifth of the scroll, then crosses to the other half and breaks apart on the way: every node flies out along a direction of its own (set by where it sits, so the two ends of a link follow the nodes they join), the links let go first, and the nodes come back together on the far side. The scroll reaches the shell through a ref it reads every frame (`live`), eased there, so nothing re-renders as the page moves. Under reduced motion it crosses without breaking. The earlier air-stream scene (components/home/AirFlowScene.tsx) is no longer used.

### Project Dolly Gallery
A DollyGallery (components/react-bits/dolly-gallery.tsx) of the real project photos, served from the client's originals in `public/images` through Next's image optimizer (`getImageProps`, so each tile gets a srcset): each photo is asked for at the width its 1.45:1 crop needs (the tile's width, times how much wider than 1.45:1 the photo is), at the screen's density and never past the original. Four originals are small (project.webp 1140px, project4 966px, project12 760px, project13 762px wide) and stay soft on high-density screens until sharper photos come. The tiles are square-cornered landscape tiles (up to 820px wide and never wider or taller than the gallery less 32px, so 736px on a 768px tablet, 343px on a 375px phone and 508px on a 1000 × 700 landscape tablet; aspect 1.45, a light 25% grayscale) placed one behind another down a 1000px perspective, 900px of depth apart, each centred in the gallery, so the photo at the front is always whole on screen. The page scroll drives it through `driveRef`: the opening holds the first project a step away, and each later step brings the next one to the front, where it holds while its name shows. The photo leaving the front fades out where it stands over half a step, coming on only a tenth of its travel (`passDepth` 0.1) instead of flying at the camera; scrolling back, the last photo fades in at its own size over the one going back into depth, never huge or cut by the gallery's edge (the gallery does not clip). It has no wheel, drag or drift of its own (the wheel and a swipe stay the page's); the pointer only leans the tiles, by 2% of a tile across and 3% down. The ConcaveCarousel it replaced is no longer used.

### Partner Orbit
The Partners block (components/Footer.tsx, on every page) sets its heading, its line and an underlined "Бүх түнш" link to `/partner` (since 2026-11-09) in the left third at lg, vertically centred, and the six official brands in orbit round the company's mark on the right (below, under lg), all on the night ground (since 2026-11-07): the heading at the Headline step with no eyebrow over it, the line in white at 75%. The mark (`/images/logo3.png`), drawn white as in the header (brightness 0, inverted), sits on a dark disc 1.55 logo discs wide (white 5% fill, white 15% hairline) with the page's one soft glow. Two dashed rings in white at 20% run round it: the outer one through the logo discs' centres, half a disc in from the edge, and the inner one at half the orbit's width. The logos sit on white discs (--chip: 72–88px below lg, 88–112px at lg) that take a 6px white 16% halo when pointed at and a white focus ring, each logo's box filling its disc at its own scale (`orbitScale` in `constants/brands.ts`, worked out from each file's measured ink so the six read at one size), grayscale until pointed at or focused. Since 2026-11-09 each logo opens its brand's card on the partner page (`/partner#slug`, same tab), and the hub names the brand pointed at or focused: the mark fades out and the brand's name (semibold) and what it makes (white 65%, ink 60% on white) fade in, 300ms; the links carry the same words for assistive tech. The brand data (names, logos, scales, what each makes) is shared with the partner page from `constants/brands.ts`. At lg three ride the outer ring (clockwise, 90 s a turn) and three the inner ring (anticlockwise, 60 s); below lg all six share the outer ring, 60° apart, turning together, since two rings of logos would not clear each other at that size. Each logo is carried by a square turned about the centre and turns back by as much, so it stays upright; the orbit clips the carriers' corners so the page keeps its width. The whole orbit holds still while a logo is pointed at or keyboard-focused, so it can be clicked, and does not turn under reduced motion (globals.css, `orbit`). Off the home page it is white (the `light` variant): ink heading and line, the dashed rings in ink at 20%, the logo discs white with an ink 10% hairline and an ink 6% halo when pointed at, and the hub as the header draws the logo there, the mark in its own colours on a white disc with the soft shade of the client's reference (0 28px 60px −24px, ink at 30%); focus rings turn brand.

### Footer
On the night ground on the home page and on white everywhere else (the `light` variant: ink type, ink 10% hairlines, the ink button, brand focus rings), continuous with the page above it, inside the page container, in two bands divided by white 10% hairlines (reworked on 2026-11-09 at the user's request). (1) The closing call, two parts at lg (columns 1–7 and 8–12, bottom-aligned), stacked below. The statement is set like a hero step at clamp 2.5–5rem: the h2 "Төслөө / хамтдаа ярилцъя." with its second line set in by 0.9em, a short white rule with the line "Агаар сэлгэлт, хөргөлтийн системийг зураг төслөөс угсралт, засвар үйлчилгээ хүртэл нэг дор хийнэ." beside it (the Company copy, shortened), and under the rule the white "Инженертэй холбогдох" button (3px radius). Beside it the contact card (white 4% on night, ink 3.5% on white, 24px corners, 8px in): three of the engineers' faces overlapping (44px, ringed in the card's ground) with "Таны асуултад инженер маань хариулна", then a list (white 5% on night, white on white, 18px corners, 8% hairlines) of four 64px rows, each with its icon in a round well: the two phones (18px semibold, tabular; the whole row calls, with an arrow), the email (15px on phones so it keeps to one line from 360px, 18px from sm) (its copy button was taken out on 2026-11-09), and the hours "Даваа – Бямба 9:00 – 19:00". (2) Three columns at lg (two from sm, the menu then across both; one on phones), each under a mono label: Оффис and Үйлдвэр, each its address and an outline "Газрын зураг" button (3px radius, white 25% or ink 25% border, 44px tall, the house arrow) that opens the place's tab on the contact page with its map in view (`/contact?place=office|factory#location`, same tab); and Цэс (the menu in two columns). The places (addresses and pins) are shared with the contact page from `constants/data.ts`. The page ends there: the copyright bar, the credentials and the photo-filled name "Есөн Бэлчир" that closed it before were taken out on the user's request (2026-11-09), and with them the footer's Facebook link and "Дээш" button (the hero still links Facebook). Links on night get brighter and underlined under the pointer, never dimmer, and every focus ring in the footer is white (drawn inside the card's rows, which the list clips). The photo band and the footer-2 shoulders it replaced are gone.

### Contact Bar
The company's channels on every page (`components/ContactBar.tsx`, in the root layout after the footer; since 2026-11-09, after the client's reference): a white pill (ink 8% hairline, the soft shade 0 18px 40px −16px ink at 40%, 6px in, 4px from lg) of round icon buttons, ink, turning brand on an ink 6% ground under the pointer, with brand focus rings. In order: Facebook (a new tab), Messenger (a new tab, the page's m.me link in `constants/data.ts`), the main phone (calls) and the email (mails); the icons are the house's own (`components/icons.tsx`, Messenger's bubble with its bolt cut out added for it). From lg it stands down the left edge, 20px in, halfway up the screen, 50px wide (40px buttons, 18px icons; narrowed at the user's request), each channel's name or number showing beside it in an ink pill under the pointer or on focus. Below lg it lies along the foot of the screen, centred, 16px up or above the safe area (44px buttons), since a bar at the side would cover the text on phones and tablets; the footer's last band leaves 112px under the menu there so the bar never covers it. It sits under the header (z-40 to the header's 50), so the phone menu covers it.

### About Page
`/about` (`components/about`), minimal, on white like every page but the home page (since 2026-11-08), its header, Partners block and footer white too, built to the confirmed brief in `.impeccable/surfaces/app-about-page-tsx.md` (2026-11-08): proof first, values last, and the footer's closing statement as the one call to contact an engineer. Few elements, wide margins, hairlines between parts, and two react-bits pieces from the repo for its motion.
- **Sequence:** the opening, the team, the timeline, the factory, the strengths, then vision, mission and objective. Every part after the team sits in the page container under a white 10% hairline with 96px (128px at lg) above and below (`components/about/Part.tsx`).
- **The opening** (since 2026-11-08; `components/about/Intro.tsx`): a night hero on photographs, the screen's full height under the header (100svh − `--header-h`, taller only when its copy needs it), its copy at the foot. The copy is short (since 2026-11-08, at the user's request). At the foot on the left (columns 1–8 at lg), the statement "Барилга бүрийн агаарыг хариуцна." is the h1 in white at clamp 2.5–4.75rem (11em wide at most: two lines on desktop, three on phones), every line after the first set in by 0.9em, its words rising into place (react-bits StaggeredText, forced to `block!` so the indent applies; it is a flex row otherwise); under it, one line at the Body step in white 80%: "Агаар сэлгэлт, хөргөлтийн системийн зураг төсөл, угсралт, засвар үйлчилгээ." On the right (columns 9–12, bottom-aligned), the four figures that say the most (2011, 150+, 1 800 м², 1–3 жил) two by two, each under its own white 20% hairline (four in a row from sm until lg), rising in one after another. The licence (БХБЯ) is left to the timeline and the footer. Behind it three photographs take turns, 6 s each with a 1.4 s crossfade, each closing in from a 1.12 zoom to 1.02 while it shows: Ulaanbaatar at dusk from the air (duku. Fill), an office ceiling with its ducts and a diffuser (Adrien Olichon) and a technician servicing an air conditioner (Joel Muniz), all from Unsplash under the Unsplash License (2026-11-08, at the user's request for new photos used nowhere else on the site; the user dropped the company's ductwork photo from the turn). A night veil (ink 45% at the top, 30% at a third, 88% at the foot, and 55% more from the left, clear by 65%) keeps the type readable. As the reader scrolls on, the photos sink 14% and the copy fades to 35%; the photos change only while the opening is at least 30% in view, and under reduced motion the first one stays, still.
- **The team** (`components/about/Team.tsx`; since 2026-11-08, at the user's request for no gap after the opening): the whole team (`/images/person3.jpg`, through Next's optimizer) full-bleed straight under the opening, the two photos meeting edge to edge. It is as tall as the screen under the header from md and 4:5 on phones (a screen-tall crop there would keep only the middle of the group), centred 45% down, and settles from a 1.12 zoom to 1 while its top travels from the foot of the screen to the top (still under reduced motion); an ink shade at the foot carries "Есөн Бэлчирийн хамт олон" small at the bottom left. It replaced ScrollMask's iris, whose white ground left a gap between the photos.
- **The timeline ("Бидний түүх", "Оноор түүх" until the 2026-11-09 copy edit):** one ribbon laid down the page from 2011 to "Өнөөдөр" (since 2026-11-08, after the client's reference of a winding 3D road, in the brand's blues; `components/about/Timeline.tsx`, SVG and motion only). The ribbon is a band (3% of the container at lg, 26–40px; 18px below lg) whose top runs from brand blue at 2011 to azure `#0a8cf0` today inside a 2px white rim, with groups of pale stripes across it (white 14%). It stands on a side drawn by copies of the band set lower, each a little darker, from white under the top to a pale blue-grey (`#c9d3e6`) and a `#b4c0d8` foot, with a soft ink shadow under it; the side is 0.8 of the band deep at lg and 14px below lg, where it is also set a little to the right so it shows along the upright ribbon. At lg the eight years sit on alternate edges of the page container, each on a bend, and the ribbon leaves each one straight down and sweeps across the page to the next (its handles reach 0.6 of the way, so the bends stay upright and clear of the year the ribbon arrives above): the year (clamp 2.5–4rem, semibold, tabular, in the ribbon's colour at its node) 80px in from the bend, the title (semibold, clamp 1.375–1.75rem) and line (Body step, ink 70%) in three columns beside it, and the photo in the five columns beyond, all centred on the node. Below lg the nodes share a lane at the left and the ribbon swings out 20px between them, one side then the other, with the year, title, line and photo stacked to its right (the photo at most 42rem wide). A short straight lead fades in above 2011 and out below today, so the road seems to come from somewhere and go on. The route ahead is a 1.5px dashed ink 20% line. The ribbon is laid down to 64% of the viewport (the share of the way from one year down to the next becomes the same share of the segment between them, so it grows at an even pace), through a spring (stiffness 120, damping 22, mass 0.6), by one mask per segment so only the segment being laid repaints, and is taken up the same way when the reader scrolls back. Years ahead stand in ink 20% on a small hollow ring; when the ribbon reaches one, the ring grows into a disc in the ribbon's colour with a white rim, the year takes the ribbon's colour, and the title and line rise in (0.8 s) while the photo is put down on the page (from 1.1 and 24px above, on a spring) and pressed on with a short peel 0.7 s later, all going again in 0.3 s when the ribbon is taken back past it. The photos are react-bits ElasticStickers (`components/react-bits/elastic-sticker.tsx`, since 2026-11-08 at the user's request): glossy 4:3 photo stickers with a 10px white edge and 20px corners, each turned 2° toward the ribbon's side (−2° on the other), lifting a corner after the mouse and now and then on their own, with their own soft shadow; they do not drag, since a sticker that moved would leave its year and would hold the page's scroll on phones. Each is a WebGL canvas reaching well past the photo for its peel and shadow, so a sticker is mounted only within 60% of a screen of view (three or four at a time) and the section clips sideways (overflow-x: clip) to keep the page its width. The photos come through Next's optimizer at 1200 wide. Under reduced motion the ribbon is laid whole and every year shown at once.
- **The factory ("Сувгаа өөрсдөө хийнэ."):** the Headline with its one line beside it, then a bento (since 2026-11-08, on the user's request; `components/about/Factory.tsx`), 12 columns at lg, two from md, one on phones, 16px gaps, every tile 24px-cornered. The big tile (seven columns, two rows; `components/about/ProductTile.tsx` and `ProductModel.tsx`, since 2026-11-08 at the user's choice, replacing the bento-16 slab stack) is what the factory makes: the factory page's 3D run of fifteen duct products under the soffit (`ducts.glb`, in the same room, light and effects, shared from `components/factory/ProductsScene.tsx`) on graphite, seen from the run's side and below so its length lies across the tile, a little brighter than on the factory page. It drifts slowly ±0.3 rad about the run's middle, and a mouse drag turns it up to ±0.75 rad. Every 2.8 s the next product slides out of the run under a soft light that follows it, and its number, name and lead (the factory page's copy) change at the foot; the product under the mouse slides out instead and stays while the mouse does, and a tap picks one for 5 s. "Бүтээгдэхүүн" in mono at the top left, "Чирж эргүүлнэ" at the top right for a mouse, and the outlined white "Бүх бүтээгдэхүүн" link to `/factory#products` at the foot; the fifteen names are listed for assistive tech. The scene loads half a screen early, draws only while the tile is on screen, fades in once the model is there, and takes the lite path on phones (no SSAO or multisampling); under reduced motion it stands still and a product slides out only when pointed at. Beside it the factory (`about1.jpg`) and the warehouse (`factory10.jpg`, the ducts made there) as photo tiles; along the foot the floor area, "1 800 м²" large with 2021, 216 м² and 12 under a hairline (ink 3.5% tile), and the machines (`about3.jpg`) eight columns wide. A photo tile fills its tile, closes in to 1.04 under the pointer over 0.7 s, and carries its name and its facts as small blurred white chips on an ink shade along its foot. The tiles rise in one after another.
- **Strengths** (since 2026-11-08, after the client's reference of icon cards; `components/about/Strengths.tsx`): the Headline centred, then the eight points as cards, four across at lg, two from sm, one on phones. Each card is ink 3.5% on the white page with 20px corners and no border: a round white badge (72px, 56px on phones) holding the point's line icon (24 grid, 1.5 lines, ink; `components/about/StrengthIcons.tsx`), its short title (semibold, 18px) and its line (14px, ink 65%), all centred, the badge beside the text on phones. Under the pointer a card turns white with an ink 10% hairline and a soft shadow, its badge greys, and its icon acts its point out again: a bubble with someone typing in it, a ruler laid down and a pencil sketching, a wrench turning a bolt, a chip whose core lights and pins run out, the works with smoke leaving the stack, a bulb that lights, a manual whose page turns, a shield with a tick put in it. Each icon acts once of its own as its card comes into view, and stands still under reduced motion.
- **Vision, mission and objective** (since 2026-11-08, after the client's reference; `components/about/Statements.tsx`): one stage pinned under the header for 90svh of scroll per part, on photographs. The section's name at the top left (clamp 1.75–2.75rem, semibold, white 90%) and an outlined white "Төслүүд" link to the projects at the top right (from sm); below them the part's number in a small rounded mono pill (01 / 03, white 25% hairline on white 10%, blurred) and its name in mono capitals at the left (a row above the statement on phones), and the statement on the right in nine columns (clamp 1.5–3.125rem, medium, tracking −0.03em), its words lighting from white 30% to white one after another over the first 70% of the part's scroll and dimming again when the reader scrolls back; the parts change with a short crossfade, the number and name sliding. Behind it, a photograph of what the part means fills the stage (`public/images`, from Unsplash under the Unsplash License, 2026-11-08 at the user's request): the vision a sun rising over a hazy city (Ahmed Nishaath), the mission a tower crane over a building going up at dusk (Claudio Schwarz), the objective a summit above a sea of clouds with a climber on it (Christian Cueni). Each crossfades in with its part (0.9 s) and, as the stage scrolls, settles from a 1.16 zoom to 1.02 and drifts from 3% below to 3% above, so the background moves with the reader (still under reduced motion); a night veil (ink 62% at the top, 42% through the middle, 70% at the foot, and 35% more from the left) keeps the white type readable.
- Section headings are the Headline step with the home page's word rise (`components/about/Heading.tsx`); blocks fade up once as they arrive. The timeline, statements, strengths and factory lines are the client's copy shortened and approved on 2026-11-08 (recorded in the brief); the timeline's titles were drawn from the same facts and approved the same day.

### Team Page

`/ourTeam` (since 2026-11-09, at the user's request), white throughout and built from the about page's parts (`Part`, `Heading`, the `rise`/`stagger` reveal), its h1 "Хамт олон" visually hidden. It took in the two greeting pages, which redirect here permanently (308, in `next.config.ts`): `/greeting/director` to the top, `/greeting/engineering` to `#engineers`. In order:

- **The director's greeting** (`components/ourTeam/DirectorGreeting.tsx`), the page's opening: his portrait (`director2.jpg`, 4:5, 24px corners) in columns 1–5, and in columns 7–12 the heading "Захирлын мэндчилгээ", the letter's closing promise set large as the quote (clamp 1.25–1.75rem, medium), the letter in two short paragraphs at the Body step (ink 75%, 62ch), and his signature (`signatureee.png`) beside his name and title over a hairline. The words are his, from the old greeting page, cut short at the user's request (2026-11-09): the page keeps every block to a line or two.
- **The engineers** (`components/ourTeam/Engineers.tsx`) through the repo's `components/blocks/about-1.tsx`, made to take its people and heading as props and dressed in the house ink and brand: the roster (name over role, a brand dot for the one shown) in columns 1–3, below the carousel on phones; over the carousel the heading "Инженер техникийн алба" and its lead. The card at the front is whole (450px tall, 24px corners) with the name, role and their years (a few words: "17 жилийн туршлагатай") in white on a short dark shade over the lower half (black 60% at the foot, clear by the middle), so the photo stays clear; the next two wait inset, and a click on one brings it to the front (its photo closes in to 1.04 under the pointer). It moves on every 5 s until the visitor picks someone, holds while the pointer or keyboard focus is on it, and stays put under reduced motion (`MotionConfig reducedMotion="user"`); the progress bars under it are a pointer shortcut, hidden from assistive tech. The two safety engineers have no photo yet and show their initials on an ink tint.
- **What sets them apart** (`components/ourTeam/Advantages.tsx`) through the repo's `components/blocks/features-8.tsx`, made to take its items as props: the heading "Манай инженерүүдийн давуу тал" centred, then three centred columns, each a 64px round badge (white to ink 8%, a 1.5-stroke lucide icon), a two-line title (1.625rem, semibold) and three short points at the Body step in ink 70%.
- **The engineering lead's greeting** (`components/ourTeam/LeadGreeting.tsx`), the director's mirrored: the heading "Инженерийн багийн ахлагч", "Б.Бэхбат · 17 жилийн туршлагатай инженер", his closing sentence set large as the quote, one paragraph, and his photo (`engineering5.JPG`, 4:5) in columns 8–12.
- **The crew** (`components/ourTeam/Crew.tsx`): "Манай хамт олон" with the company in two short sentences beside three photos of the work (one tall, two stacked, 24px corners), then the whole team (`person3.jpg`) across the page at 21:9 (4:3 on phones) with its caption.

### Projects Page

`/projects` (since 2026-11-09, at the user's request; `components/projects/ProjectBook.tsx`) is a catalogue to leaf through, on the repo's `components/react-bits/page-flip.tsx` (made to take any content on a page, to be driven from outside through `open`/`onOpenChange`, and to keep its turned pages when the pointer leaves or clicks beside it). In order:

- **The book fills the screen** under the header (100svh − `--header-h`, at least 34rem) on the night ground, edge to edge but for a 16–48px margin, its controls along the foot; the page's h1 "Хэрэгжүүлсэн төслүүд" is visually hidden and the front cover carries the title. The pages take all the room left: a landscape screen opens the book into spreads (two pages side by side, each kept within 1.4:1 either way, the book sliding half a page aside as it opens), a portrait screen (a phone, an upright tablet) turns one page at a time at the full width and height. 6px corners, a soft shadow. In a spread each project's details sit on the left page (cool paper `#f5f6f8`; its number and year in mono with the number again large and faint in the page's empty middle, its name large, what the building is, the work as small grey pills, and the engineer who led it with the team page's portrait or initials) and its photo on the right, each page shaded toward the spine. One page at a time, only the photos turn and the details sit under the book in white. A graphite front cover ("Хэрэгжүүлсэн төслүүд", "150 гаруй объектоос онцлох 12 нь · 2019–2024", "Нээх →") and back cover ("Дараагийн төсөл таных байж болно."). The projects run in the order they were built; the old page's five-star ratings are gone (they were not real reviews).
- **Turning:** a click on the right page turns forward and on the left page back, a horizontal swipe turns either way, the ← → keys turn it while it is on screen, and two 48px round white-outlined buttons around a mono counter ("Нүүр", "03 / 12", "Төгсгөл") do the same, the hint at their left; at the back cover a white "Инженертэй холбогдох" button leads to `/contact`. Under reduced motion the pages turn at once. The book is hidden from assistive tech; the details line under it (visible when one page turns at a time, otherwise visually hidden, announced politely) carries what it shows.
- **Every project** (white, in the page container; photo cards since 2026-11-09 at the user's request): the heading "Бүх төсөл" and "150 гаруй объектоос онцлох 12 нь, 2019–2024 он." on the left, and on the right a row of filter pills by kind of building with their counts ("Бүгд 12", "Орон сууц 6", "Олон нийтийн 4", "Үйлдвэр, уурхай 2"; ink when chosen, ink 5% otherwise, 44px tall). Under them the projects as cards in four columns at xl, three at lg, two below: the photo at 4:3 with 20px corners, the year in a white pill at its top left and the number in mono at its top right over a light shade, then the name (semibold, brand under the pointer) and what the building is. Under the pointer the photo closes in to 1.04 and a round white book mark rises at its corner; the project open in the book is ringed in brand with a brand "Харж байна" pill. A filter change fades and reflows the cards (layout animation, none under reduced motion); a click opens the book on the project and scrolls back up to it.

### Factory Page

`/factory` (its own blocks since 2026-11-09, at the user's request; the 3D run stays where it was), white around the graphite run, in order:

- **The opening** (`components/factory/Intro.tsx`, in place of the old two photo carousels): the h1 "Агаар сэлгэлт, хөргөлтийн үйлдвэрлэл" (clamp 2.5–4.75rem, word rise) in columns 1–7 and "Суваг, фасон эдлэл, агаар сэлгэлтийн тоног төхөөрөмжийг өөрийн үйлдвэрт, төслийн хэмжээгээр хийнэ." at the right; the hall (`factory4.jpg`) across the container at 21:9 (4:3 on phones, 24px corners); then the four approved figures under hairlines (2021 · 1 800 м² · 12 · 216 м²), four in a row from sm.
- **What it makes:** the 3D run, Products, unchanged.
- **What sets it apart** (`components/factory/Advantage.tsx`, `#features`, in place of the old three shadowed cards): the heading "Үйлдвэрийн онцлог" with one line beside it, then five alternating rows, a 4:3 photo of the plant (24px corners) on one side and on the other the strength's number in mono, its name (clamp 1.75–2.75rem, semibold), one sentence at the Body step and a few facts as grey pills; the sides swap from row to row, the photo first on phones. The rows: all stages in one place, modern machines (1 800 м², 12, since 2021), standards and quality control, energy-saving solutions, fit for every building. The copy is the old page's, cut short.
- **The plant** (`components/factory/Plant.tsx`, in place of the old last carousel): over a hairline, the heading "Манай үйлдвэр" with "72 × 24 м хэмжээтэй, 7,35 м өндөр, хоёр давхар барилгад байрладаг.", and four photos as a bento (the building large at the left over two rows, the line across the top right, two machines under it; the building across the top on phones), each closing in to 1.03 under the pointer.

### Partner Page

`/partner` (since 2026-11-09, at the user's request: shorter and clearer; `components/partner/Brands.tsx`), white, in order:

- **The opening:** the h1 "Албан ёсны түншүүд" (clamp 2.5–4.75rem, word rise) in columns 1–7 and "Дэлхийд танигдсан 6 брэндийн агаар сэлгэлт, хөргөлтийн тоног төхөөрөмжийг албан ёсоор нийлүүлж, угсарна." at the right; under them the six logos as a row of grey tiles (16px corners, 80px tall; three across on phones), grayscale at 70% until the pointer brings back their colour, each a jump to its brand. The logo files carry different margins, so each takes a scale (`logoScale`, in `constants/brands.ts`, which the footer's orbit shares) to read at one size.
- **The brands** as cards, three across at lg, two from md, one on phones: a grey card (ink 3.5%, 24px corners) holding two product photos on white tiles (18px corners, closing in to 1.04 under the pointer), then the logo as the card's heading (its white ground multiplied into the card) with the country and the year it began, what it makes in semibold, one line, three facts as white pills, and its site with an arrow (a new tab). Every fact is from the client's old copy, which ran to five paragraphs a brand. A card reached by its `#slug` (the jump row or the footer's orbit) lands 40px under the header: its scroll margin is 128px, since the card is still 24px low from its entrance when the page scrolls to it.
- **The next step:** an ink panel, "Аль брэнд таны төсөлд тохирох вэ?" with one line and a white "Инженертэй холбогдох" button to `/contact`.

The shared Partners block is left out of this page's footer (`components/Footer.tsx`), since the page shows the brands in full.

### Contact Page

`/contact` (since 2026-11-09, at the user's request: the office and the factory as two tabs in the middle of the page, each on a Google map with its phone and address; `components/contact/Contact.tsx`, the metadata in `app/contact/layout.tsx`), white, in order:

- **The opening:** the h1 "Холбоо барих" (clamp 2.5–4.75rem, word rise) in columns 1–7 and "Оффис болон үйлдвэрийн хаяг, утас, байршил." at the right, as on the partner page. The old page's shadowed cards and building photo are gone.
- **The tabs** (`#location`, 96px scroll margin), centred: a grey pill track (ink 5%, 4px in) holding "Оффис" (Building2) and "Үйлдвэр" (Factory), 44px tall; the chosen one is white on an ink pill that slides between them (motion `layoutId`, spring 0.45 s, bounce 0.15; instant under reduced motion). They follow the WAI-ARIA tabs pattern: arrows, Home and End move between them and focus follows; the panels are `tabpanel`s, the hidden one hidden. The place on show is in the URL (`?place=factory`, none for the office), rewritten in place with `history.replaceState` so a tab answers at once and the page can be shared open on either place; the footer's "Газрын зураг" buttons link there. The static HTML shows the office (useSearchParams sits under a Suspense whose fallback is the office without its map).
- **A panel**, fading in (300 ms), two parts at lg (columns 1–5 and 6–12, the same height), stacked below: the place's card (ink 3.5%, 24px corners, 8px in) with its name as the h2, a white list (18px corners, ink 8% hairlines) of 64px rows, each an icon in a round well over a small label: Хаяг (the address on one line), Утас twice (the whole row calls), Имэйл (the row mails), and under the list the ink "Чиглэл авах" button across the card (48px, 3px radius, the house arrow) to Google Maps directions to the pin. Beside it the map (24px corners, ink 4% ground while it loads; 22rem on phones, 28rem from sm, at least 28rem at lg): Google's keyless embed of the pin (`maps.google.com/maps?q=lat,lng&z=16&hl=mn&output=embed`, lazy). A place's map loads the first time its tab opens, since a map loaded in a hidden panel starts at no size and loses its pin, and then stays. The office's pin is decoded from its plus code WW36+6W8, the factory's from its Google Maps link. The hours are left off: PRODUCT.md marks them unconfirmed.

### Products Page

`/products` (since 2026-11-09, at the user's request: the partner brands' products, sorted on the left, a list with a search, each opening its details), white; "Бүтээгдэхүүн" is in the menu (header and footer) between Түнш and Холбоо барих.

- **The data** (`constants/products.ts`): each brand's products as its own site shows them, collected on 2026-11-09. KANION from kanionco.com, AUX from auxcool.com, BALLU from ballu.kg (BALLU's Kyrgyz site, since ballu.ru blocks automated requests), SHUFT from shuft.pro (SHUFT's official store, since shuft.ru does too) and AIRONN from aironn.com.tr; LAVFILL has none yet (its storefront asks for a CAPTCHA and its image host refuses direct requests). Names, model codes and figures are the brand's; the Mongolian titles, summaries and features were written for this site, and warranty terms were left out, since the local warranty is the distributor's. The photos are WebP in `public/images/products/<brand>/`, their flat white or transparent margins trimmed. Nine kinds (`categories`): Агааржуулагч, Мульти ба VRF систем, Дулааны насос, Дулааны хөшиг, Конвектор, халаагуур, Агаар боловсруулах төхөөрөмж, Чиллер, Үйлдвэрийн ба галын сэнс, Ахуйн агаар сорогч; a kind with no products does not show.
- **The opening:** the h1 "Бүтээгдэхүүн" (clamp 2.5–4.75rem, word rise) in columns 1–7 and one line at the right, as on the partner page.
- **The filters** (columns 1–3 at lg, sticky under the header): two groups under mono labels, Ангилал and Брэнд, each "Бүгд" first and then its options with how many products each leaves after the other group and the search (faceted counts); the chosen option is an ink pill (12px corners), the rest ink 75% on an ink 5% hover. One option per group; choosing the chosen one again clears it. Below lg they fold behind a "Шүүлтүүр" pill (with the number of filters on) and fold away again once one is chosen.
- **The list** (columns 4–12): a search pill (48px, ink 5%) that matches names, model codes, brands, kinds, the texts and the figures (so "R32" finds every R32 unit), with a clear button, and the count beside it (a live region); with a brand chosen, its card from the partner page's data (logo, what it makes, its line, "Брэндийн тухай" to `/partner#slug`); then the products, three across from md, two on phones. Each is a grey tile (ink 3.5%, 20px corners) with the photo multiplied into it and closing in to 1.04 under the pointer, the brand and model in mono, the name in semibold (underlined under the pointer) and what it is. Nothing found: a grey panel with a line and an ink "Шүүлтүүрийг арилгах" button. The filters and the search are in the URL (`?category=&brand=&q=`, rewritten in place), so a filtered list can be shared; the static page lists everything.
- **A product** (`/products/[slug]`, static for every product, 404 otherwise; its own title, description and share photo): a trail (Бүтээгдэхүүн / brand / name), then at lg the photos in columns 1–7 (a grey square tile, the chosen photo fading in, thumbnails under it when there are more) and in 8–12 the brand and kind in mono, the name as the h1 (clamp 2–3.25rem), what it is, the model in mono, the summary, the features with brand checks, the ink "Үнийн санал авах" button to `/contact` beside the phone, and a quiet link to the product's page on the maker's site (a new tab). Under them "Техникийн үзүүлэлт" as a two-column list of label and value over ink 10% hairlines, and "Төстэй бүтээгдэхүүн": up to four cards, the same kind first, then the same brand.

### Navigation
One bar, `--header-h` (4rem) tall and sticky, so every scroll stage pins right under it; dark cinematic (see Overview).
- **Layout:** a three-column grid in the 80rem container: the white logo at the left; the page links in the middle ("Нүүр" first), small uppercase and white, the current page at 45% white, the others dimming on hover; the phone (from xl) and the small white "Холбоо барих" button at the right.
- **Ground:** night on the home page. Over its hero it casts nothing, so it reads as part of the first screen; further down a shadow sets it off (0 10px 30px −12px, black 70%), fading in over 300ms. Every other page gets the white bar (the `light` variant): a soft ink shadow (0 8px 28px −14px, ink 30%), the logo in its own colours, ink links with the current page at 50%, the ink "Холбоо барих" button and brand focus rings; the phone menu sheet turns white with it. No border (since 2026-11-08 the shadow replaced the hairline, at the user's request), no blur.
- **Phones:** the logo and a 44px menu button. The menu opens as a night sheet under the bar: the pages in large white semibold type on white 10% lines, then the phones and the email. Escape closes it and returns focus to the button.
- A skip link ("Агуулга руу шилжих") leads to `<main id="main">`.

## Do's and Don'ts

### Do:
- **Do** use the white button on night, graphite or ink grounds and the ink one on panel or white grounds, both in the Button style, fully rounded.
- **Do** pair one primary button with at most one underlined mono secondary link.
- **Do** keep the home page on the one night ground from the header to the footer, and every other page white from the header to the footer.
- **Do** keep brand blue to squares, hairline rules, focus rings and hover fills.
- **Do** set headings semibold with a clamp() size and -0.04em to -0.045em tracking.
- **Do** gate every rAF loop or R3F frameloop with an IntersectionObserver (`useInView` or a raw observer), and load heavy scenes about one screen before they arrive.
- **Do** make reduced motion produce a still picture:
  - R3F rigs snap to the scroll pose and drop ambient sway;
  - the Company streams render one still frame per part, redrawn only when the part changes.
- **Do** run the lite path on coarse pointers or widths under 768px: no SSAO, no multisampling, and a device pixel ratio capped at 1.5.
- **Do** keep a readable fallback when WebGL is missing: the section ground and all content stay.
- **Do** write all copy in Mongolian, and use only figures the client has confirmed.

### Don't:
- **Don't** put kicker or eyebrow labels, or section or step numbers, above headings.
- **Don't** use gradient text.
- **Don't** round corners or add box-shadows to house components.
- **Don't** invent testimonials, reviews or ratings, and never present the projects page's stars as client ratings.
- **Don't** add a second accent colour. The shadcn coral `--secondary` and `--primary` in globals.css are legacy values, not part of this system.
- **Don't** let a scene capture the page wheel, or block page scroll on touch.
