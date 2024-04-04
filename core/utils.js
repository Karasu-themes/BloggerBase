import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { themeConfig } from '../theme.config.js';

export function getEntryPointApp(route, folderName) {
  let getEntryPointApp = fs.readdirSync(path.resolve(route, folderName));
  getEntryPointApp = getEntryPointApp.filter(n => {
    return /app\.(xml|njk|html)/g.test(n)
  });
  return getEntryPointApp[0] ?? "app.njk";
}

export function writeBuild(content, config = {}, DIR = './dist') {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR);
  fs.writeFileSync(`${DIR}/${config.outputName ?? "blogger-base"}@${config.version}.xml`, content, 'utf8');
}

export function timeStamp(stime, etime) {
  const time = etime.getTime() - stime.getTime();
  return `${time}ms`;
}

/**
 * Get the current directory
 * @returns String
 */
export function dirname() {
  return path.dirname(fileURLToPath(import.meta.url));
}

export function mergeObj(bobj, nobj) {
  for (let key in nobj) {
    if (typeof nobj[key] === 'object' && nobj[key] !== null) {

      if (bobj[key] === undefined) {
        bobj[key] = {};
      }

      bobj[key] = mergeObj(bobj[key], nobj[key]);
    } else {

      bobj[key] = nobj[key];
    }
  }
  return bobj;
}

/**
 * Get the theme configuration
 * @param {folderName} route 
 * @returns 
 */
export async function getThemeConfig(route) {

  const file = path.resolve(dirname(), route, "theme.config.js");

  let config = themeConfig;

  if (fs.existsSync(file)) {

    const { default: currentConfig } = await import(`file://${file}`);

    config = mergeObj(config, currentConfig);
  }

  return config;
}

/**
 * Get the postcss configuration
 * @param {folderName} route 
 * @returns 
 */
export async function getPostcssConfig(route) {

  const file = path.resolve(dirname(), route, "postcss.config.js");
  let config = {
    plugins: []
  };

  if (fs.existsSync(file)) {

    const { default: currentConfig } = await import(`file://${file}`);

    config = { ...config, ...currentConfig };
  }

  return config;
}

/**
 * Get the nunjucks variables to use
 * @param {folderName} route 
 * @returns 
 */
export async function getNjkVariables(route) {

  const file = path.resolve(dirname(), route, "nunjucks.variables.js");
  let variables = {};

  if (fs.existsSync(file)) {

    const { default: currentVariables } = await import(`file://${file}`);

    variables = { ...variables, ...currentVariables };
  }

  return variables;
}

/**
 * Get the rollup configuration from the route
 * @param {folderName} route 
 * @returns 
 */
export async function getRollupConfig(route) {

  const file = path.resolve(dirname(), route, "rollup.config.js");
  let config = {
    plugins: []
  };

  if (fs.existsSync(file)) {

    const { default: currentConfig } = await import(`file://${file}`);

    config = { ...config, ...currentConfig };
  }

  return config;
}

/**
 * Get the package.json content
 * @returns Object
 */
export function getPackageJson() {
  const file = path.resolve(dirname(), "../", "package.json");
  if (fs.existsSync(file)) {
    const packageFile = fs.readFileSync(file, 'utf8');
    return JSON.parse(packageFile);
  }

  return {};
}

export function getMode(mode) {
  return {
    mode: mode ?? "development",
    devMode: (mode ?? "development") == "development",
    demoMode: (mode ?? "") == "demo",
    prodMode: (mode ?? "") == "production",
  }
}

export function btagParams(tag) {
  const src = tag.match(/src="([^"]+)"/g) != null ? tag.match(/src="([^"]+)"/g)[0].match(/[^"]+/g)[1] : "";
  const format = tag.match(/format="([^"]+)"/g) != null ? tag.match(/format="([^"]+)"/g)[0].match(/[^"]+/g)[1] : "";
  const output = tag.match(/output="([^"]+)"/g) != null ? tag.match(/output="([^"]+)"/g)[0].match(/[^"]+/g)[1] : "";
  const name = tag.match(/name="([^"]+)"/g) != null ? tag.match(/name="([^"]+)"/g)[0].match(/[^"]+/g)[1] : "";
  const cdta = /cdta/g.test(tag);
  const render = /render/g.test(tag);

  return {
    src, format, output, name, cdta, render
  }
}