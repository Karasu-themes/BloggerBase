import { postcssPlugins } from "./postcss.plugins.js";
import { rollupPlugins } from "./rollup.plugins.js";

/**
 * Config
 */
export const config = {
  /**
   * Theme information
   */
  theme: {
    name: "Kronos",
    description: "A tool for building blogger template based in ejs",
    version: "1.0.5",
    url: "https://github.com/Karasu-themes/kronos"
  },

  /**
   * Author information
   */
  author: {
    name: "MarceloTLD",
    url: "https://github.com/MarceloTLD"
  },

  /**
   * License type
   */
  license: "Release under MIT License",

  /**
   * Plugins (Don't touch here!)
   */
  plugins: {
    /* postcss */
    postcss: [...postcssPlugins],

    /* rollup */
    rollup: [...rollupPlugins]
  }
}