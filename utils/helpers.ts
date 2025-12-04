import tinycolor from 'tinycolor2';
export const formatDate = (date: string) => {
  const formatted = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(date));

  return formatted;
};

export const formatDigits = (digit: number) => {
  return digit.toLocaleString();
};

export function generateColorShades(hex: string) {
  const base = tinycolor(hex);

  return {
    50: base.clone().lighten(45).toHexString(),
    100: base.clone().lighten(35).toHexString(),
    200: base.clone().lighten(25).toHexString(),
    300: base.clone().lighten(15).toHexString(),
    400: base.clone().lighten(5).toHexString(),
    500: base.clone().toHexString(), // base color
    600: base.clone().darken(5).toHexString(),
    700: base.clone().darken(15).toHexString(),
    800: base.clone().darken(25).toHexString(),
    900: base.clone().darken(35).toHexString(),
  };
}
