# Changelog

## 0.4.0
- Cambio de fuente de las imágenes: ahora se traen en vivo desde una
  carpeta de Google Drive (compartida como "Cualquiera con el enlace" +
  API key), en vez de estar subidas al repositorio.
- Se sacaron `/comics` (imágenes de ejemplo) y `/scripts` (generación de
  manifest), ya no hacen falta.
- `js/config.js` ahora incluye `driveFolderId` y `driveApiKey`.
- El workflow de GitHub Actions se simplificó: ya no corre Python, solo
  publica los archivos estáticos.
- Nadie necesita iniciar sesión con Google: la contraseña sigue siendo el
  único filtro de acceso, igual que antes.

## 0.3.0
- Se sacó la contraseña en texto plano del `README.md` y del comentario en
  `js/config.js`. Ahora el único lugar donde figura algo relacionado a la
  clave es el hash SHA-256 en `passwordHash`.

## 0.2.0
- Primera versión funcional: gate con contraseña, biblioteca de tomos,
  visor tipo YACReader (ajustar a alto / ancho / tamaño real), workflow
  de GitHub Actions para publicar en Pages.

## 0.1.0
- Prototipo inicial.
