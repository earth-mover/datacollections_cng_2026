<template>
  <div class="slidev-layout em-end">
    <div class="em-end-content">
      <img src="/brand-kit/Earthmover-Brand-Identity-Assets/02 Earthmover Full Lockup/03 Vector - RGB - SVG/02-Earthmover-Full-Lockup-Violet-RGB.svg" alt="Earthmover" class="em-end-lockup" />
      <slot />
    </div>
    <SlideFooter />
  </div>
</template>

<style scoped>
.em-end {
  position: relative;
  padding: 3rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.em-end-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.em-end-lockup {
  height: 6rem;
  width: auto;
}

.em-end :deep(p) {
  color: var(--em-muted);
  font-size: 1rem;
}

.em-end :deep(a) {
  color: var(--em-accent);
}
</style>
