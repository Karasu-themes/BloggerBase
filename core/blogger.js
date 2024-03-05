import * as cheerio from 'cheerio';

// Todos los tipos de widgets disponibles
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

export default async function blogger(content) {
  const $ = cheerio.load(content, { xmlMode: true, decodeEntities: false });

  // Aumentamos en uno según el mismo tipo de widget
  widgetTypes.forEach(type => {

    let count = 0;
    for (const btag of $('b\\:widget')) {
      const attribute = btag.attribs;

      if (type == attribute.type) {
        count++
        attribute.id = attribute.type + count;
      }

    }

  });

  // Damos soporte a la etiqueta <b:area> para manejar las areas de las diferentes secciones
  for (const area of $('b\\:area')) {
    const attribute = area.attribs;
    const name = attribute.name;
    $(area).replaceWith(`<b:tag cond='data:view.isLayoutMode' name='div' class='bs-area'>
      <b:tag cond='data:view.isLayoutMode' name='div' class='bs-area__wrapper ${name}'>\n${$(area).html()}</b:tag>
    </b:tag>`);
  }

  const results = $.html();

  return results
}