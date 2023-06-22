import { fromDegToRad } from '../math';

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
  cross_pattern_angle_rad: number;
  pattern_spacing_px: number;
  cross_pattern_spacing_px: number;
  weight: number;
  width?: number;
}

export const TEST_HATCH: FillStyle = {
  color: '#E8F6EF',
  pattern_color: '#4C4C6D',
  pattern_style: [7, 3],
  pattern_angle_rad: fromDegToRad(60),
  cross_pattern_angle_rad: fromDegToRad(-60),
  pattern_spacing_px: 20,
  cross_pattern_spacing_px: 40,
  weight: 0,
};
