/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.vue'],
  darkMode: 'selector',
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
      'normal-serif': '420',
      normal: '450',
      'normal-italic': '480',
      medium: '520',
      bold: '700',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'blank-color': 'hsl(var(--color-bg-blank) / <alpha-value>)',
      'hover-color': 'hsl(var(--color-bg-hover) / <alpha-value>)',
      'controls-color': 'hsl(var(--color-bg-controls) / <alpha-value>)',
      'selection-color': 'hsl(var(--color-bg-selection) / <alpha-value>)',
      'primary-color': 'hsl(var(--color-text-primary) / <alpha-value>)',
      'primary-selected-color': 'hsl(var(--color-text-primary-selected) / <alpha-value>)',
      'secondary-color': 'hsl(var(--color-text-secondary) / <alpha-value>)',
      'separator-color': 'hsl(var(--color-separator) / <alpha-value>)',
      'indentation-color': 'hsl(var(--color-indentation) / <alpha-value>)',
      'icon-color': 'hsl(var(--color-icon) / <alpha-value>)',
      'accent-color': 'hsl(var(--color-accent) / <alpha-value>)',
      'focus-color': 'hsl(var(--color-focus) / <alpha-value>)',
    },
    borderRadius: {
      none: '0',
      DEFAULT: '0.1875rem',
      outline: '0.21875rem',
      dialog: '0.625rem',
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
      containers: {
        'comment-wide': '28rem',
        'comment-detached': '37.5625rem',
      },
      boxShadow: {
        'border-y': '0 0.0625rem, 0 -0.0625rem',
        'border-b': '0 0.0625rem',
        'indentation-t': '0 -0.5rem, 0 -1rem, 0 -1.5rem, 0 -2rem',
        menu: '0 0 0 1px rgb(0 0 0 / 0.1), 0 2px 4px rgb(0 0 0 / 0.075), 0 4px 8px rgb(0 0 0 / 0.075)',
        'menu-dark':
          '0 0 0 1px rgb(0 0 0 / 0.1), 0 2px 4px rgb(0 0 0 / 0.15), 0 4px 8px rgb(0 0 0 / 0.15)',
        dialog: '0 4px 8px rgb(0 0 0 / 0.075), 0 8px 16px rgb(0 0 0 / 0.075)',
      },
      transitionDuration: {
        200: '200ms',
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries'), require('@headlessui/tailwindcss')],
};
