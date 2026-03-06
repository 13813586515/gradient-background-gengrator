export interface HSL {
  h: number
  s: number
  l: number
}

export interface RGB {
  r: number
  g: number
  b: number
}

export type HarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'splitComplementary'
  | 'tetradic'
  | 'monochromatic'

export interface ColorRecommendation {
  colors: string[]
  type: HarmonyType
  name: string
}

export function hexToRgb(hex: string): RGB {
  let cleanHex = hex.replace('#', '')
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const r = parseInt(cleanHex.slice(0, 2), 16)
  const g = parseInt(cleanHex.slice(2, 4), 16)
  const b = parseInt(cleanHex.slice(4, 6), 16)
  return { r, g, b }
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h *= 60
  }

  return { h, s: s * 100, l: l * 100 }
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0,
    g = 0,
    b = 0

  if (0 <= h && h < 60) {
    r = c
    g = x
    b = 0
  } else if (60 <= h && h < 120) {
    r = x
    g = c
    b = 0
  } else if (120 <= h && h < 180) {
    r = 0
    g = c
    b = x
  } else if (180 <= h && h < 240) {
    r = 0
    g = x
    b = c
  } else if (240 <= h && h < 300) {
    r = x
    g = 0
    b = c
  } else if (300 <= h && h < 360) {
    r = c
    g = 0
    b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

export function hexToHsl(hex: string): HSL {
  const rgb = hexToRgb(hex)
  return rgbToHsl(rgb.r, rgb.g, rgb.b)
}

export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

function normalizeHue(h: number): number {
  return ((h % 360) + 360) % 360
}

export function getComplementary(hex: string): string {
  const hsl = hexToHsl(hex)
  return hslToHex(normalizeHue(hsl.h + 180), hsl.s, hsl.l)
}

export function getAnalogous(hex: string, angle: number = 30): string[] {
  const hsl = hexToHsl(hex)
  return [
    hslToHex(normalizeHue(hsl.h - angle), hsl.s, hsl.l),
    hex,
    hslToHex(normalizeHue(hsl.h + angle), hsl.s, hsl.l),
  ]
}

export function getTriadic(hex: string): string[] {
  const hsl = hexToHsl(hex)
  return [
    hex,
    hslToHex(normalizeHue(hsl.h + 120), hsl.s, hsl.l),
    hslToHex(normalizeHue(hsl.h + 240), hsl.s, hsl.l),
  ]
}

export function getSplitComplementary(hex: string, angle: number = 30): string[] {
  const hsl = hexToHsl(hex)
  const compHue = normalizeHue(hsl.h + 180)
  return [
    hex,
    hslToHex(normalizeHue(compHue - angle), hsl.s, hsl.l),
    hslToHex(normalizeHue(compHue + angle), hsl.s, hsl.l),
  ]
}

export function getTetradic(hex: string): string[] {
  const hsl = hexToHsl(hex)
  return [
    hex,
    hslToHex(normalizeHue(hsl.h + 90), hsl.s, hsl.l),
    hslToHex(normalizeHue(hsl.h + 180), hsl.s, hsl.l),
    hslToHex(normalizeHue(hsl.h + 270), hsl.s, hsl.l),
  ]
}

export function getMonochromatic(hex: string, count: number = 5): string[] {
  const hsl = hexToHsl(hex)
  const colors: string[] = []
  const lightnessStep = 80 / (count - 1)
  for (let i = 0; i < count; i++) {
    colors.push(hslToHex(hsl.h, hsl.s, Math.max(10, Math.min(90, 10 + i * lightnessStep))))
  }
  return colors
}

export function getAllRecommendations(hex: string): ColorRecommendation[] {
  return [
    {
      type: 'complementary',
      name: '互补色',
      colors: [hex, getComplementary(hex)],
    },
    {
      type: 'analogous',
      name: '类似色',
      colors: getAnalogous(hex),
    },
    {
      type: 'triadic',
      name: '三元色',
      colors: getTriadic(hex),
    },
    {
      type: 'splitComplementary',
      name: '分裂互补色',
      colors: getSplitComplementary(hex),
    },
    {
      type: 'tetradic',
      name: '四元色',
      colors: getTetradic(hex),
    },
    {
      type: 'monochromatic',
      name: '同色系',
      colors: getMonochromatic(hex, 4),
    },
  ]
}

export function getBestRecommendations(hex: string): ColorRecommendation[] {
  const all = getAllRecommendations(hex)
  return [
    all[0],
    all[1],
    all[4],
  ]
}
