// Lifecycle helper: init an ECharts instance on a div, re-render on prop
// changes, resize with its container, and dispose on unmount.
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'

export function useEmChart(buildOption: () => any, deps: () => unknown) {
  const el = ref<HTMLElement | null>(null)
  let chart: echarts.ECharts | null = null
  let ro: ResizeObserver | null = null

  const render = () => chart && chart.setOption(buildOption(), true)

  onMounted(() => {
    if (!el.value) return
    chart = echarts.init(el.value)
    render()
    ro = new ResizeObserver(() => chart && chart.resize())
    ro.observe(el.value)
  })

  watch(deps, () => render(), { deep: true })

  onBeforeUnmount(() => {
    ro?.disconnect()
    chart?.dispose()
    chart = null
  })

  return { el }
}
