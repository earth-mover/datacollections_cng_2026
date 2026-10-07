<script setup lang="ts">
// Chunk scanning in zarr-datafusion-search, drawn for the DevSeed (orange) slides.
// Only chunk 1 is expanded; its rows are where the predicate is evaluated.
const rows = [
  { collection: 'wat', date: '2024-06-01', bbox: '-105.2, 39.7', match: false },
  { collection: 'test', date: '2024-06-03', bbox: '-104.9, 39.6', match: true },
  { collection: 'not a test', date: '2024-06-04', bbox: '-105.0, 40.0', match: false },
  { collection: 'test', date: '2024-06-07', bbox: '-105.1, 39.8', match: true },
  { collection: 'grateful', date: '2024-06-09', bbox: '-104.8, 39.9', match: false },
]
const columns = [
  { key: 'collection', role: 'predicate' },
  { key: 'date', role: 'projection' },
  { key: 'bbox', role: 'projection' },
] as const
const matches = rows.filter(r => r.match)
</script>

<template>
  <div class="cs">
    <div class="cs-side">
      <pre class="cs-query"><span class="kw">SELECT</span> date, bbox
<span class="kw">FROM</span> zarr_data
<span class="kw">WHERE</span> collection = <span class="str">'test'</span></pre>
      <ol class="cs-steps">
        <li>Read a <code>collection</code> chunk and evaluate the predicate</li>
        <li>Take the matching rows from the <code>date</code> and <code>bbox</code> chunks</li>
        <li>Emit them as an Arrow RecordBatch</li>
      </ol>
    </div>

    <div class="cs-grid">
      <div class="cs-role" style="grid-column: 1">predicate</div>
      <div class="cs-role" style="grid-column: 2 / 4">projection</div>

      <div class="cs-band"><span class="cs-note">chunk size = 5</span></div>

      <template v-for="(col, i) in columns" :key="col.key">
        <div class="cs-col" :class="col.role" :style="{ gridColumn: i + 1 }" />
        <div class="cs-head" :style="{ gridColumn: i + 1 }">{{ col.key }}[ ]</div>
        <div class="cs-chunk" :style="{ gridColumn: i + 1, gridRow: 3 }">chunk 0</div>
        <div class="cs-rows" :style="{ gridColumn: i + 1 }">
          <div v-for="(r, j) in rows" :key="j" class="cs-row" :class="{ match: r.match }">
            {{ r[col.key] }}
          </div>
        </div>
        <div v-for="n in [2, 3, 4]" :key="n" class="cs-chunk" :style="{ gridColumn: i + 1, gridRow: n + 3 }">
          chunk {{ n }}
        </div>
      </template>
    </div>

    <div class="cs-arrow">
      <span>matching rows</span>
      <svg viewBox="0 0 60 12" width="60" height="12" aria-hidden="true">
        <line x1="0" y1="6" x2="52" y2="6" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3" />
        <path d="M50 1 L59 6 L50 11 Z" fill="currentColor" />
      </svg>
    </div>

    <div class="cs-result">
      <div class="cs-result-title">RecordBatch</div>
      <table>
        <thead><tr><th>date</th><th>bbox</th></tr></thead>
        <tbody>
          <tr v-for="(r, j) in matches" :key="j"><td>{{ r.date }}</td><td>{{ r.bbox }}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.cs {
  --navy: var(--ds-highlight, #0F1E3D);
  --mono: ui-monospace, 'SF Mono', Menlo, monospace;
  display: flex;
  align-items: center;
  gap: 18px;
  color: #fff;
  font-size: 11px;
}

/* Left: query + steps */
.cs-side {
  width: 200px;
  flex-shrink: 0;
}
.cs-query {
  margin: 0 0 14px;
  padding: 10px 12px;
  background: var(--navy);
  border-radius: 8px;
  font-family: var(--mono);
  font-size: 11.5px;
  line-height: 1.55;
  color: #fff;
  white-space: pre;
}
.cs-query .kw { color: #9ec9ff; font-weight: 700; }
.cs-query .str { color: #ffd8a8; }
.slidev-layout .cs-steps {
  margin: 0;
  padding-left: 1.2em;
}
.slidev-layout .cs-steps li {
  font-size: 12px;
  line-height: 1.35;
  margin: 0 0 6px;
}
.slidev-layout .cs-steps code {
  background: rgba(0, 0, 0, 0.15);
  padding: 0 3px;
  border-radius: 3px;
  font-size: 11px;
}

/* Middle: the three Zarr arrays, rows: role, head, chunk0, rows, chunk2-4 */
.cs-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 98px);
  grid-template-rows: 16px 26px repeat(5, auto);
  column-gap: 10px;
  row-gap: 6px;
  flex-shrink: 0;
}
.cs-role {
  grid-row: 1;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  font-size: 10px;
}
.cs-col {
  grid-row: 2 / 8;
  border-radius: 10px;
  margin: -4px;
  z-index: 0;
}
.cs-col.predicate { background: var(--navy); }
.cs-col.projection { background: rgba(255, 255, 255, 0.14); border: 1.5px solid rgba(255, 255, 255, 0.5); }
.cs-head,
.cs-chunk,
.cs-rows { position: relative; z-index: 2; }
.cs-head {
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-weight: 700;
  font-size: 12px;
}
.cs-chunk {
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.75);
}
.cs-rows {
  grid-row: 4;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 4px 0;
}
.cs-row {
  height: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-family: var(--mono);
  font-size: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
}
.cs-row.match {
  background: #fff;
  color: var(--navy);
  font-weight: 700;
}
/* Dashed band marking the chunk being evaluated, across all three arrays */
.cs-band {
  grid-row: 4;
  grid-column: 1 / 4;
  margin: -2px -10px;
  border: 2px dashed #fff;
  border-radius: 8px;
  z-index: 1;
  position: relative;
}
.cs-note {
  position: absolute;
  left: 100%;
  top: 2px;
  margin-left: 10px;
  font-family: var(--mono);
  line-height: 1.4;
  text-align: left;
  white-space: nowrap;
}

/* Arrow + result */
.cs-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  opacity: 0.9;
  flex-shrink: 0;
  white-space: nowrap;
  min-width: 118px; /* also leaves room for the chunk-size label above it */
}
.cs-result {
  background: #fff;
  color: var(--navy);
  border-radius: 8px;
  padding: 8px 10px;
  flex-shrink: 0;
}
.cs-result-title {
  font-weight: 900;
  font-size: 12px;
  margin-bottom: 4px;
}
.slidev-layout .cs-result table {
  border-collapse: collapse;
  font-family: var(--mono);
  font-size: 10px;
}
.slidev-layout .cs-result th,
.slidev-layout .cs-result td {
  color: var(--navy);
  border: none;
  border-top: 1px solid rgba(15, 30, 61, 0.15);
  padding: 3px 6px;
  text-align: left;
}
.slidev-layout .cs-result th {
  border-top: none;
  font-weight: 700;
}
</style>
