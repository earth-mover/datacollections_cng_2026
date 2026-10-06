<template>
  <div class="slidev-layout em-default">
    <SlideLogo />
    <div class="em-content">
      <slot />
    </div>
    <SlideFooter />
  </div>
</template>

<style scoped>
.em-default {
  position: relative;
  padding: 3.5rem 3rem 3rem 3rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.em-content {
  flex: 1;
  padding-top: 1rem;
  overflow: visible;
}

.em-default :deep(.slide-logo) {
  position: absolute;
  top: 1.5rem;
  right: 3rem;
}
</style>
