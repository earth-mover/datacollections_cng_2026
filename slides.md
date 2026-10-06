---
theme: ./theme
title: "Level 2 Data Collections in Zarr"
info: |
  CNG Forum 2026, Track 2: Cloud-Native Geo in Practice. Co-presented by Tom
  Nicholas (Earthmover) and Sean Harkins (Development Seed). Storing STAC-like
  metadata alongside raw Level 2 data in Zarr, with Icechunk managing atomic
  transactions across data and metadata.
layout: cover-split
leftSpeaker: Tom Nicholas · Earthmover
rightSpeaker: Sean Harkins · Development Seed
leftAvatar: /images/tom-nicholas.jpg
rightAvatar: /images/sean-harkins.jpg
---

## Level 2 Data Collections in Zarr

CNG Forum 2026 · Thu, Oct 08, 2026

---

# OUTLINE

## what we'll cover

1. Desired properties of a cloud-native data system
2. Level 2 vs Level 3 today
3. Limitations of the COG + STAC design
4. Idea: Icechunk DataCollections
5. (Sean) Prototypes and future work

<!--
Tom: items 1–4 (~10 min). Sean: design details, open questions, prototypes.
-->

---
layout: two-col-header
---

# CNG FORUM 2025

## last year: zarr vs cog

Lots of debate last year, and the rough consensus was:

::left::

<div class="text-center">
<img src="/images/datacube.png" alt="A datacube of gridded variables" class="h-40 mx-auto mb-3" />
<div class="text-sm uppercase tracking-widest opacity-70">Level 3 · gridded datacubes</div>
<div class="text-5xl font-medium text-em-violet mt-2">Zarr wins</div>
</div>

::right::

<div class="text-center">
<div class="scene-stack h-40 mx-auto mb-3" aria-label="A stack of overlapping satellite scenes">
  <div class="scene-stack-inner">
    <div class="scene" style="--i:0; --dx:-18px; --dy:10px; --rot:-6deg; background-position: 10% 20%; filter: hue-rotate(0deg);"></div>
    <div class="scene" style="--i:1; --dx:14px; --dy:-6px; --rot:5deg; background-position: 60% 70%; filter: hue-rotate(40deg);"></div>
    <div class="scene" style="--i:2; --dx:-6px; --dy:-16px; --rot:-2deg; background-position: 85% 15%; filter: hue-rotate(-40deg);"></div>
    <div class="scene" style="--i:3; --dx:20px; --dy:12px; --rot:9deg; background-position: 30% 85%; filter: hue-rotate(80deg);"></div>
  </div>
</div>
<div class="text-sm uppercase tracking-widest opacity-70">Level 2 · individual scenes</div>
<div class="text-5xl font-medium text-em-lime mt-2">COG + STAC wins</div>
</div>

<div class="absolute bottom-14 left-0 right-0 text-center text-2xl opacity-80">
does it have to be that way?
</div>

<!--
Set the scene: this is a familiar debate for this room, and that consensus is
reasonable. Our question today: do we have to accept that split, or can Level 2
get the same benefits Zarr + Icechunk give Level 3?
-->

---

# Desired properties

## icechunk-zarr works great! (for level 3)

<div class="grid grid-cols-2 gap-x-10 mt-4">
<div>

| Property | Icechunk-Zarr |
|---|:---:|
| Single entrypoint for metadata<span class="mark">☁️</span><img class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /> | ✅ |
| Query by coordinates<img class="mark" src="/brand-kit/assets/logos/third-party/xarray.svg" alt="Xarray" /> | ✅ |
| Scalable<span class="mark">☁️</span><img class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /> | ✅ |
| Serverless<span class="mark">☁️</span><img class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /> | ✅ |
| Uncoordinated reads<span class="mark">☁️</span><img class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /> | ✅ |
| Uncoordinated writes<img class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /> | ✅ |

