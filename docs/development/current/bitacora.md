# Bitácora — Hilo a Hilo

> Registro de cada sesión (metodología Oden: progreso diario). Lo más nuevo, arriba.
> Para seguir en otra sesión (Claude móvil, web o terminal): lee esto, luego `.claude/epics/mejoras-v2/epic.md`.

## En qué quedamos (2026-10-11)

**Hecho y publicado:** tareas 001–004 y 006–009 de `mejoras-v2`.

**Siguiente paso:**
1. **Probar en la tablet de mamá** (con internet una vez, para que se guarde):
   - Abrir la app, luego apagar el wifi y volver a abrirla → debe abrir y armar el PDF.
   - Modo bordar: dejar el dedo quieto y arrastrar marca; deslizar rápido mueve el patrón.
   - "Descargar PDF", "Guardar copia de seguridad" y "Compartir por WhatsApp" dentro del APK.
2. **Tarea 005 (APK):** el autor tiene que decir con qué herramienta hizo el APK. Si las descargas o compartir fallan, generar uno nuevo con PWABuilder (https://www.pwabuilder.com, URL `https://hilo-a-hilo.vercel.app`), que ahora sí es posible porque la app ya es PWA. **Antes de desinstalar el APK viejo: Guardar copia de seguridad** (desinstalar borra los bordados).
3. Ideas para después (competitive-analysis.md): línea de centro opcional, pespunte, conectar el buscador a una IA gratuita (Gemini).

## 2026-10-11 — Sesión 2: mejoras v2 completas

- **Rápida:** tabla sRGB→lineal, Lab en arreglo plano, flood fill sin arreglos temporales; patrón y vista bordada dibujados por color; el patrón escondido no se redibuja. Huellas (`S.key`) idénticas a las de antes, así que el avance guardado sigue valiendo.
  - CPU 4× más lenta: cambiar tamaño (ancho 140) en Ajustes **941 → ~306 ms**; vista "Cómo se verá" **287 → 12 ms**; marcar una puntada **154 → 0.1 ms**.
- **Marcar:** solo se redibuja el cuadro tocado; al entrar a modo bordar el patrón se acerca (cuadros de 28 px); **marcar arrastrando** (dedo quieto 350 ms + arrastrar; con mouse, arrastrar); "Deshacer" quita la pasada completa.
- **Buscar lo que falta:** botón en el patrón que salta al siguiente cuadrito sin marcar del hilo escogido y lo señala en rojo. La guía dice "faltan X de Y" y la lista de hilos muestra "faltan N" / "✓ terminado".
- **Sin internet / instalable:** `manifest.webmanifest`, iconos (corazón en punto de cruz) y `sw.js` (página: primero internet; jsPDF, letras e iconos: memoria).
- Pruebas: 10 en `tests/hilo.test.js`, todas pasan. Toques reales probados aparte (largo+arrastre 26/26, deslizar no marca, toque corto marca 1).

## 2026-10-11 — Sesión 1: revisión, Oden y protección del avance

- Verificado: carpeta, GitHub, Vercel y artifact iguales; sin claves en el repo.
- El autor contó que empaquetó la app como **APK** y la instaló en la tablet Android de su mamá; funcionó.
- Instalada la herramienta Oden (`oden-forge` 3.0.0) en `~/.claude`; se adoptó **Oden ligero**: technical-decisions, 5 ADRs, análisis de competencia, PRD/épica/tareas, pruebas.
- **Protección del avance** (ADR-0004): avance por versión del patrón + aviso "↩ Volver a como estaba".
- **Modo día y noche** con botón, recordado; el patrón se oscurece de noche y el PDF sigue blanco.
