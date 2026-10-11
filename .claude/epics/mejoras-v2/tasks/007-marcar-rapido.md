# 007 — Marcar puntadas rápido
Req: R6 · Estado: ✅ hecho

## Qué
- Al marcar, redibujar solo ese cuadro (y la barra de avance), no todo el patrón.
- Al activar "Modo bordar", acercar a un tamaño de cuadro cómodo para el dedo (≥ 28 px) centrado donde estaba.

## Criterios de aceptación
- Marcar 1 puntada ≤ 16 ms con CPU 4× más lenta (hoy 154 ms).
- Las pruebas de avance siguen pasando.

## Resultado
`drawCells()` con `only` en `drawChart()`: 154 → 0.1 ms por puntada. Zoom a 28 px (o el máximo posible) al activar Modo bordar, sin perder la posición.
