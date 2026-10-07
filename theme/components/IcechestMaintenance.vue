<script setup lang="ts">
// Table maintenance: a catalog service runs it for standard Iceberg, but in
// Icechest Iceberg versions are pinned by Icechunk snapshots with their own
// lifecycle, so maintenance must treat Icechunk refs as the source of truth.
const jobs = ['Data compaction', 'Metadata compaction', 'Orphan-file removal', 'Snapshot expiry']
const snapshots = [
  { id: 'a1f9', ref: 'tag v1.0', version: 'v2' },
  { id: 'b7e2', ref: '', version: 'v3' },
  { id: 'c9d1', ref: 'main', version: 'v4' },
]
</script>

<template>
  <div class="im">
    <!-- Standard Iceberg: the catalog service owns maintenance -->
    <div class="im-panel im-before">
      <div class="im-head">Standard Iceberg</div>
      <div class="im-card">
        <div class="im-card-title">Catalog service</div>
        <ul class="im-jobs">
          <li v-for="j in jobs" :key="j"><span class="im-check">✓</span>{{ j }}</li>
        </ul>
      </div>
      <div class="im-caption">Judged from the table's own history</div>
    </div>

    <div class="im-divider" />

    <!-- Icechest: Icechunk refs pin Iceberg versions, so maintenance is ours -->
    <div class="im-panel">
      <div class="im-head">Icechest</div>

      <div class="im-timeline">
        <div class="im-line" />
        <template v-for="s in snapshots" :key="s.id">
          <div class="im-snap">
            <span class="im-ref" :class="{ empty: !s.ref }">{{ s.ref || '·' }}</span>
            <span class="im-dot" :class="{ pinned: s.ref.startsWith('tag') }" />
            <code class="im-snap-id">{{ s.id }}…</code>
            <span class="im-pin" />
            <span class="im-version" :class="{ pinned: s.ref.startsWith('tag') }">{{ s.version }}.metadata.json</span>
          </div>
        </template>
      </div>

      <div class="im-warning">
        <span class="im-warn-icon">!</span>
        <span>Iceberg's expiry only sees <b>v4</b>, so it would delete files that <b>tag v1.0</b> still needs</span>
      </div>

      <div class="im-ours">
        <div class="im-ours-title">We'll need to run these ourselves, with Icechunk refs as the source of truth</div>
        <div class="im-ours-jobs">
          <span v-for="j in jobs" :key="j" class="im-job">{{ j }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.im {
  --navy: var(--ds-highlight, #0F1E3D);
  --mono: ui-monospace, 'SF Mono', Menlo, monospace;
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 26px;
  color: #fff;
  font-size: 11px;
}
.im-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.im-before { opacity: 0.85; justify-content: flex-start; }
.im-head {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  font-size: 11px;
}
.im-divider {
  width: 0;
  border-left: 2px dashed rgba(255, 255, 255, 0.5);
}
.im-caption {
  font-weight: 700;
  font-size: 12px;
}

/* Catalog service card */
.im-card {
  background: rgba(255, 255, 255, 0.14);
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  border-radius: 10px;
  padding: 10px 14px 8px;
}
.im-card-title { font-weight: 900; font-size: 13px; text-align: center; margin-bottom: 6px; }
.slidev-layout .im-jobs {
  list-style: none;
  margin: 0;
  padding: 0;
}
.slidev-layout .im-jobs li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  margin: 0;
  padding: 5px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
}
.im-check {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff;
  color: var(--navy);
  font-size: 10px;
  font-weight: 900;
}

/* Icechunk snapshot timeline, each snapshot pinning an Iceberg version */
.im-timeline {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.im-snap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  flex-shrink: 0;
}
/* One line through the dots, from the first snapshot's center to the last's */
.im-line {
  position: absolute;
  top: 26px;
  left: 60px;
  right: 60px;
  height: 2px;
  background: #fff;
}
.im-ref {
  background: var(--navy);
  border-radius: 4px;
  padding: 0 6px;
  font-family: var(--mono);
  font-weight: 700;
  font-size: 10px;
  margin-bottom: 3px;
  white-space: nowrap;
}
.im-ref.empty { visibility: hidden; }
.im-dot {
  position: relative;
  z-index: 1;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--navy);
}
.im-dot.pinned { background: var(--navy); border-color: #fff; }
.im-snap-id {
  margin-top: 2px;
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
}
.slidev-layout .im-snap-id { background: none; padding: 0; color: #fff; }
.im-pin {
  width: 2px;
  height: 10px;
  margin: 2px 0;
  background: repeating-linear-gradient(to bottom, #fff 0 3px, transparent 3px 5px);
}
.im-version {
  font-family: var(--mono);
  font-size: 9.5px;
  padding: 1px 6px;
  border-radius: 3px;
  background: #fff;
  color: var(--navy);
  font-weight: 700;
}
.im-version.pinned {
  outline: 2px solid var(--navy);
  outline-offset: 1px;
}

/* Warning callout */
.im-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 420px;
  background: var(--navy);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 11px;
  line-height: 1.35;
}
.im-warn-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff;
  color: var(--navy);
  font-weight: 900;
}
.im-warning b { font-weight: 900; }

/* Maintenance we now own */
.im-ours {
  border: 2px dashed #fff;
  border-radius: 10px;
  padding: 6px 10px 8px;
  text-align: center;
}
.im-ours-title {
  font-weight: 700;
  font-size: 11px;
  margin-bottom: 6px;
}
.im-ours-jobs {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 4px 6px;
  justify-content: center;
}
.im-job {
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  border-radius: 5px;
  padding: 2px 8px;
  font-size: 11px;
}
</style>
