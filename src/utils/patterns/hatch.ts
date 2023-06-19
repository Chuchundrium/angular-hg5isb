import { isDefined } from '../general';
import { fromDegToRad, leastCommonMultiple, y } from '../math';

/**
 * @prop { string } color - background color
 * @prop { string } pattern_color - #RRGGBBAA (AA is alpha for opacity)
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
  color: '#E8F6EF07',
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
// O-TODO: handle 90 deg: dash doesn't work, lineWidth = 1 - not all lines are visible

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

// before to call this func: parse the style and multiply to meterToPixelRatio everything that necessery
// calc lineWidth before too - ?
// convert deg to rad before too - !
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
  console.log({ patternCanvasWidthA });
  const patternCanvasWidth = 300;
  const patternCanvasHeight = 300;
  // const width = 300;
  // const height = 300;

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
    const lineAngleRad = fromDegToRad(angle);
    const k = Math.tan(lineAngleRad);
    const b = (spacing + lineWidth) / Math.cos(lineAngleRad);

    const dx = (spacing + lineWidth) / Math.sin(lineAngleRad);
    const dy = b;
    const count = Math.abs(
      Math.abs(angle) > 45
        ? Math.ceil(patternCanvasWidth / dx)
        : Math.ceil(patternCanvasHeight / dy)
    );

    const startI = angle > 0 ? -1 * count : 0;
    const endI = angle > 0 ? count : count * 2;

    patternCtx.strokeStyle = color;
    patternCtx.beginPath();
    for (let i = startI; i < endI; i++) {
      const x1 = -10;
      const x2 = patternCanvasWidth;
      patternCtx.moveTo(x1, y(x1, k, b * i));
      patternCtx.lineTo(x2, y(x2, k, b * i));
    }

    patternCtx.stroke();
  });

  return patternCanvas;
}
