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
    // const patternCanvas = getHorizontalHatchPattern();
    // const patternCanvas = getVerticalHatchPattern();
    // const patternCanvas = getDiagonalHatchPatternUpd();
    // const patternCanvas = getCrossHatchPattern2();
    // const patternCanvas = getGravelPattern();
    // const patternCanvas = getHoneycombsPattern();
    const patternCanvas = getHatchPattern();

    const canvasA = this.canvasA.nativeElement;
    canvasA.width = 300;
    canvasA.height = 300;
    const ctxA = canvasA.getContext('2d') as CanvasRenderingContext2D;

    // setCustomPattern(ctxA);

    ctxA.fillStyle = ctxA.createPattern(
      patternCanvas,
      'repeat'
    ) as CanvasPattern;
    ctxA.fillRect(0, 0, 300, 300);

    // const canvasB = this.canvasB.nativeElement;
    // canvasB.width = 300;
    // canvasB.height = 300;
    // const ctxB = canvasB.getContext('2d') as CanvasRenderingContext2D;

    // ctxB.fillStyle = ctxB.createPattern(
    //   patternCanvas,
    //   'repeat'
    // ) as CanvasPattern;
    // ctxB.fillRect(0, 0, 300, 300);
  }
}

bootstrapApplication(AppComponent);
