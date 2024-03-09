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
    <span><img src="https://img.shields.io/npm/v/bloggerbase?color=green
    " alt="NPM Version" /></span>
</p>

------

[Demostración](https://blogger-base-xml.blogspot.com/ "ver demostración")

## Característica destacadas

✔ Motor de plantilla gracias a `ejs`
✔ Compila código javascript y css directamente en los archivos `*.ejs`
✔ Plantillas de ejemplos con excelente rendimiento
✔ Soporte para plugins de **rollup** y **postcss**
✔ Eso y mucho más en camino... 

------

## Instalación

> Esta es una documentación temporal mientras se trabaja en una documentación más detallada y mejor explicada.

Para instalar BloggerBase es sumamente sencillo, ejecuta el siguiente comando en terminal:

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

Por defecto cuando creamos nuestra plantilla con el comando `create-blogger-theme`, este creará una
base en blanco lista para poder desarrollar nuestra plantilla. Si tu intención es usar como punto de partida la plantilla por defecto
de BloggerBase [ver demo arriba](#), debes ejecutar el siguiente comando:

```
npx create-blogger-theme my-awesome-template --template base
```

Una vez ejecutado el comando se creará el proyecto con la plantilla por defecto de BloggerBase lista para modificar y/o usar. Recuerda instalar las dependencias antes de ejecutar algún comando.

### Scripts de desarrollo

BloggerBase cuenta con tres comandos npm que nos permitirán trabajar con nuestra plantilla:

- `build` crea un build de nuestra plantilla en formato .xml lista para instalar en Blogger o distribuir.
- `start` ejecuta el modo de desarrollo el cuál nos permitirá trabajar en nuestro proyecto en tiempo real
- `start:demo` Funcionamiento similar a `start`. Este modo dispará una variable `demoMode` para usar en los archivos `*.ejs`.

## Estructura de carpetas

**BloggerBase** ha sido creado de cara a una experiencia de desarrollo rápida y flexible por lo qué la estructura
de carpetas y como organizamos cada archivo queda hasta cierto punto a elección del desarrollador salvo las carpetas requeridas para el correcto funcionamiento del sistema.

```
app/
├── assets (requerido)
├── markups (requerido)
│   ├── common (requerido)
│   └── gadgets (requerido)
├── app.ejs (requerido)
└── app.variables.ejs (requerido)
```

- **/app** Es la carpeta dónde almacenaremos nuestra plantilla para blogger.
- **/assets** Aquí manejaremos tanto los estilos css como los códigos de javascript que vayamos necesitando.
- **/markups** Aquí va todo lo referente a los includables y elementos necesarios para agregar lógica y dinamismo a nuestra plantilla blogger.
  - **/common**
  - **/gadgets**
- **app.ejs** punto de entrada de la plantilla.
- **app.variables.ejs** punto de entrada a las variables de blogger que iremos creando para utilizar en nuestro proyecto.

## Trabajar con estilos css y javascript

Para trabajar nuestros estilos y código de javascript, contamos con dos etiquetas creadas para éste fin:

### b:style


La etiqueta `<b:style/>` nos permitirá compilar y/o usar nuestro `css`, `scss` o `pcss`. Para usarla es tan simple como ubicar la etiqueta anteriormente mencionada en alguna parte en nuestros archivos **`*.ejs`**:

```xml
<!-- Sintaxis -->
<b:style src='ruta/a/mi/estilo.css' render='true' cdta='true'/>
```
La etiqueta de estilo tiene los siguientes atributos para poder utilizar:

- `src`: ruta al archivo `css, scss, pcss` que queremos utilizar.
- `render`: Agrega el estilo css compilado desde la ruta especificada en una etiqueta `<style>`. Por defecto dicha etiqueta no se agrega.
- `cdta`: Agrega `<![CDATA[` y `]]>` a la etiqueta `<style>`. Éste atributo solo será tomado en cuenta cuando usemos la propiedad `render`

> Por defecto b:style, compila automaticamente los estilos **`*.css`** cómo archivos de postcss (pcss) por lo que estos son compatibles con los plugins de postcss que instalemos y usemos.


### b:script

La etiqueta `<b:script/>` nos permite compilar código js directamente en nuestros archivos ***.ejs** gracias a rollup y soporta plugins de éste.

```xml
<b:script src='ruta/a/mi/script.js' name='myApp' format='iife' cdta='true'/>
```

Esta etiqueta tiene los siguientes atributos para poder utilizar:

- `src`: ruta al archivo js.
- `name`: Nombre de nuestra función generada con rollup. Por defecto toma el nombre del archivo js
- `cdta`: Agrega `<![CDATA[` y `]]>` a la etiqueta `<script>`.
- `format`: El formato aceptado por rollup. Por defecto usa `iife`

## Ruta base

Tanto `b:script` y `b:style` tienen de punto de entrada la carpeta `assets` para encontrar los archivos **js, scs, css, pcss** que necesitemos al momento de usar alguna de las etiquetas antes mencionadas

## Consideraciones

Tanto **rollup** cómo **postcss** podrían o no soportar algunos plugins por el momento.

## Ejs

BloggerBase utiliza `ejs` cómo motor de plantilla y con el podrás manejar todo lo referente a la organización y lógica para crear tu plantilla blogger de manera que sea más fácil que hacerlo todo en un mismo archivo.

- [Saber más sobre ejs](https://ejs.co/)

### Funciones

Se han preparado 3 funciones que nos permitirán crear las `<Variables>` de blogger que usamos para agregar personalización o extender algunas Característica en  nuestra plantilla blogger:

- **Variable(`Object`)**
- **Variables(`Object`)**
- **VariableGroup(`String`, `String`, `Object`)**

#### Variable

> Crea una variable blogger con las propiedades pasadas cómo parametro

```ejs
<%- 
variable({name: "m.showMeta", description: "Show the post meta", type: "string", value: "true"}) 
// resultado
// <Variable name="m.showMeta" description="Show the post meta" type="string" value="true" />
%>
```

#### Variables

> Crea una lista de variables blogger con las propiedades pasadas cómo parametro

```ejs
<%- 
Variables("Meta option", [
  {name: "m.showMeta", description: "Show the post meta", type: "string", value: "true"},
  {name: "m.showUserMeta", description: "Show the post username", type: "string", value: "true"},
  {name: "m.showDateMeta", description: "Show the post date", type: "string", value: "true"},
]); 
// resultado
// <Variable name="m.showMeta" description="Show the post meta" type="string" value="true" />
// <Variable name="m.showUserMeta" description="Show the post username" type="string" value="true" />
// <Variable name="m.showDateMeta" description="Show the post date" type="string" value="true" />
%>
```

#### VariableGroup

> Crea un `<Group>` con una lista de variables blogger

```ejs
<%- 
<%- 
VariableGroup("Light scheme color", "Light scheme color", "body",
[
{name: "c.primary", description: "Primary color", type: "color", default: "#6366F1", value: "#6366F1"},
{name: "c.body", description: "body color", type: "color", default: "#fff", value: "#fff"},
])
_%>
// resultado
// <!-- Light scheme color -->
// <Group description="Light scheme color" selector="body">
//   <Variable name="c.primary" description="Primary color" type="color" default="#6366F1" value="#6366F1" />
//   <Variable name="c.body" description="body color" type="color" default="#fff" value="#fff" />
// </Group>
%>
```

## Reporte de errores

Si tienes algú error/bug que reportar o quieres sugerir mejoras, puedes contactarme por medio de mi [telegram](https://t.me/marceloTLD). Por el momento no se aceptarán PR al proyecto hasta que se organice todo correctamente.

## Notas finales

Eso ha sido todo por el momento. BloggerBase está en etapa de crecimiento y desarrollo. Se planea seguir extendiendo y mejorando la experiencia de desarrollo para todo aquel que quiera desarrollar sus plantillas blogger de una manera diferente y rápida. Si quieres apoyar éste proyecto, considera [invitarme un café](https://ko-fi.com/karasuthemes) en ko-fi.com para así mantenerme motivado y seguir trayendo mejoras y novedades para este y mis otros proyectos de uso libre.

Un saludo!