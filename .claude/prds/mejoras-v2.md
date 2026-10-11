---
name: mejoras-v2
status: in-progress
created: 2026-10-11
---

# PRD: Hilo a Hilo — mejoras v2

## Problema
Mamá ya usa la app en su tablet Android (APK). La revisión encontró riesgos para sus datos y puntos lentos o incómodos:
1. Su avance se "perdía" al tocar un ajuste. **(Resuelto en `cf7af9c`.)**
2. Sin internet la app no abre ni arma el PDF.
3. En el APK, descargar el PDF, guardar la copia de seguridad y compartir por WhatsApp pueden no funcionar; desinstalar el APK borra todo.
4. En tablet sencilla: ~1 s congelada al cambiar tamaño (extra grande), 154 ms por puntada marcada.
5. Faltan herramientas que las apps de marcado sí tienen (ver competitive-analysis.md).
6. Pidió modo día y noche. **(Hecho.)**

## Usuaria
Mamá: borda en tablet, a veces de noche, sin conocimientos técnicos. Prefiere botones grandes y textos claros.

## Historias
- Como mamá, quiero que **nunca se pierda lo que llevo bordado**, aunque cambie algo por error.
- Como mamá, quiero **abrir mi bordado sin internet**.
- Como mamá, quiero **guardar el PDF y mi copia de seguridad** desde la tablet.
- Como mamá, quiero **marcar puntadas rápido**, sin que la pantalla se trabe ni me equivoque de cuadro.
- Como mamá, quiero **encontrar los cuadritos que me faltan** de un color.
- Como mamá, quiero **modo noche** para bordar de noche sin que me deslumbre.

## Requisitos
| ID | Requisito | Prioridad |
|---|---|---|
| R1 | El avance no se borra por cambiar ajustes; botón para volver | Must ✅ |
| R2 | Modo día/noche con botón, recordado, patrón oscuro de noche y PDF blanco | Must ✅ |
| R3 | PWA: manifest + service worker; abre y arma el PDF sin internet | Must |
| R4 | APK que descargue, comparta y conserve datos (PWABuilder/TWA o comprobar el actual) | Must |
| R5 | Procesar ≤ 300 ms en tablet sencilla para ancho 140, sin congelar | Should |
| R6 | Marcar una puntada ≤ 16 ms; zoom cómodo al entrar a modo bordar | Should |
| R7 | "Buscar lo que falta" y contador hechas/faltan por hilo | Should |
| R8 | Marcar arrastrando el dedo | Could |

## Fuera de alcance
Cuentas, sincronizar en la nube, IA (ADR-0001), pespunte y editor de cuadritos.

## Criterios de éxito
- Las pruebas de `tests/` pasan antes de cada subida a `main`.
- Mamá abre sus bordados sin wifi.
- Medidas de rendimiento por debajo de las metas en technical-decisions.md §5.
