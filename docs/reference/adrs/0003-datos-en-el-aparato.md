# ADR-0003: Los bordados se guardan en el aparato

Status: Accepted
Fecha: 2026-10-11

## Contexto
Mamá necesita retomar sus bordados días después, sin cuentas ni contraseñas.

## Decisión
Proyectos en IndexedDB (con localStorage como respaldo si no hay IndexedDB) y `navigator.storage.persist()`. Copia de seguridad manual en JSON.

## Consecuencias
- Sin servidor ni costos, y privado.
- **Riesgo:** si se borran los datos del navegador, o se desinstala o reinstala el APK, se pierde todo, salvo que exista copia de seguridad. En el APK hay que comprobar que la copia de seguridad se pueda descargar (ver ADR-0005).
- No se sincroniza entre aparatos (se pasa con la copia de seguridad).
