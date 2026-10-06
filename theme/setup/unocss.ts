import { defineUnoSetup } from '@slidev/types'

export default defineUnoSetup(() => ({
  theme: {
    colors: {
      'em-midnight': '#201F2C',
      'em-violet': '#A653FF',
      'em-lime': '#B7E400',
      'em-light-grey': '#F5F5F5',
      'em-red': '#FF6554',
      'em-orange': '#FF9E0D',
      'em-green': '#31D495',
      'em-blue': '#5EC4F7',
      'em-pink': '#F881D1',
      'em-dark-gray': '#787878',
      'em-dark-violet': '#6D0EDB',
      'em-light-violet': '#C396F9',
    },
    fontFamily: {
      brand: ['ABC Diatype Rounded', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
    },
    letterSpacing: {
      'brand-tight': '-0.03em',
      'brand-wide': '0.05em',
      'brand-caption': '0.03em',
    },
  },
}))
