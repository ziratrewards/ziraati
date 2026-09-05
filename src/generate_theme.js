const fs = require('fs');

const config = {
  colors: { "status-danger": "#E10514", "tertiary": "#735c00", "inverse-primary": "#ffb4aa", "surface-canvas": "#F8F9FA", "brand-red-subtle": "#FDE8E9", "status-success-subtle": "#EBF6EE", "outline": "#936e69", "text-primary": "#1E1E1E", "on-tertiary-fixed": "#241a00", "secondary-fixed-dim": "#c8c6c5", "surface-tint": "#c0000e", "text-muted": "#9CA3AF", "secondary-fixed": "#e5e2e1", "on-secondary": "#ffffff", "on-primary-container": "#fff2f0", "error": "#ba1a1a", "on-tertiary-container": "#4f3e00", "text-secondary": "#5F6368", "tertiary-container": "#cca730", "on-secondary-fixed": "#1b1b1c", "accent-gold": "#D4AF37", "on-surface": "#181c20", "primary": "#b3000c", "error-container": "#ffdad6", "tertiary-fixed-dim": "#e9c349", "accent-gold-light": "#FFF9E6", "surface-container-highest": "#dfe3e8", "inverse-on-surface": "#eef1f7", "status-warning": "#D97706", "surface-variant": "#dfe3e8", "primary-fixed-dim": "#ffb4aa", "surface-container-high": "#e5e8ee", "surface-dim": "#d7dae0", "on-primary-fixed-variant": "#930008", "secondary": "#5f5e5e", "primary-container": "#e10514", "on-surface-variant": "#5e3f3b", "on-error-container": "#93000a", "primary-fixed": "#ffdad5", "surface-bright": "#f7f9ff", "tertiary-fixed": "#ffe088", "on-primary-fixed": "#410001", "on-tertiary-fixed-variant": "#574500", "status-success": "#107C41", "brand-red-dark": "#B0030F", "on-secondary-container": "#636262", "surface-border-subtle": "#EEEEEE", "surface-border": "#E5E7EB", "on-tertiary": "#ffffff", "inverse-surface": "#2d3135", "background": "#f7f9ff", "surface-container": "#ebeef4", "on-secondary-fixed-variant": "#474746", "surface-card": "#FFFFFF", "on-error": "#ffffff", "secondary-container": "#e2dfde", "on-primary": "#ffffff", "on-background": "#181c20", "surface": "#f7f9ff", "surface-container-low": "#f1f4fa", "outline-variant": "#e8bcb6", "surface-container-lowest": "#ffffff" },
  spacing: { "margin-mobile": "1rem", "space-xs": "0.5rem", "space-xl": "2rem", "space-lg": "1.5rem", "margin-tablet": "2rem", "space-2xs": "0.25rem", "space-3xl": "3rem", "space-sm": "0.75rem", "space-2xl": "2.5rem", "gutter-mobile": "1rem", "margin-desktop": "3rem", "container-max": "1280px", "gutter-desktop": "1.5rem", "space-md": "1rem" },
  fontFamily: { "numeric-lg": ["Manrope"], "body-md": ["Manrope"], "label-lg": ["Manrope"], "headline-xl-mobile": ["Manrope"], "headline-md": ["Manrope"], "body-sm": ["Manrope"], "body-lg": ["Manrope"], "headline-lg": ["Manrope"], "headline-lg-mobile": ["Manrope"], "label-sm": ["Manrope"], "headline-xl": ["Manrope"], "numeric-hero": ["Manrope"], "label-md": ["Manrope"], "title-lg": ["Manrope"], "title-md": ["Manrope"], "headline-sm": ["Manrope"] },
  fontSize: { "numeric-lg": ["24px", { lineHeight: "30px", letterSpacing: "-0.01em", fontWeight: "700" }], "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }], "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }], "headline-xl-mobile": ["28px", { lineHeight: "34px", letterSpacing: "-0.015em", fontWeight: "700" }], "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }], "body-sm": ["12px", { lineHeight: "16px", fontWeight: "400" }], "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }], "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.015em", fontWeight: "700" }], "headline-lg-mobile": ["24px", { lineHeight: "30px", letterSpacing: "-0.01em", fontWeight: "700" }], "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "600" }], "headline-xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }], "numeric-hero": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }], "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "600" }], "title-lg": ["18px", { lineHeight: "24px", fontWeight: "600" }], "title-md": ["16px", { lineHeight: "22px", fontWeight: "600" }], "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }] }
};

let css = '\n@theme {\n';
for (const [k, v] of Object.entries(config.colors)) {
  css += `  --color-${k}: ${v};\n`;
}
for (const [k, v] of Object.entries(config.spacing)) {
  css += `  --spacing-${k}: ${v};\n`;
}
for (const [k, v] of Object.entries(config.fontFamily)) {
  css += `  --font-family-${k}: '${v[0]}', sans-serif;\n`;
}
for (const [k, v] of Object.entries(config.fontSize)) {
  css += `  --font-size-${k}: ${v[0]};\n`;
  if (v[1].lineHeight) css += `  --text-${k}-line-height: ${v[1].lineHeight};\n`;
  if (v[1].fontWeight) css += `  --text-${k}-font-weight: ${v[1].fontWeight};\n`;
  if (v[1].letterSpacing) css += `  --text-${k}-letter-spacing: ${v[1].letterSpacing};\n`;
}
css += '}\n';

const styleFile = 'e:/PRV/Tarek/Turkish Bank/frontend/src/styles.css';
let currentCss = fs.readFileSync(styleFile, 'utf8');
fs.writeFileSync(styleFile, currentCss + css);
console.log('Appended to styles.css');
