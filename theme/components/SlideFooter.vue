<script setup lang="ts">
import { computed } from 'vue'
import { configs } from '@slidev/client'

const props = withDefaults(defineProps<{
  confidential?: boolean
}>(), {
  confidential: true,
})

// A deck can opt out of the watermark via headmatter:
//   themeConfig:
//     confidential: false
const showConfidential = computed(
  () => props.confidential && configs.themeConfig?.confidential !== false,
)
</script>

<template>
  <div class="slide-footer">
    <span class="footer-left">EARTHMOVER.IO</span>
    <span v-if="showConfidential" class="footer-center">CONFIDENTIAL AND PRIVILEGED</span>
    <span class="footer-right"><slot /></span>
  </div>
</template>

<style scoped>
.slide-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 0 3rem 1.5rem 3rem;
  font-family: 'ABC Diatype Rounded', 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  color: var(--em-muted);
}

.footer-left {
  flex: 0 0 auto;
}

.footer-center {
  flex: 1;
  text-align: center;
}

.footer-right {
  flex: 0 0 auto;
}
</style>
