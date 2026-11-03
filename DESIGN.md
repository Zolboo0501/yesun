---
name: Есөн Бэлчир
description: The engineered-air system for the home page of an Ulaanbaatar HVAC engineering company.
colors:
  ink: "#0b1020"
  soft: "#4f5a6e"
  panel: "#e9ebee"
  brand: "#0100fd"
  graphite: "#1f2226"
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
  selector:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, min(1.6rem + 5.6vw, 10svh), 6rem)"
    fontWeight: 600
    lineHeight: 0.95
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
  system-option:
    textColor: "{colors.ink}"
    typography: "{typography.selector}"
  fact:
    textColor: "{colors.ink}"
    typography: "{typography.figure}"
---

# Design System: Есөн Бэлчир

Scope: this records the home page (`app/page.tsx`) as it ships: Hero, Products, Company, Projects, plus the shared Partners block and footer in `components/Footer.tsx`. The other routes (about, ourTeam, projects, factory, partner, contact, greeting, products) and `components/Header.tsx` still use the older styles: shadcn primary blue, hardcoded hex values, grey text, rounded cards and drop shadows. They are **not yet aligned** and are not evidence for this system.

## Overview

**Creative North Star: "The Engineered Air"**

The site shows the company's subject, air moving through a building, as something you can see. It does not illustrate it. Each scroll stage is a working view: an x-rayed office, a run of fabricated duct pieces, a wall with daylight and air streams on it, and a wall of delivered buildings. Around them sits the plain apparatus of an engineering drawing: cool grey and graphite grounds, near-black ink type, small mono uppercase labels, square buttons, and one saturated electric blue used sparingly.

The layout is calm and sparse. A section carries one headline, one or two sentences, real figures and one call to action. The 3D or WebGL image does the persuading. Type is set large and tight. Everything else is small, mono and quiet. The house draws no rounded corners and no shadows; depth comes from the rendered scenes and from alternating light and dark grounds.

The world is local and factual. All copy is Mongolian. Every figure shown is one the client has confirmed.

**Key Characteristics:**
- Grounds alternate light and dark: panel (Hero), graphite (Products), panel (Company), graphite (Projects), then white (Partners) and ink (footer).
- One accent, electric brand blue. It appears as small squares, hairline progress rules, corner brackets, focus outlines and the hover fill of buttons.
- Semibold Golos Text headlines with tight negative tracking, sized with clamp().
- JetBrains Mono uppercase, tracked at 0.16em, is the voice of every label, button and technical annotation.
- Square corners throughout. No shadows.
- The scenes are driven by scroll, are paused when off screen, hold still under reduced motion, and run a lighter path on phones.

## Colors

A cool, nearly neutral palette of blue-black, blue-grey and graphite, carrying a single electric blue.

### Primary
- **Electric Signal Blue** (brand): the only accent. It is used for:
  - the square after the selected Company system word;
  - the square bullets in the Products point lists;
  - the corner brackets on scroll-stage copy;
  - the hero progress rules;
  - focus outlines on light grounds;
  - the hover fill of every primary button;
  - the text selection colour on Company.

  It is never used as a ground or as body text.

### Neutral
- **Blueprint Ink** (ink): headings and primary text on light grounds. It is the resting fill of the primary button on light grounds and the footer ground. Body copy uses it at 80% opacity, and hairline dividers use it at 15%.
- **Drafting Slate** (soft): secondary text on light grounds, such as fact labels, the radiogroup prompt, the system meta line and the hero frame annotations.
- **Plaster Panel** (panel): the light ground of Hero and Company, and of the partner logo tiles. Behind Company it is the wall the daylight lands on.
- **Graphite** (graphite): the dark ground of Products and Projects. On graphite, text is white at stepped opacities: 100% for headings, 85–90% for leads, 70% for body and 50–60% for annotations.
- **White** (white): text on dark grounds, the resting fill of the primary button on dark grounds, and the Partners ground.

### Named Rules
**The One Signal Rule.** Brand blue only marks things: a point, a rule, a bracket, a focus ring or a hover. It covers a few square millimetres of any screen. If it fills an area larger than a button, it is wrong.

**The Alternating Ground Rule.** Consecutive home sections change ground between light (panel or white) and dark (graphite or ink). A new section takes the opposite ground from the one before it.

## Typography

**Display Font:** Golos Text (with ui-sans-serif, system-ui), weights 400, 500 and 600, with the Cyrillic subset.
**Body Font:** Golos Text.
**Label/Mono Font:** JetBrains Mono (with ui-monospace), weights 400 and 500, with the Cyrillic subset.

**Character:** a clear, modern Cyrillic grotesque set heavy and tight for statements, paired with a technical mono for labels and controls. Together they read like a specification sheet.

### Hierarchy
- **Display** (600, clamp 2.25–4.5rem, line-height 0.95, tracking -0.045em): the hero step headings (the h1 is the first step) and the footer's "Төслөө бидэнтэй ярилцъя."
- **Headline** (600, clamp 2–3.75rem, line-height 0.98, tracking -0.04em): section h2s in Products and Projects. The Company h2 runs slightly smaller and looser (clamp 2–3.5rem, line-height 1.02).
- **Selector** (600, clamp 3–6rem with a 10svh cap, line-height 0.95): the three Company system words, which are themselves the radio controls. Unselected words are ink at 55%.
- **Figure** (600, 1.5rem, tracking -0.03em, tabular numerals): proof values in the facts list.
- **Title** (600, 1.125rem, tracking -0.01em): the name of the selected system and the Products lead line.
- **Body** (400, fluid 1.0625–1.1875rem, line-height 1.625): every supporting paragraph, with a measure of 44–56ch.
- **Small** (400, fluid 0.8125–0.875rem): footer contact lists and the WebGL fallback text.
- **Label** (mono 400, 0.75rem, uppercase, tracking 0.16em): buttons, secondary links and meta lines.
- **Micro** (mono 400, 11px, uppercase, tracking 0.16em, 0.2em when set vertically): the frame annotations around the scroll stages and the footer column labels.

