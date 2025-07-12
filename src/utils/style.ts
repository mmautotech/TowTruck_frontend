// src/utils/style.ts
import { wp, hp } from './responsive';

// --- COLORS ---
export const COLORS = {
  primary: '#357EBD',
  secondary: '#00C853',
  danger: '#E74C3C',
  white: '#fff',
  black: '#000',
  gray: '#888',
  lightGray: '#ccc',
  text: '#333',
  background: '#fff',
  badge: '#FF3B30',
  border: '#ccc',
};

// --- FONT SIZES (responsive, typical design scale) ---
export const FONT_SIZE = {
  xs: wp(3.2),
  sm: wp(3.8),
  md: wp(4),
  lg: wp(5),
  xl: wp(6),
  xxl: wp(8),
  title: wp(7.5),
};

// --- FONT WEIGHTS (use only these values!) ---
export const FONT_WEIGHT = {
  regular: '400' as '400',
  medium: '500' as '500',
  semiBold: '600' as '600',
  bold: 'bold' as 'bold',
};

// --- SPACING ---
export const SPACING = {
  xs: wp(2),
  sm: wp(3),
  md: wp(4),
  lg: wp(5),
  xl: wp(7),
};

// --- BORDERS & RADIUS ---
export const BORDERS = {
  radius: wp(2),
  radiusLg: wp(4),
  borderWidth: 1,
};

// --- SHADOWS ---
export const SHADOW = {
  shadowColor: COLORS.black,
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 2,
};

// --- ICON SIZES ---
export const ICON_SIZE = {
  sm: wp(4),
  md: wp(5),
  lg: wp(6),
};

