export const CUSTOM_PATTERNS_MAPPING: Record<string, Function> = {
  GRAVEL: (color: string, width: number) => `
  <svg width="109" height="109" fill="none" stroke="${color}" stroke-width="${width}"  xmlns="http://www.w3.org/2000/svg">
    <path d="M17 0.5L21.5 8L13.5 35L1 43.5"/>
    <path d="M66 9.5L56.5 0.5H33.5L25.5 9.5L33.5 22.5L60.5 26L66 16.5V9.5Z"/>
    <path d="M78 0.5L67.5 9L67 33L74.5 51.5L98 53.5L108.5 43"/>
    <path d="M3.5 50L23.5 28H51L65 37.5L61.5 53L37.5 65.5L10.5 62.5L3.5 50Z"/>
    <path d="M1.5 67.5L11 66.5L34.5 71.5L36 77L27 87.5L1.5 90.5"/>
    <path d="M1.5 96.5H9.5L17 108.5"/>
    <path d="M25 108L21 98.5L28 94L41 99L25 108Z"/>
    <path d="M66 56.5L49.5 62L41.5 78L48 93L66 98L85 92L90.5 76.5L83.5 63L66 56.5Z"/>
    <path d="M108.5 67.5L100.5 68.5L98 77L108.5 90.5"/>
    <path d="M78 108.5L92.5 94.5L108.5 96.5"/>
  </svg>  
  `,
};
