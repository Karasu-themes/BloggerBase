import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { themeConfig } from '../theme.config.js';

export function getEntryPointApp(route, folderName) {
  let getEntryPointApp = fs.readdirSync(path.resolve(route, folderName));
  getEntryPointApp = getEntryPointApp.filter(n => {
    return /app\.(xml|ejs|html)/g.test(n)
  });
  return getEntryPointApp[0] ?? "app.ejs";
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
 * Get the ejs variables to use
 * @param {folderName} route 
 * @returns 
 */
export async function getEjsVariables(route) {

  const file = path.resolve(dirname(), route, "ejs.variables.js");
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
  const params = tag.match(/\w+=['"]([^"']+)?['"]/g); // match with: attr="", attr="value", attr='', attr='value'
  let objParam = {};

  params.forEach(param => {
    const keyName = param.replace(/(?:\=['"](.*)?['"])/g, '');
    const matchValue = param.match(/(?:['"](.*)?['"])/);
    objParam[keyName] = matchValue[1] ?? "";
  });

  return objParam;
}