# ADR-0001: Sin API de Claude ni cuenta de Claude

Status: Accepted
Fecha: 2026-10-11

## Contexto
La app traía un buscador de diseños y un asistente que leía la imagen usando Claude (capability `sample` del artifact).

## Decisión
La app no usa la API de Claude ni la cuenta de Claude del autor de ningún modo: sin backend, sin `ANTHROPIC_API_KEY`, sin capability `sample`. El código del buscador y del asistente queda en el archivo, pero se esconde solo cuando no hay IA conectada.

## Consecuencias
- Todo funciona sin cuentas ni costos.
- Queda "Agregar letras a mano" como forma de corregir letras.
- ~~Si se conecta una IA en el futuro, tiene que ser gratuita (el autor sugirió Gemini) y requiere un ADR nuevo.~~
- **2026-10-17:** el autor decidió que no se agrega ninguna API, tampoco Gemini ni otra IA gratuita. El buscador y el asistente se quedan apagados.
