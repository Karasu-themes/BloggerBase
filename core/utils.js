import fs from 'node:fs';
import { fileURLToPath } from 'url';
import path from 'node:path';
import chalk from 'chalk';
import { themeConfig } from '../theme.config.js';
const fsP = fs.promises;

export async function loadFile(pathFile) {
  const fileContent = await fsP.readFile(pathFile, 'utf8');
  return fileContent;
}

export function tagStyle(cdta, content) {
  return cdta ? `<style><![CDATA[\n${content.trim()}\n]]>\n</style>` : `<style>\n${content.trim()}\n</style>`;
}

export function writeBuild(content, config = {}, DIR = './dist') {
  const { theme } = config;

  // Revisamos si el directorio ./dist no existe
  if (!fs.existsSync(DIR)) {

    // Si no existe, la creamos. :D
    fs.mkdirSync(DIR);
  }

  // Guardamos el archivo
  fs.writeFileSync(`${DIR}/${theme.outputName ?? "blogger-base"}@${theme.version}.xml`, content, 'utf8');
}

export function timeStamp(stime, etime) {
  const time = etime.getTime() - stime.getTime();
  return `${time}ms`;
}

export function parseParams() {
  // Obtener los argumentos de la línea de comandos
  const args = process.argv.slice(2);

  // Definir un objeto para almacenar los argumentos como pares clave-valor
  const params = {};

  // Iterar sobre los argumentos y parsearlos
  args.forEach(arg => {
    const [key, value] = arg.split('=');
    params[key.replace('--', '')] = value || true;
  });

  return params;
}

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
 * Obtiene el archivo de configuración del tema actual
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
 * Obtiene el archivo de configuración de postcss
 */
export async function getPostcssConfig(route) {

  const file = path.resolve(dirname(), route, "postcss.config.js");
  let config = {
    plugins: []
  };

  if (fs.existsSync(file)) {

    const { default: currentConfig } = await import(`file://${file}`);

    config = {...config, ...currentConfig};
  }

  return config;
}

/**
 * Obtiene el archivo de configuración de rollup
 */
export async function getRollupConfig(route) {

  const file = path.resolve(dirname(), route, "rollup.config.js");
  let config = {
    plugins: []
  };

  if (fs.existsSync(file)) {

    const { default: currentConfig } = await import(`file://${file}`);

    config = {...config, ...currentConfig};
  }

  return config;
}

export function getPackageJson () {
  const file = path.resolve(dirname(),"../", "package.json");
  if (fs.existsSync(file)) {
    const packageFile = fs.readFileSync(file, 'utf8');
    return JSON.parse(packageFile);
  }

  return {};
}

export function getMode(mode) {
  return {
    mode: mode,
    devMode: (mode ?? "development") == "development",
    demoMode: (mode ?? "") == "demo",
    prodMode: (mode ?? "") == "production",
  }
}