<div class="mark-legend text-base opacity-70 mt-8 ml-4">
<span class="mark">☁️</span> i.e. "cloud-optimized"<br />
<img class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /> from Zarr
</div>

</div>
<div>

| Property | Icechunk-Zarr |
|---|:---:|
| Arbitrary N-D schemas<img class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /> | ✅ |
| Domain-agnostic<img class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /> | ✅ |
| ACID transactions and consistency<img class="mark" src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="Icechunk" /> | ✅ |
| Versioning, time travel, branches<img class="mark" src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="Icechunk" /> | ✅ |
| Schema evolution<img class="mark" src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="Icechunk" /> | ✅ |
| Zero-copy ingestion ("virtual chunks")<img class="mark" src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="Icechunk" /> | ✅ |

<div class="mark-legend text-base opacity-70 mt-8 ml-4">
<img class="mark" src="/brand-kit/assets/logos/third-party/xarray.svg" alt="Xarray" /> from Xarray<br />
<img class="mark" src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="Icechunk" /> from Icechunk
</div>

</div>
</div>

<!--
Level 3 = gridded, regular, shares a coordinate system → one datacube.
One Xarray Dataset == one Zarr store. This is a solved problem.

Icons show where each property comes from: Zarr for most of the storage
properties, Xarray for query by coordinates, Icechunk for transactions,
versioning, branches, schema evolution and virtual chunks. The cloud-marked
rows are what together make it "cloud-optimized".
-->

---
layout: two-col-header
---

# LEVEL 2 vs LEVEL 3

## But level 2 in Zarr is unsolved

::left::

- You **cannot** think of Level 2 data as one datacube
- Fundamental problem: **many arrays with no shared coordinate system**
- So geospatial folks use many separate COGs, then index them with STAC
  - We also see anti-patterns: many small Zarrs, or one Zarr with an unwieldy number of groups

> [!IMPORTANT]
> This problem is **not** specific to geospatial 🌍!<br />
> 🔬 Bioimaging: millions of OME-TIFFs + an index.<br />
> ⚛️ Fusion: many Zarr stores + a Parquet index.

::right::

<div class="no-cube">
  <div class="no-cube-scenes">
    <div class="flat-scene" style="--w:7rem; --h:5rem; --x:0.2rem; --y:0.6rem; --rot:-14deg; background-position: 10% 20%; filter: hue-rotate(0deg);"><span>EPSG:32610</span></div>
    <div class="flat-scene" style="--w:5.5rem; --h:6rem; --x:6.2rem; --y:0rem; --rot:11deg; background-position: 60% 70%; filter: hue-rotate(40deg);"><span>EPSG:32611</span></div>
    <div class="flat-scene" style="--w:6.5rem; --h:4.5rem; --x:1.6rem; --y:6.4rem; --rot:7deg; background-position: 85% 15%; filter: hue-rotate(-40deg);"><span>EPSG:32633</span></div>
    <div class="flat-scene" style="--w:5rem; --h:5rem; --x:7.6rem; --y:6.8rem; --rot:-22deg; background-position: 30% 85%; filter: hue-rotate(80deg);"><span>EPSG:3031</span></div>
  </div>
  <div class="no-cube-arrow">
    <svg viewBox="0 0 80 40" width="80" height="40" aria-hidden="true">
      <line x1="4" y1="20" x2="68" y2="20" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <polyline points="58,10 70,20 58,30" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span class="no-cube-x">✕</span>
  </div>
  <svg class="no-cube-cube" viewBox="0 0 120 130" width="120" height="130" aria-label="An empty datacube outline">
    <g fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="7 6" stroke-linejoin="round">
      <polygon points="60,8 112,36 60,64 8,36" />
      <polyline points="8,36 8,96 60,124 112,96 112,36" />
    </g>
    <text x="60" y="108" text-anchor="middle" fill="currentColor" style="font-size: 40px; font-weight: 600;">?</text>
  </svg>
</div>

