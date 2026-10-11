---
name: mejoras-v2
status: in-progress
prd: .claude/prds/mejoras-v2.md
created: 2026-10-11
---

# Épica: mejoras v2

Orden pensado para proteger primero los datos de mamá y después la comodidad.

| # | Tarea | Req. | Estado | Depende de |
|---|---|---|---|---|
| 001 | Proteger el avance por versión del patrón | R1 | ✅ hecho (`cf7af9c`) | — |
| 002 | Modo día y noche | R2 | ✅ hecho | — |
| 003 | Pruebas en navegador (`tests/`) | — | ✅ hecho | — |
| 004 | PWA sin conexión (manifest, iconos, service worker) | R3 | pendiente | — |
| 005 | APK con PWABuilder (TWA) o comprobar el actual | R4 | pendiente: falta saber la herramienta | 004 |
| 006 | Procesamiento rápido (tablas de color, arreglos tipados, Web Worker) | R5 | pendiente | 003 |
| 007 | Marcar puntadas rápido (redibujar solo el cuadro, zoom de bordar) | R6 | pendiente | 003 |
| 008 | Buscar lo que falta + contador por hilo | R7 | pendiente | 007 |
| 009 | Marcar arrastrando el dedo | R8 | pendiente | 007 |

## Notas técnicas
- Todo sigue en `index.html`; el service worker (`sw.js`), `manifest.webmanifest` y los iconos son archivos aparte, permitidos por ADR-0002.
- Cada tarea agrega su prueba en `tests/hilo.test.js`.
