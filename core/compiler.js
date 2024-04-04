import compilerXML from "./compiler-xml.js";
import compilerStyles from "./compiler-styles.js";
import compilerScripts from "./compiler-scripts.js";
import blogger from "./blogger.js";
import chalk from "chalk";
import { timeStamp } from "./utils.js";

export default async function compiler(cfg) {
  const startTime = new Date();
  let compiled = '';

  // Compile XML files
  compiled = await compilerXML({ ...cfg.modes });

  // Compile css files
  compiled = await compilerStyles(compiled, { ...cfg });

  // Compile js files
  compiled = await compilerScripts(compiled, { ...cfg });

  // Compile blogger directive
  compiled = await blogger(compiled);

  const endTime = new Date();
  console.log(`Built in ${chalk.green(timeStamp(startTime, endTime))}`);

  return compiled;
}