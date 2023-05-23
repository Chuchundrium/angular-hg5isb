import 'zone.js/dist/zone';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { getHoneycombsPattern } from './patterns.service';

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
    // const patternCanvas = this.getHorizontalHatchPattern();
    // const patternCanvas = this.getVerticalHatchPattern();
    // const patternCanvas = this.getDiagonalHatchPatternUpd();
    // const patternCanvas = this.getCrossHatchPattern();
    // const patternCanvas = this.getGravelPattern();
    const patternCanvas = getHoneycombsPattern();

    const canvasA = this.canvasA.nativeElement;
    canvasA.width = 300;
    canvasA.height = 300;
    const ctxA = canvasA.getContext('2d') as CanvasRenderingContext2D;

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
