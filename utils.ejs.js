module.exports = {
  /**
   * 
   * @param {Object} params 
   * @returns String
   */
  Variable: function (params) {
    let strvar = "";
    for (const key in params) {
      strvar += `${key}="${params[key]}" `;
    }
    return `<Variable ${strvar.trim()} />`;
  },

  /**
   * 
   * @param {String} name 
   * @param {Array_Object} variables 
   * @returns String
   */
  Variables: function (name, variables) {
    let str = "";
    str += `<!-- ${name} -->\n`;

    variables.map(v => {
      let strvar = "";
      for (const key in v) {
        strvar += `${key}="${v[key]}" `;
      }
      str += `<Variable ${strvar.trim()} />\n`;
    });

    return str
  },
  Group: function Group (name, description, selector, variables) {
    let strGroup = "";
    
    strGroup += `<!-- ${name} -->\n`;
    strGroup += `<Group description="${description}" selector="${selector}">\n`;
    
    variables.forEach(v => {
      strGroup+= "  " + this.Variable(v) + "\n"
    })
    
    strGroup += `</Group>`;
    
    return strGroup;
  },
  xmlTag: function () {
    return `<?xml version='1.0' encoding='UTF-8' ?>`;
  },
  htmlTags: function (params) {
    let tag="";
    for (const key in params) {
      tag+=`${key}='${params[key]}' `;
    }
    return tag.trim();
  }
}