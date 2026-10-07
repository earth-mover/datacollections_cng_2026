<script setup lang="ts">
// A DataFusion query that uses a materialized R-tree index (stored as a Zarr
// array) to read only the matching chunks, drawn for the DevSeed (orange) slides.
const arrays = ['collection', 'date', 'bbox']
const chunks = [0, 1, 2, 3, 4]
const hits = new Set([1, 3])
// The tree's nodes in breadth-first order, as stored in the 1-D index array:
// root, 2 internal nodes, 4 leaves. 'path' = visited, 'hit' = matching leaf.
const nodes = ['path', 'path', 'skip', 'hit', 'hit', 'skip', 'skip']
</script>

<template>
  <div class="iq">
    <pre class="iq-query"><span class="kw">SELECT</span> *
<span class="kw">FROM</span> scenes
<span class="kw">WHERE</span> bbox && :aoi</pre>

    <div class="iq-arrow" />

    <div class="iq-engine">
      <div class="iq-engine-name">DataFusion</div>
      <div class="iq-engine-sub">table provider</div>
    </div>

    <div class="iq-arrow"><span>lookup</span></div>

    <div class="iq-index">
      <svg viewBox="0 0 120 70" width="120" height="70" aria-hidden="true">
        <!-- edges: the path to matching leaves is solid -->
        <g stroke="rgba(255,255,255,0.35)" stroke-width="1.5">
          <line x1="60" y1="12" x2="88" y2="34" />
          <line x1="88" y1="34" x2="74" y2="58" />
          <line x1="88" y1="34" x2="104" y2="58" />
        </g>
        <g stroke="#fff" stroke-width="2.5">
          <line x1="60" y1="12" x2="32" y2="34" />
          <line x1="32" y1="34" x2="12" y2="58" />
          <line x1="32" y1="34" x2="44" y2="58" />
        </g>
        <rect x="48" y="4" width="24" height="14" rx="3" fill="#fff" />
        <rect x="20" y="27" width="24" height="14" rx="3" fill="#fff" />
        <rect x="76" y="27" width="24" height="14" rx="3" fill="rgba(255,255,255,0.3)" />
        <rect x="2" y="52" width="20" height="13" rx="3" fill="#0F1E3D" stroke="#fff" stroke-width="2" />
        <rect x="34" y="52" width="20" height="13" rx="3" fill="#0F1E3D" stroke="#fff" stroke-width="2" />
        <rect x="64" y="52" width="20" height="13" rx="3" fill="rgba(255,255,255,0.3)" />
        <rect x="94" y="52" width="20" height="13" rx="3" fill="rgba(255,255,255,0.3)" />
      </svg>
      <div class="iq-index-name">R-tree index</div>
      <svg class="iq-serial" viewBox="0 0 12 14" width="12" height="14" aria-hidden="true">
        <line x1="6" y1="0" x2="6" y2="8" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2" />
        <path d="M2 7 L6 13 L10 7 Z" fill="currentColor" />
      </svg>
      <div class="iq-index-array">
        <span class="iq-array-name">rtree[ ]</span>
        <span v-for="(n, i) in nodes" :key="i" class="iq-node" :class="n">{{ i }}</span>
      </div>
      <div class="iq-index-sub">nodes stored in a 1-D Zarr array</div>
    </div>

    <div class="iq-arrow"><span>chunks 1, 3</span></div>

    <div class="iq-arrays">
      <div class="iq-array-cols">
        <div v-for="a in arrays" :key="a" class="iq-array">
          <span class="iq-array-name">{{ a }}</span>
          <span v-for="c in chunks" :key="c" class="iq-chunk" :class="{ hit: hits.has(c) }" />
        </div>
      </div>
      <div class="iq-skip">only 2 of 5 chunks read</div>
    </div>

    <div class="iq-arrow" />

    <div class="iq-result">RecordBatch</div>
  </div>
</template>

<style scoped>
.iq {
  --navy: var(--ds-highlight, #0F1E3D);
  --mono: ui-monospace, 'SF Mono', Menlo, monospace;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  font-size: 11px;
}
.iq-query {
  margin: 0;
  padding: 8px 10px;
  background: var(--navy);
  border-radius: 8px;
  font-family: var(--mono);
  font-size: 11px;
  line-height: 1.5;
  color: #fff;
  white-space: pre;
  flex-shrink: 0;
}
.iq-query .kw { color: #9ec9ff; font-weight: 700; }

/* Dashed arrow with an optional label above it */
.iq-arrow {
  position: relative;
  width: 36px;
  height: 2px;
  flex-shrink: 0;
  background: repeating-linear-gradient(to right, #fff 0 4px, transparent 4px 7px);
}
.iq-arrow::after {
  content: '';
  position: absolute;
  right: -2px;
  top: -4px;
  border-left: 7px solid #fff;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
}
.iq-arrow span {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9.5px;
  white-space: nowrap;
  opacity: 0.9;
}

.iq-engine,
.iq-result {
  background: #fff;
  color: var(--navy);
  border-radius: 8px;
  padding: 8px 10px;
  text-align: center;
  flex-shrink: 0;
}
.iq-engine-name,
.iq-result { font-weight: 900; font-size: 12px; }
.iq-engine-sub { font-size: 10px; opacity: 0.75; }

.iq-index {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
.iq-index-name { font-weight: 700; margin-top: 4px; }
.iq-index-sub { font-size: 9.5px; opacity: 0.85; margin-top: 3px; }
.iq-serial { margin: 2px 0; opacity: 0.9; }
.iq-index-array {
  display: flex;
  align-items: center;
  gap: 2px;
}
.iq-index-array .iq-array-name { margin-right: 4px; }
.iq-node {
  width: 15px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-family: var(--mono);
  font-size: 8.5px;
}
.iq-node.path { background: #fff; color: var(--navy); font-weight: 700; }
.iq-node.hit { background: var(--navy); border: 1.5px solid #fff; color: #fff; font-weight: 700; }
.iq-node.skip { background: rgba(255, 255, 255, 0.3); color: rgba(255, 255, 255, 0.8); }

.iq-arrays {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
/* Each array is a column of chunks, top to bottom, as in the chunk-scanning diagram */
.iq-array-cols {
  display: flex;
  gap: 6px;
}
.iq-array {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.iq-array-name {
  font-family: var(--mono);
  font-size: 10px;
}
.iq-array .iq-array-name { margin-bottom: 1px; }
.iq-chunk {
  width: 44px;
  height: 11px;
  border-radius: 3px;
  border: 1.5px dashed rgba(255, 255, 255, 0.4);
}
.iq-chunk.hit {
  background: #fff;
  border: 1.5px solid #fff;
}
.iq-skip {
  margin-top: 4px;
  font-size: 9.5px;
  opacity: 0.85;
}
</style>
