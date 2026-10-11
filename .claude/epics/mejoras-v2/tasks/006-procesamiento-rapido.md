# 006 — Procesamiento rápido
Req: R5 · Estado: ✅ hecho

## Qué
- Tabla de 256 valores para pasar sRGB a lineal (quita 3 `Math.pow` por pixel).
- `Float32Array` para Lab (hoy son ~600 k arreglos chiquitos → mucha basura en memoria).
- Mover `process()` a un Web Worker (Blob URL para no agregar archivos) y mostrar "Preparando patrón…".

## Criterios de aceptación
- CPU 4× más lenta, ancho 140 con detalle: ≤ 300 ms (hoy 941 ms) y la página responde mientras procesa.
- El patrón resultante es idéntico (mismo hash) al de antes → el avance guardado sigue valiendo.

## Resultado
Tabla `LIN`, Lab en `Float64Array` plano (mismos números → mismas huellas), flood fill sin arreglos temporales, `drawStitches()` por color y el patrón escondido no se dibuja. Ancho 140 en Ajustes: 941 → ~306 ms; vista bordada 287 → 12 ms. No hizo falta Web Worker; queda como opción si en la tablet se siente lento.
