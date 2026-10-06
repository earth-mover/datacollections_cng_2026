<template>
  <div class="slidev-layout em-quote">
    <SlideLogo />
    <div class="em-quote-content">
      <slot />
    </div>
    <SlideFooter />
  </div>
</template>

<style scoped>
.em-quote {
  position: relative;
  padding: 3rem 4rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.em-quote :deep(.slide-logo) {
  position: absolute;
  top: 1.5rem;
  right: 3rem;
}

.em-quote-content {
  max-width: 85%;
}

/* Style blockquotes as big pull quotes */
.em-quote :deep(blockquote) {
  border-left: 4px solid var(--em-accent);
  padding-left: 1.5rem;
  margin: 0;
  font-style: normal;
  color: var(--em-heading);
}

.em-quote :deep(blockquote p) {
  font-size: 1.8rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: var(--em-heading);
}

/* Attribution: last paragraph after blockquote */
.em-quote :deep(blockquote + p) {
  font-size: 0.9rem;
  color: var(--em-muted);
  margin-top: 1rem;
}
</style>
