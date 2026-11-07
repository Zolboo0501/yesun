---
name: Есөн Бэлчир
description: The engineered-air system for the home page of an Ulaanbaatar HVAC engineering company.
colors:
  ink: "#0b1020"
  soft: "#4f5a6e"
  panel: "#e9ebee"
  brand: "#0100fd"
  graphite: "#1f2226"
  mist: "#aeb2b8"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.4rem + 3vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "-0.045em"
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
    rounded: "{rounded.none}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.white}"
  button-primary-on-dark:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 24px"
  button-primary-on-dark-hover:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.white}"
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

Scope: this records the home page (`app/page.tsx`) as it ships: the shared header (`components/Header.tsx`), Hero, Company, Projects, plus the shared Partners block and footer in `components/Footer.tsx`; and the 3D product run, Products (`components/factory/Products.tsx`), which since 2026-11-07 sits on the factory page (`/factory`) after the factory's introduction. The rest of the other routes (about, ourTeam, projects, the factory page's own blocks, partner, contact, greeting, products) still use the older styles: shadcn primary blue, hardcoded hex values, grey text, rounded cards and drop shadows. They are **not yet aligned** and are not evidence for this system.

## Overview

**Creative North Star: "The Engineered Air"**

The site shows the company's subject, air moving through a building, as something you can see. It does not illustrate it. Each scroll stage is a working view: an x-rayed office, a run of fabricated duct pieces, a turning network sphere of the company's sites beside its four parts, and delivered buildings flying in one after another. Around them sits the plain apparatus of an engineering drawing: cool grey and graphite grounds, near-black ink type, small mono uppercase labels, square buttons, and one saturated electric blue used sparingly.

The layout is calm and sparse. A section carries one headline, one or two sentences, real figures and one call to action. The 3D or WebGL image does the persuading. Type is set large and tight. Everything else is small, mono and quiet. The house draws no rounded corners and no shadows; depth comes from the rendered scenes and from alternating light and dark grounds.

The world is local and factual. All copy is Mongolian. Every figure shown is one the client has confirmed.

**Key Characteristics:**
- Grounds alternate dark and light: night (Hero and Company), graphite (Projects), then white (Partners) and ink (footer). On the factory page, Products keeps its graphite ground.
- One accent, electric brand blue. It appears as small squares, hairline progress rules, corner brackets, focus outlines and the hover fill of buttons.
- Semibold Golos Text headlines with tight negative tracking, sized with clamp().
- JetBrains Mono uppercase, tracked at 0.16em, is the voice of every label, button and technical annotation.
- Square corners throughout. No shadows.
- The scenes are driven by scroll, are paused when off screen, hold still under reduced motion, and run a lighter path on phones.

**The header and the hero's first screen are the exception (dark cinematic, since 2026-11-07, after the client's reference image).** One deep charcoal, night `#16171b` (a token in `globals.css`), runs from the header into the hero, the way a full-bleed photograph runs under a transparent menu. Everything on it is white: the logo (drawn white with a filter), small uppercase Golos links (semibold, 11px, 0.06em; the current page at 45% white), and one small white button with a 3px radius. Hero headings are large Golos semibold (`clamp(2.5rem, 1.1rem + 4.2vw, 6rem)`, line-height 0.95, tracking -0.035em) in two lines, the second set in by 0.9em, with a short white rule and the step text beside it. On first load a night curtain lies over the header and the hero, and scroll-mask's iris (`components/react-bits/scroll-mask.tsx`) opens it from the subject once the first 3D frame is drawn (1.6 s; skipped under reduced motion; a CSS timer lifts it after 4 s if the script never runs), the 3D settling from a slight zoom and the heading's words running as the iris reaches them. Each step's heading and text come in word by word, fading in as they rise a few pixels into place and stopping there (no blur, no overshoot), whenever that step or its scene arrives (`components/react-bits/staggered-text.tsx`). Over the stage, a mouse brings up a white drafting crosshair with rulers and a mono coordinate chip; a drag measures and a click pins a point, and the step lines name their step in the chip (`components/react-bits/drafting-cursor.tsx`; fine pointers only). Icons are the inline set in `components/icons.tsx`. Brand blue appears in neither. Every rule below still holds for the rest of the home page.

## Colors

A cool, nearly neutral palette of blue-black, blue-grey and graphite, carrying a single electric blue.

### Primary
- **Electric Signal Blue** (brand): the only accent. It is used for:
  - the square bullets in the Products point lists;
  - the corner brackets on scroll-stage copy;
  - the hero progress rules;
  - focus outlines on light grounds;
  - the hover fill of every primary button;
  - the text selection colour on Company.

  It is never used as a ground or as body text.

