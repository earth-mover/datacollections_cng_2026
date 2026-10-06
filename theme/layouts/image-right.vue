<script setup lang="ts">
defineProps<{
  image: string
}>()
</script>

<template>
  <div class="slidev-layout em-image-right">
    <SlideLogo />
    <div class="em-ir-content">
      <slot />
    </div>
    <div class="em-ir-image" :style="{ backgroundImage: `url(${image})` }" />
    <SlideFooter />
  </div>
</template>

<style scoped>
.em-image-right {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.em-image-right :deep(.slide-logo) {
  position: absolute;
  top: 1.5rem;
  right: 3rem;
}

.em-ir-content {
  padding: 3.5rem 2rem 3rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.em-ir-image {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.em-image-right :deep(.slide-footer) {
  grid-column: 1 / -1;
}
</style>
