# SlimFile Design Guide

SlimFile's interface follows the look of **apple.com**: calm white pages, soft grey
panels, large clean type, one accent colour and gentle motion. Every new page and
component should use the rules below so the site stays consistent.

If something here does not cover your case, copy the closest existing page
(see [Reference pages](#reference-pages)) rather than inventing a new style.

---

## 1. Principles

1. **The tool comes first.** Put the upload box or main action directly under the
   headline. Supporting content (formats, how it works, why SlimFile) goes below it.
2. **One accent colour.** SlimFile red (`red-600`) is the only accent. Do not give
   tools their own colours for buttons, badges or highlights.
3. **Flat, not decorated.** No gradients, glows, coloured borders, corner accents
   or heavy shadows. Separate things with space and soft grey surfaces.
4. **Quiet text, strong headings.** Big semibold titles, grey supporting text,
   small plain labels. No ALL CAPS badges or pill-shaped feature tags.
5. **Honest motion.** Animate to show what is happening (menus opening, a tab
   moving, real progress), never as decoration.

---

## 2. Colours

Use these values exactly. Prefer the Tailwind classes shown.

| Token | Value | Tailwind | Use for |
|---|---|---|---|
| Text | `#1d1d1f` | `text-[#1d1d1f]` | Headings, body text, active nav items |
| Secondary text | `#6e6e73` | `text-[#6e6e73]` | Subtitles, descriptions, labels, hints |
| Page | `#ffffff` | `bg-white` | Page background |
| Surface | `#f5f5f7` | `bg-[#f5f5f7]` | Panels, cards, tiles, feature boxes |
| Track | `#e8e8ed` | `bg-[#e8e8ed]` | Segmented control background, secondary buttons |
| Hairline | `#d2d2d7` | `border-[#d2d2d7]` | Input borders, drop-zone dashes |
| Divider | black 6% | `border-black/[0.06]` | Header and panel edges |
| Bar | `#fbfbfd` at 80% | `bg-[#fbfbfd]/80` | Header and app bars (with blur) |
| Accent | red-600 / red-700 | `bg-red-600 hover:bg-red-700`, `text-red-600` | Primary buttons, links, eyebrow text, active state |

**Avoid:** `bg-gradient-*`, `bg-clip-text` gradient titles, `text-gray-900` /
`text-gray-500` (use the tokens above), and per-tool colours such as orange,
violet or purple on buttons and badges.

Icons may keep a colour of their own on home tiles (`feature.color`), drawn as
line icons with `strokeWidth={1.75}`, never inside a gradient square.

---

## 3. Typography

The site font stays as is; only size, weight and colour follow Apple.

| Element | Classes |
|---|---|
| Page title (wide pages) | `text-4xl sm:text-[56px] sm:leading-[1.07] font-semibold tracking-tight text-[#1d1d1f]` |
| Page title (narrow tool pages, `max-w-2xl` or less) | `text-4xl sm:text-5xl sm:leading-[1.08] font-semibold tracking-tight text-[#1d1d1f]` |
| Second line of a title (optional) | wrap in `<span className="block text-red-600">` |
| Subtitle | `text-[#6e6e73] text-lg sm:text-[21px] leading-snug max-w-xl mx-auto` |
| Eyebrow above a title | `inline-flex items-center gap-1.5 text-red-600 text-sm font-semibold mb-3` |
| Section heading | `text-3xl sm:text-[40px] font-semibold tracking-tight text-[#1d1d1f]` |
| Card / tile title | `text-[21px] font-semibold tracking-tight text-[#1d1d1f]` |
| Body / description | `text-[15px] leading-relaxed text-[#6e6e73]` |
| Small label | `text-xs font-medium text-[#6e6e73]` |

Use `font-semibold`, not `font-bold`, for headings.

---

## 4. Layout and spacing

- Page wrapper: `min-h-screen bg-white pt-28 sm:pt-32 pb-24`
  (the fixed header is 48px tall, `h-12`).
- Tool page column: `max-w-2xl mx-auto px-4 sm:px-6` (use `max-w-3xl` for wider tools).
- Hero block: `text-center mb-10`.
- Leave generous space between sections (`py-16`). Alternate `bg-white` and
  `bg-[#f5f5f7]` sections when a page has several.
- Anything you scroll to needs `scroll-mt-16` so it is not hidden under the header.

---

## 5. Components

### Header — `src/components/Header.tsx`

- Thin frosted bar: `h-12`, `bg-[#fbfbfd]/80 backdrop-blur-xl backdrop-saturate-150 border-b border-black/[0.06]`.
- Logo left, menu centred, apps icon and Login right. The outer blocks are `flex-1`
  so the menu stays centred.
- Menu items are plain text: `text-[13px]`, `text-[#1d1d1f]/75`, hover and active
  `text-[#1d1d1f]`. No pills, no chevrons.
- **Adding a menu with sub-links:** use the shared `MegaMenu` component in the same
  file. Give it a `featured` group (large links) and `groups` (small columns). It
  handles the full-width panel, the blurred page and the animation. Do not build a
  small boxed dropdown.
- Small popovers (like the apps menu): `bg-white/90 backdrop-blur-xl rounded-2xl border border-black/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-1.5`,
  items `rounded-xl px-3 py-2 text-[13px] text-[#1d1d1f] hover:bg-black/[0.05]`,
  opened with a short fade and scale.

### Panels and cards

- Panel (tool area, feature box, format list): `bg-[#f5f5f7] rounded-[28px] p-6 sm:p-8`.
  No border, no shadow.
- White inner area on a grey panel (results, file lists): `bg-white rounded-[22px] p-4 sm:p-6`.
- Rows inside a panel: `bg-white rounded-2xl p-3` on grey, or `bg-[#f5f5f7] rounded-2xl p-3` on white.
- Home tiles (`src/pages/Home.tsx`): grey tile, line icon, title, description and a
  red `Try it ›` link. Hover: `hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:hover:scale-[1.015]`.
  On phones the tile collapses to a slim row with a chevron.

### Buttons — `src/components/ui/button.tsx`

The shared `Button` already follows the guide: pill-shaped (`rounded-full`), flat,
no shadow or grow-on-hover.

- Primary: `<Button>` (red). For a big call to action add `className="h-12 text-[15px]"`.
- Secondary: `<Button variant="secondary">` (grey `#e8e8ed`).
- Outline: `<Button variant="outline">` (red outline that fills on hover).
- Hand-built buttons must match: `rounded-full h-11 px-6 bg-red-600 hover:bg-red-700 text-white text-[15px] font-medium`.

### Highlights (instead of pills)

```tsx
<div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
  <span className="flex items-center gap-1.5 text-sm text-[#6e6e73]">
    <FilePlus2 className="w-3.5 h-3.5 text-red-600" /> Merge up to 20 PDFs
  </span>
</div>
```

### Upload drop zone — `src/components/FileUpload.tsx`

White dashed area on the grey panel:
`border-2 border-dashed border-[#d2d2d7] bg-white rounded-[22px] p-10 sm:p-14 hover:border-red-400`,
`border-red-500 bg-red-50` while dragging. Icon in a grey circle (`bg-[#f5f5f7] rounded-full`).
Reuse `FileUpload` where possible instead of writing a new drop zone.

### Segmented control (tabs)

Grey track with a white pill that slides to the selected option (see the Home tabs):

```tsx
<div className="inline-flex items-center gap-0.5 p-1 rounded-full bg-[#e8e8ed]">
  {tabs.map(tab => (
    <button key={tab.key} onClick={() => setActive(tab.key)}
      className={`relative px-5 py-2 text-sm font-medium rounded-full ${
        active === tab.key ? 'text-[#1d1d1f]' : 'text-[#6e6e73] hover:text-[#1d1d1f]'}`}>
      {active === tab.key && (
        <motion.span layoutId="my-tabs-pill"
          className="absolute inset-0 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
          transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
      )}
      <span className="relative">{tab.label}</span>
    </button>
  ))}
</div>
```

Give each control its own `layoutId`.

### Inputs

`w-full px-3 py-2 border border-[#d2d2d7] rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20`

### Progress — `src/components/FileProgressCard.tsx` and `src/lib/uploadWithProgress.ts`

Never fake progress with timers. Send files with `uploadWithProgress()`, which
reports real upload and download bytes, and show them with `FileProgressCard`.
It reads like a status line: an animated sparkle, a rotating SlimFile verb
("Slimming…", "SlimFiling…"), the real percent while bytes move, and a timer while
the server works. No progress bars.

---

## 6. Motion

- Use `framer-motion`.
- Durations: 0.15–0.3s; ease `[0.4, 0, 0.2, 1]`.
- Panels grow in (`height: 0 → 'auto'`), content fades and slides 6–8px, columns
  stagger by about 0.05s.
- Hover feedback is colour, a soft shadow or at most `scale-[1.015]`. Never
  `hover:scale-105`, bouncing or pulsing decoration.

---

## 7. Page template

Start new tool pages from this skeleton:

```tsx
<div className="min-h-screen bg-white pt-28 sm:pt-32 pb-24">
  <div className="max-w-2xl mx-auto px-4 sm:px-6">

    {/* Hero */}
    <div className="text-center mb-10">
      <div className="inline-flex items-center gap-1.5 text-red-600 text-sm font-semibold mb-3">
        <ToolIcon className="w-3 h-3" /> SlimFile Product
      </div>
      <h1 className="text-4xl sm:text-5xl sm:leading-[1.08] font-semibold text-[#1d1d1f] tracking-tight mb-4">
        Tool Name
      </h1>
      <p className="text-[#6e6e73] text-lg sm:text-[21px] leading-snug max-w-xl mx-auto">
        One sentence on what the tool does.
      </p>
    </div>

    {/* Highlights */}
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">…</div>

    {/* Tool */}
    <div className="bg-[#f5f5f7] rounded-[28px] p-6 sm:p-8">
      {/* drop zone, options, then a full-width primary button */}
      <Button className="w-full h-12 text-[15px]">Do the thing</Button>
    </div>

    {/* Trust note */}
    <div className="flex items-center justify-center gap-2 mt-6 text-xs text-[#6e6e73]">
      <ShieldCheck className="w-3.5 h-3.5" />
      <span>Files are processed securely and never stored on our servers</span>
    </div>
  </div>
</div>
```

If the page has a long marketing section above the tool, add a red pill button
under the subtitle that scrolls to the tool (see `src/pages/Compress.tsx`), and
give the tool section `id="upload-section"` and `scroll-mt-16`.

---

## 8. Reference pages

| Pattern | Look at |
|---|---|
| Simple tool page | `src/pages/SlimFileMergeCompress.tsx` |
| Tool page with marketing sections | `src/pages/Compress.tsx` |
| Tabs inside a tool | `src/pages/SlimFileQR.tsx` |
| Home tiles and segmented tabs | `src/pages/Home.tsx` |
| Header, MegaMenu, popover | `src/components/Header.tsx` |
| Info / landing page | `src/pages/Api.tsx` |

---

## 9. Checklist for a new page

- [ ] White page, `pt-28 sm:pt-32`, tool directly under the headline
- [ ] Title, subtitle and eyebrow use the classes in section 3
- [ ] Panels are `bg-[#f5f5f7] rounded-[28px]` with no border or shadow
- [ ] Only red as an accent; no gradients, glows or coloured borders
- [ ] Buttons use `Button` or the pill classes in section 5
- [ ] Highlights are plain text, not pills
- [ ] Real progress via `uploadWithProgress` and `FileProgressCard`
- [ ] Checked at phone width (375px) and desktop
- [ ] New header links added to the right `MegaMenu` group, mobile menu and Home tabs
