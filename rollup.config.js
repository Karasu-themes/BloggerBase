// rollup.config.js
import { minify } from 'rollup-plugin-esbuild';

// Configuración de Rollup
export default {
  plugins: [
    minify()
  ]
};