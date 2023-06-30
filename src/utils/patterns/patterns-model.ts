import { fromDegToRad } from '../math';
import { isDefined } from '../general';

export const DEFAULT_LINE_WIDTH_PX = 2;

export const getLineWidth = (weight: number) =>
  (weight + 1) * DEFAULT_LINE_WIDTH_PX;

/**
 * @prop { string } color - background color
 * @prop { string } pattern_color - '#RRGGBBAA' (AA is alpha for opacity)
 * @prop { number[] } pattern_style - [length of dash, length of space, length of dash, length of space, ...];  [1, 0] - solid line.
 * @prop { number } pattern_angle - DEG, from -90 to 90
 * @prop { number } cross_pattern_angle - DEG, from -90 to 90
 * @prop { number } pattern_spacing - ground units (the units used for the design meters/mm/foot etc)
 * @prop { number } cross_pattern_spacing - ground units (the units used for the design meters/mm/foot etc)*
 * @prop { number } weight - line width = (weight + 1) * default (default = 2px) ;
 */
export interface FillStyle {
  color: string;
  pattern_color: string;
  pattern_style: Array<number>;
  pattern_angle_rad: number;
  pattern_spacing_px: number;
  weight: number;
  cross_pattern_angle_rad?: number;
  cross_pattern_spacing_px?: number;
  width?: number;
  fill_type_detected?: 'solid' | 'lines' | 'cross-lines';
}

export const TEST_CROSS_HATCH: FillStyle = {
  color: '#E8F6EF',
  pattern_color: '#4C4C6Daa',
  pattern_style: [7, 3],
  pattern_angle_rad: fromDegToRad(60),
  cross_pattern_angle_rad: fromDegToRad(-60),
  pattern_spacing_px: 20,
  cross_pattern_spacing_px: 40,
  weight: 0,
};

export const TEST_LINES_HATCH: FillStyle = {
  color: '#E8F6EF',
  pattern_color: '#4C4C6Daa',
  pattern_style: [7, 3],
  pattern_angle_rad: fromDegToRad(60),
  pattern_spacing_px: 20,
  weight: 0,
};

/**
 * @description pattern style [1, 0] means solid line
 */
export const isSolidLine = (patternStyle: number[]) => {
  return (
    isDefined(patternStyle) &&
    patternStyle.length === 2 &&
    patternStyle[0] === 1 &&
    patternStyle[1] === 0
  );
};

export const detectFillType = (
  fill: FillStyle
): 'solid' | 'lines' | 'cross-lines' => {
  if (!isDefined(fill)) {
    return;
  }
  let type = null;
  const SOLID_REQUIRED_PROPS = ['color', 'pattern_style'];
  const LINES_REQUIRED_PROPS = ['pattern_angle_rad', 'pattern_spacing_px'];
  const CROSS_LINES_REQUIRED_PROPS = [
    'cross_pattern_angle_rad',
    'cross_pattern_spacing_px',
  ];

  const fillKeys = Object.keys(fill);

  const hasSolidFillProps = SOLID_REQUIRED_PROPS.reduce(
    (res: boolean, prop: string) => res && fillKeys.includes(prop),
    true
  );
  const hasLinesProps = LINES_REQUIRED_PROPS.reduce(
    (res: boolean, prop: string) => res && fillKeys.includes(prop),
    true
  );
  const hasCrossLinesProps = CROSS_LINES_REQUIRED_PROPS.reduce(
    (res: boolean, prop: string) => res && fillKeys.includes(prop),
    true
  );

  if (hasCrossLinesProps && hasLinesProps) {
    type = 'cross-lines';
  } else if (hasLinesProps) {
    type = 'lines';
  } else if (hasSolidFillProps && isSolidLine(fill.pattern_style)) {
    type = 'solid';
  }

  return type;
};
