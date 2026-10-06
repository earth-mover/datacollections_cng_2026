<script setup lang="ts">
import { baseOption, normalizeSeries, cssVar, EM_FONT } from './emChart'
import { useEmChart } from './useEmChart'

const props = withDefaults(defineProps<{
  categories: string[]
  series: any           // number[] | number[][] | { name, data }[]
  title?: string
  unit?: string         // value-axis label
  catUnit?: string      // category-axis label
  height?: number | string
  horizontal?: boolean
  stack?: boolean
  showLabel?: boolean
  colors?: string[]
  markLines?: { value: number; label?: string }[]  // reference lines on the value axis
}>(), {
  height: 320,
  horizontal: false,
  stack: false,
  showLabel: false,
})

function build() {
  const series = normalizeSeries(props.series)
  const showLegend = series.length > 1 && series.some((s) => !!s.name)
  const base = baseOption({
    title: props.title,
    categories: props.categories,
    unit: props.unit,
    catUnit: props.catUnit,
    horizontal: props.horizontal,
    showLegend,
    colors: props.colors,
  })
  const radius = props.horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]
  const markLine = props.markLines?.length
    ? {
        silent: true,
        symbol: 'none',
        lineStyle: {
          color: cssVar('--em-muted', '#787878'),
          type: 'dashed',
          width: 1.5,
        },
        label: {
          color: cssVar('--em-text', '#201F2C'),
          fontFamily: EM_FONT,
          fontSize: 11,
          formatter: (p: any) => p.name || '',
          position: props.horizontal ? 'insideStartTop' : 'insideEndTop',
        },
        data: props.markLines.map((m) =>
          props.horizontal
            ? { xAxis: m.value, name: m.label }
            : { yAxis: m.value, name: m.label },
        ),
      }
    : undefined
  return {
    ...base,
    series: series.map((s, i) => ({
      type: 'bar',
      name: s.name,
      data: s.data,
      stack: props.stack ? 'total' : undefined,
      markLine: i === 0 ? markLine : undefined,
      barMaxWidth: 48,
      itemStyle: { borderRadius: props.stack ? 0 : radius },
      label: props.showLabel
        ? {
            show: true,
            position: props.horizontal ? 'right' : 'top',
            color: cssVar('--em-text', '#201F2C'),
            fontFamily: EM_FONT,
            fontSize: 12,
          }
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
