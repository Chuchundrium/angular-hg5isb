import { isDefined } from '../general';
import { leastCommonMultiple, x } from '../math';
import { FillStyle, getLineWidth, TEST_HATCH } from './patterns-model';

const patternCanvasSize = (
  lineWidth: number,
  spacing: number,
  angleRad: number
) => {
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
  style = {
    ...style,
    width: getLineWidth(style.weight),
  };

  const [minWidth1, minHeight1] = patternCanvasSize(
    style.width,
    style.pattern_spacing_px,
    style.pattern_angle_rad
  );
  const [minWidth2, minHeight2] = patternCanvasSize(
    style.width,
    style.cross_pattern_spacing_px,
    style.cross_pattern_angle_rad
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
  patternCtx.lineWidth = style.width;

  [
    {
      angle: style.pattern_angle_rad,
      color: style.pattern_color,
      spacing: style.pattern_spacing_px,
    },
    {
      angle: style.cross_pattern_angle_rad,
      color: style.pattern_color,
      spacing: style.cross_pattern_spacing_px,
    },
  ].forEach(({ angle, color, spacing }) => {
    patternCtx.strokeStyle = color;
    patternCtx.beginPath();

    const isRightAngle = angle === Math.PI / 2 || angle === -Math.PI / 2;
    const isZeroAngle = angle === 0;
    const isNegativeAngle = !isRightAngle && !isZeroAngle && angle < 0;

    if (isRightAngle) {
      const dx = Math.abs(Math.ceil(spacing + style.width));
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
      const dy = Math.abs(Math.ceil(spacing + style.width));
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
      const k = Math.tan(angle);
      const b = Math.ceil((spacing + style.width) / Math.cos(angle));
      const dx = Math.abs(Math.ceil((spacing + style.width) / Math.sin(angle)));
      const dy = Math.abs(b);
      const countX = Math.ceil(patternCanvasWidth / dx);
      const countY = Math.ceil(patternCanvasHeight / dy);
      const count = countX + countY;
      const y1 = 0;
      const y2 = patternCanvasHeight;

      let x1 = isNegativeAngle ? 0 : -1 * dx * countY;
      let x2 = isNegativeAngle
        ? Math.ceil(x(y2, k, b)) - dx
        : dx + x1 + Math.ceil(x(y2, k, b));

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
