export interface ColorResult {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export interface ContrastResult {
  ratio: number;
  level: {
    AA: { normal: boolean; large: boolean };
    AAA: { normal: boolean; large: boolean };
  };
  grade: 'fail' | 'AA' | 'AAA';
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }): number {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function checkWCAGCompliance(ratio: number): ContrastResult['level'] {
  return {
    AA: {
      normal: ratio >= 4.5,
      large: ratio >= 3.0
    },
    AAA: {
      normal: ratio >= 7.0,
      large: ratio >= 4.5
    }
  };
}

export function getContrastGrade(ratio: number): ContrastResult['grade'] {
  if (ratio >= 7.0) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'fail';
}

export function analyzeContrast(foreground: ColorResult, background: ColorResult): ContrastResult {
  const ratio = getContrastRatio(foreground.rgb, background.rgb);
  const level = checkWCAGCompliance(ratio);
  const grade = getContrastGrade(ratio);

  return { ratio, level, grade };
}

export function suggestImprovements(foreground: ColorResult, background: ColorResult): {
  foreground: ColorResult[];
  background: ColorResult[];
} {
  const suggestions = {
    foreground: [] as ColorResult[],
    background: [] as ColorResult[]
  };

  // Suggest lighter/darker variations of current colors
  const { l: fgL } = foreground.hsl;
  const { l: bgL } = background.hsl;

  // For foreground: suggest lighter if background is dark, darker if background is light
  if (bgL < 50) {
    // Background is dark, suggest lighter foreground
    for (let l = Math.min(100, fgL + 20); l <= 100; l += 20) {
      const rgb = hslToRgb(foreground.hsl.h, foreground.hsl.s, l);
      suggestions.foreground.push({
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb,
        hsl: { ...foreground.hsl, l }
      });
    }
  } else {
    // Background is light, suggest darker foreground
    for (let l = Math.max(0, fgL - 20); l >= 0; l -= 20) {
      const rgb = hslToRgb(foreground.hsl.h, foreground.hsl.s, l);
      suggestions.foreground.push({
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb,
        hsl: { ...foreground.hsl, l }
      });
    }
  }

  // For background: suggest variations
  for (let l = Math.max(0, bgL - 20); l <= Math.min(100, bgL + 20); l += 20) {
    if (l !== bgL) {
      const rgb = hslToRgb(background.hsl.h, background.hsl.s, l);
      suggestions.background.push({
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb,
        hsl: { ...background.hsl, l }
      });
    }
  }

  return suggestions;
}

export function getRandomColor(): ColorResult {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  
  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    hsl: rgbToHsl(r, g, b)
  };
}

export function getComplementaryColor(color: ColorResult): ColorResult {
  const { h, s, l } = color.hsl;
  const complementaryH = (h + 180) % 360;
  const rgb = hslToRgb(complementaryH, s, l);
  
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb,
    hsl: { h: complementaryH, s, l }
  };
}

export function getAnalogousColors(color: ColorResult): ColorResult[] {
  const { h, s, l } = color.hsl;
  const colors: ColorResult[] = [];
  
  for (let offset of [-30, 30]) {
    const newH = (h + offset + 360) % 360;
    const rgb = hslToRgb(newH, s, l);
    colors.push({
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb,
      hsl: { h: newH, s, l }
    });
  }
  
  return colors;
}

export function getTriadicColors(color: ColorResult): ColorResult[] {
  const { h, s, l } = color.hsl;
  const colors: ColorResult[] = [];
  
  for (let offset of [120, 240]) {
    const newH = (h + offset) % 360;
    const rgb = hslToRgb(newH, s, l);
    colors.push({
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb,
      hsl: { h: newH, s, l }
    });
  }
  
  return colors;
}
