import { isDefined } from '../general';
import { leastCommonMultiple, x } from '../math';
import {
  CanvasSize,
  CANVAS_SIZE,
  detectFillType,
  FillStyle,
  getLineWidth,
} from './patterns-model';

function getSize(angle: number, spacing: number, lineWidth: number): CanvasSize {
  // TODO: care 0 and 90 degrees
  const defaultWidth = 50;

  // y = kx + b
  const k = Math.tan(angle);
  const b = (spacing + lineWidth) / Math.cos(angle);

  const width_X = Math.abs(
      angle === 0 ? defaultWidth : b / k
  );
  const height_Y = b;
  return { w: Math.round(width_X), h: Math.round(height_Y) };
}
function getPatternSize(style: FillStyle): CanvasSize {
  if (style.fill_type_detected === 'lines') {
    return getSize(style.pattern_angle_rad, style.pattern_spacing_px, style.width);
  } else if (style.fill_type_detected === 'cross-lines') {
    const patternSize = getSize(style.pattern_angle_rad, style.pattern_spacing_px, style.width);
    const crossPatternSize = getSize(style.cross_pattern_angle_rad, style.cross_pattern_spacing_px, style.width);
    return {
      w: leastCommonMultiple(patternSize.w, crossPatternSize.w),
      h: leastCommonMultiple(patternSize.h, crossPatternSize.h)
    };
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

  let patternCanvasWidth = size?.w ? Math.min(size.w, CANVAS_SIZE.w) : CANVAS_SIZE.w;
  let patternCanvasHeight = size?.h ? Math.min(size.h, CANVAS_SIZE.h) : CANVAS_SIZE.h;
  console.log({ size, patternCanvasWidth, patternCanvasHeight })

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

  patternCtx.strokeStyle = style.pattern_color;
  patternCtx.lineCap = 'square';

  linesData.forEach(({ angle, spacing }) => {
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

  // ADD PATTERN BORDERS
  // patternCtx.setLineDash([]);
  // patternCtx.lineWidth = 1;
  // patternCtx.strokeRect(0, 0, patternCanvas.width, patternCanvas.height);

  return patternCanvas;
}
