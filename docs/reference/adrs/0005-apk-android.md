# ADR-0005: APK para la tablet Android

Status: Proposed
Fecha: 2026-10-11

## Contexto
El autor empaquetó la app como .apk y la instaló en la tablet de su mamá; funcionó. No hay proyecto Android en el repo; falta registrar con qué herramienta se hizo. Las envolturas de tipo WebView normalmente:
- no descargan archivos `blob:` (PDF, copia de seguridad),
- no tienen `navigator.share` (compartir por WhatsApp),
- guardan los datos dentro de la app (se borran al desinstalarla).

## Opciones
1. **Dejar la envoltura actual** y comprobar en la tablet: Descargar PDF, Guardar copia de seguridad, Compartir por WhatsApp.
2. **PWA + TWA con PWABuilder** (recomendada): agregar manifest y service worker (modo sin conexión) y generar el APK con PWABuilder. Usa Chrome por dentro: descargas, compartir y almacenamiento persistente funcionan igual que en el navegador.
3. **Capacitor/Android Studio:** control total, pero más mantenimiento; no hace falta.

## Decisión
Pendiente: depende de qué herramienta se usó y de la prueba en la tablet. La opción 2 ya es posible: desde el 2026-10-11 la app es PWA (manifest, iconos, service worker).

**2026-10-17:** recomendado en el README: (1) instalar desde Chrome ("Instalar app"), que no necesita APK; (2) si hace falta APK, PWABuilder con nombre de paquete `app.vercel.hilo_a_hilo.twa` y llave nueva. El APK lo genera el autor en pwabuilder.com porque la llave de firma es suya y no debe salir de sus manos ni entrar al repositorio. Al tenerla, se sube `assetlinks.json` a `.well-known/`.
Las descargas, la copia de seguridad, WhatsApp (con y sin menú de compartir) y el modo sin wifi se probaron en una tablet Android **simulada** (prueba `tablet Android…` en `tests/hilo.test.js`). Falta confirmarlo en la tablet real.
