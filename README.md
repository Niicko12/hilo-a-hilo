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
- **Muestrario de estilos de letra:** más de 35 estilos, cada uno mostrado con el texto que escribiste. Hay 4 de cuadritos (Clásica, Gruesa, Inclinada, Chica) y tipografías de Google Fonts convertidas a puntadas: cursivas (Dancing Script, Great Vibes, Pacifico, Lobster…), elegantes, divertidas, de molde y antiguas. Las cursivas finas usan más cuadritos de alto para que se lean.
- **Mover las letras** arrastrándolas en "Cómo se verá": con el mouse directo, o en el celular tocando "✋ Mover las letras" y arrastrando con el dedo. También hay flechas ← ↑ ↓ →.
- Cada texto se puede agrandar, achicar o quitar.
- Si el fondo se borda, las letras nuevas se escriben encima sin dejar huecos de tela.

### Compartir por WhatsApp

- En "Cómo se verá": manda una imagen del bordado terminado con su nombre y medidas.
- En "Imprimir": manda el patrón en PDF.

En el celular se abre el menú de compartir del teléfono (con WhatsApp). Si el aparato no deja compartir archivos, el archivo se guarda y se abre WhatsApp con un mensaje listo para adjuntarlo.

### Buscador y asistente con IA (apagados por ahora)

El código ya trae un **buscador de diseños** y un **asistente que lee la imagen** en 3 pasos (mira la imagen completa, revisa las letras una por una y comprueba que se lean en el bordado). Están **apagados**: la app no usa ninguna cuenta ni clave de API, así que esas secciones no aparecen y todo lo demás funciona igual.

Más adelante se pueden conectar a una opción gratuita, como Gemini.

## Cómo está hecha

- Es **un solo archivo**: `index.html`, con HTML, CSS y JavaScript sin dependencias que instalar. El PDF se genera con [jsPDF](https://github.com/parallax/jsPDF), cargado desde cdnjs.
- Los colores se comparan en espacio de color **Lab** contra una paleta DMC aproximada, y se agrupan con *k-means*.
- Se adapta a celular, tablet y computadora.
- *Mis bordados* (foto, ajustes, letras y avance) se guardan en la base de datos del navegador (**IndexedDB**), en el mismo teléfono o computadora: no se pierden al recargar ni al cerrar la página. La app pide almacenamiento persistente para que el navegador no los borre por falta de espacio.
- **Copia de seguridad:** en *Mis bordados*, "Guardar copia de seguridad" descarga un archivo `.json` con todos los bordados; "Recuperar una copia" los trae de vuelta en otro teléfono o después de borrar el navegador.

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
