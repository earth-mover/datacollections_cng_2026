# Level 2 Data Collections in Zarr — CNG Forum 2026

Slides for the CNG Forum 2026 talk by Sean Harkins (Development Seed) and Tom
Nicholas (Earthmover), Thu Oct 08 2026, Track 2: Cloud-Native Geo in Practice.

The deck is built with [Slidev](https://sli.dev): everything lives in
`slides.md` as Markdown, and `slides.pdf` is a recent export.

## Running locally

Requires Node 18+.

```sh
npm install
npm run dev        # http://localhost:3030 (live-reloads as you edit slides.md)
```

- Presenter view with speaker notes: http://localhost:3030/presenter/
- Overview of all slides: http://localhost:3030/overview/

## Editing

- Slides are separated by `---`. A YAML block right after a separator sets that
  slide's layout, e.g. `layout: two-col-header`.
- `<!-- ... -->` at the end of a slide becomes its speaker notes.
- Sean's half starts at the orange `devseed-statement` slide (before the end
  slide); the slide after it is a placeholder example to replace.
- Available layouts: `cover`, `default`, `section`, `two-col`,
  `two-col-header`, `three-col-header`, `grid`, `image-left`, `image-right`,
  `quote`, `embed`, `end` (see `theme/layouts/`).
- DevSeed-style layouts for Sean's half: `devseed-statement` (one big bold
  line, as a section opener) and `devseed` (heading + body). Both use the
  DevSeed orange with white Roboto; wrap key phrases in `**bold**` to pick
  them out in DevSeed dark grey. Styles are in `theme/styles/devseed.css`.
- Styling uses UnoCSS (Tailwind-compatible classes) plus brand colours such as
  `text-em-violet` and `text-em-lime`. Deck-specific CSS is in `style.css`.
- Images go in `public/` and are referenced from the root, e.g.
  `/images/foo.png` for `public/images/foo.png`.

## Exporting a PDF

With the dev server running, open http://localhost:3030/export and use the
export button (or the browser's Print → Save as PDF, landscape, no margins,
background graphics on).

## Layout

```
slides.md     the deck
style.css     deck-specific styles
slides.pdf    latest PDF export
theme/        Earthmover Slidev theme (snapshot of Earthmover's internal theme)
public/       brand assets used by the deck (logos, diagrams, illustrations)
```

## Font licence

The theme uses ABC Diatype Rounded (`theme/public/fonts/`), a commercial font
licensed to Earthmover. It's included here so the slides render correctly for
collaborators on this talk — please don't reuse or redistribute it outside
this repo.
