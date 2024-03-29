import { isDefined } from '../general';
import {
  isRightAngle,
  isZeroAngle,
  leastCommonMultiple,
  roundToAbsLarger,
  x,
} from '../math';
import {
  CanvasSize,
  CANVAS_SIZE,
  detectFillType,
  FillStyle,
  FLAGS,
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
    height = Math.abs(b);
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

function getPatternScale(patternSize: CanvasSize, canvasSize: CanvasSize) {
  if (!FLAGS.scaleHatch) {
    return { x: 1, y: 1 };
  }
  const xWholeNumber = Math.floor(canvasSize.w / patternSize.w);
  const yWholeNumber = Math.floor(canvasSize.h / patternSize.h);

  const updPatternWidth = canvasSize.w / xWholeNumber;
  const updPatternHeight = canvasSize.h / yWholeNumber;

  return {
    x: updPatternWidth / patternSize.w,
    y: updPatternHeight / patternSize.h,
  };
}

export const isValidPatternSize = (
  patternSize: CanvasSize,
  parrentCanvasSize: CanvasSize
) =>
  patternSize?.w &&
  patternSize?.h &&
  patternSize.w < parrentCanvasSize.w &&
  patternSize.h < parrentCanvasSize.h;

export function getHatchPattern(style: FillStyle): HTMLCanvasElement {
  style = {
    ...style,
    width: getLineWidth(style.weight),
    fill_type_detected: detectFillType(style),
  };

  let scale = { x: 1, y: 1 };

  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

  if (!FLAGS.useHatch) {
    patternCtx.fillStyle = style.color;
    patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
    return patternCanvas;
  }

  const calculatedPatternSize = getPatternSize(style);

  if (
    !isValidPatternSize(calculatedPatternSize, CANVAS_SIZE) ||
    (!isSolidLine(style.pattern_style) && !FLAGS.scaleDashedHatch)
  ) {
    // set pattern size equal to tile canvas size: a) if calculated pattern size is larger than canvas size; b) if no need to scale dashed hatch
    patternCanvas.width = CANVAS_SIZE.w;
    patternCanvas.height = CANVAS_SIZE.h;
  } else {
    scale = getPatternScale(calculatedPatternSize, CANVAS_SIZE);
    const scaledPatternSize = {
      w: calculatedPatternSize.w * scale.x,
      h: calculatedPatternSize.h * scale.y,
    };
    if (isValidPatternSize(scaledPatternSize, CANVAS_SIZE)) {
      // scale pattern size
      patternCanvas.width = scaledPatternSize.w;
      patternCanvas.height = scaledPatternSize.h;
    } else {
      patternCanvas.width = calculatedPatternSize.w;
      patternCanvas.height = calculatedPatternSize.h;
    }
  }

  const withScaling = scale.x !== 1 || scale.y !== 1;

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

  if (withScaling) {
    // SCALE CONTEXT
    patternCtx.scale(scale.x, scale.y);
  }

  linesData.forEach(({ angle, spacing }) => {
    patternCtx.beginPath();

    if (isRightAngle(angle)) {
      const dx = Math.ceil(Math.abs(spacing + style.width));
      const countX = Math.ceil(
        (withScaling ? calculatedPatternSize.w : patternCanvas.width) / dx
      );
      let x = style.width / 2;
      const y1 = 0;
      const y2 = withScaling ? calculatedPatternSize.w : patternCanvas.width;

      for (let i = 0; i < countX; i++) {
        patternCtx.moveTo(x, y1);
        patternCtx.lineTo(x, y2);
        x += dx;
      }
    } else if (isZeroAngle(angle)) {
      const dy = Math.abs(Math.ceil(spacing + style.width));
      const countY = Math.ceil(
        (withScaling ? calculatedPatternSize.w : patternCanvas.width) / dy
      );
      const x1 = 0;
      const x2 = patternCanvas.width;
      let y = style.width / 2;

      for (let i = 0; i < countY; i++) {
        patternCtx.moveTo(x1, y);
        patternCtx.lineTo(x2, y);
        y += dy;
      }
    } else {
      const isNegativeAngle = angle < 0;

      const k = Math.tan(angle);
      const b = (spacing + style.width) / Math.cos(angle);
      const dx = Math.ceil(Math.abs((spacing + style.width) / Math.sin(angle)));
      const dy = Math.ceil(Math.abs(b));

      // if with scaling: use calculated size for calc, scaling will work according to context scaling
      // if without: use resulted pattern size for calc
      const countX = Math.ceil(
        (withScaling ? calculatedPatternSize.w : patternCanvas.width) / dx
      );
      const countY = Math.ceil(
        (withScaling ? calculatedPatternSize.h : patternCanvas.height) / dy
      );
      const count = countX + countY + 1;

      // think about more clever shift
      const y1 = -dy;
      const y2 =
        (withScaling ? calculatedPatternSize.w : patternCanvas.width) + dy;

      const x1Base = x(y1, k, b);
      const x2Base = x(y2, k, b);
      let x1 = isNegativeAngle
        ? roundToAbsLarger(x1Base - dx)
        : roundToAbsLarger(x1Base - dx * countY);
      let x2 = isNegativeAngle
        ? roundToAbsLarger(x2Base - dx)
        : roundToAbsLarger(x2Base - dx * countY);

      for (let i = 0; i <= count; i++) {
        patternCtx.moveTo(x1, y1);
        patternCtx.lineTo(x2, y2);

        x1 += dx;
        x2 += dx;
      }
    }
    patternCtx.stroke();
  });

  // addPatternBorders(patternCtx, patternCanvas);

  return patternCanvas;
}

function addPatternBorders(
  patternCtx: CanvasRenderingContext2D,
  patternCanvas: HTMLCanvasElement
) {
  patternCtx.setLineDash([]);
  patternCtx.globalAlpha = 1;
  patternCtx.strokeStyle = '#02fa44';
  patternCtx.lineWidth = 1;
  patternCtx.strokeRect(0, 0, patternCanvas.width, patternCanvas.height);
}
