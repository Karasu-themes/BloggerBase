import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import compiler from '../core/compiler.js';
import { writeBuild, getThemeConfig, getMode } from '../core/utils.js';

export default function build(program, route) {

  const bb = chalk.hex('#6366f1').bold;

  program.command('build')
    .description('Compilamos y guardamos el tema creado')
    .option('-m, --mode <mode>', 'Modo de uso')
    .action(async (options) => {
      const entryPointApp = path.join(path.resolve(route, 'app'), 'app.ejs');
      const mode = options.mode ?? "production";
      const config = await getThemeConfig(route);

      // Comprobamos que la capreta ./app exista
      if (!fs.existsSync(path.resolve(route, 'app'))) {
        console.log('No existe la carpeta ./app');
        process.exit(1);
      }

      // Comprobamos que exista app.ejs en ./app
      if (!fs.existsSync(entryPointApp)) {
        console.log('No existe el archivo app.ejs en la carpeta ./app');
        process.exit(1);
      }

      console.log(`${bb(`BloggerBase | version 2.0.0 \n`)}`);

      const compiled = await compiler(entryPointApp, {
        ...getMode(mode),
        ...config
      });

      writeBuild(compiled, config)
    });
}