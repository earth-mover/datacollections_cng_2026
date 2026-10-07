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
layout: two-col-header
---

# CNG FORUM 2025

## last year: zarr vs cog

Lots of debate last year, and the rough consensus was:

::left::

<div class="text-center mt-6">
<div class="text-sm uppercase tracking-widest opacity-70">Level 3</div>
<div class="text-sm opacity-70 mb-4">gridded datacubes</div>
<div class="text-5xl font-medium text-em-violet">Zarr wins</div>
</div>

::right::

<div class="text-center mt-6">
<div class="text-sm uppercase tracking-widest opacity-70">Level 2</div>
<div class="text-sm opacity-70 mb-4">individual scenes</div>
<div class="text-5xl font-medium text-em-lime">COG + STAC wins</div>
</div>

<div class="absolute bottom-28 left-0 right-0 text-center text-2xl opacity-80">
does it have to be that way?
</div>

<!--
Set the scene: this is a familiar debate for this room, and that consensus is
reasonable. Our question today: do we have to accept that split, or can Level 2
get the same benefits Zarr + Icechunk give Level 3?
-->

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

# LEVEL 2 vs LEVEL 3

## But level 2 in Zarr is unsolved

- You **cannot** think of Level 2 data as one datacube
- The fundamental problem: **many arrays that don't share a coordinate system**
- So geospatial folks use many separate COGs, then index them with STAC
  - We also see anti-patterns: many small Zarrs, or one Zarr with an unwieldy number of groups

> [!IMPORTANT]
> This problem is **not** specific to geospatial!
> - Bioimaging: millions of OME-TIFFs, plus an index
> - Fusion energy: many separate Zarr stores, indexed with Parquet

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

# STAC + COG

## results in disjoint data systems

- Data lives in one place (COGs in object storage)
- Metadata lives in another (a STAC catalog / database)
- Nothing ties the two together transactionally
- → **Consistency problems** whenever either side changes

<!-- TODO: diagram — COG bucket on one side, STAC API/DB on the other, with an
arrow that can get out of sync -->

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

# WHY

## these limitations are inherent to the design

**A monolithic container file can never support key features in object storage**

- Prevents embarrassingly parallel writes
- Prevents cheap updates → no schema evolution, no versioning
- Can't use the serverless consistency mechanism Icechunk uses
- Virtual references inherently involve multiple files

**TIFF as a container constrains the schema**

**GeoTIFF + STAC are domain-specific**

---

# WHAT WOULD BE BETTER?

## a domain-agnostic way to manage sets of related arrays

- If only we could put **all the chunks and all the metadata** in one consistently versioned, cloud-native data repository…
- We still want STAC-like metadata search
- But if we can get that *from* Icechunk, we immediately gain loads of powerful features

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

## **Storing data and** STAC-like metadata **together**

<!--
Sean's half starts here. Section opener in DevSeed style.
Use **bold** to pick out key phrases in DevSeed dark grey.
-->

---
layout: devseed
---

# Design

## What Do We Want In A ~~Level 2 Zarr System~~ **Array Database?**
<div class="grid grid-cols-[1fr_auto] gap-x-10 items-center">
<div>

At this point we need to take a step back and realize that we're
trying to build database technology that needs to solve these problems.

1. Storing columnar metadata.
2. Querying using industry standard tooling.
3. Supporting transactions for **data and metadata** together.
4. Scaling to **billions?** of arrays.

</div>

<AtomicCommit />

</div>

---
layout: devseed
---

# Initial Attempt

Most of the "metadata" we're discussing can be modeled as an Arrow schema. So as an initial experiment we thought **What if we could store Arrow like data in Icechunk?**

<div class="flex flex-col items-center gap-3 mt-4">
  <img src="/images/zarr-datafusion/zarr-datafusion_logo_white.png" alt="Zarr-Datafusion-Search logo" class="h-56" />
  <span class="font-bold text-xl">Zarr-Datafusion-Search</span>
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
</style>

---
Domain Agnostic schemas
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
