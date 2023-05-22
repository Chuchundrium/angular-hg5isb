import 'zone.js/dist/zone';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

const CUSTOM_PATTERNS_MAPPING: Record<string, Function> = {
  GRAVEL: (color: string, width = 2) => `
  <svg width="109" height="109" viewBox="0 0 109 109" fill="none" stroke="${color}" stroke-width="${width}" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 0.5L21.5 8L13.5 35L1 43.5"/>
    <path d="M66 9.5L56.5 0.5H33.5L25.5 9.5L33.5 22.5L60.5 26L66 16.5V9.5Z"/>
    <path d="M78 0.5L67.5 9L67 33L74.5 51.5L98 53.5L108.5 43"/>
    <path d="M3.5 50L23.5 28H51L65 37.5L61.5 53L37.5 65.5L10.5 62.5L3.5 50Z"/>
    <path d="M1.5 67.5L11 66.5L34.5 71.5L36 77L27 87.5L1.5 90.5"/>
    <path d="M1.5 96.5H9.5L17 108.5"/>
    <path d="M25 108L21 98.5L28 94L41 99L25 108Z"/>
    <path d="M66 56.5L49.5 62L41.5 78L48 93L66 98L85 92L90.5 76.5L83.5 63L66 56.5Z"/>
    <path d="M108.5 67.5L100.5 68.5L98 77L108.5 90.5"/>
    <path d="M78 108.5L92.5 94.5L108.5 96.5"/>
  </svg>  
  `,
};

