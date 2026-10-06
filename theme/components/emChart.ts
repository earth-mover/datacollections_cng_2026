// Shared Earthmover chart theming for the BarChart / LineChart components.
// Colors come from brand-tokens.yaml; text/axis colors read the live CSS
// custom properties so charts adapt automatically to light/dark slides.

export const EM_FONT =
  "'ABC Diatype Rounded', 'Helvetica Neue', Helvetica, sans-serif"

// Series color order (brand palette). Violet and lime lead; secondaries follow.
export const EM_PALETTE = [
  '#A653FF', // violet
  '#B7E400', // lime
  '#5EC4F7', // blue
  '#FF9E0D', // orange
  '#31D495', // green
  '#F881D1', // pink
  '#FF6554', // red
  '#6D0EDB', // dark violet
]

/** Read a CSS custom property off :root, with a fallback. */
export function cssVar(name: string, fallback: string): string {
  try {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim()
    return v || fallback
  } catch {
    return fallback
  }
}

/** Hex (#rgb / #rrggbb) → rgba() string with the given alpha. */
export function withAlpha(hex: string, alpha: number): string {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export interface SeriesInput {
  name?: string
  data: number[]
}

/**
 * Normalize the many shapes a user might pass into a consistent
 * { name, data[] }[] array.
 *   - [1, 2, 3]                       → one unnamed series
 *   - [[1,2],[3,4]]                   → multiple unnamed series
 *   - [{ name, data }]               → passed through
 *   - { data: [...] } / single obj   → wrapped
 */
export function normalizeSeries(series: any): SeriesInput[] {
  if (series == null) return []
  if (!Array.isArray(series)) return [series as SeriesInput]
  if (series.length === 0) return []
  // Array of numbers → single series
  if (typeof series[0] === 'number') return [{ data: series as number[] }]
  // Array of number[] → multiple unnamed series
  if (Array.isArray(series[0])) return (series as number[][]).map((data) => ({ data }))
  // Array of { name, data }
  return series as SeriesInput[]
}

/** Common option scaffolding shared by bar + line charts. */
export function baseOption(opts: {
  title?: string
  categories: string[]
  unit?: string
  catUnit?: string
  horizontal?: boolean
  showLegend: boolean
  colors?: string[]
}) {
  const text = cssVar('--em-text', '#201F2C')
  const muted = cssVar('--em-muted', '#787878')
  const midnight = cssVar('--em-midnight', '#201F2C')
  const split = withAlpha(muted, 0.18)
  const palette = opts.colors && opts.colors.length ? opts.colors : EM_PALETTE

  // Distance from the axis to its name must clear the tick labels, whose
  // width (horizontal charts) depends on the longest category string.
  const maxCatLen = Math.max(0, ...opts.categories.map((c) => String(c).length))
  const catAxis = {
    type: 'category' as const,
    data: opts.categories,
    name: opts.catUnit,
    nameLocation: 'middle' as const,
    nameGap: opts.horizontal ? maxCatLen * 7 + 16 : 30,
    nameRotate: opts.horizontal ? 90 : 0,
    nameTextStyle: { color: muted, fontFamily: EM_FONT, fontSize: 12 },
    axisLine: { lineStyle: { color: withAlpha(muted, 0.5) } },
    axisTick: { show: false },
    axisLabel: { color: text, fontFamily: EM_FONT, fontSize: 13 },
  }
  const valName = !!opts.unit
  const catName = !!opts.catUnit
  const valAxis = {
    type: 'value' as const,
    name: opts.unit,
    nameLocation: 'middle' as const,
    nameGap: opts.horizontal ? 26 : 40,
    nameTextStyle: { color: muted, fontFamily: EM_FONT, fontSize: 12 },
    axisLabel: { color: muted, fontFamily: EM_FONT, fontSize: 12 },
    splitLine: { lineStyle: { color: split } },
  }

  return {
    color: palette,
    animation: false, // deterministic for PDF export
    textStyle: { fontFamily: EM_FONT, color: text },
    title: opts.title
      ? {
          text: opts.title,
          left: 'center',
          textStyle: {
            fontFamily: EM_FONT,
            fontWeight: 400,
            fontSize: 18,
            color: cssVar('--em-heading', '#201F2C'),
          },
        }
      : undefined,
    grid: {
      // Reserve room for the centered axis name (containLabel covers tick
      // labels but not the axis name).
      left:
        (valName && !opts.horizontal ? 40 : 12) +
        (catName && opts.horizontal ? 18 : 0),
      right: 18,
      top: opts.title ? 48 : 18,
      bottom:
        (opts.showLegend ? 36 : 10) +
        (valName && opts.horizontal ? 22 : 0) +
        (catName && !opts.horizontal ? 22 : 0),
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: midnight,
      borderWidth: 0,
      textStyle: { color: '#F5F5F5', fontFamily: EM_FONT },
      axisPointer: { type: opts.horizontal ? 'line' : 'shadow' },
    },
    legend: opts.showLegend
      ? { bottom: 0, textStyle: { color: text, fontFamily: EM_FONT }, icon: 'roundRect' }
      : undefined,
    xAxis: opts.horizontal ? valAxis : catAxis,
    yAxis: opts.horizontal ? catAxis : valAxis,
  }
}
