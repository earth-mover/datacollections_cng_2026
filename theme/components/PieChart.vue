<script setup lang="ts">
import { EM_PALETTE, cssVar, withAlpha, EM_FONT } from './emChart'
import { useEmChart } from './useEmChart'

const props = withDefaults(defineProps<{
  categories: string[]
  series: number[]
  title?: string
  unit?: string         // appended to slice labels, e.g. "%"
  height?: number | string
  donut?: boolean
  showLegend?: boolean
  colors?: string[]
}>(), {
  height: 320,
  donut: false,
  showLegend: false,
})

function build() {
  const text = cssVar('--em-text', '#201F2C')
  const midnight = cssVar('--em-midnight', '#201F2C')
  const palette = props.colors && props.colors.length ? props.colors : EM_PALETTE
  const unit = props.unit ?? ''
  return {
    color: palette,
    animation: false, // deterministic for PDF export
    textStyle: { fontFamily: EM_FONT, color: text },
    title: props.title
      ? {
          text: props.title,
          left: 'center',
          textStyle: {
            fontFamily: EM_FONT,
            fontWeight: 400,
            fontSize: 18,
            color: cssVar('--em-heading', '#201F2C'),
          },
        }
      : undefined,
    tooltip: {
      trigger: 'item',
      backgroundColor: midnight,
      borderWidth: 0,
      textStyle: { color: '#F5F5F5', fontFamily: EM_FONT },
      valueFormatter: (v: number) => `${v}${unit}`,
    },
    legend: props.showLegend
      ? { bottom: 0, textStyle: { color: text, fontFamily: EM_FONT }, icon: 'roundRect' }
      : undefined,
    series: [
      {
        type: 'pie',
        radius: props.donut ? ['45%', '72%'] : '72%',
        top: props.title ? 24 : 0,
        bottom: props.showLegend ? 28 : 0,
        data: props.categories.map((name, i) => ({ name, value: props.series[i] })),
        itemStyle: {
          borderColor: cssVar('--em-bg', '#FFFFFF'),
          borderWidth: 2,
        },
        label: {
          formatter: `{b}\n{c}${unit}`,
          color: text,
          fontFamily: EM_FONT,
          fontSize: 12,
          lineHeight: 16,
        },
        labelLine: { lineStyle: { color: withAlpha(text, 0.4) } },
      },
    ],
  }
}

const { el } = useEmChart(build, () => props)
const h = typeof props.height === 'number' ? `${props.height}px` : props.height
</script>

<template>
  <div ref="el" class="em-chart" :style="{ height: h, width: '100%' }" />
</template>
