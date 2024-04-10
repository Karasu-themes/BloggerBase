import { btagParams } from './utils.js';

export function addAutoIDWidget(content) {
  let compiled = content;
  const bwidgets = content.match(/<b\:widget(.*)?>/g) ?? [];

  // All widgets types available
  const widgetTypes = [
    "AdSense",
    "Attributions",
    "Blog",
    "BlogArchive",
    "BloggerButton",
    "BlogList",
    "BlogSearch",
    "ContactForm",
    "FeaturedPost",
    "Feed",
    "Followers",
    "Header",
    "HTML",
    "Text",
    "Image",
    "Label",
    "LinkList",
    "PageList",
    "PopularPosts",
    "Profile",
    "Stats",
    "Subscribe",
    "TextList",
    "Translate",
    "Wikipedia",
  ]

  widgetTypes.forEach(type => {
    let count = 0;
    for (const bwidget of bwidgets) {
      const wtype = /type=['"][A-Za-z-0-9]+['"]/.exec(bwidget);
      const ctype = wtype[0].replace(/(?:\w+=|')/g, '');
      const isAutoCloseTag = /\/>/g.test(bwidget) ?? false;

      if (ctype == type && !bwidget.includes('id=')) {
        let attrs = '';
        const params = btagParams(wtype.input);
        count++;

        params.id = type + count;
        for (const key in params) attrs += `${key}="${params[key]}" `;

        compiled = compiled.replace(bwidget, `<b:widget ${attrs}${(isAutoCloseTag ? "/" : "")}>`)
      }
    }

  })

  return compiled;
}

export function bloggerVariables(content) {
  let compiled = content;
  const variables = content.match(/<Variable(.*)?\/>/g) ?? [];

  for (const variable of variables) {
    let attrs = '';
    const regex = new RegExp(`params=['"](.*)?['"]`);
    const params = variable.match(regex);
    const bvars = JSON.parse(params[1]);

    for (const key in bvars) {
      attrs += `${key}="${bvars[key]}" `;
    }

    compiled = compiled.replace(regex, attrs);
  }

  return compiled;
}