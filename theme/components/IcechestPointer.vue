<script setup lang="ts">
// Where the "current metadata.json" pointer lives: a catalog service in standard
// Iceberg vs. Icechunk commit metadata in Icechest. Drawn for the DevSeed slides.
const versions = ['v1', 'v2', 'v3']
</script>

<template>
  <div class="ip">
    <!-- Standard Iceberg: a catalog service owns the pointer, arrays live elsewhere -->
    <div class="ip-panel ip-before">
      <div class="ip-head">Standard Iceberg</div>
      <div class="ip-body">
        <div class="ip-stack">
          <div class="ip-card">
            <div class="ip-card-title">Catalog service</div>
            <div class="ip-card-sub">REST · Glue · Hive</div>
            <code class="ip-pointer">granules → v3</code>
          </div>
          <div class="ip-down" />
          <div class="ip-files">
            <span v-for="v in versions" :key="v" class="ip-file" :class="{ current: v === 'v3' }">{{ v }}.metadata.json</span>
          </div>
        </div>

        <div class="ip-split">
          <svg viewBox="0 0 40 16" width="40" height="16" aria-hidden="true">
            <line x1="0" y1="8" x2="15" y2="8" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2" />
            <line x1="25" y1="8" x2="40" y2="8" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2" />
            <line x1="17" y1="2" x2="23" y2="14" stroke="currentColor" stroke-width="2" />
          </svg>
          <span>separate<br>commits</span>
        </div>

        <div class="ip-card">
          <div class="ip-card-title">Icechunk repo</div>
          <div class="ip-card-sub">array data</div>
          <div class="ip-tiles"><span v-for="n in 3" :key="n" class="ip-tile" /></div>
        </div>
      </div>
      <div class="ip-caption">Two systems to keep in sync</div>
    </div>

    <div class="ip-divider" />

    <!-- Icechest: the Icechunk commit carries the pointer alongside the arrays -->
    <div class="ip-panel">
      <div class="ip-head">Icechest</div>
      <div class="ip-body">
        <div class="ip-snapshot">
          <div class="ip-snap-title">
            Icechunk snapshot <code>b7e2…</code>
            <span class="ip-branch">main</span>
          </div>
          <div class="ip-row">
            <span class="ip-row-label">arrays</span>
            <div class="ip-tiles"><span v-for="n in 3" :key="n" class="ip-tile" /></div>
          </div>
          <div class="ip-row ip-meta">
            <span class="ip-row-label">commit metadata</span>
            <code class="ip-pointer">iceberg:table_versions<br>granules → v3.metadata.json</code>
          </div>
        </div>

        <div class="ip-right">
          <svg viewBox="0 0 44 12" width="44" height="12" aria-hidden="true">
            <line x1="0" y1="6" x2="36" y2="6" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3" />
            <path d="M34 1 L43 6 L34 11 Z" fill="currentColor" />
          </svg>
        </div>

        <div class="ip-stack">
          <div class="ip-files">
            <span v-for="v in versions" :key="v" class="ip-file" :class="{ current: v === 'v3' }">{{ v }}.metadata.json</span>
          </div>
          <div class="ip-card-sub">Iceberg warehouse</div>
        </div>
      </div>
      <div class="ip-caption">The snapshot <em>is</em> the catalog: one commit publishes both</div>
    </div>
  </div>
</template>

<style scoped>
.ip {
  --navy: var(--ds-highlight, #0F1E3D);
  --mono: ui-monospace, 'SF Mono', Menlo, monospace;
  display: flex;
  align-items: stretch;
  gap: 22px;
  color: #fff;
  font-size: 11px;
}
.ip-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ip-before { opacity: 0.8; }
.ip-head {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  font-size: 11px;
  margin-bottom: 12px;
}
.ip-body {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}
.ip-caption {
  margin-top: 12px;
  font-weight: 700;
  font-size: 12px;
}
.ip-divider {
  width: 0;
  border-left: 2px dashed rgba(255, 255, 255, 0.5);
}

.ip-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.ip-card {
  background: rgba(255, 255, 255, 0.14);
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  border-radius: 8px;
  padding: 7px 10px;
  text-align: center;
}
.ip-card-title { font-weight: 900; font-size: 12px; }
.ip-card-sub { font-size: 10px; opacity: 0.85; }
.slidev-layout .ip-pointer {
  display: inline-block;
  margin-top: 5px;
  padding: 2px 6px;
  border-radius: 4px;
  background: #fff;
  color: var(--navy);
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  line-height: 1.4;
  text-align: left;
}
.ip-down {
  width: 2px;
  height: 16px;
  background: repeating-linear-gradient(to bottom, #fff 0 3px, transparent 3px 6px);
  position: relative;
}
.ip-down::after {
  content: '';
  position: absolute;
  left: -4px;
  bottom: -5px;
  border-top: 6px solid #fff;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}

/* metadata.json versions; the current one is solid */
.ip-files {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ip-file {
  font-family: var(--mono);
  font-size: 9.5px;
  padding: 2px 6px;
  border-radius: 3px;
  border: 1.5px dashed rgba(255, 255, 255, 0.45);
  color: rgba(255, 255, 255, 0.75);
}
.ip-file.current {
  background: #fff;
  border: 1.5px solid #fff;
  color: var(--navy);
  font-weight: 700;
}

.ip-split {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 9.5px;
  text-align: center;
  line-height: 1.2;
}

.ip-tiles {
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-top: 5px;
}
.ip-tile {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  background-color: #fff;
  background-image:
    linear-gradient(to right, rgba(15, 30, 61, 0.25) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(15, 30, 61, 0.25) 1px, transparent 1px);
  background-size: 5px 5px;
  background-position: -1px -1px;
}

/* Icechest: one snapshot holding arrays and the table pointer */
.ip-snapshot {
  background: var(--navy);
  border-radius: 10px;
  padding: 10px 12px;
}
.ip-snap-title {
  font-weight: 900;
  font-size: 12px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.slidev-layout .ip-snap-title code {
  font-family: var(--mono);
  font-size: 11px;
  background: none;
  padding: 0;
  color: #fff;
}
.ip-branch {
  background: #fff;
  color: var(--navy);
  border-radius: 4px;
  padding: 0 5px;
  font-family: var(--mono);
  font-size: 10px;
}
.ip-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.ip-row .ip-tiles { margin-top: 0; }
.ip-row-label {
  width: 62px;
  font-size: 10px;
  line-height: 1.2;
  opacity: 0.85;
}
.ip-meta .ip-pointer { margin-top: 0; }
.ip-right { display: flex; align-items: center; margin-top: 46px; }
</style>
