<script setup lang="ts">
withDefaults(defineProps<{
  illustration?: string
}>(), {
  illustration: '',
})
</script>

<template>
  <div class="slidev-layout em-cover" :class="{ 'has-illustration': illustration }">
    <div class="em-cover-content">
      <img src="/brand-kit/Earthmover-Brand-Identity-Assets/02 Earthmover Full Lockup/03 Vector - RGB - SVG/02-Earthmover-Full-Lockup-Violet-RGB.svg" alt="Earthmover" class="em-cover-lockup" />
      <slot />
    </div>
    <div v-if="illustration" class="em-cover-illustration">
      <img :src="illustration" alt="" />
    </div>
    <GridDecoration v-if="!illustration" position="bottom-left" :size="100" />
    <SlideFooter />
  </div>
</template>

<style scoped>
.em-cover {
  position: relative;
  padding: 3rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.em-cover-content {
  padding-top: 2rem;
}

.em-cover-lockup {
  display: block;
  height: 2.4rem;
  width: auto;
  margin-bottom: 1.5rem;
}

/* Override heading sizes for cover — bigger */
.em-cover :deep(h2) {
  font-size: 3rem;
  line-height: 1.1;
}

.em-cover :deep(p) {
  font-size: 1.1rem;
  color: var(--em-muted);
  max-width: 100%;
}

/* Two-column layout when illustration is present */
.em-cover.has-illustration {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  padding: 0;
}

.has-illustration .em-cover-content {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.em-cover-illustration {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0;
}

.em-cover-illustration img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.has-illustration :deep(.slide-footer) {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
