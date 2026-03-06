/**
 * 色彩工具函数 - 基于色彩理论的颜色转换和推荐算法
 * 
 * 色彩和谐规则：
 * 1. 互补色 (Complementary): 色轮上相对的颜色 (相差180°)
 * 2. 类似色 (Analogous): 色轮上相邻的颜色 (相差30°)
 * 3. 三色组 (Triadic): 色轮上等距的三种颜色 (相差120°)
 * 4. 分裂互补色 (Split Complementary): 一种颜色与其互补色两侧的颜色
 * 5. 四色组 (Tetradic/Rectangle): 色轮上形成矩形的四种颜色
 * 6. 方形 (Square): 色轮上形成正方形的四种颜色
 */

export interface HSL {
  h: number; // 色相: 0-360
  s: number; // 饱和度: 0-100
  l: number; // 亮度: 0-100
}

export interface ColorHarmony {
  name: string;
  description: string;
  colors: string[];
}

/**
 * 将Hex颜色转换为HSL
 */
export function hexToHSL(hex: string): HSL {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * 将HSL转换为Hex颜色
 */
export function hslToHex(hsl: HSL): string {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * 标准化色相角度到0-360范围
 */
function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

/**
 * 生成互补色配色方案
 * 色轮上相对的颜色 (相差180°)
 */
export function getComplementaryColors(baseColor: string): ColorHarmony {
  const hsl = hexToHSL(baseColor);
  const complementaryH = normalizeHue(hsl.h + 180);
  
  return {
    name: 'Complementary',
    description: '互补色 - 高对比度，视觉冲击力强',
    colors: [
      baseColor,
      hslToHex({ h: complementaryH, s: hsl.s, l: hsl.l })
    ]
  };
}

/**
 * 生成类似色配色方案
 * 色轮上相邻的颜色 (相差30°)
 */
export function getAnalogousColors(baseColor: string): ColorHarmony {
  const hsl = hexToHSL(baseColor);
  
  return {
    name: 'Analogous',
    description: '类似色 - 和谐统一，视觉舒适',
    colors: [
      hslToHex({ h: normalizeHue(hsl.h - 30), s: hsl.s, l: hsl.l }),
      baseColor,
      hslToHex({ h: normalizeHue(hsl.h + 30), s: hsl.s, l: hsl.l })
    ]
  };
}

/**
 * 生成三色组配色方案
 * 色轮上等距的三种颜色 (相差120°)
 */
export function getTriadicColors(baseColor: string): ColorHarmony {
  const hsl = hexToHSL(baseColor);
  
  return {
    name: 'Triadic',
    description: '三色组 - 色彩丰富，平衡和谐',
    colors: [
      baseColor,
      hslToHex({ h: normalizeHue(hsl.h + 120), s: hsl.s, l: hsl.l }),
      hslToHex({ h: normalizeHue(hsl.h + 240), s: hsl.s, l: hsl.l })
    ]
  };
}

/**
 * 生成分裂互补色配色方案
 * 一种颜色与其互补色两侧的颜色
 */
export function getSplitComplementaryColors(baseColor: string): ColorHarmony {
  const hsl = hexToHSL(baseColor);
  const complementaryH = hsl.h + 180;
  
  return {
    name: 'Split Complementary',
    description: '分裂互补色 - 对比强烈但不刺眼',
    colors: [
      baseColor,
      hslToHex({ h: normalizeHue(complementaryH - 30), s: hsl.s, l: hsl.l }),
      hslToHex({ h: normalizeHue(complementaryH + 30), s: hsl.s, l: hsl.l })
    ]
  };
}

/**
 * 生成四色组配色方案 (矩形)
 */
export function getTetradicColors(baseColor: string): ColorHarmony {
  const hsl = hexToHSL(baseColor);
  
  return {
    name: 'Tetradic',
    description: '四色组 - 丰富多彩，需要平衡使用',
    colors: [
      baseColor,
      hslToHex({ h: normalizeHue(hsl.h + 60), s: hsl.s, l: hsl.l }),
      hslToHex({ h: normalizeHue(hsl.h + 180), s: hsl.s, l: hsl.l }),
      hslToHex({ h: normalizeHue(hsl.h + 240), s: hsl.s, l: hsl.l })
    ]
  };
}

/**
 * 生成方形配色方案
 */
export function getSquareColors(baseColor: string): ColorHarmony {
  const hsl = hexToHSL(baseColor);
  
  return {
    name: 'Square',
    description: '方形配色 - 四种颜色均衡分布',
    colors: [
      baseColor,
      hslToHex({ h: normalizeHue(hsl.h + 90), s: hsl.s, l: hsl.l }),
      hslToHex({ h: normalizeHue(hsl.h + 180), s: hsl.s, l: hsl.l }),
      hslToHex({ h: normalizeHue(hsl.h + 270), s: hsl.s, l: hsl.l })
    ]
  };
}

/**
 * 生成单色系配色方案
 */
export function getMonochromaticColors(baseColor: string): ColorHarmony {
  const hsl = hexToHSL(baseColor);
  
  return {
    name: 'Monochromatic',
    description: '单色系 - 简洁优雅，层次分明',
    colors: [
      hslToHex({ h: hsl.h, s: hsl.s, l: Math.max(20, hsl.l - 30) }),
      hslToHex({ h: hsl.h, s: hsl.s, l: Math.max(35, hsl.l - 15) }),
      baseColor,
      hslToHex({ h: hsl.h, s: hsl.s, l: Math.min(80, hsl.l + 15) })
    ]
  };
}

/**
 * 获取所有配色方案
 */
export function getAllColorHarmonies(baseColor: string): ColorHarmony[] {
  return [
    getComplementaryColors(baseColor),
    getAnalogousColors(baseColor),
    getTriadicColors(baseColor),
    getSplitComplementaryColors(baseColor),
    getTetradicColors(baseColor),
    getSquareColors(baseColor),
    getMonochromaticColors(baseColor)
  ];
}

/**
 * 根据色轮上的角度计算颜色
 */
export function getColorFromWheelAngle(angle: number, saturation: number = 80, lightness: number = 50): string {
  return hslToHex({
    h: normalizeHue(angle),
    s: saturation,
    l: lightness
  });
}

/**
 * 计算色轮上的角度对应的颜色坐标
 */
export function getWheelPosition(angle: number, radius: number, centerX: number, centerY: number) {
  const radian = (angle - 90) * (Math.PI / 180);
  return {
    x: centerX + radius * Math.cos(radian),
    y: centerY + radius * Math.sin(radian)
  };
}

/**
 * 从色轮坐标计算角度
 */
export function getAngleFromWheelPosition(x: number, y: number, centerX: number, centerY: number): number {
  const dx = x - centerX;
  const dy = y - centerY;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  angle = angle + 90;
  return normalizeHue(angle);
}

/**
 * 生成色轮的渐变色带
 */
export function generateWheelGradient(): string {
  const stops: string[] = [];
  for (let i = 0; i <= 360; i += 10) {
    const color = hslToHex({ h: i, s: 100, l: 50 });
    stops.push(`${color} ${i}deg`);
  }
  return `conic-gradient(${stops.join(', ')})`;
}
