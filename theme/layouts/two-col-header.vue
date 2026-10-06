<template>
  <div class="slidev-layout em-two-col-header">
    <SlideLogo />
    <div class="em-two-col-header-top">
      <slot />
    </div>
    <div class="em-two-col-header-grid">
      <div class="em-col-left">
        <slot name="left" />
      </div>
      <div class="em-col-right">
        <slot name="right" />
      </div>
    </div>
    <SlideFooter />
  </div>
</template>

<style scoped>
.em-two-col-header {
  position: relative;
  padding: 3.5rem 3rem 3rem 3rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.em-two-col-header :deep(.slide-logo) {
  position: absolute;
  top: 1.5rem;
  right: 3rem;
}

.em-two-col-header-top {
  /* Match two-col exactly: same 1rem top offset as two-col's grid padding-top,
     and NO extra bottom spacing — the gap below the header comes only from the
     heading's own margin-bottom, just like two-col's single-flow left column. */
  padding-top: 1rem;
}

.em-two-col-header-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  overflow: hidden;
}

.em-col-left,
.em-col-right {
  overflow: hidden;
}
</style>
