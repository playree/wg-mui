import { heroui } from '@heroui/react'
import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        noto: [
          'var(--font-noto-sans-jp)',
          'BlinkMacSystemFont',
          'Roboto',
          'Segoe UI',
          'Helvetica Neue',
          'HelveticaNeue',
          '游ゴシック体',
          'YuGothic',
          '游ゴシック Medium',
          'Yu Gothic Medium',
          '游ゴシック',
          'Yu Gothic',
          'Verdana',
          'メイリオ',
          'Meiryo',
          'sans-serif',
        ],
        mono: ['var(--font-roboto-mono)'],
      },
    },
  },
  darkMode: 'class',
  plugins: [heroui()],
} satisfies Config
