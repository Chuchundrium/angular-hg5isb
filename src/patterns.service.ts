import { CUSTOM_PATTERNS_MAPPING, drawGravelPattern } from './custom-patterns';

export function getHorizontalHatchPattern(
  lineWidth = 4,
  offset = 20,
  backgroundColor = '#FEFF8630',
  lineColor = '#146C94',
  dashStyle = [7, 5, 2, 5, 2, 5]
) {
  const defailtPatternWidth =
    dashStyle.length > 0
      ? dashStyle.reduce((partialSum, a) => partialSum + a, 0)
      : 30;

  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

  patternCanvas.width = defailtPatternWidth;
  patternCanvas.height = lineWidth + offset;
  patternCtx.fillStyle = backgroundColor;
  patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

  patternCtx.strokeStyle = lineColor;
  patternCtx.lineWidth = lineWidth;

  patternCtx.setLineDash(dashStyle);

  patternCtx.moveTo(0, 0);
  patternCtx.lineTo(defailtPatternWidth, 0);
  patternCtx.stroke();

  return patternCanvas;
}

export function getVerticalHatchPattern(
  lineWidth = 4,
  offset = 20,
  backgroundColor = '#A4BE7B30',
  lineColor = '#285430'
) {
  const defailtPatternHeight = 30;

  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

  patternCanvas.width = lineWidth + offset;
  patternCanvas.height = defailtPatternHeight;
  patternCtx.fillStyle = backgroundColor;
  patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

  patternCtx.setLineDash([7, 5, 2, 5, 2, 5]);
  patternCtx.strokeStyle = lineColor;
  patternCtx.lineWidth = lineWidth;

  patternCtx.moveTo(0, 0);
  patternCtx.lineTo(0, defailtPatternHeight);
  patternCtx.stroke();

  return patternCanvas;
}

export function getDiagonalHatchPattern(
  lineWidth = 8,
  offset = 20,
  backgroundColor = '#A4BE7B50',
  lineColor = '#863A6F',
  lineAngle = -80
) {
  const defaultWidth = 50;
  const lineAngleRad = lineAngle * (Math.PI / 180);

  // y = kx + b
  const k = Math.tan(lineAngleRad);
  const b = (offset + lineWidth) / Math.cos(lineAngleRad);
  const y = (x: number, c: number) => k * x + b * c;

  const width_X = Math.abs(lineAngle === 0 ? defaultWidth : b / k);
  const height_Y = b;

  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

  patternCanvas.width = width_X;
  patternCanvas.height = height_Y;
  patternCtx.fillStyle = backgroundColor;
  patternCtx.fillRect(
    patternCanvas.width,
    patternCanvas.height,
    patternCanvas.width,
    patternCanvas.height
  );

  patternCtx.strokeStyle = lineColor;
  patternCtx.lineWidth = lineWidth;
  patternCtx.lineCap = 'square';

  patternCtx.beginPath();

  const cs = lineAngle > 0 ? [-1, 0, 1] : [0, 1, 2];

  cs.forEach((c) => {
    const x1 = -10;
    const x2 = width_X + 10;
    patternCtx.moveTo(x1, y(x1, c));
    patternCtx.lineTo(x2, y(x2, c));
  });

  patternCtx.stroke();
  return patternCanvas;
}