### Neutral
- **Blueprint Ink** (ink): headings and primary text on light grounds. It is the resting fill of the primary button on light grounds and the footer ground. Body copy uses it at 80% opacity, and hairline dividers use it at 15%.
- **Drafting Slate** (soft): secondary text on light grounds, such as fact labels and the frame annotations of the Hero and Company stages.
- **Plaster Panel** (panel): the light ground of Hero and of the partner logo tiles.
- **Mist** (mist, #aeb2b8): a cool mid grey, the Company ground until the network sphere moved it onto night (2026-11-07); the token stays for later use.
- **Graphite** (graphite): the dark ground of Products and Projects. On graphite, text is white at stepped opacities: 100% for headings, 85–90% for leads, 70% for body and 50–60% for annotations.
- **White** (white): text on dark grounds, the resting fill of the primary button on dark grounds, and the Partners ground.

### Named Rules
**The One Signal Rule.** Brand blue only marks things: a point, a rule, a bracket, a focus ring or a hover. It covers a few square millimetres of any screen. If an interface fill is larger than a button, it is wrong. This rule covers the interface, not the light inside a rendered scene: the Company network is white on night, and brand blue only lights the nodes under the pointer and the pulse a click sends round it.

**The Alternating Ground Rule.** Consecutive home sections change ground between light (panel or white) and dark (graphite or ink). A new section takes the opposite ground from the one before it.

## Typography

**Display Font:** Golos Text (with ui-sans-serif, system-ui), weights 400, 500 and 600, with the Cyrillic subset.
**Body Font:** Golos Text.
**Label/Mono Font:** JetBrains Mono (with ui-monospace), weights 400 and 500, with the Cyrillic subset.

**Character:** a clear, modern Cyrillic grotesque set heavy and tight for statements, paired with a technical mono for labels and controls. Together they read like a specification sheet.

### Hierarchy
- **Display** (600, clamp 2.25–4.5rem, line-height 0.95, tracking -0.045em): the hero step headings (the h1 is the first step) and the footer's centred "Есөн Бэлчир" wordmark, under which "Төслөө бидэнтэй ярилцъя." is the footer's h2 at 1.25–1.875rem, weight 500, white at 80%
- **Headline** (600, clamp 2–3.75rem, line-height 0.98, tracking -0.04em): section and step headings in Products and Company. The Projects stage sets its headings in the hero's step style instead: the opening at the Display size, each project's name at clamp 2.25–2.875rem.
- **Figure** (600, 1.5rem, tracking -0.03em, tabular numerals): proof values in the facts list.
- **Title** (600, 1.125rem, tracking -0.01em): the Products lead line.
- **Body** (400, fluid 1.0625–1.1875rem, line-height 1.625): every supporting paragraph, with a measure of 44–56ch.
- **Small** (400, fluid 0.8125–0.875rem): footer contact lists and the WebGL fallback text.
- **Label** (mono 400, 0.75rem, uppercase, tracking 0.16em): buttons, secondary links, meta lines and the Company brand list.
- **Micro** (mono 400, 11px, uppercase, tracking 0.16em, 0.2em when set vertically): the frame annotations around the scroll stages and the footer column labels.

### Named Rules
**The Tight Statement Rule.** Headlines are semibold, sized with clamp(), balanced with text-wrap, and tracked between -0.04em and -0.045em. Never set a heading at regular weight or with neutral tracking.

**The Mono Voice Rule.** Anything that acts or annotates (buttons, links, meta, counters) is mono uppercase with wide tracking. Running text is never mono.

## Layout

- **Container and grid:** content sits in an 80rem container. Side gutters are 16px, rising to 24px at sm and 32px at lg. At lg, sections use a 12-column grid with 32px gaps.
- **Section padding:** static sections open with 96px of top padding, or 128px at lg.
- **Scroll stages:** Hero (home) and Products (factory page) are pinned stages. The sticky frame sits right under the header (top `var(--header-h)`, 4rem) and fills the rest of the viewport. Hero takes 100svh of scroll per step and Products 70svh. Each step holds still for the first and last fifth of its scroll, then travels. Company is not pinned: its parts scroll as ordinary blocks over a sticky scene.
- **Step copy:** at lg the copy floats bottom-left (5vw in, about 40–46vw wide) on its own ground at 80–85% opacity. Below lg it docks as a solid band along the bottom.
- **Company:** four parts stacked down the page, each one stage tall (100svh − `--header-h`), over a sticky full-stage scene that the blocks overlap with a negative top margin. At lg each part's copy takes one half, alternating right, left, right, left, vertically centred and at most 36rem wide; its outer edge sits on the page container's edge, max(2rem, 50vw − 38rem), and its inner edge is 4vw from the centre line. The copy fades with its distance from the stage and is fully opaque when its part fills it. The network sphere stands in the other half and crosses between parts. On phones each part's copy sits at the bottom of its block over a night shade, and the sphere sits above it, swaying a little between parts. The part rows let the pointer through to the sphere; only the copy takes it.
- **Projects:** a scroll stage like the hero's, one screen of scroll per step: the opening, then one step per project (eleven in all), under a sticky stage (100svh − `--header-h`). The copy is the hero's (components/home/Step.tsx): the opening carries "Хэрэгжүүлсэн төслүүд." at the hero heading size, one plain sentence under it a size up ("Музейгээс уурхай хүртэл 150 гаруй объектод агаар сэлгэлт, хөргөлт угсарсан.") and the white "Бүх төсөл" button. Each project step is a caption beside its photo: the name a size down (clamp 2.25–2.875rem) in a column of min(25rem, 32vw) at lg that ends before the photo, and "systems · year" at body size, the year kept on the line of the word before it. The gallery stands in the right 60% at lg (the top 60% on phones), so the photo is the largest thing on each step; a graphite shade darkens only the copy's side (graphite to 8%, 80% at 24%, 25% at 34%, clear from 42%) and the bottom on phones, and the hero's step lines run down the right edge.

## Elevation & Depth

The house is flat. There are no box-shadows anywhere on the home page. Depth comes from three things:
- the rendered scenes themselves: R3F lighting, SSAO and bloom in the hero and products, and the Company network sphere;
- semi-opaque copy grounds over the scenes (panel or graphite at 80–85%);
- the light/dark alternation between sections.

### Named Rules
**The Lit-Not-Lifted Rule.** Depth comes from light in the scene, never from shadows on the interface. Panels over a scene are translucent ground, not floating cards.

## Shapes

Every corner the house draws is square (0px), including buttons, copy panels, partner tiles and the brand squares. The recurring geometry is rectilinear:
- small solid squares of brand blue (6px list bullets in Products);
- 14px L-shaped corner brackets in 2px brand blue that frame the Hero and Products step copy at lg;
- 1px hairline dividers at 15% opacity above each fact and above the Company brand list;
- a thin progress rule (1px track, filled brand in Hero, white in Products and ink in Company).


## Components

### Buttons
Square, mono and direct. Every button carries a forward arrow.
- **Shape:** square corners (0px).
- **Primary on light grounds:** ink fill with white label text. Padding is 16px 24px, and the label is mono uppercase. A 16px ArrowUpRight icon follows the label after a 12px gap.
- **Primary on dark grounds:** white fill with ink label text, otherwise identical.
- **Hover / Focus:**
  - Both variants fill brand blue on hover, with white text.
  - The arrow nudges 2px up and to the right.
  - On press the button scales to 0.98.
  - Focus shows a 2px outline offset by 4px, brand on light grounds and white on dark.
- **Secondary link:** mono uppercase label text with a 1px underline offset by 6px. On light grounds it turns brand on hover; on dark grounds it fades to 70% white. It sits 32px to the right of the primary button and wraps below it.

### Facts List
A two-column definition list. Each fact sits under a 15% ink hairline, with the value above in the Figure style and the label below in soft text. It carries real, confirmed figures only. A related variant is the Company brand list: the six official brands in mono Label style, laid out in 3 columns under one hairline.

### Scroll Stage (signature)
A pinned 3D or WebGL scene with a technical frame of micro annotations: a vertical label at the top left and a step counter at the bottom right.
- **Hero** (dark cinematic, see Overview): four buildings (office, kindergarten, school, building) slide in one after another on the night ground. Each scene is shaded like a photograph under type: a light overall dim, dark under the copy (the left on desktop, the bottom on phones) and along the top and bottom edges, open where the building stands; the building's fog melts its far ground into the night. In the building's fourth step the structure turns to a faint ghost and the fit-out, glazing and street fade, so every floor's ductwork shows in place, each duct in its air's site-tape colour (sky supply, butter return, peach exhaust); the same colours carry the exploded view at the end. After it the camera comes down the five floors one step each, from the top: that floor's network at full strength, the others dimmed, and each floor's copy naming one part of the system (the fire damper and control box by the shaft, the main stepping down, the diffusers, the return along the back, the air curtain over the entrance). The step copy floats without a panel: the two-line heading, the rule and the text, and on the last step the white button with the phone beside it. Around it, as in the reference: one short line per step down the right edge (six for a room, eleven for the building; the current one long and bright, sliding to the next as you scroll; each a jump link), the four building names small at the bottom left (the current one white, each a jump link), a vertical "Гүйлгэх" over a hairline, and Facebook, email and phone icons at the bottom right.
- **Products:** a "Гүйлгэж танилцана" progress rule at the bottom left.

In Hero and Products the step copy sits inside corner brackets. Products also adds a jump index of its 15 items at the top left, at lg; the current item is at full opacity and the rest at 45%.

Step copy fades as the scene moves away from it and fades back once the scene has settled. Steps that are not showing are set to visibility hidden.

### Network Sphere (Company)
The 150+ sites as one network (components/react-bits/astral-shell.tsx): 2,200 nodes (1,200 on phones) clustered on a sphere, each linked to its nearest neighbours with a few chords across, white on the night ground, drawn additively so it glows. It turns slowly on a tilted axis; the pointer lights the nodes and links near it in brand blue, and a click sends a pulse round the shell. Dragging is off, so a swipe over it still scrolls the page. It draws only while in view.

It stands in the half the part's copy leaves free (centre 27% or 73% across, radius 0.32 of the stage height; on phones 40% or 60% across, 75% up, radius 0.23). Between two parts it holds for the first and last fifth of the scroll, then crosses to the other half and breaks apart on the way: every node flies out along a direction of its own (set by where it sits, so the two ends of a link follow the nodes they join), the links let go first, and the nodes come back together on the far side. The scroll reaches the shell through a ref it reads every frame (`live`), eased there, so nothing re-renders as the page moves. Under reduced motion it crosses without breaking. The earlier air-stream scene (components/home/AirFlowScene.tsx) is no longer used.

### Project Dolly Gallery
A DollyGallery (components/react-bits/dolly-gallery.tsx) of the real project photos: square-cornered landscape tiles (820px wide, 360px on phones, never wider than the gallery less 32px; aspect 1.45, a light 25% grayscale) placed one behind another down a 1000px perspective, 900px of depth apart, shifted 5% of a tile to alternate sides, so the front photo stays whole beside the copy and on a phone. The page scroll drives it through `driveRef`: the opening holds the first project a step away, and each later step brings the next one to the front, where it holds while its name shows; between steps the passing photo flies past and fades. It has no wheel, drag or drift of its own (the wheel and a swipe stay the page's); the pointer only leans the tiles. The ConcaveCarousel it replaced is no longer used.

### Footer
Adapted from components/blocks/footer-2.tsx. A photo of installed ductwork (`/images/banner.webp`, darkened toward ink) shows above the ink panel, whose two raised shoulders (the footer-2 curve, up to 250px wide) rise into it at the corners and dip between them; the curve is the one rounded shape the house allows. The panel centres the "Есөн Бэлчир" wordmark, the h2 "Төслөө бидэнтэй ярилцъя." and one row of actions: the white primary button "Инженертэй холбогдох" (brand on hover), then the phone and the email as underlined mono links, the email in its own case. Below a hairline, a four-column grid (two on phones) holds phones with hours, the office, the factory (each with a map link) and the menu. The closing bar has the copyright with the Facebook icon, and the three confirmed credentials stacked right: 2011 оноос, БХБЯ-ны тусгай зөвшөөрөлтэй, 150+ объект. No kicker sits above any heading.

### Navigation
One bar, `--header-h` (4rem) tall and sticky, so every scroll stage pins right under it; dark cinematic (see Overview).
- **Layout:** a three-column grid in the 80rem container: the white logo at the left; the page links in the middle ("Нүүр" first), small uppercase and white, the current page at 45% white, the others dimming on hover; the phone (from xl) and the small white "Холбоо барих" button at the right.
- **Ground:** night everywhere. Over the home page's hero it has no rule, so it reads as part of the first screen; elsewhere a white 10% hairline sets it off. No shadow, no blur.
- **Phones:** the logo and a 44px menu button. The menu opens as a night sheet under the bar: the pages in large white semibold type on white 10% lines, then the phones and the email. Escape closes it and returns focus to the button.
- A skip link ("Агуулга руу шилжих") leads to `<main id="main">`.

## Do's and Don'ts

### Do:
- **Do** use the ink-filled primary button on panel or white grounds and the white-filled one on graphite or ink grounds. Both turn brand on hover.
- **Do** pair one primary button with at most one underlined mono secondary link.
- **Do** alternate grounds section by section: panel, graphite, panel, graphite.
- **Do** keep brand blue to squares, hairline rules, corner brackets, focus rings and hover fills.
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
