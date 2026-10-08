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

1. Features of an ideal cloud-native data system
2. Level 2 vs Level 3 today
3. Limitations of COG + STAC
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
<div v-click="1">
<img src="/images/datacube.png" alt="A datacube of gridded variables" class="h-40 mx-auto mb-3" />
<div class="text-sm uppercase tracking-widest opacity-70">Level 3 · gridded datacubes</div>
</div>
<div v-click="2" class="text-5xl font-medium text-em-violet mt-2">Zarr wins</div>
</div>

::right::

<div class="text-center">
<div v-click="3">
<div class="scene-stack h-40 mx-auto mb-3" aria-label="A stack of overlapping satellite scenes">
  <div class="scene-stack-inner">
    <div class="scene" style="--i:0; --dx:-18px; --dy:10px; --rot:-6deg; background-position: 10% 20%; filter: hue-rotate(0deg);"></div>
    <div class="scene" style="--i:1; --dx:14px; --dy:-6px; --rot:5deg; background-position: 60% 70%; filter: hue-rotate(40deg);"></div>
    <div class="scene" style="--i:2; --dx:-6px; --dy:-16px; --rot:-2deg; background-position: 85% 15%; filter: hue-rotate(-40deg);"></div>
    <div class="scene" style="--i:3; --dx:20px; --dy:12px; --rot:9deg; background-position: 30% 85%; filter: hue-rotate(80deg);"></div>
  </div>
</div>
<div class="text-sm uppercase tracking-widest opacity-70">Level 2 · individual scenes</div>
</div>
<div v-click="4" class="text-5xl font-medium text-em-lime mt-2">COG + STAC wins</div>
</div>

<div v-click="5" class="absolute bottom-14 left-0 right-0 text-center text-2xl opacity-80">
but similar aims: so why the split?
</div>

<!--
Set the scene: this is a familiar debate for this room, and that consensus is
reasonable. Our question today: do we have to accept that split, or can Level 2
get the same benefits Zarr + Icechunk give Level 3?
-->

---

# Desired features

## icechunk-zarr works great! (for level 3)

<div class="grid grid-cols-2 gap-x-10 mt-4">
<div>

<table>
<thead><tr><th>Property</th><th style="text-align:center">Icechunk-Zarr</th></tr></thead>
<tbody>
<tr v-click="1"><td>Single entrypoint<span v-click="7" class="mark">☁️</span><img v-click="11" class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /></td><td style="text-align:center">✅</td></tr>
<tr v-click="2"><td>Query by coordinates<span v-click="7" class="mark">☁️</span><img v-click="3" class="mark" src="/brand-kit/assets/logos/third-party/xarray.svg" alt="Xarray" /></td><td style="text-align:center">✅</td></tr>
<tr v-click="4"><td>Scalable<span v-click="7" class="mark">☁️</span><img v-click="11" class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /></td><td style="text-align:center">✅</td></tr>
<tr v-click="5"><td>Serverless<span v-click="7" class="mark">☁️</span><img v-click="11" class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /></td><td style="text-align:center">✅</td></tr>
<tr v-click="6"><td>Uncoordinated reads<span v-click="7" class="mark">☁️</span><img v-click="11" class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /></td><td style="text-align:center">✅</td></tr>
<tr v-click="8"><td>Uncoordinated writes<img v-click="11" class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /></td><td style="text-align:center">✅</td></tr>
</tbody>
</table>

<div class="mark-legend text-base opacity-70 mt-8 ml-4">
<div v-click="7"><span class="mark">☁️</span> i.e. "cloud-optimized"</div>
<div v-click="11"><img class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /> from Zarr</div>
</div>

</div>
<div>

