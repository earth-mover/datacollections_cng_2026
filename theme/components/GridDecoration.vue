<script setup lang="ts">
withDefaults(defineProps<{
  position?: 'bottom-left' | 'bottom-right' | 'top-right'
  size?: number
  opacity?: number
}>(), {
  position: 'bottom-left',
  size: 120,
  opacity: 1,
})
</script>

<template>
  <div
    class="grid-decoration"
    :class="position"
    :style="{ opacity, width: size + 'px', height: size + 'px' }"
  >
    <!-- 5x8 dot grid matching the Earthmover brand grid square pattern -->
    <svg viewBox="0 0 100 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <template v-for="row in 8" :key="'r' + row">
        <circle
          v-for="col in 5"
          :key="'c' + col"
          :cx="(col - 1) * 25"
          :cy="(row - 1) * 22.86"
          r="3"
          fill="currentColor"
        />
      </template>
    </svg>
  </div>
</template>

<style scoped>
.grid-decoration {
  position: absolute;
  color: var(--em-accent);
  pointer-events: none;
}

.bottom-left {
  bottom: 3rem;
  left: 3rem;
}

.bottom-right {
  bottom: 3rem;
  right: 3rem;
}

.top-right {
  top: 3rem;
  right: 3rem;
}
</style>
