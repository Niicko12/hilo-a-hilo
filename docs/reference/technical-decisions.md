# Decisiones técnicas — Hilo a Hilo

> Metodología Oden, versión ligera. Este documento describe la app **como es hoy** y las reglas que cualquier cambio tiene que respetar.
> Última revisión: 2026-10-11.

## 1. Qué es y para quién

App para convertir una foto o un dibujo en un patrón de punto de cruz con hilos DMC. Tiene **una sola usuaria principal**: la mamá del autor, que la usa en una **tablet Android** (APK) y a veces en el navegador.

Consecuencias para el diseño:

- Textos en español sencillo, botones grandes (mínimo 44–48 px) y "Letra grande" opcional.
- Nada de cuentas, contraseñas ni configuraciones técnicas.
- **Sus bordados y su avance son lo más valioso**. Ningún cambio puede arriesgarlos (ver [ADR-0003](adrs/0003-datos-en-el-aparato.md) y [ADR-0004](adrs/0004-avance-por-version.md)).

## 2. Stack

| Pieza | Decisión | Por qué |
|---|---|---|
| Código | Un solo `index.html` con HTML, CSS y JS sin paso de compilación | [ADR-0002](adrs/0002-un-solo-archivo.md) |
| PDF | jsPDF 2.5.1 desde cdnjs | Única dependencia; genera hojas carta sin servidor |
| Letras | Google Fonts (Atkinson Hyperlegible, Instrument Serif y ~35 tipografías para bordar) | Se dibujan en canvas y se convierten en cuadritos |
| Datos | IndexedDB (`hilo-a-hilo` → `proyectos`) + localStorage como respaldo | [ADR-0003](adrs/0003-datos-en-el-aparato.md) |
| Hosting | Vercel, proyecto `hilo-a-hilo`, conectado a GitHub (`main` despliega) | Gratis y automático |
| Tablet | APK que envuelve la web | [ADR-0005](adrs/0005-apk-android.md) (propuesta) |
| IA | Ninguna conectada | [ADR-0001](adrs/0001-sin-api-de-claude.md) |

## 3. Cómo funciona por dentro

### 3.1 De foto a patrón (`process()`)

1. Se reduce la imagen al ancho elegido en puntadas (× 4 si "Cuidar líneas finas" está activo).
2. Cada pixel pasa a espacio de color **Lab**.
3. **Fondo:** se busca el color más repetido en las orillas; las zonas de ese color que tocan la orilla (o grandes encerradas) se quitan y queda la tela.
4. **k-means** en Lab (máx. 30,000 muestras, 10 vueltas) → cada centro se cambia por el hilo DMC más cercano.
5. Cada cuadrito vota su color; en modo detalle, las líneas finas le ganan al relleno.
6. Se quitan los colores que mamá decidió no bordar y las puntadas sueltas.
7. `S.base` guarda el patrón sin letras; `finishGrid()` pone las letras encima (mover letras no recalcula todo).

### 3.2 Letras (`applyTexts()`)

- Letras de la imagen o agregadas a mano, con estilo (4 de cuadritos + tipografías reales), tamaño, posición y color.
- Las tipografías se cargan con `document.fonts.load`; **al abrir un bordado se espera a que carguen** (máx. 4 s) para que el patrón salga igual que la última vez.

### 3.3 Avance (modo bordar)

- `S.key = 'hilo-' + hash(patrón)`: el avance es una lista de índices de cuadritos, **válida solo para ese patrón exacto**.
- Se guarda en dos lugares: `localStorage[S.key]` (al instante, en cada toque) y `proyecto.prog[S.key]` en IndexedDB (600 ms después).
- `proyecto.prog` guarda hasta **6 versiones** del patrón con avance; `proyecto.anchor` recuerda los ajustes y las letras de la última versión con avance.
- Si un cambio esconde el avance, sale el aviso **"↩ Volver a como estaba"**, que restaura esos ajustes y letras.

### 3.4 Pantallas

Cinco pestañas: Diseño · Ajustes · Patrón · Hilos · Imprimir. En celular/tablet chica el menú va abajo, como app; en computadora va arriba y fijo.

### 3.5 Marcar, buscar y sin internet

