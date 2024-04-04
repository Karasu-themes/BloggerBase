import { addAutoIDWidget, bloggerVariables } from "./blogger-directives.js";

export default async function blogger(content) {
  let compiled = addAutoIDWidget(content);
  const directives = [bloggerVariables];

  directives.forEach(directive => {
    compiled = directive(compiled);
  });

  return compiled;
}