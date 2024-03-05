export function htmlTags(params) {
  let tag = "";
  for (const key in params) {
    tag += `${key}='${params[key]}' `;
  }
  return tag.trim();
}

export function Variable(params) {
  let strvar = "";
  for (const key in params) {
    strvar += `${key}="${params[key]}" `;
  }
  return `<Variable ${strvar.trim()} />`;
}

export function Variables(name, variables) {
  let str = "";
  str += `<!-- ${name} -->\n`;

  variables.forEach(v => {
    let strvar = "";
    for (const key in v) {
      strvar += `${key}="${v[key]}" `;
    }
    str += `<Variable ${strvar.trim()} />\n`;
  });

  return str
}

export function VariableGroup(name, description, selector, variables) {
  let strGroup = "";

  strGroup += `<!-- ${name} -->\n`;
  strGroup += `<Group description="${description}" selector="${selector}">\n`;

  variables.forEach(v => {
    strGroup += "  " + Variable(v) + "\n"
  })

  strGroup += `</Group>`;

  return strGroup;
}