<table>
<thead><tr><th>Property</th><th style="text-align:center">Icechunk-Zarr</th></tr></thead>
<tbody>
<tr v-click="9"><td>Arbitrary N-D schemas<img v-click="11" class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /></td><td style="text-align:center">✅</td></tr>
<tr v-click="10"><td>Domain-agnostic<img v-click="11" class="mark" src="/brand-kit/assets/logos/third-party/zarr.svg" alt="Zarr" /></td><td style="text-align:center">✅</td></tr>
<tr v-click="12"><td>ACID transactions and consistency<img v-click="16" class="mark" src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="Icechunk" /></td><td style="text-align:center">✅</td></tr>
<tr v-click="13"><td>Versioning, time travel, branches<img v-click="16" class="mark" src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="Icechunk" /></td><td style="text-align:center">✅</td></tr>
<tr v-click="14"><td>Schema evolution<img v-click="16" class="mark" src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="Icechunk" /></td><td style="text-align:center">✅</td></tr>
<tr v-click="15"><td>Zero-copy ingestion ("virtual chunks")<img v-click="16" class="mark" src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="Icechunk" /></td><td style="text-align:center">✅</td></tr>
</tbody>
</table>

<div class="mark-legend text-base opacity-70 mt-8 ml-4">
<div v-click="3"><img class="mark" src="/brand-kit/assets/logos/third-party/xarray.svg" alt="Xarray" /> from Xarray</div>
<div v-click="16"><img class="mark" src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="Icechunk" /> from Icechunk</div>
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

<ul>
<li v-click="1">You <strong>cannot</strong> think of Level 2 data as one datacube</li>
<li v-click="3">Problem: <strong>many arrays, no shared coordinate system</strong></li>
<li v-click="5">So geospatial folks use many separate COGs, then index them with STAC
<ul><li v-click="6">We also see anti-patterns: many small Zarrs, or one Zarr with too many groups</li></ul>
</li>
</ul>

<div v-click="7">

> [!IMPORTANT]
> This problem is **not** specific to geospatial 🌍!<br />
> 🔬 Bioimaging: millions of OME-TIFFs + an index.<br />
> 🔭 Astronomy: many images as separate FITS files.<br />
> ⚛️ Fusion: many Zarr stores + a Parquet index.

</div>

::right::

<div class="no-cube">
  <div v-click="2" class="no-cube-scenes">
    <div class="flat-scene" style="--w:7rem; --h:5rem; --x:0.2rem; --y:0.6rem; --rot:-14deg; background-position: 10% 20%; filter: hue-rotate(0deg);"><span>EPSG:32610</span></div>
    <div class="flat-scene" style="--w:5.5rem; --h:6rem; --x:6.2rem; --y:0rem; --rot:11deg; background-position: 60% 70%; filter: hue-rotate(40deg);"><span>EPSG:32611</span></div>
    <div class="flat-scene" style="--w:6.5rem; --h:4.5rem; --x:1.6rem; --y:6.4rem; --rot:7deg; background-position: 85% 15%; filter: hue-rotate(-40deg);"><span>EPSG:32633</span></div>
    <div class="flat-scene" style="--w:5rem; --h:5rem; --x:7.6rem; --y:6.8rem; --rot:-22deg; background-position: 30% 85%; filter: hue-rotate(80deg);"><span>EPSG:3031</span></div>
  </div>
  <div v-click="4" class="no-cube-arrow">
    <svg viewBox="0 0 80 40" width="80" height="40" aria-hidden="true">
      <line x1="4" y1="20" x2="68" y2="20" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <polyline points="58,10 70,20 58,30" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span class="no-cube-x">✕</span>
  </div>
  <svg v-click="4" class="no-cube-cube" viewBox="0 0 120 130" width="120" height="130" aria-label="An empty datacube outline">
    <g fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="7 6" stroke-linejoin="round">
      <polygon points="60,8 112,36 60,64 8,36" />
      <polyline points="8,36 8,96 60,124 112,96 112,36" />
    </g>
    <text x="60" y="108" text-anchor="middle" fill="currentColor" style="font-size: 40px; font-weight: 600;">?</text>
  </svg>
</div>

<div v-click="4" class="text-center text-sm opacity-70 mt-3">different footprints and CRSs: nothing shared to stack along</div>

---

# feature comparison

## STAC + COG solves some problems, but not all

<div class="grid grid-cols-2 gap-x-8 mt-4">
<div>

