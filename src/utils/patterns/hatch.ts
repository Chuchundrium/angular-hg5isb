import { isDefined } from '../general';
import {isRightAngle, isZeroAngle, leastCommonMultiple, x} from '../math';
import {
  CanvasSize,
  CANVAS_SIZE,
  detectFillType,
  FillStyle,
  getLineWidth,
} from './patterns-model';

function getSize(angle: number, spacing: number, lineWidth: number): CanvasSize {
  const defaultWidth = 50;
  const defaultHeight = 50;

  // y = kx + b
  const k = isRightAngle(angle) ? 1 : Math.tan(angle);
  const b = isRightAngle(angle) ? defaultHeight : (spacing + lineWidth) / Math.cos(angle);

  const widthX = isZeroAngle(angle) ? defaultWidth : Math.abs(b / k);
  const heightY = b;
  return { w: Math.round(widthX), h: Math.round(heightY) };
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

  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;


  const size = getPatternSize(style);

  if (isDefined(size?.w) && isDefined(size?.h) && size.w < CANVAS_SIZE.w && size.h < CANVAS_SIZE.h) {
    patternCanvas.width = size.w;
    patternCanvas.height = size.h;
  } else {
    patternCanvas.width = CANVAS_SIZE.w;
    patternCanvas.height = CANVAS_SIZE.h;
  }
  patternCtx.fillStyle = style.color;
  patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

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

    if (isRightAngle(angle)) {
      const dx = Math.abs(Math.ceil(spacing + style.width));
      const countX = Math.ceil(patternCanvas.width / dx);
      let x = 0;
      const y1 = 0;
      const y2 = patternCanvas.height;

      for (let i = 0; i < countX; i++) {
        patternCtx.moveTo(x, y1);
        patternCtx.lineTo(x, y2);
        x += dx;
      }
    } else if (isZeroAngle(angle)) {
      const dy = Math.abs(Math.ceil(spacing + style.width));
      const countY = Math.ceil(patternCanvas.height / dy);
      const x1 = 0;
      const x2 = patternCanvas.width;
      let y = 0;

      for (let i = 0; i < countY; i++) {
        patternCtx.moveTo(x1, y);
        patternCtx.lineTo(x2, y);
        y += dy;
      }
    } else {
      const isNegativeAngle = angle < 0;

      const k = Math.tan(angle);
      const b = Math.ceil((spacing + style.width) / Math.cos(angle));
      const dx = Math.abs(Math.ceil((spacing + style.width) / Math.sin(angle)));
      const dy = Math.abs(b);
      const countX = Math.ceil(patternCanvas.width / dx);
      const countY = Math.ceil(patternCanvas.height / dy);
      const count = countX + countY;
      const y1 = 0;
      const y2 = patternCanvas.height;

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
