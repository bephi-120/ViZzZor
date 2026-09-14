// Configuración del sitio. Editá esto cuando quieras cambiar el título
// o la contraseña de acceso.
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
};
