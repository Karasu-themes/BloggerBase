import chalk from 'chalk';
import { resolve } from 'node:path';
import { loadFile, timeStamp } from './utils.js';
import { themeConfig } from '../theme.config.js';
import { readFileSync } from 'node:fs';
import ejs from 'ejs';
import styles from './styles.js';
import scripts from './script.js';
import { htmlTags, Variable, Variables, VariableGroup } from './utils.ejs.js';
import blogger from './blogger.js';

/**
 * Compila los assets del proyecto actual
 * @returns String
 */
export default async function compiler(APP_DIR = false, cfg = {}) {
  const APP_PATH = APP_DIR ? APP_DIR : resolve(resolve(resolve(''), 'app') + "/app.ejs");
  const content = await loadFile(APP_PATH);
  const { theme } = themeConfig;
  const config = {
    ...cfg,
    ...theme,
    htmlTags,
    Variable,
    Variables,
    VariableGroup
  }
  let compiled = '';

  console.log(`${timeStamp(new Date())}: ${chalk.cyan("compiling ...")}`);
  
  compiled = ejs.render(content, config, { filename: APP_PATH });

  compiled = await blogger(compiled);

  compiled = await scripts(compiled);

  compiled = await styles(compiled);

  compiled = compiled.replace('!doctype', '!DOCTYPE');

  /**
   * Inyectamos la licencia del tema en base a la configuración proporcionada
   */
  compiled = compiled.replace(/@license\;?/, `
    /*!************************************************
    * Blogger Template Style
    * Name: ${theme.name}
    * version: ${theme.version}
    * Description: ${theme.description}
    * Theme URL: ${theme.url}
    * Author: ${theme.author.name}
    * Author URL: ${theme.author.url}
    * License: ${theme.license}
    **************************************************/`.trim() + "\n");

  /**
   * Agregamos las variables necesarias para manejar blogger
   */
  compiled = compiled.replace(/@variables\;?/, () => {
    const VAR_APP_PATH = resolve(resolve(resolve(''), 'app') + "/app.variables.ejs");
    const GET_CONTENT = readFileSync(VAR_APP_PATH, 'utf8');
    return GET_CONTENT ? ejs.render("/*"+ GET_CONTENT.trim() + " \n*/\n", config, { filename: APP_PATH, rmWhitespace: false }) : "";
  });

  console.log(`${timeStamp(new Date())}: ${chalk.green("compiled ✔")}`);

  return `<?xml version='1.0' encoding='UTF-8' ?>\n<!DOCTYPE html>\n${compiled}`;
}