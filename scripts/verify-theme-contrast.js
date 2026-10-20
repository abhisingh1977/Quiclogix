// Automated WCAG 2.2 AA Color Contrast & Theme Token Validator
// Tests all text-to-background combinations in both Light and Dark themes

function hexToRgb(hex) {
  let c = hex.replace('#', '')
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('')
  }
  const num = parseInt(c, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  }
}

function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map(v => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function contrastRatio(hex1, hex2) {
  const lum1 = relativeLuminance(hexToRgb(hex1))
  const lum2 = relativeLuminance(hexToRgb(hex2))
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

const lightTokens = {
  bgPrimary: '#F8F6F1',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F0ECE1',
  textPrimary: '#111613',
  textSecondary: '#424D46',
  textMuted: '#59675F',
  accentText: '#7A5B00',
  success: '#1E6B47',
  warning: '#A36200',
  error: '#B53630',
  border: '#E5DFD1'
}

const darkTokens = {
  bgPrimary: '#0D1913',
  bgSurface: '#14251D',
  bgSubtle: '#1C3328',
  textPrimary: '#F4F1EA',
  textSecondary: '#C5D0C9',
  textMuted: '#9BA8A0',
  accentText: '#E4C558',
  accent: '#D8B437',
  success: '#4CAF50',
  warning: '#E4C558',
  error: '#EF5350',
  border: '#233D30',
  footerBg: '#0E1012',
  footerText: '#F4F1EA',
  footerMuted: '#9BA8A0',
  footerSecondary: '#C5D0C9'
}

console.log('=== QUICLOGIX THEME CONTRAST AUDIT (WCAG 2.2 AA) ===\n')

const testPairs = [
  // Light Mode
  { theme: 'LIGHT', name: 'Primary Text on Warm Stone Page Bg', fg: lightTokens.textPrimary, bg: lightTokens.bgPrimary, req: 4.5 },
  { theme: 'LIGHT', name: 'Primary Text on White Surface Card', fg: lightTokens.textPrimary, bg: lightTokens.bgSurface, req: 4.5 },
  { theme: 'LIGHT', name: 'Secondary Text on Warm Stone Page Bg', fg: lightTokens.textSecondary, bg: lightTokens.bgPrimary, req: 4.5 },
  { theme: 'LIGHT', name: 'Secondary Text on White Surface Card', fg: lightTokens.textSecondary, bg: lightTokens.bgSurface, req: 4.5 },
  { theme: 'LIGHT', name: 'Muted Text / Placeholder on White Card', fg: lightTokens.textMuted, bg: lightTokens.bgSurface, req: 4.5 },
  { theme: 'LIGHT', name: 'Muted Text on Warm Stone Page Bg', fg: lightTokens.textMuted, bg: lightTokens.bgPrimary, req: 4.5 },
  { theme: 'LIGHT', name: 'Gold Accent Text on White Surface Card', fg: lightTokens.accentText, bg: lightTokens.bgSurface, req: 4.5 },
  { theme: 'LIGHT', name: 'Gold Accent Text on Warm Stone Page Bg', fg: lightTokens.accentText, bg: lightTokens.bgPrimary, req: 4.5 },
  { theme: 'LIGHT', name: 'Gold Accent Text on Subtle Bg', fg: lightTokens.accentText, bg: lightTokens.bgSubtle, req: 4.5 },
  { theme: 'LIGHT', name: 'Success Badge on White Card', fg: lightTokens.success, bg: lightTokens.bgSurface, req: 4.5 },
  { theme: 'LIGHT', name: 'Warning Badge on White Card', fg: lightTokens.warning, bg: lightTokens.bgSurface, req: 4.5 },
  { theme: 'LIGHT', name: 'Error Message on White Card', fg: lightTokens.error, bg: lightTokens.bgSurface, req: 4.5 },
  { theme: 'LIGHT', name: 'Secondary Button Text on White Card', fg: lightTokens.textPrimary, bg: lightTokens.bgSurface, req: 4.5 },
  { theme: 'LIGHT', name: 'Navbar Link on Warm Stone Bg', fg: lightTokens.textSecondary, bg: lightTokens.bgPrimary, req: 4.5 },
  
  // Dark Mode
  { theme: 'DARK', name: 'Primary Text on Forest Page Bg', fg: darkTokens.textPrimary, bg: darkTokens.bgPrimary, req: 4.5 },
  { theme: 'DARK', name: 'Primary Text on Forest Surface Card', fg: darkTokens.textPrimary, bg: darkTokens.bgSurface, req: 4.5 },
  { theme: 'DARK', name: 'Secondary Text on Forest Page Bg', fg: darkTokens.textSecondary, bg: darkTokens.bgPrimary, req: 4.5 },
  { theme: 'DARK', name: 'Secondary Text on Forest Surface Card', fg: darkTokens.textSecondary, bg: darkTokens.bgSurface, req: 4.5 },
  { theme: 'DARK', name: 'Muted Text / Placeholder on Forest Surface', fg: darkTokens.textMuted, bg: darkTokens.bgSurface, req: 4.5 },
  { theme: 'DARK', name: 'Gold Accent Text on Forest Surface Card', fg: darkTokens.accentText, bg: darkTokens.bgSurface, req: 4.5 },
  { theme: 'DARK', name: 'Gold Accent Text on Forest Page Bg', fg: darkTokens.accentText, bg: darkTokens.bgPrimary, req: 4.5 },
  { theme: 'DARK', name: 'Primary Button Text (Dark Ink on Gold)', fg: '#111613', bg: darkTokens.accent, req: 4.5 },
  { theme: 'DARK', name: 'Success Badge on Forest Surface', fg: darkTokens.success, bg: darkTokens.bgSurface, req: 4.5 },
  { theme: 'DARK', name: 'Warning Badge on Forest Surface', fg: darkTokens.warning, bg: darkTokens.bgSurface, req: 4.5 },
  { theme: 'DARK', name: 'Error Badge on Forest Surface', fg: darkTokens.error, bg: darkTokens.bgSurface, req: 4.5 },
  { theme: 'DARK', name: 'Navbar Link on Forest Page Bg', fg: darkTokens.textSecondary, bg: darkTokens.bgPrimary, req: 4.5 },

  // Footer (Shared / Dark)
  { theme: 'FOOTER', name: 'Footer Body on Dark Footer Surface', fg: darkTokens.footerSecondary, bg: darkTokens.footerBg, req: 4.5 },
  { theme: 'FOOTER', name: 'Footer Muted Meta on Dark Footer Surface', fg: darkTokens.footerMuted, bg: darkTokens.footerBg, req: 4.5 },
  { theme: 'FOOTER', name: 'Footer Gold Notice on Dark Footer Surface', fg: darkTokens.accentText, bg: darkTokens.footerBg, req: 4.5 }
]

let passed = 0
let failed = 0

for (const pair of testPairs) {
  const ratio = contrastRatio(pair.fg, pair.bg)
  const ok = ratio >= pair.req
  if (ok) passed++
  else failed++
  const status = ok ? 'PASS' : 'FAIL'
  console.log(`[${status}] [${pair.theme}] ${pair.name}`)
  console.log(`       FG: ${pair.fg} | BG: ${pair.bg} | Ratio: ${ratio.toFixed(2)}:1 (Min: ${pair.req}:1)\n`)
}

console.log(`Summary: ${passed} passed, ${failed} failed out of ${testPairs.length} checks.`)
if (failed > 0) process.exit(1)