<div class="text-center text-sm opacity-70 mt-3">different footprints and CRSs: nothing shared to stack along</div>

---

# STAC + COG

## solves some problems, but not all

<div class="grid grid-cols-2 gap-x-8 mt-4">
<div>

| Property | Icechunk-Zarr | STAC + COG |
|---|:---:|:---:|
| Single entrypoint for metadata | ✅ | ✅ |
| Query by coordinates | ❓ | ✅ |
| Scalable | ✅ | ✅ |
| Serverless | ✅ | 🟠 |
| Uncoordinated reads | ✅ | ✅ |
| Uncoordinated writes | ✅ | 🟠 |

</div>
<div>

| Property | Icechunk-Zarr | STAC + COG |
|---|:---:|:---:|
| Arbitrary N-D schemas | ✅ | ❌ |
| Domain-agnostic | ✅ | ❌ |
| ACID transactions and consistency | ✅ | ❌ |
| Versioning, time travel, branches | ✅ | ❌ |
| Schema evolution | ✅ | ❌ |
| Zero-copy ingestion | ✅ | 🟠 |

</div>
</div>

<style>
th, td { white-space: nowrap; padding-left: 0.3rem !important; padding-right: 0.3rem !important; }
</style>

<!--
Be generous here: STAC + COG is a huge success, and the first three ticks are
exactly why we (rightly) call COG "cloud-optimized".

Serverless 🟠: COGs and static STAC catalogs need no server, but searching at
scale in practice means running a STAC API + database (e.g. pgSTAC).

Query by coordinates ❓ for Icechunk-Zarr: this is the one row where STAC wins.
For Level 2 there is no shared grid to .sel() on, so plain Icechunk-Zarr needs
a separate index — which is exactly what DataCollections will add.
-->

---
layout: two-col-header
---

# STAC + COG

## results in disjoint data systems

::left::

<div class="dj">
  <div class="dj-head">🪣 object storage</div>
  <div></div>
  <div class="dj-head">🗂️ STAC catalog</div>

  <div class="dj-file"><span class="dj-thumb" style="background-position: 10% 20%;"></span>scene_A.tif</div>
  <div class="dj-arrow">←</div>
  <div class="dj-item">item A</div>

  <div class="dj-file dj-rel">
    <span class="dj-thumb" style="background-position: 60% 70%; filter: hue-rotate(40deg);"></span>scene_B.tif
    <div v-click="3" class="dj-gone">🗑️ deleted</div>
  </div>
  <div class="dj-arrow dj-rel">←<div v-click="3" class="dj-broken">404</div></div>
  <div class="dj-item">item B</div>

  <div class="dj-file"><span class="dj-thumb" style="background-position: 85% 15%; filter: hue-rotate(-40deg);"></span>scene_C.tif</div>
  <div class="dj-arrow">←</div>
  <div class="dj-item">item C</div>

  <div v-click="1" class="dj-file dj-new dj-rel">
    <span class="dj-thumb" style="background-position: 30% 85%; filter: hue-rotate(80deg);"></span>scene_D.tif
    <div v-click="2" class="dj-orphan"><span>orphaned</span></div>
  </div>
  <div></div>
  <div v-click="2" class="dj-item dj-missing">💥 no item</div>
</div>

::right::

<div class="dj-steps">

Data and metadata live in **two systems**, linked only by `href`s.

<div v-click="1">① Producer writes a new COG…</div>
<div v-click="2">💥 …but the job crashes before updating STAC → <strong>orphaned data</strong>, invisible to search</div>
<div v-click="3">② Scene B is reprocessed and the old COG deleted → <strong>dangling link</strong></div>
<div v-click="4" class="dj-punch">Nothing ties the two together transactionally → <strong>consistency problems</strong></div>

</div>

<!--
Walk through the clicks: healthy state, then a new COG lands, then the job
dies before the STAC item is written (orphan), then a reprocess deletes a COG
the catalog still points at (404). Neither side can roll back the other.
-->

