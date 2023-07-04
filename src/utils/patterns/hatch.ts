import { isDefined } from '../general';
import { leastCommonMultiple, x } from '../math';
import {
  CanvasSize,
  CANVAS_SIZE,
  detectFillType,
  FillStyle,
  getLineWidth,
} from './patterns-model';

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

function getPatternSize(style: FillStyle): CanvasSize {
  if (style.fill_type_detected === 'lines') {
    const defaultWidth = 50;

    // y = kx + b
    const k = Math.tan(style.pattern_angle_rad);
    const b =
      (style.pattern_spacing_px + style.width) /
      Math.cos(style.pattern_angle_rad);
    const y = (x: number, c: number) => k * x + b * c;

    const width_X = Math.abs(
      style.pattern_angle_rad === 0 ? defaultWidth : b / k
    );
    const height_Y = b;
    return { w: Math.round(width_X), h: Math.round(height_Y) };
  } else if (style.fill_type_detected === 'cross-lines') {
    return;
  }
}

function getPatternScale(canvasSize: CanvasSize, patternSize: CanvasSize) {
  return {
    x: canvasSize.w / patternSize.w / Math.round(canvasSize.w / patternSize.w),
    y: canvasSize.h / patternSize.h / Math.round(canvasSize.h / patternSize.h),
  };
}

export function getHatchPattern(style: FillStyle): HTMLCanvasElement {
  style = {
    ...style,
    width: getLineWidth(style.weight),
    fill_type_detected: detectFillType(style),
  };

  const size = getPatternSize(style);
  console.log(size);

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
  let patternCanvasWidth = size?.w ?? 300;
  let patternCanvasHeight = size?.h ?? 300;

  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

  const scale = getPatternScale(CANVAS_SIZE, {
    w: patternCanvasWidth,
    h: patternCanvasHeight,
  });

  console.log(scale);
  // patternCtx.scale(scale.x, scale.y);

  // patternCanvasWidth *= scale.x;
  // patternCanvasHeight *= scale.y;
  patternCanvas.width = patternCanvasWidth;
  patternCanvas.height = patternCanvasHeight;

  // patternCanvas.width = patternCanvasWidth * scale.x;
  // patternCanvas.height = patternCanvasHeight * scale.y;

  patternCtx.fillStyle = style.color;
  patternCtx.fillRect(0, 0, patternCanvasWidth, patternCanvasHeight);

  if (isDefined(style.pattern_style)) {
    patternCtx.setLineDash(style.pattern_style);
  }
  patternCtx.lineWidth = style.width;

  const linesData: { angle: number; spacing: number }[] = [];
  if (['lines', 'cross-lines'].includes(style.fill_type_detected)) {
    linesData.push({
      angle: style.pattern_angle_rad,
      spacing: style.pattern_spacing_px,
    });
  }
  if (style.fill_type_detected === 'cross-lines') {
    linesData.push({
      angle: style.cross_pattern_angle_rad,
      spacing: style.cross_pattern_spacing_px,
    });
  }

  linesData.forEach(({ angle, spacing }) => {
    patternCtx.strokeStyle = style.pattern_color;
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

    patternCtx.setLineDash([]);
    patternCtx.lineWidth = 1;
    patternCtx.strokeRect(0, 0, patternCanvas.width, patternCanvas.height);
  });

  return patternCanvas;
}
