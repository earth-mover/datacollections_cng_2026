<script setup lang="ts">
// Data and metadata written in one Icechunk transaction, drawn for the DevSeed
// (orange) slides. New writes are solid white; existing content is faint.
const scenes = ['scene_1022', 'scene_1023', 'scene_1024']
const metaCols = ['collection', 'date', 'bbox']
// Existing rows, then one new row per scene written in this transaction.
const metaRows = [false, false, true, true, true]
</script>

<template>
  <div class="ac">
    <div class="ac-session">
      <div class="ac-title">one transaction</div>
      <div class="ac-writes">
        <div class="ac-write">
          <div class="ac-label">data</div>
          <div class="ac-tiles">
            <div v-for="s in scenes" :key="s" class="ac-tile-wrap">
              <div class="ac-tile" />
              <div class="ac-tile-name">{{ s }}</div>
            </div>
          </div>
        </div>

        <div class="ac-plus">+</div>

        <div class="ac-write">
          <div class="ac-label">metadata</div>
          <div class="ac-table">
            <div v-for="c in metaCols" :key="c" class="ac-col">
              <div class="ac-col-name">{{ c }}</div>
              <div v-for="(isNew, j) in metaRows" :key="j" class="ac-cell" :class="{ new: isNew }" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="ac-commit">
      <svg viewBox="0 0 12 30" width="12" height="30" aria-hidden="true">
        <line x1="6" y1="0" x2="6" y2="22" stroke="currentColor" stroke-width="2" />
        <path d="M1 20 L6 29 L11 20 Z" fill="currentColor" />
      </svg>
      <code>session.commit()</code>
    </div>

    <div class="ac-history">
      <div class="ac-snap old">
        <div class="ac-dot" />
        <div class="ac-snap-id">a1f9…</div>
        <div class="ac-snap-msg">previous</div>
      </div>
      <div class="ac-line" />
      <div class="ac-snap">
        <div class="ac-branch">main</div>
        <div class="ac-dot" />
        <div class="ac-snap-id">b7e2…</div>
        <div class="ac-snap-msg">data + metadata</div>
      </div>
    </div>

    <div class="ac-caption">Readers see both or neither</div>
  </div>
</template>

<style scoped>
.ac {
  --navy: var(--ds-highlight, #0F1E3D);
  --mono: ui-monospace, 'SF Mono', Menlo, monospace;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  font-size: 11px;
}

/* The transaction: both writes inside one dashed boundary */
.ac-session {
  position: relative;
  border: 2px dashed #fff;
  border-radius: 12px;
  padding: 18px 16px 12px;
}
.ac-title {
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
.ac-writes {
  display: flex;
  align-items: flex-end;
  gap: 14px;
}
.ac-write {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.ac-label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  font-size: 10px;
}
.ac-plus {
  font-size: 22px;
  font-weight: 900;
  align-self: center;
  padding-top: 14px;
}

/* Data: new image arrays, each a small chunk grid */
.ac-tiles {
  display: flex;
  gap: 8px;
}
.ac-tile-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.ac-tile {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-color: #fff;
  background-image:
    linear-gradient(to right, rgba(15, 30, 61, 0.25) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(15, 30, 61, 0.25) 1px, transparent 1px);
  background-size: 10px 10px;
  background-position: -1px -1px;
}
.ac-tile-name {
  font-family: var(--mono);
  font-size: 8.5px;
  opacity: 0.85;
}

/* Metadata: three 1-D columns gaining one row per new scene */
.ac-table {
  display: flex;
  gap: 4px;
  background: var(--navy);
  border-radius: 6px;
  padding: 5px 6px 6px;
}
.ac-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ac-col-name {
  font-family: var(--mono);
  font-size: 8.5px;
  text-align: center;
  margin-bottom: 1px;
}
.ac-cell {
  width: 46px;
  height: 7px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
}
.ac-cell.new { background: #fff; }

/* Commit arrow */
.ac-commit {
  position: relative;
  display: flex;
  margin: 4px 0;
}
.ac-commit code {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
  white-space: nowrap;
}
.slidev-layout .ac-commit code {
  font-family: var(--mono);
  font-size: 11px;
  background: rgba(0, 0, 0, 0.15);
  padding: 1px 5px;
  border-radius: 4px;
}

/* Snapshot history: main moves to the new snapshot in one step */
.ac-history {
  display: flex;
  align-items: flex-start;
  margin-top: 16px;
}
.ac-snap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 110px;
}
.ac-snap.old { opacity: 0.6; }
.ac-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--navy);
}
.ac-snap.old .ac-dot {
  background: transparent;
  border-color: #fff;
}
.ac-snap-id {
  margin-top: 4px;
  font-family: var(--mono);
  font-weight: 700;
}
.ac-snap-msg { font-size: 10px; opacity: 0.85; }
.ac-line {
  width: 40px;
  height: 2px;
  margin: 8px -35px 0;
  background: #fff;
}
.ac-branch {
  position: absolute;
  top: -18px;
  left: calc(50% + 12px);
  background: var(--navy);
  border-radius: 4px;
  padding: 1px 6px;
  font-family: var(--mono);
  font-weight: 700;
  font-size: 10px;
}
.ac-caption {
  margin-top: 8px;
  font-weight: 700;
  font-size: 12px;
}
</style>
