# ADR-0002: Un solo archivo index.html, sin compilar

Status: Accepted
Fecha: 2026-10-11

## Contexto
La app se publica en tres lugares (Vercel, artifact de claude.ai y APK) y la mantiene una sola persona.

## Decisión
Todo vive en `index.html` (HTML + CSS + JS), sin npm ni paso de compilación. Las únicas dependencias externas son jsPDF (cdnjs) y Google Fonts.

## Consecuencias
- Publicar es copiar un archivo; el mismo archivo sirve para Vercel y para el artifact.
- Archivo grande (~1,900 líneas); hay que buscar por las secciones `// ---------- …`.
- Sin internet no cargan jsPDF ni las tipografías (lo resuelve la tarea de modo sin conexión; un service worker sería un segundo archivo, que se permite).
- Las pruebas viven aparte, en `tests/`, con su propio package.json, para no afectar el despliegue.
