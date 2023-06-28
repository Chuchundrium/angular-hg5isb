import 'zone.js/dist/zone';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  getCanvasCustomPattern,
  getCrossHatchPattern2,
  getHoneycombsPattern,
  getHorizontalHatchPattern,
  getVerticalHatchPattern,
  setCustomPattern,
} from './patterns.service';
import { getHatchPattern } from './utils/patterns/hatch';
import {
  TEST_CROSS_HATCH,
  TEST_LINES_HATCH,
} from './utils/patterns/patterns-model';

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
  @ViewChild('canvas1', { static: true })
  canvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2', { static: true })
  canvas2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas3', { static: true })
  canvas3!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas4', { static: true })
  canvas4!: ElementRef<HTMLCanvasElement>;

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
    // const patternCanvas = getHorizontalHatchPattern();
    // const patternCanvas = getVerticalHatchPattern();
    // const patternCanvas = getDiagonalHatchPatternUpd();
    // const patternCanvas = getCrossHatchPattern2();
    // const patternCanvas = getGravelPattern();
    // const patternCanvas = getHoneycombsPattern();

    // const patternCanvas = getHatchPattern(TEST_CROSS_HATCH);
    const patternCanvas = getHatchPattern(TEST_LINES_HATCH);

    const canvasA = this.canvasA.nativeElement;
    canvasA.width = 300;
    canvasA.height = 300;
    const ctxA = canvasA.getContext('2d') as CanvasRenderingContext2D;

    // setCustomPattern(ctxA);

    ctxA.fillStyle = ctxA.createPattern(
      patternCanvas,
      'repeat'
    ) as CanvasPattern;
    // ctxA.fillRect(0, 0, 300, 300);

    ctxA.beginPath();
    ctxA.moveTo(20, 10);
    ctxA.lineTo(100, 10);
    ctxA.lineTo(200, 100);
    ctxA.lineTo(100, 50);
    ctxA.lineTo(20, 10);
    ctxA.fill();
    ctxA.stroke();
    ctxA.restore();
    // const canvasB = this.canvasB.nativeElement;
    // canvasB.width = 300;
    // canvasB.height = 300;
    // const ctxB = canvasB.getContext('2d') as CanvasRenderingContext2D;

    // ctxB.fillStyle = ctxB.createPattern(
    //   patternCanvas,
    //   'repeat'
    // ) as CanvasPattern;
    // ctxB.fillRect(0, 0, 300, 300);

    this.addTestCanvases(patternCanvas);
  }

  //   {id: '20', k: 0, x: 851, y: 641.5}
  // {id: '20', k: 1, x: 1037.5, y: 1037.25}
  // {id: '20', k: 2, x: 1023.5, y: 1044}

  addTestCanvases(patternCanvas: HTMLCanvasElement) {
    const canvas1 = this.canvas1.nativeElement;
    canvas1.width = 1024;
    canvas1.height = 1024;
    const ctx1 = canvas1.getContext('2d') as CanvasRenderingContext2D;
    ctx1.beginPath();
    // {id: '20', k: 0, x: 789.5, y: 1044}
    // {id: '20', k: 1, x: 643.5, y: 736.5}
    // {id: '20', k: 2, x: 851, y: 641.5}
    ctx1.beginPath();
    ctx1.moveTo(789.5, 1044);
    ctx1.lineTo(643.5, 736.5);
    ctx1.lineTo(851, 641.5);
    ctx1.fill();
    ctx1.stroke();
    ctx1.restore();

    const canvas2 = this.canvas2.nativeElement;
    canvas2.width = 1024;
    canvas2.height = 1024;
    const ctx2 = canvas2.getContext('2d') as CanvasRenderingContext2D;
    //   {id: '20', k: 0, x: 1021.75, y: -20}
    // {id: '20', k: 1, x: 1037.5, y: 13.25}
    // {id: '20', k: 2, x: 833.5, y: 112.25}
    // {id: '20', k: 3, x: 770.5, y: -20}
    ctx2.beginPath();
    ctx2.moveTo(1021.75, -20);
    ctx2.lineTo(1037.5, 13.25);
    ctx2.lineTo(833.5, 112.25);
    ctx2.lineTo(770.5, -20);
    ctx2.fill();
    ctx2.stroke();
    ctx2.restore();

    const canvas3 = this.canvas3.nativeElement;
    canvas3.width = 1024;
    canvas3.height = 1024;
    const ctx3 = canvas3.getContext('2d') as CanvasRenderingContext2D;
    //   {id: '20', k: 0, x: -20, y: 966.25}
    // {id: '20', k: 1, x: 13.5, y: 1037.25}
    // {id: '20', k: 2, x: -0.5, y: 1044}
    ctx3.beginPath();
    ctx3.moveTo(-20, 966.25);
    ctx3.lineTo(13.5, 1037.25);
    ctx3.lineTo(-0.5, 1044);
    ctx3.fill();
    ctx3.stroke();
    ctx3.restore();

    const canvas4 = this.canvas4.nativeElement;
    canvas4.width = 1024;
    canvas4.height = 1024;
    const ctx4 = canvas4.getContext('2d') as CanvasRenderingContext2D;
    //   {id: '20', k: 0, x: -2.25, y: -20}
    // {id: '20', k: 1, x: 13.5, y: 13.25}
    // {id: '20', k: 2, x: -20, y: 29.5}
    ctx4.beginPath();
    ctx4.moveTo(-2.25, -20);
    ctx4.lineTo(13.5, 13.25);
    ctx4.lineTo(-20, 29.5);
    ctx4.fill();
    ctx4.stroke();
    ctx4.restore();
  }
}

bootstrapApplication(AppComponent);