export function getCrossHatchPattern2(
  width = 300,
  height = 300,
  lineWidth = 2,
  offset = 20,
  backgroundColor = '#E8F6EF07',
  lineColor1 = '#4C4C6D',
  lineAngle1 = 10,
  lineColor2 = '#1B9C85',
  lineAngle2 = 90
) {
  // O-TODO: handle 90 deg: dash doesn't work, lineWidth = 1 - not all lines are visible

  // y = kx + b
  const y = (x: number, c: number, k: number, b: number) => k * x + b * c;

  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

  patternCanvas.width = width;
  patternCanvas.height = height;
  patternCtx.fillStyle = backgroundColor;
  patternCtx.fillRect(
    patternCanvas.width,
    patternCanvas.height,
    patternCanvas.width,
    patternCanvas.height
  );

  // patternCtx.setLineDash([7, 5, 2, 5, 2, 5]);
  patternCtx.lineWidth = lineWidth;
  // patternCtx.lineCap = 'square';

  [
    { angle: lineAngle1, color: lineColor1 },
    { angle: lineAngle2, color: lineColor2 },
  ].forEach((line) => {
    const lineAngleRad = line.angle * (Math.PI / 180);
    const k = Math.tan(lineAngleRad);
    const b = (offset + lineWidth) / Math.cos(lineAngleRad);

    const dx = (offset + lineWidth) / Math.sin(lineAngleRad);
    const dy = b;

    const count = Math.abs(
      Math.abs(line.angle) > 45 ? Math.ceil(width / dx) : Math.ceil(height / dy)
    );

    const startI = line.angle > 0 ? -1 * count : 0;
    const endI = line.angle > 0 ? count : count * 2;

    patternCtx.strokeStyle = line.color;
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

// test for angle = 45 deg
export function getCrossHatchPattern(
  lineWidth = 2,
  offset = 20,
  backgroundColor = '#A4BE7B50',
  lineColor1 = '#FC4F00',
  lineColor2 = '#394867'
) {
  const patternWidth = Math.sqrt(Math.pow((offset + lineWidth) * 2, 2) / 2);
  const patternHeight = patternWidth;
  // (x0, y0) -- (x1, y0)
  //    |           |
  //    |           |
  // (x0, y1) -- (x1, y1)
  const x0 = 0;
  const x1 = patternWidth;
  const y0 = 0;
  const y1 = patternHeight;

  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

  patternCanvas.width = patternWidth;
  patternCanvas.height = patternHeight;
  patternCtx.fillStyle = backgroundColor;
  patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

  const d = patternWidth / 2;
  patternCtx.lineWidth = lineWidth;
  // direction 1
  patternCtx.strokeStyle = lineColor1;
  patternCtx.beginPath();
  patternCtx.moveTo(x0, y0 + d);
  patternCtx.lineTo(x0 + d, y0);
  patternCtx.moveTo(x0 + d, y1);
  patternCtx.lineTo(x1, y0 + d);
  patternCtx.stroke();
  // direction 2
  patternCtx.strokeStyle = lineColor2;
  patternCtx.beginPath();
  patternCtx.moveTo(x0 + d, y0);
  patternCtx.lineTo(x1, y0 + d);
  patternCtx.moveTo(x0, y0 + d);
  patternCtx.lineTo(x0 + d, y1);
  patternCtx.stroke();

  return patternCanvas;
}

export function getGravelPattern(
  lineWidth = 2,
  backgroundColor = '#A4BE7B50',
  lineColor = '#394867'
) {
  const patternWidth = 100;
  const patternHeight = 100;

  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

  patternCanvas.width = patternWidth;
  patternCanvas.height = patternHeight;
  patternCtx.fillStyle = backgroundColor;
  patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

  patternCtx.lineWidth = lineWidth;
  patternCtx.strokeStyle = lineColor;

  patternCtx.beginPath();

  patternCtx.moveTo(5, 5);
  patternCtx.lineTo(20, 5);
  patternCtx.lineTo(28, 20);
  patternCtx.lineTo(18, 30);
  patternCtx.lineTo(10, 27);
  patternCtx.lineTo(5, 5);

  patternCtx.moveTo(50, 10);
  patternCtx.lineTo(55, 13);
  patternCtx.lineTo(56, 15);
  patternCtx.lineTo(55, 20);
  patternCtx.lineTo(47, 17);
  patternCtx.lineTo(50, 10);

  patternCtx.moveTo(33, 40);
  patternCtx.lineTo(40, 50);
  patternCtx.lineTo(45, 60);
  patternCtx.lineTo(40, 60);
  patternCtx.lineTo(28, 50);
  patternCtx.lineTo(33, 40);

  patternCtx.moveTo(55, 55);
  patternCtx.lineTo(60, 70);
  patternCtx.lineTo(85, 80);
  patternCtx.lineTo(80, 60);
  patternCtx.lineTo(63, 50);
  patternCtx.lineTo(55, 55);

  patternCtx.moveTo(5, 80);
  patternCtx.lineTo(7, 75);
  patternCtx.lineTo(15, 70);
  patternCtx.lineTo(9, 88);
  patternCtx.lineTo(3, 87);
  patternCtx.lineTo(5, 80);

  patternCtx.stroke();

  return patternCanvas;
}

export function getHoneycombsPattern(
  lineWidth = 20,
  sideLength = 50,
  backgroundColor = '#F2B6A050',
  lineColor = '#850000'
) {
  const z = Math.cos(30 * (Math.PI / 180));
  const patternWidth = 3 * sideLength + (lineWidth / 2) * z;
  const patternHeight = 2 * sideLength * z;

  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

  patternCanvas.width = patternWidth;
  patternCanvas.height = patternHeight;

  patternCtx.fillStyle = backgroundColor;
  patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

  patternCtx.lineWidth = lineWidth;
  patternCtx.strokeStyle = lineColor;
  patternCtx.lineCap = 'square';

  // patternCtx.setLineDash([2, 8]);

  const da = sideLength / 2;

  const hexagonCoords = [
    [0.5 * sideLength + da, 2 * sideLength * z],
    [da, sideLength * z],
    [0.5 * sideLength + da, 0],
    [1.5 * sideLength + da, 0],
    [2 * sideLength + da, sideLength * z],
    [1.5 * sideLength + da, 2 * sideLength * z],
  ];

  patternCtx.beginPath();

  patternCtx.moveTo(hexagonCoords[1][0] - da, hexagonCoords[1][1]);
  patternCtx.lineTo(hexagonCoords[1][0], hexagonCoords[1][1]);

  hexagonCoords.forEach((coord, i) => {
    if (i === 0) {
      patternCtx.moveTo(coord[0], coord[1]);
    } else {
      patternCtx.lineTo(coord[0], coord[1]);
    }
  });
  patternCtx.lineTo(hexagonCoords[0][0], hexagonCoords[0][1]);

  patternCtx.moveTo(hexagonCoords[4][0], hexagonCoords[4][1]);
  patternCtx.lineTo(hexagonCoords[4][0] + da, hexagonCoords[4][1]);
  patternCtx.stroke();

  return patternCanvas;
}

export function setCustomPattern(
  ctx: CanvasRenderingContext2D,
  lineWidth = 2,
  backgroundColor = '#F2B6A050',
  lineColor = 'rgb(30, 70, 200)'
) {
  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

  const img = new Image();

  img.src =
    'data:image/svg+xml; charset=utf8,' +
    CUSTOM_PATTERNS_MAPPING['GRAVEL'](lineColor, lineWidth);

  img.onload = () => {
    patternCanvas.width = img.width;
    patternCanvas.height = img.height;
    patternCtx.fillStyle = backgroundColor;
    patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
    patternCtx.drawImage(img, 0, 0);

    ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat') as CanvasPattern;
    ctx.fillRect(0, 0, 300, 300);
  };
}

export function getCanvasCustomPattern(
  lineWidth = 2,
  backgroundColor = '#F2B6A050',
  lineColor = 'rgb(30, 70, 200)'
) {
  const patternCanvas = document.createElement('canvas');
  const patternCtx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

  patternCanvas.width = 109;
  patternCanvas.height = 109;

  patternCtx.fillStyle = backgroundColor;
  patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

  patternCtx.lineWidth = lineWidth;
  patternCtx.strokeStyle = lineColor;
  patternCtx.lineCap = 'square';
  patternCtx.fillStyle = backgroundColor;
  patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
  patternCtx.lineWidth = lineWidth;
  patternCtx.strokeStyle = lineColor;

  drawGravelPattern(patternCtx);

  return patternCanvas;
}
