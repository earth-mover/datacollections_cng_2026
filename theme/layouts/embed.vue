<script setup lang="ts">
import { computed } from 'vue'

// Full-bleed embed layout: no padding, logo, or footer — the slotted content
// (an <iframe> or <video>) fills the entire slide.
//
//   ---
//   layout: embed
//   bg: '#000000'      # optional background color (default black)
//   width: 1440        # optional: render the frame at this logical px width
//                      # and scale it to fit the slide. Use for full web apps
//                      # whose layout looks cramped at the slide's ~980px width.
//   ---
//   <iframe src="https://…" title="…" loading="lazy" allow="fullscreen"></iframe>
const props = withDefaults(defineProps<{
  bg?: string
  width?: number | string
}>(), {
  bg: '#000000',
})

// Slide canvas — matches the theme's slidev config (canvasWidth 980, 16:9).
const CANVAS_W = 980
const CANVAS_H = (CANVAS_W * 9) / 16

// When `width` is given, compute the scale + logical frame size so the frame,
// rendered at `width`px, scales down to exactly fill the 980×551 canvas.
const frame = computed(() => {
  const w = typeof props.width === 'number' ? props.width : parseFloat(String(props.width ?? ''))
  if (!w || w <= 0) return null
  const scale = CANVAS_W / w
  return { w: `${w}px`, h: `${CANVAS_H / scale}px`, scale: String(scale) }
})

const rootStyle = computed(() => {
  const s: Record<string, string> = { background: props.bg }
  if (frame.value) {
    s['--frame-w'] = frame.value.w
    s['--frame-h'] = frame.value.h
    s['--frame-scale'] = frame.value.scale
  }
  return s
})
</script>

<template>
  <div
    class="slidev-layout em-embed"
    :class="{ 'em-embed--scaled': !!frame }"
    :style="rootStyle"
  >
    <slot />
  </div>
</template>

<style scoped>
.em-embed {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0;
  overflow: hidden;
}

/* Default: the embed fills the slide (absolute so it fills regardless of any
   wrapper Slidev puts around slot content). */
.em-embed :deep(iframe),
.em-embed :deep(video) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

/* `width` set: render at the given logical width, then scale to fit the slide. */
.em-embed--scaled :deep(iframe),
.em-embed--scaled :deep(video) {
  inset: auto;
  top: 0;
  left: 0;
  width: var(--frame-w);
  height: var(--frame-h);
  transform: scale(var(--frame-scale));
  transform-origin: top left;
}
</style>
