# 004 — PWA sin conexión
Req: R3 · Estado: ✅ hecho

## Qué
- `manifest.webmanifest` (nombre, colores, iconos 192/512 y maskable, `display: standalone`).
- `sw.js`: precarga `index.html`, jsPDF y las fuentes de Google (cache-first para fuentes y jsPDF; network-first para `index.html`, para que las actualizaciones lleguen).
- `<meta name="theme-color">`, registro del service worker y aviso "Hay una versión nueva" opcional.

## Criterios de aceptación
- Prueba: con la red cortada (`context.setOffline(true)`) tras la primera visita, la página abre, arma el patrón y genera el PDF.
- Lighthouse: instalable.

## Resultado
`manifest.webmanifest`, `icons/` y `sw.js` (versión `hilo-v1`). Prueba "sin internet" en `tests/` pasa. Al cambiar archivos guardados, subir `V` en `sw.js`.
