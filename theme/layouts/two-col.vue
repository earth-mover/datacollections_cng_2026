<template>
  <div class="slidev-layout em-two-col">
    <SlideLogo />
    <div class="em-two-col-grid">
      <div class="em-col-left">
        <slot name="default" />
      </div>
      <div class="em-col-right">
        <slot name="right" />
      </div>
    </div>
    <SlideFooter />
  </div>
</template>

<style scoped>
.em-two-col {
  position: relative;
  padding: 3.5rem 3rem 3rem 3rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.em-two-col :deep(.slide-logo) {
  position: absolute;
  top: 1.5rem;
  right: 3rem;
}

.em-two-col-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding-top: 1rem;
  overflow: hidden;
}

.em-col-left,
.em-col-right {
  overflow: hidden;
}
</style>
