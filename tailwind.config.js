/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.vue'],
  theme: {
    fontFamily: {
      sans: ['"Source Sans 3 VF"', 'sans-serif'],
      'serif-text': ['"Nice Text"', 'serif'],
      'serif-micro': ['"Nice Micro"', 'serif'],
    },
    fontSize: {
      base: ['1.03125rem', '1.125rem'],
      'base-serif': ['1rem', '1.1875rem'],
      small: '0.90625rem',
    },
    lineHeight: {
      base: '1.125rem',
      'paragraph-narrow': '1.3125rem',
      'paragraph-wide': '1.375rem',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      gray: {
        50: '#F9F9FB',
        100: '#EFF1F5', // header bg
        200: '#DBDDE6', // borders
        300: '#C7CAD6',
        400: '#AFB3C0', // indentation
        500: '#9598A4', // icons
        600: '#82879C',
        700: '#707794',
        800: '#5C6484',
        900: '#3E4560',
        950: '#2A2F46', // text
      },
      orange: {
        50: '#FFF9F5',
        100: '#FFF3EB',
        200: '#FFE3D1',
        300: '#FFD4B8',
        400: '#FFC299',
        500: '#FFAF7A',
        600: '#FF944D',
        700: '#FF7519', // accent
        800: '#E05A00',
        900: '#9E3F00',
        950: '#752F00',
      },
    },
    extend: {
      spacing: {
        90: '22.5rem', // 360px
        150: '37.5rem', // 600px
      },
      transitionDuration: {
        200: '200ms',
      },
    },
  },
  plugins: [],
};