<table>
<thead><tr><th>Property</th><th style="text-align:center">Icechunk-Zarr</th><th style="text-align:center">STAC + COG</th></tr></thead>
<tbody>
<tr v-click="1"><td>Single entrypoint<span v-click="6" class="mark">☁️</span></td><td style="text-align:center">✅</td><td style="text-align:center">✅</td></tr>
<tr v-click="2"><td>Query by coordinates<span v-click="6" class="mark">☁️</span></td><td style="text-align:center">✅</td><td style="text-align:center">✅</td></tr>
<tr v-click="3"><td>Scalable<span v-click="6" class="mark">☁️</span></td><td style="text-align:center">✅</td><td style="text-align:center">✅</td></tr>
<tr v-click="4"><td>Serverless<span v-click="6" class="mark">☁️</span></td><td style="text-align:center">✅</td><td style="text-align:center">🟠<sup class="fn">1</sup></td></tr>
<tr v-click="5"><td>Uncoordinated reads<span v-click="6" class="mark">☁️</span></td><td style="text-align:center">✅</td><td style="text-align:center">✅</td></tr>
<tr v-click="7"><td>Uncoordinated writes</td><td style="text-align:center">✅</td><td style="text-align:center">❌</td></tr>
</tbody>
</table>

<div class="mark-legend text-base opacity-70 mt-6 ml-4">
<div v-click="6"><span class="mark">☁️</span> i.e. "cloud-optimized"</div>
</div>

</div>
<div>

<table>
<thead><tr><th>Property</th><th style="text-align:center">Icechunk-Zarr</th><th style="text-align:center">STAC + COG</th></tr></thead>
<tbody>
<tr v-click="8"><td>Arbitrary N-D schemas</td><td style="text-align:center">✅</td><td style="text-align:center">❌</td></tr>
<tr v-click="9"><td>Domain-agnostic</td><td style="text-align:center">✅</td><td style="text-align:center">❌</td></tr>
<tr v-click="10"><td>ACID transactions and consistency</td><td style="text-align:center">✅</td><td style="text-align:center">❌</td></tr>
<tr v-click="11"><td>Versioning, time travel, branches</td><td style="text-align:center">✅</td><td style="text-align:center">❌</td></tr>
<tr v-click="12"><td>Schema evolution</td><td style="text-align:center">✅</td><td style="text-align:center">❌</td></tr>
<tr v-click="13"><td>Zero-copy ingestion</td><td style="text-align:center">✅</td><td style="text-align:center">🟠<sup class="fn">2</sup></td></tr>
</tbody>
</table>

<div class="mark-legend text-base opacity-70 mt-6 ml-4">
<div v-click="4"><sup class="fn">1</sup> only with stac-geoparquet (no STAC API server)</div>
<div v-click="13"><sup class="fn">2</sup> only if your data are already COGs</div>
</div>

</div>
</div>

<style>
th, td { white-space: nowrap; padding-left: 0.3rem !important; padding-right: 0.3rem !important; }
</style>

<!--
Be generous here: STAC + COG is a huge success, and the first three ticks are
exactly why we (rightly) call COG "cloud-optimized".

Serverless 🟠: COGs plus a static stac-geoparquet catalog need no server, but
the usual setup is a STAC API + database (e.g. pgSTAC).
Uncoordinated writes ❌: every new scene means updating the shared catalog.
Zero-copy ingestion 🟠: only if the source data are already COGs; otherwise
you have to rewrite everything into COGs first.
-->

---
layout: grid
cols: 3
clicks: 1
---

<template #header>

# IN PRACTICE

## COG's limitations cause real problems

</template>

<div class="pc-card pc-focus" :class="{ 'pc-on': $clicks >= 1 }">

### Consistency failures

During operational updates, the catalog and the data can disagree

</div>

<div class="pc-card" :class="{ 'pc-dim': $clicks >= 1 }">

### Rigid data layouts

No hyperspectral bands, no ensemble members, no time dimension

</div>

<div class="pc-card" :class="{ 'pc-dim': $clicks >= 1 }">

### Query-optimized chunking

