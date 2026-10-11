# Hilo a Hilo: instrucciones para Claude

App de punto de cruz hecha para la mamá del autor: convierte fotos en patrones DMC, calcula madejas, imprime PDF carta y lleva el avance puntada por puntada. Ella la usa en una **tablet Android** (APK) y en el navegador.

**Para seguir trabajando (también desde Claude móvil / claude.ai/code):** lee primero
1. `docs/development/current/bitacora.md`: qué se hizo, en qué quedamos y qué sigue.
2. `.claude/epics/mejoras-v2/epic.md`: tareas con su estado.
3. `docs/reference/technical-decisions.md`: cómo funciona por dentro y las reglas.

## Reglas que no se rompen
- **Sin API de Claude ni cuenta de Claude** en la app: nada de backend, `ANTHROPIC_API_KEY` ni capability `sample` (ADR-0001). Si se conecta una IA, que sea gratuita (el autor sugirió Gemini) y con un ADR nuevo.
- **Los bordados y el avance de mamá son sagrados.** Si cambia la forma de los datos guardados, agregar conversión automática (como `progOf()`). Si se toca `process()`, el patrón debe salir idéntico (mismo `S.key`), o se invalida el avance guardado.
- Todo lo que se ve, en **español sencillo**, con botones grandes.
- El PDF y las hojas impresas, siempre en fondo blanco.
- Metodología **Oden ligero**: documentar decisiones (ADRs en `docs/reference/adrs/`), tareas en `.claude/epics/`, y anotar cada sesión en la bitácora.

## Archivos
- `index.html`: toda la app (HTML + CSS + JS, sin compilar). Secciones marcadas con `// ---------- … ----------`.
- `sw.js` + `manifest.webmanifest` + `icons/`: modo sin internet e instalación. **Si cambian archivos que el service worker guarda, subir la versión `V` en `sw.js`.**
- `tests/`: pruebas en navegador (node:test + playwright-core).
- `docs/`, `.claude/`, `tests/` no se publican (`.vercelignore`).

## Flujo de trabajo
1. Editar `index.html`.
2. Probar: `cd tests && npm install && npm test`. En la nube, si no hay Chrome: `npx playwright-core install chromium` y luego `npm test`.
3. Commit con autor `Limber Magana <Niicko12@users.noreply.github.com>`.
4. **Push a `main` = publicar** en https://hilo-a-hilo.vercel.app (Vercel despliega solo), y de ahí llega a la tablet. No subir a `main` con pruebas fallando.
5. Anotar la sesión en `docs/development/current/bitacora.md`.

## Otros lugares donde vive
- GitHub privado: `Niicko12/hilo-a-hilo`.
- Artifact en claude.ai: https://claude.ai/artifact/2ppwpx53bX5YJYhwbcWZHk (solo capability `downloads`; se actualiza aparte y puede ir atrasado).
- APK en la tablet de mamá: falta registrar con qué herramienta se hizo (ADR-0005).
