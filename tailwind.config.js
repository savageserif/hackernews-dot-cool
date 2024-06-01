/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.vue'],
  theme: {
    fontFamily: {
      sans: ['"Source Sans 3 Var", sans-serif', { fontFeatureSettings: '"cv04", "cv17"' }],
      mono: ['"Source Code Var", monospace', { fontFeatureSettings: '"ss04"' }],
      serif: ['"Nice Var", serif', { fontVariationSettings: '"opsz" 6' }],
      'serif-heading': ['"Nice Var", serif', { fontVariationSettings: '"opsz" 12' }],
    },
    fontSize: {
      base: ['1.03125rem', { lineHeight: '1.125rem', fontWeight: '450' }],
      'base-serif': ['1rem', { lineHeight: '1.1875rem', fontWeight: '420' }],
      small: ['0.90625rem', { lineHeight: '1.0625rem' }],
    },
    fontWeight: {
      medium: '500',
      bold: '700',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      blue: '#4C9EFF',
      gray: {
        50: '#F9F9FB',
        100: '#EFF1F5', // header bg
        200: '#DBDDE6', // borders
        300: '#C7CAD6',
        400: '#AFB3C0', // indentation
        500: '#9598A4', // secondary
        600: '#82879C',
        700: '#707794',
        800: '#5C6484',
        900: '#3E4560',
        950: '#2A2F46', // primary
      },
      orange: {
        50: '#FFF9F5',
        100: '#FFF3EB',
        200: '#FFE3D1', // active bg
        300: '#FFD4B8',
        400: '#FFC299',
        500: '#FFAF7A',
        600: '#FF944D',
        700: '#FF7519', // accent
        800: '#DB5800',
        900: '#8F3900',
        950: '#522100', // primary & secondary (60% opacity)
      },
    },
    extend: {
      lineHeight: {
        'paragraph-narrow': '1.3125rem',
        'paragraph-wide': '1.375rem',
      },
      spacing: {
        90: '22.5rem', // 360px
        150: '37.5rem', // 600px
      },
      boxShadow: {
        'border-y': '0 0.0625rem, 0 -0.0625rem',
        'border-b': '0 0.0625rem',
        menu: '0 0 0 1px rgb(0 0 0 / 0.1), 0 2px 4px rgb(0 0 0 / 0.07), 0 4px 8px rgb(0 0 0 / 0.07);',
        'indentation-t': '0 -0.5rem, 0 -1rem, 0 -1.5rem, 0 -2rem',
      },
      transitionDuration: {
        200: '200ms',
      },
      animation: {
        appear: 'appear 0.2s',
        step: 'step 0.75s infinite',
      },
      keyframes: {
        appear: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        step: {
          '0%, 12.4999%': { transform: 'rotate(0deg)' },
          '12.5%, 24.9999%': { transform: 'rotate(45deg)' },
          '25%, 37.4999%': { transform: 'rotate(90deg)' },
          '37.5%, 49.9999%': { transform: 'rotate(135deg)' },
          '50%, 62.4999%': { transform: 'rotate(180deg)' },
          '62.5%, 74.9999%': { transform: 'rotate(225deg)' },
          '75%, 87.4999%': { transform: 'rotate(270deg)' },
          '87.5%, 100%': { transform: 'rotate(315deg)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries'), require('@headlessui/tailwindcss')],
};
