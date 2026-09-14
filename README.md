# ViZzZor

Un visor de cómics propio, minimalista, pensado para uso personal: vos subís
los tomos directamente al repositorio (no hay botón de "subir" para quien
visita la página) y compartís el link con tu contraseña a quien quieras
—por ejemplo, a tu comunidad de YouTube—.

Funciona como página estática en GitHub Pages, sin backend ni base de datos.

## Qué incluye

- **Contraseña de entrada** (se cambia fácil, y solo se guarda como hash — ver más abajo).
- **Biblioteca** con los tomos que subiste, cada uno con su portada.
- **Visor tipo YACReader**: una página a la vez (nada de scroll infinito),
  navegación con flechas del teclado, clic a los costados de la imagen,
  swipe en celular, control deslizante para saltar de página, y tres
  modos de vista:
  - **Ajustar a la altura**: se ve la página completa, como en la primera
    captura que mandaste.
  - **Ajustar al ancho**: la página ocupa todo el ancho de la pantalla
    (más zoom, con scroll vertical), como en la segunda captura.
  - **Tamaño original**: la imagen a su resolución real.
- Recuerda en qué página te quedaste de cada tomo, y guarda tu modo de
  vista preferido.

## Cómo publicarlo

1. Subí todo este contenido a un repositorio de GitHub (puede ser privado
   o público; si es público, la contraseña es lo único que separa a un
   visitante casual del contenido — ver la sección de seguridad abajo).
2. Andá a **Settings → Pages** del repositorio y elegí como *Source*
   **"GitHub Actions"**.
3. Hacé push a la rama `main`. El workflow en
   `.github/workflows/deploy.yml` genera `comics/manifest.json`
   automáticamente y publica el sitio.
4. GitHub te va a dar una URL del tipo
   `https://tu-usuario.github.io/vizzzor/`. Esa es la que compartís.

## Cómo subir un tomo

Mirá `comics/README.md`: básicamente creás una carpeta dentro de
`/comics` con las páginas numeradas (`001.jpg`, `002.jpg`, ...) y hacés
push. No hay que tocar código.

## Cómo cambiar la contraseña

Abrí `js/config.js`. Ahí está `passwordHash`, que es el hash SHA-256 de la
contraseña (nunca se guarda la contraseña en texto plano). Para generar
el hash de una clave nueva, abrí la consola del navegador (F12) en
cualquier página y ejecutá:

```js
crypto.subtle.digest('SHA-256', new TextEncoder().encode('tu-nueva-clave'))
  .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('')))
```

Copiá el resultado como nuevo valor de `passwordHash` y hacé push.

## Sobre la seguridad (importante)

Este candado es una **traba liviana para compartir con criterio**, no un
sistema de autenticación real: el sitio es 100% estático, así que
cualquiera que sepa buscar en el código fuente puede ver las rutas de
las imágenes o el hash de la contraseña. Alcanza y sobra para que un
visitante casual no entre sin la clave, pero no uses este proyecto para
contenido que necesite protección seria. Si eso te importa, lo más simple
es mantener el repositorio **privado** y activar Pages solo para
colaboradores, o sumar autenticación real de algún proveedor (eso ya
requiere backend y queda fuera del alcance de este proyecto).

## Estructura del proyecto

```
vizzzor/
├── index.html              # la app entera (gate + biblioteca + visor)
├── css/style.css
├── js/
│   ├── app.js
│   └── config.js            # título del sitio + hash de la contraseña
├── comics/
│   ├── manifest.json        # se regenera solo, no lo edites a mano
│   ├── README.md
│   └── Tomo de ejemplo 1/…  # páginas de muestra, borralas cuando quieras
├── scripts/
│   ├── generate_manifest.py
│   └── make_demo_pages.py
└── .github/workflows/deploy.yml
```
