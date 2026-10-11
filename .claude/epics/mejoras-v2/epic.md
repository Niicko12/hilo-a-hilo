---
name: mejoras-v2
status: in-progress  # solo falta 005 (APK)
prd: .claude/prds/mejoras-v2.md
created: 2026-10-11
---

# Épica: mejoras v2

Orden pensado para proteger primero los datos de mamá y después la comodidad.

| # | Tarea | Req. | Estado | Depende de |
|---|---|---|---|---|
| 001 | Proteger el avance por versión del patrón | R1 | ✅ hecho (`cf7af9c`) | — |
| 002 | Modo día y noche | R2 | ✅ hecho (`df2b4e2`) | — |
| 003 | Pruebas en navegador (`tests/`) | — | ✅ hecho | — |
| 004 | PWA sin conexión (manifest, iconos, service worker) | R3 | ✅ hecho | — |
| 005 | APK con PWABuilder (TWA) o comprobar el actual | R4 | ⏳ falta saber la herramienta y probar en la tablet | 004 ✅ |
| 006 | Procesamiento rápido (tabla de color, arreglo plano, dibujo por color) | R5 | ✅ hecho (941 → ~306 ms) | 003 |
| 007 | Marcar puntadas rápido (redibujar solo el cuadro, zoom de bordar) | R6 | ✅ hecho (154 → 0.1 ms) | 003 |
| 008 | Buscar lo que falta + contador por hilo | R7 | ✅ hecho | 007 |
| 009 | Marcar arrastrando el dedo | R8 | ✅ hecho | 007 |

## Notas técnicas
- Todo sigue en `index.html`; el service worker (`sw.js`), `manifest.webmanifest` y los iconos son archivos aparte, permitidos por ADR-0002.
- Cada tarea agrega su prueba en `tests/hilo.test.js`.