- **Marcar:** toque = un cuadro (`drawCells`). Dedo quieto 350 ms + arrastrar = pasada del mismo color (`markAt`, `startStroke`, `endStroke`). `S.undo` guarda listas.
- **Modo bordar** acerca el patrón a cuadros de 28 px (o el máximo que permite `maxCell()`).
- **Buscar lo que falta** (`#findBtn`, `showCell`): siguiente cuadro sin marcar del hilo escogido.
- **Sin internet** (`sw.js`): página primero de internet (5 s) y si no, la guardada; jsPDF, letras e iconos salen de la memoria. Instalable con `manifest.webmanifest`. El registro solo ocurre en la página publicada (no dentro de claude.ai).

### 3.6 Modo día y noche

- Sin escoger, sigue el tema del aparato (`prefers-color-scheme`).
- El botón "🌙 Modo noche / ☀️ Modo día" fija `data-theme` en `<html>` y lo guarda en `localStorage['hilo-tema']`.
- El patrón en pantalla usa `CHART_NIGHT` de noche; **las hojas impresas y el PDF siempre van en blanco**.

## 4. Modelo de datos (IndexedDB)

```js
proyecto = {
  id: 'f…',                 // 'f' + fecha en base 36
  name: 'Gatito para Lupita',
  kind: 'photo' | 'design',
  photo: 'data:image/jpeg;base64,…',   // máx. 1000 px, JPEG 85 %
  design: {...},            // solo kind 'design'
  settings: { width, colors, count, fabric, bgoff, clean, detail, textfix, removed: [] },
  texts: [{ texto, estilo, cx, cy, alto, ancho, radio, forma, ds, ox, oy, code, manual, erase }],
  prog: { 'hilo-abc123': { done: [índices], at: fecha } },   // hasta 6 versiones
  anchor: { key, pct, n, settings, texts },                  // última versión con avance
  pct: 0–100,
  updated: fecha
}
```

Los campos viejos `done` y `doneKey` se convierten solos a `prog` (`progOf()`).

**Copia de seguridad:** JSON `{ app: 'hilo-a-hilo', version: 1, fecha, proyectos: [...] }`. Al recuperar, gana la versión con `updated` más reciente.

## 5. Rendimiento medido

Chrome con CPU 4× más lenta (para parecerse a una tablet sencilla), imagen de 1000 × 1400:

| Acción (mismas condiciones) | Antes (v1) | Ahora (v2) | Meta |
|---|---|---|---|
| Cambiar a ancho 140 con detalle en Ajustes | 941 ms | ~306 ms | < 300 ms |
| Vista "Cómo se verá" | 287 ms | 12 ms | < 50 ms |
| Marcar 1 puntada | 154 ms | 0.1 ms | < 16 ms |
| Abrir la pestaña Patrón (dibujo completo, 140 × 196) | — | ~127 ms | — |

Cómo: tabla `LIN` (sRGB→lineal), Lab en `Float64Array` plano, dibujo agrupado por color (`drawChart`, `drawStitches`), redibujo parcial (`drawCells`) y el patrón escondido no se dibuja (`S.chartDirty`). Las huellas `S.key` no cambiaron, así que el avance guardado sigue valiendo.

## 6. Reglas para cualquier cambio

1. **No romper los datos guardados.** Si cambia la forma de un proyecto, agregar conversión automática, como `progOf()`.
2. **Correr las pruebas** (`cd tests && npm install && npm test`) antes de subir a `main`, porque subir es publicar en la tablet de mamá.
3. Sin claves de API, sin backend, sin la capability `sample` (ADR-0001).
4. Español sencillo en todo lo que se ve.
5. Probar en ancho de celular (360 px), tablet (800 px) y computadora.
6. El PDF y las hojas impresas siempre en fondo blanco.

## 7. Pruebas

`tests/hilo.test.js` (node:test + playwright-core con el Chrome instalado):

- Arranca sin errores.
- El avance sobrevive a un cambio de tamaño y vuelve con "Volver a como estaba".
- El avance sobrevive a recargar aunque se borre localStorage.
- Se convierten los bordados guardados a la manera anterior.
- Modo día y noche sigue al aparato y recuerda lo escogido.
- El PDF se arma.
- Marcar arrastrando y Deshacer de la pasada.
- Buscar lo que falta y contador de la lista de hilos.
- Sin internet: abre y arma el PDF.
- Instalable: manifest e iconos.

`docs/`, `.claude/` y `tests/` no se publican en Vercel (`.vercelignore`).
