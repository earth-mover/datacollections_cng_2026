<template>
  <div class="slidev-layout em-three-col-header">
    <SlideLogo />
    <div class="em-three-col-header-top">
      <slot />
    </div>
    <div class="em-three-col-header-grid">
      <div class="em-col-left">
        <slot name="left" />
      </div>
      <div class="em-col-center">
        <slot name="center" />
      </div>
      <div class="em-col-right">
        <slot name="right" />
      </div>
    </div>
    <SlideFooter />
  </div>
</template>

<style scoped>
.em-three-col-header {
  position: relative;
  padding: 3.5rem 3rem 3rem 3rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.em-three-col-header :deep(.slide-logo) {
  position: absolute;
  top: 1.5rem;
  right: 3rem;
}

.em-three-col-header-top {
  margin-bottom: 0.5rem;
}

.em-three-col-header-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  padding-top: 0.5rem;
  overflow: hidden;
}

.em-col-left,
.em-col-center,
.em-col-right {
  overflow: hidden;
}
</style>
