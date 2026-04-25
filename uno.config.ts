import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  theme: {
    fontFamily: {
      sp: "'Bangers', cursive"
    },
    colors: {
      sp: {
        yellow: '#FFC20E',
        red: '#C00000',
        dark: '#16163a',
        darker: '#0a0a14'
      }
    }
  },
  shortcuts: {
    'btn-spin':
      'px-8 py-4 bg-sp-yellow text-black font-black text-2xl rounded-full cursor-pointer select-none transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sp-yellow/30 border-3 border-black',
    'card-base':
      'rounded-2xl bg-white/5 border border-white/10 p-6',
    'pill':
      'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold'
  }
})
