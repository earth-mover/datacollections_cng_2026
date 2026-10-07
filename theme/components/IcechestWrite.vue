<script setup lang="ts">
// PyIceberg writes table data and Icechunk writes arrays inside one Icechest
// transaction, published by a single Icechunk commit. Drawn for the DevSeed slides.
</script>

<template>
  <div class="iw">
    <div class="iw-tx">
      <div class="iw-tx-title">one transaction</div>

      <div class="iw-lane">
        <div class="iw-writer">
          <img src="/images/icechest/iceberg-logo-icon.png" alt="" />
          <div>
            <div class="iw-writer-name">PyIceberg</div>
            <code>tx.append("granules", rows)</code>
          </div>
        </div>
        <div class="iw-arrow" />
        <div class="iw-out">
          <div class="iw-out-files">
            <span class="iw-file">data.parquet</span>
            <span class="iw-file">manifest.avro</span>
            <span class="iw-file current">v4.metadata.json</span>
          </div>
          <div class="iw-out-label">table data</div>
        </div>
      </div>

      <div class="iw-lane">
        <div class="iw-writer">
          <img src="/brand-kit/assets/logos/third-party/icechunk.svg" alt="" />
          <div>
            <div class="iw-writer-name">Icechunk + Zarr</div>
            <code>tx.group["reflectance"][0:10] = chunk</code>
          </div>
        </div>
        <div class="iw-arrow" />
        <div class="iw-out">
          <div class="iw-tiles"><span v-for="n in 3" :key="n" class="iw-tile" /></div>
          <div class="iw-out-label">array chunks</div>
        </div>
      </div>
    </div>

    <div class="iw-commit">
      <svg viewBox="0 0 44 12" width="44" height="12" aria-hidden="true">
        <line x1="0" y1="6" x2="36" y2="6" stroke="currentColor" stroke-width="2" />
        <path d="M34 1 L43 6 L34 11 Z" fill="currentColor" />
      </svg>
      <code>commit</code>
    </div>

    <div class="iw-snapshot">
      <div class="iw-snap-title">
        Icechunk snapshot <code>c9d1…</code>
        <span class="iw-branch">main</span>
      </div>
      <div class="iw-row">
        <span class="iw-row-label">arrays</span>
        <div class="iw-tiles"><span v-for="n in 3" :key="n" class="iw-tile" /></div>
      </div>
      <div class="iw-row">
        <span class="iw-row-label">table pointer</span>
        <code class="iw-pointer">granules → v4.metadata.json</code>
      </div>
      <div class="iw-snap-note">both published, or neither</div>
    </div>
  </div>
</template>

<style scoped>
.iw {
  --navy: var(--ds-highlight, #0F1E3D);
  --mono: ui-monospace, 'SF Mono', Menlo, monospace;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #fff;
  font-size: 11px;
}

/* Dashed transaction boundary around both writers */
.iw-tx {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 2px dashed #fff;
  border-radius: 12px;
  padding: 18px 14px 12px;
}
.iw-tx-title {
  position: absolute;
  top: -9px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 8px;
  background: var(--ds-orange, #CF3F02);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  font-size: 10px;
  white-space: nowrap;
}
.iw-lane {
  display: flex;
  align-items: center;
  gap: 10px;
}
.iw-writer {
  width: 290px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  color: var(--navy);
  border-radius: 8px;
  padding: 7px 10px;
}
.iw-writer img {
  width: 30px;
  height: 30px;
  object-fit: contain;
  flex-shrink: 0;
}
.iw-writer-name { font-weight: 900; font-size: 12px; }
.slidev-layout .iw-writer code {
  font-family: var(--mono);
  font-size: 9.5px;
  background: none;
  padding: 0;
  color: var(--navy);
  white-space: nowrap;
}

.iw-arrow {
  position: relative;
  width: 28px;
  height: 2px;
  flex-shrink: 0;
  background: repeating-linear-gradient(to right, #fff 0 4px, transparent 4px 7px);
}
.iw-arrow::after {
  content: '';
  position: absolute;
  right: -2px;
  top: -4px;
  border-left: 7px solid #fff;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
}

.iw-out {
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.iw-out-files {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.iw-file {
  font-family: var(--mono);
  font-size: 9.5px;
  padding: 1px 6px;
  border-radius: 3px;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  text-align: center;
}
.iw-file.current {
  background: #fff;
  border-color: #fff;
  color: var(--navy);
  font-weight: 700;
}
.iw-out-label { font-size: 10px; opacity: 0.85; }

.iw-tiles {
  display: flex;
  gap: 4px;
}
.iw-tile {
  width: 22px;
  height: 22px;
  border-radius: 3px;
  background-color: #fff;
  background-image:
    linear-gradient(to right, rgba(15, 30, 61, 0.25) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(15, 30, 61, 0.25) 1px, transparent 1px);
  background-size: 5.5px 5.5px;
  background-position: -1px -1px;
}

.iw-commit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.slidev-layout .iw-commit code {
  font-family: var(--mono);
  font-size: 10px;
  background: rgba(0, 0, 0, 0.15);
  padding: 1px 5px;
  border-radius: 4px;
}

/* The single Icechunk commit holding arrays and the table pointer */
.iw-snapshot {
  background: var(--navy);
  border-radius: 10px;
  padding: 10px 12px;
  flex-shrink: 0;
}
.iw-snap-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 900;
  font-size: 12px;
  margin-bottom: 6px;
}
.slidev-layout .iw-snap-title code {
  font-family: var(--mono);
  font-size: 11px;
  background: none;
  padding: 0;
  color: #fff;
}
.iw-branch {
  background: #fff;
  color: var(--navy);
  border-radius: 4px;
  padding: 0 5px;
  font-family: var(--mono);
  font-size: 10px;
}
.iw-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.iw-row-label {
  width: 44px;
  font-size: 10px;
  line-height: 1.2;
  opacity: 0.85;
}
.slidev-layout .iw-pointer {
  padding: 2px 6px;
  border-radius: 4px;
  background: #fff;
  color: var(--navy);
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
}
.iw-snap-note {
  margin-top: 4px;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
}
</style>
