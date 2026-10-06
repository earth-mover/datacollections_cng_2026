<script setup lang="ts">
defineProps<{
  image: string
}>()
</script>

<template>
  <div class="slidev-layout em-image-left">
    <div class="em-il-image" :style="{ backgroundImage: `url(${image})` }" />
    <SlideLogo />
    <div class="em-il-content">
      <slot />
    </div>
    <SlideFooter />
  </div>
</template>

<style scoped>
.em-image-left {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.em-image-left :deep(.slide-logo) {
  position: absolute;
  top: 1.5rem;
  right: 3rem;
}

.em-il-image {
  background-size: cover;
  background-position: center;
}

.em-il-content {
  padding: 3.5rem 3rem 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.em-image-left :deep(.slide-footer) {
  grid-column: 1 / -1;
}
</style>
