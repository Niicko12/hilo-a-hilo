# Hilo a Hilo 🧵

> **Para mi mamá, con todo mi cariño.**
> Hice esta aplicación para tus bordados: para que conviertas en patrón cualquier foto o dibujo que te guste, sepas qué hilos comprar y vayas marcando tu avance puntada por puntada.

Hilo a Hilo convierte una foto o un dibujo en un **patrón de punto de cruz**, con sus **hilos DMC** y las **madejas** que hay que comprar en la mercería.

## Qué hace

La app está organizada en 5 pasos (menú abajo en el celular, arriba en la computadora):

| Paso | Para qué sirve |
|---|---|
| **1. Diseño** | Subir una foto o un dibujo. Aquí también están *Mis bordados*, que se guardan solos. |
| **2. Ajustes** | Escoger tamaño, número de colores, tela (Aida 11, 14, 16 o 18) y su color, quitar el fondo y arreglar las letras. Al lado se ve **cómo quedaría bordado**, con la medida, la tela que hay que cortar, las puntadas y las madejas. |
| **3. Patrón** | El patrón con colores y símbolos, una guía para bordar **hilo por hilo** y el *modo bordar* para marcar los cuadritos que ya bordaste. |
| **4. Hilos** | La lista de hilos DMC con cuántas madejas comprar, lista para copiar y llevar a la mercería. |
| **5. Imprimir** | Descargar el patrón en **PDF tamaño carta**, todo en una hoja o en varias hojas con cuadros más grandes, a color o en blanco y negro. |

### Letras que se leen bien

Las letras chicas de una imagen se vuelven manchas al convertirlas en puntadas. Para que se lean:

- En **Ajustes → Letras de tu imagen → Agregar letras a mano** escribes el texto y escoges dónde va (en curva arriba o abajo, o en renglón). La app borra las letras borrosas y las vuelve a escribir con un **abecedario de punto de cruz** de 7 cuadritos de alto, con acentos y Ñ.
- Si las letras salen de un color parecido a la tela, la app usa un tono más oscuro (o más claro) del mismo color para que contrasten.
- Cada texto se puede agrandar, achicar, subir, bajar o quitar.

### Asistente con Claude (solo dentro de claude.ai)

Cuando la página se abre como *artifact* en claude.ai, se activan además:

- **Buscador de diseños**: escribes un tema ("colibrí", "rosas") y Claude dibuja 4 diseños originales en punto de cruz.
- **Asistente que lee tu imagen** en 3 pasos:
  1. Mira la imagen completa en alta resolución.
  2. Revisa las letras una por una, con acercamientos a cada renglón o arco de texto.
  3. Comprueba que las letras se lean en el bordado terminado y, si no, agranda el bordado y las letras y vuelve a revisar.

Estas funciones usan la cuenta de Claude de quien abre la página, no una clave de API. Fuera de claude.ai (por ejemplo en Vercel) se esconden solas y todo lo demás funciona igual.

## Cómo está hecha

- Es **un solo archivo**: `index.html`, con HTML, CSS y JavaScript sin dependencias que instalar. El PDF se genera con [jsPDF](https://github.com/parallax/jsPDF), cargado desde cdnjs.
- Los colores se comparan en espacio de color **Lab** contra una paleta DMC aproximada, y se agrupan con *k-means*.
- Se adapta a celular, tablet y computadora.
- *Mis bordados* y el avance se guardan en el navegador (`localStorage`), en el mismo teléfono o computadora.

## Probarla en tu computadora

```bash
cd hilo-a-hilo
python3 -m http.server 8765
```

Luego abre <http://127.0.0.1:8765/>.

## Publicarla

Es un sitio estático: Vercel la sirve tal cual, sin configuración ni variables de entorno.

```bash
vercel --prod
```

## Notas

- Los colores DMC son la equivalencia más cercana; en pantalla pueden verse un poco distintos. Conviene comparar con la madeja en mano.
- El cálculo de madejas supone madejas DMC de 8 m de 6 hebras, bordando con 2 hebras (3 en Aida 11), e incluye un poco de sobrante para rematar.
