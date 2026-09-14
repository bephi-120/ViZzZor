# Cómo subir un tomo nuevo

1. Creá una carpeta nueva acá dentro de `/comics` con el nombre del tomo,
   por ejemplo `Tomo 3` o `Capítulo 12 - El regreso`.
2. Metele adentro las imágenes de las páginas, una por página, nombradas
   de forma que el orden alfabético coincida con el orden de lectura.
   Lo más seguro es numerarlas con ceros adelante:
   `001.jpg`, `002.jpg`, `003.jpg`, ... `015.jpg`.
   (Si numerás `1.jpg, 2.jpg ... 10.jpg` sin ceros, el visor igual las
   ordena bien gracias al orden "natural" del script, pero los ceros
   adelante son más prolijos si después revisás la carpeta a mano).
3. Formatos aceptados: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`.
4. Hacé commit y push a `main`.
5. GitHub Actions genera `manifest.json` solo y publica el sitio.
   En un par de minutos el tomo nuevo aparece en la biblioteca.

No hace falta tocar ningún archivo de código para agregar cómics: alcanza
con subir la carpeta de imágenes.

Las carpetas `Tomo de ejemplo 1` y `Tomo de ejemplo 2` son páginas de
muestra generadas automáticamente para que el sitio no se vea vacío la
primera vez. Borralas cuando subas tus propios tomos.
