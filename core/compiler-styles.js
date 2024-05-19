import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import CleanCSS from 'clean-css';
import * as sass from 'sass';
import { CONFIG } from './config.js';
import { btagParams, getPostcssConfig } from "./utils.js";

export default async function compilerStyles(content, opts = {}) {
  let styles = content;
  const bstyles = content.match(/@style((.*)?)\;?/g) ?? [];
  const postcssConfig = await getPostcssConfig(CONFIG.route);

  for (const bstyle of bstyles) {
    const params = btagParams(bstyle);

    // Compile style only if src is provided
    if (params.src) {
      let compiled = '';
      const lang = path.extname(params.src).replace('.', '') ?? "css";
      const folderPath = path.resolve(path.join(CONFIG.route, CONFIG.folderName, CONFIG.folderAssets));
      const filePath = path.resolve(path.join(CONFIG.route, CONFIG.folderName, CONFIG.folderAssets, params.src))
      const fileName = path.parse(params.src).name;
      const fileContent = fs.readFileSync(filePath, 'utf8');

      // Compile scss/sass files
      if (lang == "scss" || lang == "sass") {
        const sassCompiled = await sass.compileStringAsync(fileContent, {
          loadPaths: [
            path.resolve(`${folderPath}/`),
            path.resolve(`${folderPath}/style/`),
            path.resolve(`${folderPath}/styles/`),
            path.resolve(`${folderPath}/css/`),
            path.resolve(`${folderPath}/scss/`),
            path.resolve(`${folderPath}/sass/`)
          ],
          style: params.output ? params.output : "expanded"
        });
        compiled = sassCompiled.css;
      } else {
        compiled = fileContent;
      }

      // Process css with postcss
      const { css } = await postcss(postcssConfig.plugins).process(compiled, { from: undefined });

      // Minify the css with CleanCSS
      const compiledMinify = new CleanCSS({}).minify(css);;
      compiled = css;

      // Write compiled file only if the mode is set on "production" and "build" params is provided
      if (opts.modes.mode === "production" && (params.build && params.build == "true")) {
        const pathBuild = `${CONFIG.route}/${CONFIG.folderDist}/css`;
        if (!fs.existsSync(`${CONFIG.route}/${CONFIG.folderDist}`)) fs.mkdirSync(`${CONFIG.route}/${CONFIG.folderDist}`);
        if (!fs.existsSync(pathBuild)) fs.mkdirSync(pathBuild);
        fs.writeFileSync(path.resolve(path.join(pathBuild, `${fileName}.css`)), compiled.trim(), "utf8")
        fs.writeFileSync(path.resolve(path.join(pathBuild, `${fileName}.min.css`)), compiledMinify.styles.trim(), "utf8")
      }

      styles = styles.replace(bstyle, compiledMinify.styles.trim());

    }
  }

  return styles;
}