### Named Rules
**The Tight Statement Rule.** Headlines are semibold, sized with clamp(), balanced with text-wrap, and tracked between -0.04em and -0.045em. Never set a heading at regular weight or with neutral tracking.

**The Mono Voice Rule.** Anything that acts or annotates (buttons, links, meta, counters) is mono uppercase with wide tracking. Running text is never mono.

## Layout

- **Container and grid:** content sits in an 80rem container. Side gutters are 16px, rising to 24px at sm and 32px at lg. At lg, sections use a 12-column grid with 32px gaps. Company puts its headline in columns 1–6 and its facts in columns 9–12.
- **Section padding:** static sections open with 96px of top padding, or 128px at lg.
- **Scroll stages:** Hero and Products are pinned stages. The sticky frame sits at the header's height (top 11vh) and fills the rest of the viewport. Hero takes 100svh of scroll per step and Products 70svh. Each step holds still for the first and last fifth of its scroll, then travels.
- **Step copy:** at lg the copy floats bottom-left (5vw in, about 40–46vw wide) on its own ground at 80–85% opacity. Below lg it docks as a solid band along the bottom.
- **Company:** a single viewport of at least 89svh. The headline and facts sit at the top; the choice and its panel are pushed to the bottom. On phones a 17rem slot is left above the choice, where the light lands.
- **Projects:** the header row wraps between the headline and the button. Below it, the carousel runs full bleed, min(64svh, 560px) tall, or min(80svh, 780px) at lg.

## Elevation & Depth

The house is flat. There are no box-shadows anywhere on the home page. Depth comes from three things:
- the rendered scenes themselves: R3F lighting, SSAO and bloom in the hero and products, and a colour-dodge WebGL layer over the Company wall;
- semi-opaque copy grounds over the scenes (panel or graphite at 80–85%);
- the light/dark alternation between sections.

### Named Rules
**The Lit-Not-Lifted Rule.** Depth comes from light in the scene, never from shadows on the interface. Panels over a scene are translucent ground, not floating cards.

## Shapes

Every corner the house draws is square (0px), including buttons, copy panels, partner tiles and the brand squares. The recurring geometry is rectilinear:
- small solid squares of brand blue (0.14em after a selected word, 6px as list bullets);
- 14px L-shaped corner brackets in 2px brand blue that frame scroll-stage copy at lg;
- 1px hairline dividers at 15% opacity above each fact;
- a thin progress rule (1px track, brand or white fill).

The vendor ConcaveCarousel still uses its own rounded photo panels and circular 32px controls (see Do's and Don'ts).

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

### System Selector (signature)
The Company radiogroup is three giant words: Сэлгэлт, Хөргөлт and Шүүлт. The selected word is full ink and ends in a brand square. The others are ink at 55% and rise to 80% on hover. Arrow keys move the selection (roving tabindex), and mouse hover selects after a 70ms intent delay. The panel beside the words changes with the selection: a title, a body sentence and a mono meta line. It fades and unblurs over 500ms on cubic-bezier(0.16, 1, 0.3, 1).

### Facts List
A two-column definition list. Each fact sits under a 15% ink hairline, with the value above in the Figure style and the label below in soft text. It carries real, confirmed figures only.

### Scroll Stage (signature)
A pinned 3D or WebGL scene with a technical frame of micro annotations:
- a vertical label at the top left;
- a "Гүйлгэж танилцана" progress rule at the bottom left;
- a step counter at the bottom right;
- a vertical progress rule at the right edge (hero only).

The step copy appears inside corner brackets. Products adds a jump index of its 15 items at the top left, at lg; the current item is at full opacity and the rest at 45%.

### Project Carousel
A full-bleed ConcaveCarousel of the real project photos. Captions are a title plus "systems · year". It drifts on desktop and steps one slide at a time on phones. The page wheel is never captured, and drag, arrow keys and Space are supported.

### Navigation
The shared header has not yet been aligned to this system: it uses grey links and a hardcoded blue underline on hover. Its two bars (4vh + 7vh) define the 11vh sticky offset that the scroll stages depend on.

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
  - the Company air is baked once as still streamlines;
  - the copy swaps without the blur-in.
- **Do** run the lite path on coarse pointers or widths under 768px: no SSAO, no multisampling, and a device pixel ratio capped at 1.5.
- **Do** keep a readable fallback when WebGL is missing: the plain wall and all content stay.
- **Do** write all copy in Mongolian, and use only figures the client has confirmed.

### Don't:
- **Don't** put kicker or eyebrow labels, or section or step numbers, above headings.
- **Don't** use gradient text.
- **Don't** round corners or add box-shadows to house components.
- **Don't** invent testimonials, reviews or ratings, and never present the projects page's stars as client ratings.
- **Don't** add a second accent colour. The shadcn coral `--secondary` and `--primary` in globals.css are legacy values, not part of this system.
- **Don't** let a scene capture the page wheel, or block page scroll on touch.