Can't always rechunk for access patterns, e.g. timeseries

</div>

<div class="pc-card" :class="{ 'pc-dim': $clicks >= 1 }">

### Expensive modifications

Renaming one variable in a 1TB TIFF means downloading and re-uploading 1TB

</div>

<div class="pc-card" :class="{ 'pc-dim': $clicks >= 1 }">

### Domain-specific

Microscopists have near-identical requirements, but COG + STAC are geo-only

</div>

<div class="pc-card" :class="{ 'pc-dim': $clicks >= 1 }">

### Existing archives

Can't reference non-cloud-optimized data, e.g. non-COG TIFFs

</div>

<!--
Open questions to decide before the talk:
- Timeseries access: would that actually be possible with Icechunk DataCollections?
- Chunking across bands: do ML people want to do that?
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
layout: two-col-header
---

# DEAD END

## these limitations are inherent to COG

::left::

<div class="why-text">
<p v-click="1" class="why-claim">A single-file container format can never support key features in object storage, since <it>object storage has no edit-in-place</it>.</p>
<ul>
<li v-click="2">Prevents uncoordinated writes</li>
<li v-click="3">Prevents cheap updates → no schema evolution, no versioning</li>
<li v-click="7"><strong>Prevents consistency(!!)</strong> using the serverless mechanism Icechunk uses (conditional puts)</li>
<li v-click="8">Virtual references inherently involve multiple files</li>
</ul>
<p v-click="9"><strong>TIFF as a container constrains the schema</strong></p>
<p v-click="10"><strong>GeoTIFF + STAC are domain-specific</strong></p>
</div>

::right::

<div v-click="4" class="mono">

<div class="mono-title">✏️ rename one variable…</div>

<div class="mono-row">
  <div class="mono-label">COG <span>one 1 TB object</span></div>
  <div class="mono-bar">
    <div class="mono-hdr">hdr</div>
    <div class="mono-tiles"></div>
    <div v-click="5" class="mono-redo">rewrite &amp; re-upload all 1 TB</div>
  </div>
</div>

<div class="mono-row">
  <div class="mono-label">Icechunk-Zarr <span>many small objects</span></div>
  <div class="mono-objs">
    <div class="mono-snap">snapshot v1</div>
    <div class="mono-meta">zarr.json</div>
    <div class="mono-chunks"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
  </div>
  <div v-click="6" class="mono-objs mono-new">
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
layout: two-col-split
---

# IDEA: ICECHUNK DATACOLLECTIONS

## better: many images + catalog in one repo

::left::

<v-clicks at="1" depth="2">

- What if we put **many images** (any shapes, any CRSs) into one Icechunk repo…
- …alongside a searchable **STAC-like metadata table** that indexes them?

</v-clicks>

<v-clicks at="4">

- Chunks and catalog are versioned together: **ACID, consistency, versioning and virtual chunks, for free**
- And it's domain-agnostic and works for any set of related arrays

</v-clicks>

::right::

<div v-click="3" class="ic-repo">
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
So Tom is a bit of a downer :]  He's done a great job outlining all the paint points and problems that we have in this space. 

What if we could put our arrays and searchable STAC-like metadata in a single repository?

And have our chunks and tabular information versioned together with
transactions, ACID Consistency and support virtual chunks.
-->

---
layout: devseed
---

# Initial Attempt

Most of the "metadata" we're discussing can be modeled as an Arrow schema. So as an initial experiment we thought **What if we could store Arrow like data in Icechunk?**

<div class="flex flex-col items-center gap-3 mt-4">
  <img src="/images/zarr-datafusion/zarr-datafusion_logo_white.png" alt="Zarr-Datafusion-Search logo" class="h-56" />
  <a href="https://github.com/developmentseed/zarr-datafusion-search" target="_blank" class="font-bold text-xl">Zarr-Datafusion-Search</a>
  <span class="text-sm opacity-85">github.com/developmentseed/zarr-datafusion-search</span>
</div>

---
layout: devseed
---

