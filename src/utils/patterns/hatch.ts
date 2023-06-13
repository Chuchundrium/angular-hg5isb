import { isDefined } from '../general';

/**
 *
 */
export interface FillStyle {
  /** background color */
  color: string;
  /** #RRGGBBAA (AA is alpha for opacity) */
  pattern_color: string;
  /**  [length of dash, length of space, length of dash, length of space, ...];  [1, 0] - solid line. */
  pattern_style: Array<number>;
  /** DEG, from -90 to 90 */
  pattern_angle: number;
  /** DEG, from -90 to 90 */
  cross_pattern_angle: number;
  /** ground units (the units used for the design meters/mm/foot etc) */
  pattern_spacing: number;
  /** ground units (the units used for the design meters/mm/foot etc) */
  cross_pattern_spacing: number;
  /** line width = (weight + 1) * default (default = 2px) */
  weight: number;
}

const TEST_HATCH: FillStyle = {
  color: '#E8F6EF07',
  pattern_color: '#4C4C6D',
  pattern_style: [],
  pattern_angle: 60,
  cross_pattern_angle: -60,
  pattern_spacing: 20,
  cross_pattern_spacing: 40,
  weight: 0,
};

const DEFAULT_LINE_WIDTH_PX = 2;
const getLineWidth = (weight: number) => (weight + 1) * DEFAULT_LINE_WIDTH_PX;
// O-TODO: handle 90 deg: dash doesn't work, lineWidth = 1 - not all lines are visible
// y = kx + b
const y = (x: number, c: number, k: number, b: number) => k * x + b * c;

// before to call this func: parse the style and multiply to meterToPixelRatio everything that necessery
// calc lineWidth before too - ?
export function getHatchPattern(
  style: FillStyle = TEST_HATCH
): HTMLCanvasElement {
  const width = 300;
  const height = 300;

  const lineWidth = getLineWidth(style.weight);

  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

  patternCanvas.width = width;
  patternCanvas.height = height;
  patternCtx.fillStyle = style.color;
  patternCtx.fillRect(
    patternCanvas.width,
    patternCanvas.height,
    patternCanvas.width,
    patternCanvas.height
  );

  if (isDefined(style.pattern_style)) {
    patternCtx.setLineDash(style.pattern_style);
  }
  patternCtx.lineWidth = lineWidth;

  [
    {
      angle: style.pattern_angle,
      color: style.pattern_color,
      spacing: style.pattern_spacing,
    },
    {
      angle: style.cross_pattern_angle,
      color: style.pattern_color,
      spacing: style.cross_pattern_spacing,
    },
  ].forEach(({ angle, color, spacing }) => {
    const lineAngleRad = angle * (Math.PI / 180);
    const k = Math.tan(lineAngleRad);
    const b = (spacing + lineWidth) / Math.cos(lineAngleRad);

    const dx = (spacing + lineWidth) / Math.sin(lineAngleRad);
    const dy = b;
    const count = Math.abs(
      Math.abs(angle) > 45 ? Math.ceil(width / dx) : Math.ceil(height / dy)
    );

    const startI = angle > 0 ? -1 * count : 0;
    const endI = angle > 0 ? count : count * 2;

    patternCtx.strokeStyle = color;
    patternCtx.beginPath();
    for (let i = startI; i < endI; i++) {
      const x1 = -10;
      const x2 = width;
      patternCtx.moveTo(x1, y(x1, i, k, b));
      patternCtx.lineTo(x2, y(x2, i, k, b));
    }

    patternCtx.stroke();
  });

  return patternCanvas;
}
