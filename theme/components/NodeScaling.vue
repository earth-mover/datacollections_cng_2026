<script setup lang="ts">
// Level 3 vs Level 2 store shape: one big array node vs. millions of granule
// groups, each nested by band and multiscale level. Drawn for the DevSeed slides.
</script>

<template>
  <div class="ns">
    <div class="ns-card">
      <div class="ns-head">Level 3</div>
      <div class="ns-cube">
        <span v-for="n in 3" :key="n" class="ns-layer" />
      </div>
      <div class="ns-stat"><b>1</b> array node</div>
      <div class="ns-sub">billions of chunks</div>
    </div>

    <div class="ns-card ns-l2">
      <div class="ns-head">Level 2 (HLS)</div>
<pre class="ns-tree"><span class="g">/</span>
├─ <span class="g">HLS.S30.T10SEG.2024001/</span>
│  ├─ <span class="g">B01/</span>  <span class="c">multiscales</span>
│  │  ├─ <span class="a">0</span>
│  │  ├─ <span class="a">1</span>
│  │  └─ <span class="a">2</span>
│  ├─ <span class="g">B02/</span>  <span class="c">…</span>
│  └─ <span class="g">Fmask/</span> <span class="c">…</span>
├─ <span class="g">HLS.L30.T10SEG.2024003/</span> <span class="c">…</span>
└─ <span class="c">… 38 M granules</span></pre>
      <div class="ns-stat"><b>181–217</b> nodes per granule</div>
      <div class="ns-legend"><span class="g">group/</span> <span class="a">array</span></div>
    </div>
  </div>
</template>

<style scoped>
.ns {
  --navy: var(--ds-highlight, #0F1E3D);
  --mono: ui-monospace, 'SF Mono', Menlo, monospace;
  display: flex;
  align-items: stretch;
  gap: 10px;
  color: #fff;
  font-size: 11px;
}
.ns-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.14);
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  border-radius: 10px;
  padding: 8px 12px;
}
.ns-l2 {
  background: var(--navy);
  border-color: var(--navy);
}
.ns-head {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  font-size: 10px;
  margin-bottom: 8px;
}
.ns-stat { margin-top: auto; padding-top: 8px; font-size: 11px; }
.ns-stat b { font-weight: 900; font-size: 13px; }
.ns-sub { font-size: 10px; opacity: 0.85; }

/* Level 3: a single n-D array drawn as stacked chunk grids */
.ns-cube {
  position: relative;
  width: 84px;
  height: 84px;
  margin: 6px 0;
}
.ns-layer {
  position: absolute;
  width: 64px;
  height: 64px;
  border-radius: 3px;
  background-color: #fff;
  background-image:
    linear-gradient(to right, rgba(15, 30, 61, 0.3) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(15, 30, 61, 0.3) 1px, transparent 1px);
  background-size: 8px 8px;
  background-position: -1px -1px;
  box-shadow: 0 0 0 1.5px var(--ds-orange, #CF3F02);
}
.ns-layer:nth-child(1) { left: 20px; top: 0; opacity: 0.6; }
.ns-layer:nth-child(2) { left: 10px; top: 10px; opacity: 0.8; }
.ns-layer:nth-child(3) { left: 0; top: 20px; }

/* Level 2: a file-tree view of the node hierarchy */
.slidev-layout .ns-tree {
  margin: 0;
  padding: 0;
  background: none;
  font-family: var(--mono);
  font-size: 10px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.6);
  white-space: pre;
}
.ns-tree .g { color: #fff; font-weight: 700; }
.ns-tree .a { color: #9ec9ff; font-weight: 700; }
.ns-tree .c { color: rgba(255, 255, 255, 0.6); font-style: italic; }
.ns-legend {
  margin-top: 2px;
  font-family: var(--mono);
  font-size: 9.5px;
}
.ns-legend .g { font-weight: 700; margin-right: 8px; }
.ns-legend .a { color: #9ec9ff; font-weight: 700; }
</style>
