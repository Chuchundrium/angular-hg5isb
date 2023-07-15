import { isDefined } from '../general';
import { isRightAngle, isZeroAngle, leastCommonMultiple, x } from '../math';
import {
  CanvasSize,
  CANVAS_SIZE,
  detectFillType,
  FillStyle,
  getLineWidth,
  isSolidLine,
} from './patterns-model';

function getSize(
  angle: number,
  spacing: number,
  lineWidth: number
): CanvasSize {
  let width = 50;
  let height = 50;

  if (isRightAngle(angle)) {
    width = spacing + lineWidth;
  } else if (isZeroAngle(angle)) {
    height = spacing + lineWidth;
  } else {
    // Calc width and height according to straight line equation y = kx + b
    const k = Math.tan(angle);
    const b = (spacing + lineWidth) / Math.cos(angle);

    width = Math.abs(b / k);
    height = b;
  }
  return { w: Math.ceil(width), h: Math.ceil(height) };
}

function getPatternSize(style: FillStyle): CanvasSize {
  if (style.fill_type_detected === 'lines') {
    return getSize(
      style.pattern_angle_rad,
      style.pattern_spacing_px,
      style.width
    );
  } else if (style.fill_type_detected === 'cross-lines') {
    const patternSize = getSize(
      style.pattern_angle_rad,
      style.pattern_spacing_px,
      style.width
    );
    const crossPatternSize = getSize(
      style.cross_pattern_angle_rad,
      style.cross_pattern_spacing_px,
      style.width
    );
    return {
      w: leastCommonMultiple(patternSize.w, crossPatternSize.w),
      h: leastCommonMultiple(patternSize.h, crossPatternSize.h),
    };
  }
}

function getPatternScale(canvasSize: CanvasSize, patternSize: CanvasSize) {
  const xFullCount = Math.floor(canvasSize.w / patternSize.w);
  const yFullCount = Math.floor(canvasSize.h / patternSize.h);

  const updPatternWidth = canvasSize.w / xFullCount;
  const updPatternHeight = canvasSize.h / yFullCount;

  return {
    x: updPatternWidth / patternSize.w,
    y: updPatternHeight / patternSize.h,
  };
  return { x: 1, y: 1 };
}

export function getHatchPattern(style: FillStyle): HTMLCanvasElement {
  style = {
    ...style,
    width: getLineWidth(style.weight),
    fill_type_detected: detectFillType(style),
  };

  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

  const patternCanvasSize = getPatternSize(style);
  const scale = getPatternScale(CANVAS_SIZE, {
    w: patternCanvasSize.w,
    h: patternCanvasSize.h,
  });

  // ?? add scaled size to check ??
  if (
    isDefined(patternCanvasSize?.w) &&
    isDefined(patternCanvasSize?.h) &&
    patternCanvasSize.w < CANVAS_SIZE.w &&
    patternCanvasSize.h < CANVAS_SIZE.h &&
    isSolidLine(style.pattern_style)
  ) {
    // SCALE CANVAS
    patternCanvas.width = patternCanvasSize.w * scale.x;
    patternCanvas.height = patternCanvasSize.h * scale.y;
    // patternCanvas.width = patternCanvasSize.w;
    // patternCanvas.height = patternCanvasSize.h;
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
      const fix = style.width / 2;
      let x = 0 + fix;
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
      const fix = style.width / 2;
      let y = 0 + fix;

      for (let i = 0; i < countY; i++) {
        patternCtx.moveTo(x1, y);
        patternCtx.lineTo(x2, y);
        y += dy;
      }
    } else {
      const isNegativeAngle = angle < 0;

      const k = Math.tan(angle);
      const b = Math.ceil(Math.abs((spacing + style.width) / Math.cos(angle)));
      const dx = Math.ceil(Math.abs((spacing + style.width) / Math.sin(angle)));
      console.log({
        sin: Math.sin(angle),
        cos: Math.cos(angle),
        divSin: (spacing + style.width) / Math.sin(angle),
        divCos: (spacing + style.width) / Math.cos(angle),
      });
      const dy = Math.abs(b);
      const countX = Math.ceil(patternCanvasSize.w / dx);
      const countY = Math.ceil(patternCanvasSize.h / dy);
      const count = countX + countY;
      const y1 = 0;
      const y2 = patternCanvasSize.h;

      let x1 = isNegativeAngle ? 0 : -1 * dx * countY;
      let x2 = isNegativeAngle
        ? Math.ceil(x(y2, k, b)) - dx
        : dx + x1 + Math.ceil(x(y2, k, b));

      // SCALE CONTEXT
      patternCtx.scale(scale.x, scale.y);

      console.log({ dx, dy });
      for (let i = 0; i <= count; i++) {
        patternCtx.moveTo(x1, y1);
        patternCtx.lineTo(x2, y2);
        x1 += dx;
        x2 += dx;
      }
    }
    patternCtx.stroke();
    // patternCtx.transform(1, 0, 0, 1, 0, 0);
  });

  // ADD PATTERN BORDERS
  // patternCtx.setLineDash([]);
  // patternCtx.globalAlpha = 1;
  // patternCtx.strokeStyle = '#02fa44';
  // patternCtx.lineWidth = 1;
  // patternCtx.strokeRect(0, 0, patternCanvas.width, patternCanvas.height);

  return patternCanvas;
}
