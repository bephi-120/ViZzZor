// Configuración del sitio. Editá esto cuando quieras cambiar el título,
// la contraseña de acceso, o los datos de Google Drive.
//
// Para generar el hash de una contraseña nueva, abrí la consola del
// navegador (F12) en cualquier página y pegá:
//
//   crypto.subtle.digest('SHA-256', new TextEncoder().encode('tu-nueva-clave'))
//     .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('')))
//
// y copiá el resultado como passwordHash de acá abajo.

const VIZZZOR_CONFIG = {
  siteTitle: "ViZzZor",
  tagline: "Cómics propios, para quien tenga la clave.",
  passwordHash:
    "c9188699e8afc1996bbcb1328b40eb593b6aee9dd1436bfc2af3c2110ef41729",

  // ----- Google Drive -----
  // Ver README.md -> "Como conectar Google Drive" para el paso a paso de
  // como conseguir estos dos valores.

  // ID de la carpeta principal de Drive. Adentro de esta carpeta tiene
  // que haber una subcarpeta por cada tomo (cada una con sus paginas).
  // Es el pedazo de la URL despues de "folders/" cuando abris la carpeta
  // en drive.google.com.
  driveFolderId: "PEGA_AQUI_EL_ID_DE_TU_CARPETA_DE_DRIVE",

  // API key de Google Cloud (proyecto "Drive Gallery"), con la Google
  // Drive API habilitada. No es lo mismo que el Client ID de OAuth que
  // ya creaste - esta es mas simple, es solo una clave.
  driveApiKey: "PEGA_AQUI_TU_API_KEY",
};
