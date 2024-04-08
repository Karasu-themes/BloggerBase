<p align="center" dir="auto">
  <a href="#!" rel="nofollow">
    <picture>
      <source media="(prefers-color-scheme: light),(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Karasu-themes/BloggerBase/HEAD/.github/logo-dark.png">
      <source media="not all" srcset="https://raw.githubusercontent.com/Karasu-themes/BloggerBase/HEAD/.github/logo-light.png">
      <img alt="BloggerBase" src="https://raw.githubusercontent.com/Karasu-themes/BloggerBase/HEAD/.github/logo-dark.png" width="191" height="34" style="visibility:visible;max-width:100%;">
    </picture>
  </a>
</p>

<p align="center" dir="auto">Sistema base para crear plantillas blogger como nunca antes.</p>


<p align="center" dir="auto">
    <a href="https://github.com/Karasu-themes/BloggerBase/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Karasu-themes/BloggerBase" alt="License"></a>
    <span><img src="https://img.shields.io/npm/v/bloggerbase
    " alt="NPM Version" /></span>
</p>

------

[Demostración](https://ichiban-xml.blogspot.com/ "ver demostración")

## Característica destacadas

- Motor de plantilla gracias a `ejs`
- Compila código javascript y css directamente en los archivos `*.ejs`
- Plantillas de ejemplos con excelente rendimiento
- Soporte para plugins de **rollup** y **postcss**
- Eso y mucho más en camino... 

------

## Instalación

> Esta es una documentación temporal mientras se trabaja en una documentación más detallada y mejor explicada.

Para instalar BloggerBase es sumamente sencillo, ejecuta el siguiente comando en tu terminal:

```
npx create-blogger-theme my-awesome-template
```

> cambia `my-awesome-template` por el nombre de tu proyecto

y luego de unos segundos tendrás una carpeta con el nombre `my-awesome-template` o el que hayas eligido lista para desarrollar. Navega a
la carpeta que acabamos de crear e instala las dependencias con `npm install`. Hecho lo anterior ya podrás empezar a 
trabajar en tu próxima plantilla de blogger.

> [!WARNING]
> Recuerda tener instalado nodejs y npm en tu sistema para que los comandos anteriores funcionen correctamente

### Plantilla base

[**Ichiban**](https://github.com/Karasu-themes/ichiban) es una plantilla básica y punto de partida creada usando BloggerBase. Ideal para tener de referencia y no tener que empezar desde cero.

### Comandos npm

BloggerBase cuenta con tres comandos npm que nos permitirán trabajar con nuestra plantilla:

- `build` crea un build de nuestra plantilla en formato .xml lista para instalar en Blogger o distribuir.
- `start` ejecuta el modo de desarrollo el cuál nos permitirá trabajar en nuestro proyecto y aplicar cambios al momento
- `start:demo` Funcionamiento similar a `start`. Este modo dispará una variable `{{ demoMode }}` para usar en los archivos `*.ejs`.

## Estructura de carpetas

**BloggerBase** ha sido creado de cara a una experiencia de desarrollo rápida y flexible por lo qué la estructura
de carpetas y como organizamos cada archivo queda hasta cierto punto a elección del desarrollador salvo las carpetas requeridas para el correcto funcionamiento del sistema.

```
app/
├── assets (requerido)
├── markups
│   ├── common
│   └── gadgets
├── app.ejs (requerido)
```

- **/app** Es la carpeta dónde almacenaremos nuestra plantilla para blogger.
- **/assets** Aquí manejaremos tanto los estilos css como los códigos de javascript que vayamos necesitando.
- **/markups** Aquí va todo lo referente a los includables y elementos necesarios para agregar lógica y dinamismo a nuestra plantilla blogger.
  - **/common**
  - **/gadgets**
- **app.{xml,html,njk}** punto de entrada de la plantilla.

> [!WARNING]
> Bloggerbase tiene cómo punto de entrada un archvo `.ejs`, `.html` o `.xml` con el nombre `app` para poder generar los archivos.

## Trabajar con estilos css y javascript

Para trabajar nuestros estilos y código de javascript, contamos con dos directivas creadas para éste fin:

### @style

La etiqueta `@style` nos permitirá compilar y/o usar nuestro `css`, `scss` o `pcss`. Para usarla es tan simple como ubicar la etiqueta anteriormente mencionada en alguna parte en nuestros archivos **`*.ejs`**:

```xml
<!-- Sintaxis -->
@style(src='ruta/a/mi/estilo.css');
```

> Por defecto @style, compila automaticamente los estilos **`*.css`** cómo archivos de postcss (pcss) por lo que estos son compatibles con los plugins de postcss que instalemos y usemos.

> [!WARNING]
> Ésta directiva usa clean-css para minificar el código css generado, por lo que no es necesario incluir un plugin para este fin.

> [!WARNING]
> Recuerda incluir las etiquetas `<style>` `</style>` si necesitas agregar estilos fuera de la etiqueta `<b:skin>`

### @script

La etiqueta `@script` nos permite compilar código js directamente en nuestros archivos ***.ejs** gracias a rollup y soporta plugins de éste.

```xml
<script>
@script(src='ruta/a/mi/script.js')
</script>
```

> [!WARNING]
> Ésta directiva usa terser para minificar el código javascript por lo qué no es necesario agregar un plugin para este fin.

### Ruta base

Tanto `@script` y `@style` tienen de punto de entrada la carpeta `./assets` para encontrar los archivos **js, scs, css, pcss** que necesitemos al momento de usar alguna de las etiquetas antes mencionadas

### Consideraciones

Tanto **rollup** cómo **postcss** podrían o no soportar algunos plugins por el momento.

## Reporte de errores

Si tienes algú error/bug que reportar o quieres sugerir mejoras, puedes contactarme por medio de mi [telegram](https://t.me/marceloTLD). Por el momento no se aceptarán PR al proyecto hasta que se organice todo correctamente.

## Notas finales

Eso ha sido todo por el momento. BloggerBase está en etapa de crecimiento y desarrollo. Se planea seguir extendiendo y mejorando la experiencia de desarrollo para todo aquel que quiera desarrollar sus plantillas blogger de una manera diferente y rápida. Si quieres apoyar éste proyecto, considera [invitarme un café](https://ko-fi.com/karasuthemes) en ko-fi.com para así mantenerme motivado y seguir trayendo mejoras y novedades para este y mis otros proyectos de uso libre.

Un saludo!