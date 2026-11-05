# LUMEN — biblioteca web

Proyecto de Dago García para Programación Web VII. LUMEN es una biblioteca web interactiva con catálogo, carrito y una sección de comunidad.

## Usuarios y publicaciones

La aplicación usa React y `fetch` para consultar usuarios en JSONPlaceholder y mostrar su nombre, correo y empresa. Al elegir una persona, consulta y presenta sus publicaciones originales. Incluye mensajes de carga y error y permite reintentar una consulta fallida. Los textos de las publicaciones son datos de ejemplo de la API.

## Ejecutar en el computador

Necesitas Node.js y conexión a Internet. En la carpeta del proyecto ejecuta:

```bash
npm install
npm run dev
```

Abre la dirección que aparece en la terminal. Para comprobar la compilación ejecuta `npm run build`.

## Publicación

Sitio publicado: https://dagog11.github.io/directorio-usuarios/


GitHub Actions construye el proyecto con Vite y publica la carpeta generada en GitHub Pages. La aplicación consulta `https://jsonplaceholder.typicode.com` mediante HTTPS.
