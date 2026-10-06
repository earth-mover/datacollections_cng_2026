<script setup lang="ts">
import { baseOption, normalizeSeries, withAlpha, EM_PALETTE } from './emChart'
import { useEmChart } from './useEmChart'

const props = withDefaults(defineProps<{
  categories: string[]
  series: any           // number[] | number[][] | { name, data }[]
  title?: string
  unit?: string         // value-axis label
  height?: number | string
  smooth?: boolean
  area?: boolean
  showSymbol?: boolean
  colors?: string[]
}>(), {
  height: 320,
  smooth: true,
  area: false,
  showSymbol: true,
})

function build() {
  const series = normalizeSeries(props.series)
  const showLegend = series.length > 1 && series.some((s) => !!s.name)
  const palette = props.colors && props.colors.length ? props.colors : EM_PALETTE
  const base = baseOption({
    title: props.title,
    categories: props.categories,
    unit: props.unit,
    showLegend,
    colors: props.colors,
  })
  return {
    ...base,
    series: series.map((s, i) => ({
      type: 'line',
      name: s.name,
      data: s.data,
      smooth: props.smooth,
      showSymbol: props.showSymbol,
      symbolSize: 7,
      lineStyle: { width: 3 },
      areaStyle: props.area
        ? { color: withAlpha(palette[i % palette.length], 0.15) }
        : undefined,
    })),
  }
}

const { el } = useEmChart(build, () => props)
const h = typeof props.height === 'number' ? `${props.height}px` : props.height
</script>

<template>
  <div ref="el" class="em-chart" :style="{ height: h, width: '100%' }" />
</template>
