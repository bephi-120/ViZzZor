# ViZzZor

**Versión: 0.4.0** · ver CHANGELOG.md

Un visor de cómics propio, minimalista, pensado para uso personal: vos subís
tus tomos a una carpeta de Google Drive, y quien tenga el link y la
contraseña de tu web los puede leer online, sin scroll infinito y con los
modos de vista de YACReader.

Funciona como página estática en GitHub Pages. No hay backend ni base de
datos: las imágenes se traen en vivo desde tu Google Drive.

## Qué incluye

- **Contraseña de entrada** (se cambia fácil, y solo se guarda como hash — ver más abajo).
- **Biblioteca** con los tomos de tu carpeta de Drive, cada uno con su portada.
- **Visor tipo YACReader**: una página a la vez (nada de scroll infinito),
  navegación con flechas del teclado, clic a los costados de la imagen,
  swipe en celular, control deslizante para saltar de página, y tres
  modos de vista:
  - **Ajustar a la altura**: se ve la página completa.
  - **Ajustar al ancho**: la página ocupa todo el ancho de la pantalla
    (más zoom, con scroll vertical).
  - **Tamaño original**: la imagen a su resolución real.
- Recuerda en qué página te quedaste de cada tomo, y guarda tu modo de
  vista preferido.
- **Nadie necesita iniciar sesión con Google.** Ni vos ni la gente con la
  que compartís la web: solo hace falta tu contraseña.

## Cómo conectar Google Drive

### 1. Organizá tus cómics en Drive

Creá una carpeta principal (por ejemplo "ViZzZor"), y adentro una
subcarpeta por cada tomo, con las páginas numeradas:

```
ViZzZor/
├── Tomo 1/
│   ├── 001.jpg
│   ├── 002.jpg
│   └── ...
├── Tomo 2/
│   ├── 001.jpg
│   └── ...
```

### 2. Compartí la carpeta principal

Clic derecho sobre la carpeta "ViZzZor" → **Compartir** → cambiá el
acceso general a **"Cualquiera con el enlace"** con rol **"Lector"**. Con
que la carpeta principal quede así alcanza — las subcarpetas heredan el
permiso.

### 3. Conseguí el ID de esa carpeta

Abrí la carpeta en drive.google.com y mirá la URL:

```
https://drive.google.com/drive/folders/ESTE_PEDAZO_ES_EL_ID
```

Copiá ese ID.

### 4. Conseguí una API key (no es el Client ID de OAuth)

En [Google Cloud Console](https://console.cloud.google.com/), con tu
proyecto **"Drive Gallery"** ya seleccionado (el mismo donde habilitaste
la Google Drive API):

1. Andá a **APIs y servicios → Credenciales**.
2. **Crear credenciales → Clave de API**.
3. Te da una clave nueva. Copiala.
4. (Recomendado) Editá esa clave y en **"Restricciones de la API"**
   elegí que solo pueda usarse con la **Google Drive API**. En
   **"Restricciones de la aplicación"** podés limitarla a tu dominio
   `tu-usuario.github.io` para que nadie la use desde otro sitio.

No hace falta el Client ID de OAuth que ya creaste para este método —
podés dejarlo ahí sin usar, no molesta.

### 5. Completá `js/config.js`

```js
driveFolderId: "el-id-que-copiaste",
driveApiKey: "la-api-key-que-copiaste",
```

Hacé commit y push. Listo — la próxima vez que entres a la web (con tu
contraseña), la biblioteca se arma sola con lo que haya en esa carpeta
de Drive.

## Cómo subir un tomo nuevo

Creá una carpeta nueva dentro de tu carpeta de Drive, con las páginas
numeradas (`001.jpg`, `002.jpg`, ...), y listo — no hace falta tocar la
web ni hacer ningún commit. Aparece solo la próxima vez que entrés.

## Cómo publicarlo (GitHub Pages)

1. Subí todo este contenido a un repositorio de GitHub (puede ser privado
   o público; si es público, la contraseña es lo único que separa a un
   visitante casual del contenido — ver la sección de seguridad abajo).
2. Andá a **Settings → Pages** del repositorio y elegí como *Source*
   **"GitHub Actions"**.
3. Hacé push a la rama `main`. El workflow en
   `.github/workflows/deploy.yml` publica el sitio solo.
4. GitHub te va a dar una URL del tipo
   `https://tu-usuario.github.io/vizzzor/`. Esa es la que compartís.

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
cualquiera que sepa buscar en el código fuente puede ver el hash de la
contraseña, el ID de tu carpeta de Drive y la API key. Alcanza y sobra
para que un visitante casual no entre sin la clave, pero no uses este
proyecto para contenido que necesite protección seria.

Además, como la carpeta de Drive está compartida como "Cualquiera con el
enlace", alguien que consiga el link directo de una imagen puntual (no
el de tu web) podría verla sin pasar por tu contraseña — es el mismo
nivel de privacidad que un video de YouTube "no listado". Si eso te
importa, restringí la API key a tu dominio (paso 4 de arriba) para que
al menos no se pueda usar desde otro lado, o mantené el repositorio
**privado**.

## Estructura del proyecto

```
vizzzor/
├── index.html      # la app entera (gate + biblioteca + visor)
├── css/style.css
├── js/
│   ├── app.js       # incluye la lógica que habla con la Google Drive API
│   └── config.js    # título, hash de la contraseña, y datos de Drive
└── .github/workflows/deploy.yml
```
