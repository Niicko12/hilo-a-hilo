# 009 — Marcar arrastrando el dedo
Req: R8 · Estado: ✅ hecho

## Qué
En modo bordar, mantener el dedo y arrastrar marca todos los cuadritos del mismo color por donde pasa; un solo "Deshacer" quita toda la pasada. Sin modo bordar, el dedo sigue moviendo el patrón.

## Criterios de aceptación
- Arrastrar por una fila marca solo los cuadros de ese color.
- Deshacer quita la pasada completa.

## Resultado
Dedo quieto 350 ms → vibra y empieza a marcar; `touchmove` con `preventDefault` solo durante la pasada. Con mouse, arrastrar. Rellena cuadros intermedios. Undo guarda listas.
