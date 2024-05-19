import chalk from 'chalk';
import { CONFIG } from '../core/config.js';
import compiler from '../core/compiler.js';
import { writeBuild, getThemeConfig, getMode, getPackageJson, getEntryPointApp } from '../core/utils.js';

export default function build(program, { route, folderName }) {

  const bb = chalk.bgHex('#6366f1').hex("#ffffff").bold;

  program.command('build')
    .description('Compile all files')
    .option('-m, --mode <mode>', 'Modo de uso')
    .action(async (options) => {

      const mode = options.mode ?? "production";
      const config = await getThemeConfig(route);
      const { version } = getPackageJson();

      console.log(`${bb(`BloggerBase`)} v${version}`);

      const compiled = await compiler({
        ...{ modes: getMode(mode) }
      });

      writeBuild(compiled, config, CONFIG.route + "/dist")
    });
}