@Component({
  selector: 'my-app',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvasA', { static: true })
  canvasA!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasB', { static: true })
  canvasB!: ElementRef<HTMLCanvasElement>;

  props = {
    pattern: 'GRAVEL',
    lineWidth: 2,
    spacing: 10,
    color: 'blue',
    angle: 45,
    scale: 2,
    dx: 10,
    dy: 10,
  };

  ngAfterViewInit() {
    // this.drawPatternOnImage();

    const canvasA = this.canvasA.nativeElement;
    canvasA.width = 300;
    canvasA.height = 300;
    const ctxA = canvasA.getContext('2d') as CanvasRenderingContext2D;

    // const patternCanvas = this.getHorizontalHatchPattern();
    // const patternCanvas = this.getVerticalHatchPattern();
    const patternCanvas = this.getDiagonalHatchPatternUpd();
    // const patternCanvas = this.getCrossHatchPattern();
    // const patternCanvas = this.getGravelPattern();
    ctxA.fillStyle = ctxA.createPattern(
      patternCanvas,
      'repeat'
    ) as CanvasPattern;
    ctxA.fillRect(0, 0, 300, 300);

    const canvasB = this.canvasB.nativeElement;
    canvasB.width = 300;
    canvasB.height = 300;
    const ctxB = canvasB.getContext('2d') as CanvasRenderingContext2D;

    ctxB.fillStyle = ctxA.createPattern(
      patternCanvas,
      'repeat'
    ) as CanvasPattern;
    ctxB.fillRect(0, 0, 300, 300);
  }

  private getHorizontalHatchPattern(
    lineWidth = 4,
    offset = 20,
    backgroundColor = '#FEFF8630',
    lineColor = '#146C94'
  ) {
    const defailtPatternWidth = 30;

    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D;

    patternCanvas.width = defailtPatternWidth;
    patternCanvas.height = lineWidth + offset;
    patternCtx.fillStyle = backgroundColor;
    patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

    patternCtx.strokeStyle = lineColor;
    patternCtx.lineWidth = lineWidth;

    patternCtx.moveTo(0, 0);
    patternCtx.lineTo(defailtPatternWidth, 0);
    patternCtx.stroke();

    return patternCanvas;
  }

  private getVerticalHatchPattern(
    lineWidth = 4,
    offset = 20,
    backgroundColor = '#A4BE7B30',
    lineColor = '#285430'
  ) {
    const defailtPatternHeight = 30;

    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D;

    patternCanvas.width = lineWidth + offset;
    patternCanvas.height = defailtPatternHeight;
    patternCtx.fillStyle = backgroundColor;
    patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

    patternCtx.strokeStyle = lineColor;
    patternCtx.lineWidth = lineWidth;

    patternCtx.moveTo(0, 0);
    patternCtx.lineTo(0, defailtPatternHeight);
    patternCtx.stroke();

    return patternCanvas;
  }

  private getDiagonalHatchPatternUpd(
    lineWidth = 20,
    offset = 20,
    backgroundColor = '#A4BE7B50',
    lineColor = '#863A6F',
    lineAngle = 30
  ) {
    const lineAngleRad = lineAngle * (Math.PI / 180);
    console.log({ lineAngleRad });
    const k = Math.tan(lineAngleRad);
    console.log({ k });
    // const b = Math.ceil((offset + lineWidth) / Math.cos(lineAngleRad));
    // const b = Math.floor((offset + lineWidth) / Math.cos(lineAngleRad));
    const b = (offset + lineWidth) / Math.cos(lineAngleRad);
    console.log({ b });

    // const width_X = Math.floor(Math.abs(lineAngle === 0 ? 50 : b / k));
    // const height_Y = Math.floor((offset + lineWidth) / Math.cos(lineAngleRad));

    // const width_X = Math.ceil(Math.abs(lineAngle === 0 ? 50 : b / k));
    // const height_Y = Math.ceil((offset + lineWidth) / Math.cos(lineAngleRad));

    const width_X = Math.abs(lineAngle === 0 ? 50 : b / k);
    const height_Y = (offset + lineWidth) / Math.cos(lineAngleRad);

    console.log({ width_X, height_Y });

    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D;

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
    // patternCtx.strokeRect(0, 0, patternCanvas.width, patternCanvas.height);
    patternCtx.lineWidth = lineWidth;
    patternCtx.lineCap = 'square';

    // const y = (x: number, i: number) => Math.floor(k * x + b * i);
    // const y = (x: number, i: number) => Math.ceil(k * x + b * i);
    const y = (x: number, i: number) => k * x + b * i;
    patternCtx.beginPath();

    const is = lineAngle > 0 ? [-1, 0, 1] : [0, 1, 2];

    is.forEach((b) => {
      const x1 = -10;
      const x2 = width_X + 10;
      const y1 = y(x1, b);
      const y2 = y(x2, b);
      patternCtx.moveTo(x1, y1);
      patternCtx.lineTo(x2, y2);
      console.log({ b });
      console.log({ x1, y1 });
      console.log({ x2, y2 });
    });

    // x = (y - b) / k
    // y = kx + b

    patternCtx.stroke();
    return patternCanvas;
  }

  private getDiagonalHatchPattern(
    lineWidth = 20,
    offset = 20,
    backgroundColor = '#A4BE7B50',
    lineColor = '#863A6F',
    lineAngle = 30
  ) {
    const lineAngleRad = lineAngle * (Math.PI / 180);
    // if (lineAngle === 0 || lineAngle === 90) {
    //   return;
    // }*
    // TODO: handle 0 and 90
    const dx =
      lineAngle < 45 || lineAngle === 0 || lineAngle === 90
        ? 0
        : lineWidth / (2 * Math.sin(lineAngleRad));
    const dy =
      lineAngle < 45 && lineAngle !== 0 && lineAngle !== 90
        ? lineWidth / (2 * Math.cos(lineAngleRad))
        : 0;

    const k = 1 / Math.tan(lineAngleRad);
    const patternHeight = (offset + lineWidth) / Math.cos(lineAngleRad);
    const patternWidth = patternHeight * k;

    // (x0, y0) -- (x1, y0)
    //    |           |
    //    |           |
    // (x0, y1) -- (x1, y1)
    const x0 = 0 - dx;
    const x1 = patternWidth - dx;
    const y0 = 0 - dy;
    const y1 = patternHeight - dy;

    const x2 = patternWidth - lineWidth / (2 * Math.sin(lineAngleRad));
    const x3 = patternWidth;
    const y2 = patternHeight;
    const y3 = patternHeight - lineWidth / (2 * Math.cos(lineAngleRad));

    const x4 = x3 + 20 * Math.cos(lineAngleRad);
    const y4 = y3 + 20 * Math.sin(lineAngleRad);

    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D;

    patternCanvas.width = patternWidth;
    patternCanvas.height = patternHeight;
    patternCtx.fillStyle = backgroundColor;
    patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

    patternCtx.strokeStyle = lineColor;
    patternCtx.strokeRect(0, 0, patternCanvas.width, patternCanvas.height);
    patternCtx.lineWidth = lineWidth;
    patternCtx.lineCap = 'square';

    patternCtx.beginPath();
    // patternCtx.setLineDash([8, 8]);
    patternCtx.moveTo(x0, y1);
    patternCtx.lineTo(x1, y0);
    patternCtx.moveTo(x2, y2);
    patternCtx.lineTo(x3, y3);
    patternCtx.lineTo(x4, y4);
    patternCtx.stroke();

    return patternCanvas;
  }

  // test for angle = 45 deg
  private getCrossHatchPattern(
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
    const patternCtx = patternCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D;

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

  private getGravelPattern(
    lineWidth = 2,
    backgroundColor = '#A4BE7B50',
    lineColor = '#394867'
  ) {
    const patternWidth = 100;
    const patternHeight = 100;

    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D;

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
}

bootstrapApplication(AppComponent);