# Zarr-Datafusion-Search
Datafusion let's us build queryable database-like systems from any backend that can emit Arrow RecordBatches.  With this we can represent columnar formats like Parquet using a series of 1-D Zarr arrays.

<ChunkScanning class="mt-4" />

---
layout: devseed
---

# Zarr-Datafusion-Search

## Pros and cons

<div class="pros-cons">

| Pros | Cons |
| --- | --- |
| Only requires **Icechunk** and a compliant **DataFusion table provider**. | A very **custom solution** that doesn't leverage other great industry tools. |
| Materialized **R-tree and B-tree indexes** can be stored as Zarr arrays and used in the query pipeline, which can be much more efficient than common Parquet engine pushdown optimizations. | Writers need to coordinate writing their metadata "columns" so that "rows" are **chunk aligned**. |
| Writing data only requires an **Icechunk-compatible Zarr client**. | **Variable-length dtypes** have poor decoding performance in Zarr. |

</div>

<IndexQuery class="mt-5" />

<style>
.pros-cons table { width: 100%; table-layout: fixed; border-collapse: collapse; }
/* Same line structure as the Earthmover tables, with DevSeed navy as the accent */
.slidev-layout.ds-layout .pros-cons th { font-size: 0.9rem; font-weight: 700; text-align: left; padding: 0.5em 0.8em; border-bottom: 2px solid var(--ds-highlight); }
.slidev-layout.ds-layout .pros-cons td { font-size: 0.8rem; line-height: 1.35; padding: 0.4em 0.8em; vertical-align: top; border-bottom: 1px solid rgba(255, 255, 255, 0.45); }
</style>

---
layout: devseed
---

# Icechest

## The best of both worlds?

What if we could take advantage of the best parts of an **array store** like Icechunk and an **open table format** like Iceberg?

<div class="ice-eq">
  <div class="ice-term">
    <img src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="Icechunk logo" />
    <span class="ice-name">Icechunk</span>
    <span class="ice-role">Array data</span>
  </div>
  <span class="ice-op">+</span>
  <div class="ice-term">
    <img src="/images/icechest/iceberg-logo-icon.png" alt="Apache Iceberg logo" />
    <span class="ice-name">Apache Iceberg</span>
    <span class="ice-role">Tabular metadata</span>
  </div>
  <span class="ice-op">=</span>
  <div class="ice-term ice-result">
    <img src="/images/icechest/icechest_logo.png" alt="Icechest logo: a red cooler with Icechunk and Apache Iceberg stickers" />
    <span class="ice-name">arrays + tables</span>
    <span class="ice-role">In one Icechunk commit</span>
    <a class="ice-link" href="https://github.com/developmentseed/icechest" target="_blank">github.com/developmentseed/icechest</a>
  </div>
</div>

<style>
.ice-eq { display: flex; align-items: flex-start; justify-content: center; gap: 1.75rem; margin-top: 1rem; }
.ice-term { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; }
/* Same 10rem image box for every term so the captions line up */
.ice-term img { height: 10rem; padding: 1.75rem 0; object-fit: contain; margin-bottom: 0.2rem; }
.ice-result img { padding: 0; }
.ice-name { font-weight: 900; font-size: 1.1rem; }
.ice-role { font-size: 0.85rem; opacity: 0.85; }
.ice-op { font-size: 2.5rem; font-weight: 900; line-height: 10rem; }
.ice-link { margin-top: 0.3rem; font-size: 0.8rem; }
</style>

---
layout: devseed
---

# Icechest

## How it works

Iceberg normally relies on a **catalog service** to track the current `metadata.json`. Instead of a catalog service, Icechest stores that pointer in **Icechunk commit metadata**.

<IcechestPointer class="mt-6" />

---
layout: devseed
---

# Icechest pros

## Standard tooling, one commit

Rather than reinventing the wheel like we did with Zarr-Datafusion-Search, Icechest lets us use **standard tooling** for writing and reading both **columnar data** and **array data**.

<IcechestWrite class="mt-6" />

---
layout: devseed
---

# Icechest cons

## Table maintenance is on us

