import compiler from "./compiler.js";
import { parseParams, writeBuild } from "./utils.js";

const content_compiled = await compiler();

writeBuild(content_compiled);