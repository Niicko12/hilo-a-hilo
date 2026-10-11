# ADR-0004: El avance se guarda por versión del patrón

Status: Accepted
Fecha: 2026-10-11

## Contexto
El avance son índices de cuadritos, que solo valen para un patrón exacto. Antes, cualquier cambio (tamaño, colores, mover una letra) hacía que el avance se viera en 0 y además lo sobrescribía en Mis bordados. Al abrir un bordado con letra cursiva pasaba lo mismo por un instante, mientras cargaba la tipografía.

## Decisión
- `proyecto.prog[hash]` guarda el avance de hasta 6 versiones del patrón.
- `proyecto.anchor` guarda ajustes y letras de la última versión con avance; el aviso "↩ Volver a como estaba" los restaura.
- Al abrir un bordado, se espera a sus tipografías (máx. 4 s) antes de armar el patrón.
- Los proyectos viejos (`done`/`doneKey`) se convierten solos.

## Alternativas descartadas
- **Bloquear los ajustes cuando hay avance:** frustra a mamá si de verdad quiere cambiar algo.
- **Pasar el avance al patrón nuevo:** los cuadritos no corresponden; se marcarían puntadas equivocadas.
- **Confirmar con `confirm()`:** en un WebView de APK puede no mostrarse.

## Consecuencias
Cubierto por las pruebas en `tests/hilo.test.js`.
