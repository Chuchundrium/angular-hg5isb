import 'zone.js/dist/zone';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { getHatchPattern } from './utils/patterns/hatch';
import {
  CANVAS_SIZE,
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
    // const patternCanvas = getHatchPattern(TEST_CROSS_HATCH);
    const patternCanvas = getHatchPattern(TEST_LINES_HATCH);

    this.addTestCanvases(patternCanvas);
  }

  addTestCanvases(patternCanvas: HTMLCanvasElement) {
    const canvas1 = this.canvas1.nativeElement;
    canvas1.width = CANVAS_SIZE.w;
    canvas1.height = CANVAS_SIZE.h;

    const ctx1 = canvas1.getContext('2d') as CanvasRenderingContext2D;
    ctx1.beginPath();
    ctx1.moveTo(CANVAS_SIZE.w / 2, CANVAS_SIZE.h / 2);
    ctx1.lineTo(CANVAS_SIZE.w, CANVAS_SIZE.h / 2);
    ctx1.lineTo(CANVAS_SIZE.w, CANVAS_SIZE.h);
    ctx1.lineTo(CANVAS_SIZE.w / 2, CANVAS_SIZE.h);
    ctx1.closePath();
    ctx1.fillStyle = ctx1.createPattern(
      patternCanvas,
      'repeat'
    ) as CanvasPattern;
    ctx1.fill();

    ctx1.restore();

    const canvas2 = this.canvas2.nativeElement;
    canvas2.width = CANVAS_SIZE.w;
    canvas2.height = CANVAS_SIZE.h;
    const ctx2 = canvas2.getContext('2d') as CanvasRenderingContext2D;
    ctx2.fillStyle = ctx2.createPattern(
      patternCanvas,
      'repeat'
    ) as CanvasPattern;
    ctx2.beginPath();
    ctx2.moveTo(CANVAS_SIZE.w / 2, CANVAS_SIZE.h / 2);
    ctx2.lineTo(0, CANVAS_SIZE.h / 2);
    ctx2.lineTo(0, CANVAS_SIZE.h);
    ctx2.lineTo(CANVAS_SIZE.w / 2, CANVAS_SIZE.h);
    ctx2.closePath();
    ctx2.fill();

    ctx2.restore();

    const canvas3 = this.canvas3.nativeElement;
    canvas3.width = CANVAS_SIZE.w;
    canvas3.height = CANVAS_SIZE.h;
    const ctx3 = canvas3.getContext('2d') as CanvasRenderingContext2D;

    ctx3.fillStyle = ctx3.createPattern(
      patternCanvas,
      'repeat'
    ) as CanvasPattern;
    ctx3.beginPath();
    ctx3.moveTo(CANVAS_SIZE.w / 2, CANVAS_SIZE.h / 2);
    ctx3.lineTo(CANVAS_SIZE.w / 2, 0);
    ctx3.lineTo(CANVAS_SIZE.w, 0);
    ctx3.lineTo(CANVAS_SIZE.w, CANVAS_SIZE.h / 2);
    ctx3.closePath();
    ctx3.fill();

    ctx3.restore();

    const canvas4 = this.canvas4.nativeElement;
    canvas4.width = CANVAS_SIZE.w;
    canvas4.height = CANVAS_SIZE.h;
    const ctx4 = canvas4.getContext('2d') as CanvasRenderingContext2D;
    ctx4.fillStyle = ctx4.createPattern(
      patternCanvas,
      'repeat'
      // 'no-repeat'
    ) as CanvasPattern;
    ctx4.beginPath();
    ctx4.moveTo(CANVAS_SIZE.w / 2, CANVAS_SIZE.h / 2);
    ctx4.lineTo(CANVAS_SIZE.w / 2, 0);
    ctx4.lineTo(0, 0);
    ctx4.lineTo(0, CANVAS_SIZE.h / 2);
    ctx4.closePath();
    ctx4.fill();

    ctx4.restore();

    // this.showPolygonsBorders([ctx1, ctx2, ctx3, ctx4]);
    // this.showCanvasesBorders([ctx1, ctx2, ctx3, ctx4]);
  }

  showPolygonsBorders(ctxs: CanvasRenderingContext2D[]) {
    ctxs.forEach((ctx) => {
      ctx.stroke();
    });
  }

  showCanvasesBorders(ctxs: CanvasRenderingContext2D[]) {
    ctxs.forEach((ctx) => {
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1D267D';
      ctx.strokeRect(0, 0, CANVAS_SIZE.w, CANVAS_SIZE.h);
    });
  }
}

bootstrapApplication(AppComponent);
