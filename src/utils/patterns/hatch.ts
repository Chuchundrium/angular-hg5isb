import { isDefined } from '../general';
import {fromDegToRad, leastCommonMultiple, x, y} from '../math';

/**
 * @prop { string } color - background color
 * @prop { string } pattern_color - '#RRGGBBAA' (AA is alpha for opacity)
 * @prop { number[] } pattern_style - [length of dash, length of space, length of dash, length of space, ...];  [1, 0] - solid line.
 * @prop { number } pattern_angle - DEG, from -90 to 90
 * @prop { number } cross_pattern_angle - DEG, from -90 to 90
 * @prop { number } pattern_spacing - ground units (the units used for the design meters/mm/foot etc)
 * @prop { number } cross_pattern_spacing - ground units (the units used for the design meters/mm/foot etc)*
 * @prop { number } weight - line width = (weight + 1) * default (default = 2px) ;
 */
export interface FillStyle {
  color: string;
  pattern_color: string;
  pattern_style: Array<number>;
  pattern_angle: number;
  cross_pattern_angle: number;
  pattern_spacing: number;
  cross_pattern_spacing: number;
  weight: number;
}

const TEST_HATCH: FillStyle = {
  color: '#E8F6EF',
  pattern_color: '#4C4C6D',
  pattern_style: [7, 3],
  pattern_angle: 60,
  cross_pattern_angle: -60,
  pattern_spacing: 20,
  cross_pattern_spacing: 40,
  weight: 0,
};

const DEFAULT_LINE_WIDTH_PX = 2;
const getLineWidth = (weight: number) => (weight + 1) * DEFAULT_LINE_WIDTH_PX;

const patternCanvasSize = (
  lineWidth: number,
  spacing: number,
  angle: number
) => {
  const angleRad = angle * (Math.PI / 180);
  const k = 1 / Math.tan(angleRad);
  const patternHeight = spacing / Math.cos(angleRad) + lineWidth;
  const patternWidth = patternHeight * k;
  return [
    Math.abs(Math.ceil(patternWidth)),
    Math.abs(Math.ceil(patternHeight)),
  ];
};

export function getHatchPattern(
  style: FillStyle = TEST_HATCH
): HTMLCanvasElement {
  const lineWidth = getLineWidth(style.weight);

  const [minWidth1, minHeight1] = patternCanvasSize(
    lineWidth,
    style.pattern_spacing,
    style.pattern_angle
  );
  const [minWidth2, minHeight2] = patternCanvasSize(
    lineWidth,
    style.cross_pattern_spacing,
    style.cross_pattern_angle
  );

  const patternCanvasWidthA = leastCommonMultiple(3, 5);
  // const patternCanvasHeightA = leastCommonMultiple(minHeight1, minHeight2);
  const patternCanvasWidth = 300;
  const patternCanvasHeight = 300;

  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

  patternCanvas.width = patternCanvasWidth;
  patternCanvas.height = patternCanvasHeight;
  patternCtx.fillStyle = style.color;
  patternCtx.fillRect(0, 0, patternCanvasWidth, patternCanvasHeight);

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
    patternCtx.strokeStyle = color;
    patternCtx.beginPath();

    const lineAngleRad = fromDegToRad(angle);
    const isRightAngle = lineAngleRad === Math.PI / 2 || lineAngleRad === -Math.PI / 2;
    const isZeroAngle = lineAngleRad === 0;
    const isNegativeAngle = !isRightAngle && !isZeroAngle && lineAngleRad < 0;

    if (isRightAngle) {
      const dx = Math.abs(Math.ceil((spacing + lineWidth)));
      const countX = Math.ceil(patternCanvasWidth / dx);
      let x = 0;
      const y1 = 0;
      const y2 = patternCanvasHeight;

      for (let i = 0; i < countX; i++) {
        patternCtx.moveTo(x, y1);
        patternCtx.lineTo(x, y2);
        x += dx;
      }
    } else if (isZeroAngle) {
      const dy = Math.abs(Math.ceil((spacing + lineWidth)));
      const countY = Math.ceil(patternCanvasHeight / dy);
      const x1 = 0;
      const x2 = patternCanvasWidth;
      let y = 0;

      for (let i = 0; i < countY; i++) {
        patternCtx.moveTo(x1, y);
        patternCtx.lineTo(x2, y);
        y += dy;
      }
    } else {
      const k = Math.tan(lineAngleRad);
      const b = Math.ceil((spacing + lineWidth) / Math.cos(lineAngleRad));
      const dx = Math.abs(Math.ceil((spacing + lineWidth) / Math.sin(lineAngleRad)));
      const dy = Math.abs(b);
      const countX = Math.ceil(patternCanvasWidth / dx);
      const countY = Math.ceil(patternCanvasHeight / dy);
      const count = countX + countY;
      const y1 = 0;
      const y2 = patternCanvasHeight;

      let x1 = isNegativeAngle ? 0 : -1 * dx * (countY);
      let x2 = isNegativeAngle ? Math.ceil(x(y2, k, b)) - dx : dx + x1 + Math.ceil(x(y2, k, b));

      for (let i = 0; i < count; i++) {
        patternCtx.moveTo(x1, y1);
        patternCtx.lineTo(x2, y2);
        x1 += dx;
        x2 += dx;
      }
    }

    patternCtx.stroke();
  });

  return patternCanvas;
}
