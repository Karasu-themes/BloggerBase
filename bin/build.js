import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import compiler from '../core/compiler.js';
import { writeBuild, getThemeConfig, getMode, getPackageJson } from '../core/utils.js';

export default function build(program, { route, folderName }) {

  const bb = chalk.hex('#6366f1').bold;

  program.command('build')
    .description('Compilamos y guardamos el tema creado')
    .option('-m, --mode <mode>', 'Modo de uso')
    .action(async (options) => {
      const entryPointApp = path.join(path.resolve(route, folderName), 'app.ejs');
      const mode = options.mode ?? "production";
      const config = await getThemeConfig(route);
      const { version } = getPackageJson();

      // Comprobamos que la capreta ./app exista
      if (!fs.existsSync(path.resolve(route, folderName))) {
        console.log(`No existe la carpeta ./${folderName}`);
        process.exit(1);
      }

      // Comprobamos que exista app.ejs en ./app
      if (!fs.existsSync(entryPointApp)) {
        console.log(`No existe el archivo app.ejs en la carpeta ./${folderName}`);
        process.exit(1);
      }

      console.log(`${bb(`BloggerBase | version ${version} \n`)}`);

      const compiled = await compiler(entryPointApp, {
        ...getMode(mode),
        ...config
      });

      writeBuild(compiled, config)
    });
}