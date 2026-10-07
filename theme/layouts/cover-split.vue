<script setup lang="ts">
// Joint Earthmover / Development Seed cover: left half in Earthmover colours,
// right half in DevSeed orange. Default slot = left content (title etc.),
// `::right::` slot = optional right content, `::center::` slot = content
// centred across both halves (e.g. a closing question). Speaker names sit at the bottom
// of each half, aligned.
withDefaults(defineProps<{
  leftSpeaker?: string
  rightSpeaker?: string
  leftAvatar?: string
  rightAvatar?: string
}>(), {
  leftSpeaker: '',
  rightSpeaker: '',
  leftAvatar: '',
  rightAvatar: '',
})
</script>

<template>
  <div class="slidev-layout cover-split">
    <div class="cs-half cs-left">
      <img src="/brand-kit/Earthmover-Brand-Identity-Assets/02 Earthmover Full Lockup/03 Vector - RGB - SVG/02-Earthmover-Full-Lockup-Violet-RGB.svg" alt="Earthmover" class="cs-logo" />
      <div class="cs-body">
        <slot />
      </div>
      <div class="cs-speaker">
        <img v-if="leftAvatar" :src="leftAvatar" alt="" class="cs-avatar" />
        <span>{{ leftSpeaker }}</span>
      </div>
    </div>
    <div class="cs-half cs-right">
      <img src="/devseed/devseed-logo-white.svg" alt="Development Seed" class="cs-logo" />
      <div class="cs-body">
        <slot name="right" />
      </div>
      <div class="cs-speaker">
        <img v-if="rightAvatar" :src="rightAvatar" alt="" class="cs-avatar" />
        <span>{{ rightSpeaker }}</span>
      </div>
    </div>
    <div v-if="$slots.center" class="cs-center">
      <slot name="center" />
    </div>
  </div>
</template>

<style scoped>
.cover-split {
  position: relative;
  height: 100%;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.cs-half {
  display: flex;
  flex-direction: column;
  padding: 2.5rem 3rem;
  min-width: 0;
}

.cs-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cs-logo {
  display: block;
  height: 2rem;
  width: auto;
  align-self: flex-start;
}

.cs-speaker {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.cs-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.cs-left .cs-avatar {
  border: 2px solid var(--em-violet, #A653FF);
}

.cs-right .cs-avatar {
  border: 2px solid #fff;
}

/* Left: Earthmover (inherits the theme background and typography) */
.cs-left :deep(h2) {
  font-size: 2.8rem;
  line-height: 1.1;
}

.cs-left :deep(p) {
  font-size: 1.05rem;
  color: var(--em-muted);
}

.cs-left .cs-speaker {
  color: var(--em-heading);
}

/* Right: Development Seed */
.cs-right {
  background: var(--ds-orange);
  color: #fff;
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.cs-right .cs-logo {
  height: 1.6rem;
  margin-top: 0.2rem;
}

.cs-right .cs-speaker {
  font-weight: 700;
}

.cs-right :deep(h2),
.cs-right :deep(p) {
  color: #fff;
  font-weight: 900;
  text-transform: none;
}

.cs-right :deep(strong) {
  color: var(--ds-dark);
}

/* Optional `::center::` slot: content centred across both halves */
.cs-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
</style>