---
layout: grid
cols: 3
---

<template #header>

# IN PRACTICE

## these limitations cause real problems

</template>

<div>

### Consistency failures

During operational updates, the catalog and the data can disagree

</div>

<div>

### Rigid data layouts

No hyperspectral bands, no ensemble members, no time dimension

</div>

<div>

### Query-optimized chunking

Can't always rechunk for access patterns, e.g. timeseries

</div>

<div>

### Expensive modifications

Renaming one variable in a 1TB TIFF means downloading and re-uploading 1TB

</div>

<div>

### Domain-specific

Microscopists have near-identical requirements, but COG + STAC are geo-only

</div>

<div>

### Existing archives

Can't reference non-cloud-optimized data, e.g. a biologist's plain TIFFs

</div>

<!--
Open questions to decide before the talk:
- Timeseries access: would that actually be possible with Icechunk DataCollections?
- Chunking across bands: do ML people want to do that?
-->

---
layout: two-col-header
---

# WHY

## these limitations are inherent to the design

::left::

<div class="why-text">

**A monolithic container file can never support key features in object storage**, which has no edit-in-place:

- Prevents embarrassingly parallel writes
- Prevents cheap updates → no schema evolution, no versioning
- Can't use the serverless consistency mechanism Icechunk uses
- Virtual references inherently involve multiple files

**TIFF as a container constrains the schema**

**GeoTIFF + STAC are domain-specific**

</div>

::right::

<div class="mono">

<div class="mono-title">✏️ rename one variable…</div>

<div class="mono-row">
  <div class="mono-label">COG <span>one 1 TB object</span></div>
  <div class="mono-bar">
    <div class="mono-hdr">hdr</div>
    <div class="mono-tiles"></div>
    <div v-click="1" class="mono-redo">rewrite &amp; re-upload all 1 TB</div>
  </div>
</div>

<div class="mono-row">
  <div class="mono-label">Icechunk-Zarr <span>many small objects</span></div>
  <div class="mono-objs">
    <div class="mono-snap">snapshot v1</div>
    <div class="mono-meta">zarr.json</div>
    <div class="mono-chunks"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
  </div>
  <div v-click="2" class="mono-objs mono-new">
    <div class="mono-snap">snapshot v2</div>
    <div class="mono-meta">zarr.json</div>
    <div class="mono-note">write ~1 KB · chunks reused · v1 still readable</div>
  </div>
</div>

</div>

<!--
Object storage can only overwrite whole objects. So with one big container
file, any change (even renaming one variable) means rewriting the whole
thing. With many small objects plus a snapshot, the same change writes two
tiny new objects, reuses every chunk, and leaves the old version intact.
-->

---
layout: two-col-header
---

# WHAT WOULD BE BETTER?

## a domain-agnostic way to manage sets of related arrays

::left::

- If only we could put **all the chunks and all the metadata** in one consistently versioned, cloud-native data repository…
- We still want STAC-like metadata search
- But if we can get that *from* Icechunk, we immediately gain loads of powerful features

::right::

