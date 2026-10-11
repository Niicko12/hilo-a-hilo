# 008 — Buscar lo que falta y contador por hilo
Req: R7 · Estado: ✅ hecho

## Qué
- En la guía "hilo por hilo": "Te faltan 12 de 340" y botón **"Buscar lo que falta"**, que salta y resalta el siguiente cuadrito sin marcar de ese color.
- En la tabla de hilos: columna hechas/faltan y "✓ terminado".

## Criterios de aceptación
- Prueba: con un color casi terminado, el botón lleva al cuadrito que falta.

## Resultado
Botón `#findBtn` + `showCell()` (cuadro rojo 1.8 s). Guía: "faltan X de Y". Tabla de hilos: `.tstat` con "faltan N" / "✓ terminado".