A catalog service normally handles table maintenance. In Icechest, Iceberg versions are pinned by **Icechunk snapshots**, which have their **own lifecycle**, so we have to manage maintenance ourselves.

<IcechestMaintenance class="mt-4" />

---
layout: devseed
---

# Icechest cons

## Icechunk node scaling

Level 3 data may have billions of chunks, but in **one array**. Level 2 data means **many discrete groups and arrays**. Virtualizing the full HLS archive into Icechest takes a mind-boggling number of **Zarr nodes**.

<div class="grid grid-cols-[auto_1fr] gap-x-8 mt-3 items-start">

<NodeScaling />

<div class="hls">

| collection | granules | nodes/granule | total nodes |
| --- | ---: | ---: | ---: |
| HLSL30 | 16,102,070 | 181 | 2.91 B |
| HLSS30 | 22,051,832 | 217 | 4.79 B |
| **combined** | 38,153,902 | | **7.70 B** |

<div class="hls-callout">
Commit memory and time grow with <b>total nodes in the store</b> (<a href="https://github.com/earth-mover/icechunk/issues/2449">icechunk#2449</a>): one year of HLS (~318 M nodes) → <b>~499 GiB</b>, <b>~5.7 min</b> per commit.
</div>

<div class="hls-fix">
<b>This is fixable:</b> Icechunk's <b>manifest splitting</b> approach just needs to be applied to the <b>node map</b>, and we're working on it now.
</div>

</div>
</div>

<style>
.hls table { width: 100%; border-collapse: collapse; }
/* Same line structure as the Earthmover tables, with DevSeed navy as the accent */
.slidev-layout.ds-layout .hls th { font-size: 0.8rem; font-weight: 700; padding: 0.4em 0.6em; border-bottom: 2px solid var(--ds-highlight); }
.slidev-layout.ds-layout .hls td { font-size: 0.8rem; padding: 0.35em 0.6em; border-bottom: 1px solid rgba(255, 255, 255, 0.45); font-variant-numeric: tabular-nums; }
.hls-callout { margin-top: 0.7rem; padding: 0.55rem 0.8rem; border-radius: 8px; background: var(--ds-highlight); font-size: 0.8rem; line-height: 1.4; }
.hls-callout b { font-weight: 900; }
.hls-fix { margin-top: 0.5rem; padding: 0.4rem 0.8rem; border-radius: 8px; border: 2px dashed #fff; font-size: 0.8rem; line-height: 1.4; }
.hls-fix b { font-weight: 900; }
</style>

---
layout: cover-split
leftSpeaker: Tom Nicholas · Earthmover
rightSpeaker: Sean Harkins · Development Seed
leftAvatar: /images/tom-nicholas.jpg
rightAvatar: /images/sean-harkins.jpg
---

::center::

<div class="closing-q">what do you think?</div>

<!--
Closing slide: open it up for questions and discussion.
-->

---

# BONUS

## common objections

---
layout: two-col-header
---

# SINGLE-FILE DOWNLOAD

## "BUT I LIKE DOWNLOADING A SINGLE FILE"

<p class="answer-box">sure — but that needn't dictate the storage layout</p>

::left::

<ul>
<li v-click="1">It's reasonable to want a file on your local filesystem</li>
<li v-click="2">But we're free to transform the data <strong>any way we like</strong> on its journey from the datacentre to your laptop</li>
<li v-click="3">So use a service (e.g. Flux, via OGC API – EDR) to subset the store and assemble a GeoTIFF on request</li>
<li v-click="7">A file that never existed on disk — <strong>the perfect COG for your immediate need</strong></li>
</ul>

::right::

<div class="dl">
  <div v-click="4" class="dl-zone dl-cloud">
    <div class="dl-zone-label">☁️ cloud</div>
    <div class="dl-layer">
      <div class="dl-layer-label">storage layer<span>serverless</span></div>
      <div class="edr-box edr-ic">
        <img src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="" />
        <div><strong>Icechunk repo</strong><span>just objects in a bucket</span></div>
      </div>
    </div>
    <div class="dl-down">↓ <span>reads, subsets, encodes</span></div>
    <div class="dl-layer dl-layer-svc">
      <div class="dl-layer-label">service layer<span>optional</span></div>
      <div class="edr-box edr-svc">
        <strong>Flux · OGC API – EDR</strong>
        <span>stateless service on top of the repo</span>
      </div>
    </div>
  </div>

  <div v-click="5" class="dl-get">
    <div class="dl-get-arrow">↓</div>
    <code>GET …/collections/scenes/cube<br />?bbox=…&amp;datetime=…&amp;f=GeoTIFF</code>
  </div>

  <div v-click="6" class="dl-zone dl-local">
    <div class="dl-zone-label">💻 your laptop</div>
    <div class="edr-box edr-out">
      <span class="edr-file">📄</span>
      <div><strong>subset.tif</strong><span>just your bbox, bands &amp; dates</span></div>
    </div>
  </div>
</div>

<!--
Flux serves OGC API – EDR position / area / cube queries and can return CSV,
CoverageJSON, NetCDF, or GeoTIFF. So the "single file" is assembled on the
way out, from whatever subset you asked for.
-->

---
layout: two-col-header
---

# COMPATIBILITY

## "but many applications understand TIFF!"

<p v-click="1" class="answer-box">yes — <em>filesystem</em> applications</p>

::left::

<div class="why-text">
<ul>
<li v-click="2">We can <strong>reconstruct GeoTIFFs on demand</strong> for any local program (e.g. ArcGIS)</li>
<li v-click="3">It's genuinely impressive that macOS Preview can open a COG — a feat of format stability
<ul><li v-click="4">But no one points Preview at object storage</li></ul>
</li>
<li v-click="5">Any application that reads TIFFs <strong>from object storage</strong> can be taught to read Zarr (it's all just range requests)</li>
<li v-click="9">Compatibility via adapter layer is a <strong>much easier problem</strong> than consistency - vibe code it!</li>
</ul>
</div>

::right::

<div class="zi">
  <div v-click="6">
  <div class="zi-store">
    <img src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="" />
    <img src="/brand-kit/assets/logos/third-party/zarr.svg" alt="" />
    <span><strong>Icechunk-Zarr</strong> in object storage</span>
  </div>
  <div class="zi-http">↓ HTTP range requests ↓</div>
  </div>
  <div v-click="7">
  <div class="zi-label">interface layer</div>
  <div class="zi-grid">
    <a class="zi-if zi-exists" href="https://github.com/OSGeo/gdal/pull/14755" target="_blank">GDAL Icechunk driver<span class="zi-status">✅ exists</span></a>
    <a class="zi-if zi-exists" href="https://docs.earthmover.io/compute/edr#general-options" target="_blank">on-demand GeoTIFF (Flux)<span class="zi-status">✅ exists</span></a>
    <div class="zi-if zi-wip">netcdf-c + Icechunk<span class="zi-status">🚧 in progress</span></div>
    <div class="zi-if zi-could">Zarr → COG adapter ✨<span class="zi-status">💡 could exist</span></div>
    <div class="zi-arrow">↓</div>
    <div class="zi-arrow">↓</div>
    <div class="zi-arrow">↓</div>
    <div class="zi-arrow">↓</div>
  </div>
  </div>
  <div v-click="8">
  <div class="zi-label">applications</div>
  <div class="zi-grid">
    <div class="zi-app"><img src="/logos/qgis.svg" alt="" /><span>QGIS</span></div>
    <div class="zi-app"><img src="/logos/arcgis.svg" alt="" /><span>ArcGIS</span></div>
    <div class="zi-app"><img src="/logos/netcdf-logo.png" alt="" /><span>netCDF tools</span></div>
    <div class="zi-app"><span class="zi-emoji">🛰️</span><span>any COG reader</span></div>
  </div>
  </div>
</div>

<!--
Applications don't need the bytes to be a TIFF; they need *an* interface.
Thin adapter layers (existing drivers, on-demand conversion, or a small shim
that presents Zarr as a COG) sit between apps and the same range requests.
-->