<div class="ic-repo">
  <div class="ic-repo-head">
    <img src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="Icechunk" />
    <span>one Icechunk repo</span>
  </div>
  <div class="ic-parts">
    <div class="ic-part">
      <div class="ic-part-title">🗂️ metadata catalog</div>
      <div class="ic-row ic-row-head"><span>id</span><span>datetime</span><span>EPSG</span></div>
      <div class="ic-row"><span>A</span><span>2024-07-02</span><span>32610</span></div>
      <div class="ic-row"><span>B</span><span>2024-07-03</span><span>32611</span></div>
      <div class="ic-row"><span>C</span><span>2024-07-05</span><span>32633</span></div>
      <div class="ic-row"><span>D</span><span>2024-07-09</span><span>3031</span></div>
    </div>
    <div class="ic-part">
      <div class="ic-part-title">🧊 chunk storage</div>
      <div class="ic-group"><span class="ic-thumb" style="background-position: 10% 20%; filter: hue-rotate(0deg);"></span><div class="ic-chunks"><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="ic-name">A</span></div>
      <div class="ic-group"><span class="ic-thumb" style="background-position: 60% 70%; filter: hue-rotate(40deg);"></span><div class="ic-chunks"><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="ic-name">B</span></div>
      <div class="ic-group"><span class="ic-thumb" style="background-position: 85% 15%; filter: hue-rotate(-40deg);"></span><div class="ic-chunks"><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="ic-name">C</span></div>
      <div class="ic-group"><span class="ic-thumb" style="background-position: 30% 85%; filter: hue-rotate(80deg);"></span><div class="ic-chunks"><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="ic-name">D</span></div>
    </div>
  </div>
  <div class="ic-commit">✓&nbsp; versioned together · updated in one atomic commit</div>
</div>

<!--
The fix for the disjoint-systems problem: the same scenes A–D, but now the
catalog and the chunks live in one repo, so they can't drift apart.
-->

---
layout: section
---

# IDEA

## icechunk level 2 datacollections

---
layout: two-col
---

# DATACOLLECTIONS

## many images, one repo

- For a Level 3 datacube we usually assume **1 Xarray Dataset == 1 Zarr store**
- What if instead we put **many, many images** into one Zarr store?
- Then we just need a 1D metadata table (which could be STAC-like) to find images of interest
- If that Zarr store is an **Icechunk repo**, we get ACID, consistency, versioning, and virtual chunks — all for free

::right::

<!-- TODO: diagram — one Icechunk repo containing many independent image
arrays (different shapes / CRSs) plus a 1D metadata table pointing at them -->

![Icechunk](/brand-kit/assets/diagrams/Icechunk-Diagram.svg)

<!--
Handoff to Sean for the design details.
-->

---
layout: devseed-statement
---

# Sean Harkins · Development Seed

## Putting **STAC-like metadata** right alongside the data it describes.

<!--
Sean's half starts here. Section opener in DevSeed style.
Use **bold** to pick out key phrases in DevSeed dark grey.
-->

---
layout: devseed
---

# Design

## Example DevSeed content slide

- Placeholder bullets: replace with Sean's content
- Store STAC-like metadata **inside the Icechunk repo**, next to the arrays
- Icechunk manages **atomic transactions** across data and metadata
- Then: development roadmap, and how the CNG community can get involved

<!--
Placeholder content (taken from the abstract). Layouts available for this half:
`devseed-statement` (big statement) and `devseed` (heading + body).
-->

---
layout: end
---

[earthmover.io](https://earthmover.io) · [developmentseed.org](https://developmentseed.org)

---
layout: section
---

# BACKUP

## common objections

---

# "BUT I LIKE DOWNLOADING A SINGLE FILE"

## sure — but that needn't dictate the storage layout

- It's reasonable to want a file on your local filesystem
- But we're free to transform the data **any way we like** on its journey from the datacentre to your laptop
- So use a service to subset the cloud-native store and assemble a COG on request
  - e.g. Flux
- A COG that never existed on disk — **the perfect COG for your immediate need**

---

# "BUT A COG IS STILL A VALID TIFF!"

## yes — for *filesystem* applications

- We can reconstruct GeoTIFFs on demand for any local program (e.g. ArcGIS)
- It's genuinely impressive that macOS Preview can open a COG — a feat of format stability
  - But no one points Preview at object storage; it can't even read from there
- Any application that reads TIFFs **from object storage** can be taught to read Zarr
  - It all boils down to HTTP range requests anyway
  - Worst case: an adapter layer that makes a Zarr look like a COG (like netcdf-c on Icechunk)
- It's 2026 — that interface layer is a fully specified, verifiable task. Vibe-code it!
