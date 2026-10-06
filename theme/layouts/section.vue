<template>
  <div class="slidev-layout em-section">
    <SlideLogo />
    <div class="em-section-content">
      <slot />
    </div>
    <SlideFooter />
  </div>
</template>

<style scoped>
.em-section {
  position: relative;
  padding: 3rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.em-section :deep(.slide-logo) {
  position: absolute;
  top: 1.5rem;
  right: 3rem;
}

.em-section-content {
  max-width: 80%;
}

.em-section :deep(h2) {
  font-size: 2.8rem;
  line-height: 1.1;
}
</style>
