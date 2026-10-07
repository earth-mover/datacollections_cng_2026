<!--
Joint Earthmover / Development Seed content slide, the two-col-header
counterpart to cover-split: the left half is an Earthmover slide (header via the
default slot, then `::left::`), the right half is full-bleed DevSeed orange
holding `::right::`.
-->
<template>
  <div class="slidev-layout two-col-split">
    <div class="tcs-half tcs-left">
      <SlideLogo />
      <div class="tcs-top">
        <slot />
      </div>
      <div class="tcs-body">
        <slot name="left" />
      </div>
      <SlideFooter />
    </div>
    <div class="tcs-half tcs-right">
      <img src="/devseed/devseed-logo-white.svg" alt="Development Seed" class="tcs-ds-logo" />
      <div class="tcs-body tcs-right-body">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.two-col-split {
  height: 100%;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.tcs-half {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

/* Left: Earthmover (inherits the theme background and typography) */
.tcs-left {
  padding: 3.5rem 2.5rem 3rem 3rem;
}

.tcs-left :deep(.slide-logo) {
  position: absolute;
  top: 1.5rem;
  right: 2.5rem;
}

.tcs-top {
  padding-top: 1rem;
}

.tcs-body {
  flex: 1;
  min-height: 0;
}

/* Right: Development Seed */
.tcs-right {
  padding: 2.25rem 2.5rem 2rem;
  background: var(--ds-orange);
  color: #fff;
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.tcs-ds-logo {
  height: 1.4rem;
  width: auto;
  align-self: flex-end;
}

.tcs-right-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
