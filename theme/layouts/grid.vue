<script setup lang="ts">
withDefaults(defineProps<{
  cols?: number
}>(), {
  cols: 3,
})
</script>

<template>
  <div class="slidev-layout em-grid">
    <SlideLogo />
    <div class="em-grid-header">
      <slot name="header" />
    </div>
    <div class="em-grid-cards" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <slot />
    </div>
    <SlideFooter />
  </div>
</template>

<style scoped>
.em-grid {
  position: relative;
  padding: 3.5rem 3rem 3rem 3rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.em-grid :deep(.slide-logo) {
  position: absolute;
  top: 1.5rem;
  right: 3rem;
}

.em-grid-header {
  margin-bottom: 1rem;
}

.em-grid-cards {
  flex: 1;
  display: grid;
  gap: 1rem;
  overflow: hidden;
}

/* Style direct children as cards */
.em-grid-cards :deep(> *) {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(166, 83, 255, 0.12);
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

html.dark .em-grid-cards :deep(> *) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(166, 83, 255, 0.2);
}

.em-grid-cards :deep(h3) {
  font-size: 1rem;
  margin: 0;
}

.em-grid-cards :deep(p) {
  font-size: 0.85rem;
  color: var(--em-muted);
  margin: 0;
}
</style>
