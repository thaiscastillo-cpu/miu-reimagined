# MiU · Design system

Diseño hecho en **Claude Design** y exportado como HTML independiente:

- `design/miu-diseno-original.html` es el export original, sin cambios.
- `index.html` es el mismo diseño publicado y conectado a Supabase.

Las pantallas, los textos y los estilos son los del export. Los cambios posteriores están en `docs/CAMBIOS.md`.

## Principios

1. **Lo urgente primero.** El dashboard muestra los pendientes ordenados por urgencia, con un color de estado que se lee sin abrir nada.
2. **Pocas decisiones por pantalla.** Una acción principal por fila ("Entregar →") y el detalle en un modal.
3. **Un solo lugar.** Cursos, entregas, notas, horario, chat, conferencias y pagos con la misma estructura y el mismo lenguaje.
4. **Honesto.** La barra superior siempre dice que es un prototipo académico no oficial. Lo simulado se dice simulado.
5. **Cercano.** Español de Guatemala con voseo ("Entregá", "Podés", "Revisá") y frases cortas ("Nada se te pasa.", "Tu semana, de un vistazo.").

## Color

| Token | Valor | Uso |
|---|---|---|
| `--purple` | `#c52430` | Acento principal: botones primarios, enlaces, ítems activos |
| `--side` | `#941b25` | Fondo del menú lateral y del login |
| `--lilac` | `#fcebed` | Fondos suaves, badges, avisos |
| `--bg` | `#fcf9f9` | Fondo de la aplicación |
| `--line` | `#eedfe0` | Bordes y divisores |
| `--ink` | `#24252a` | Texto principal |
| `--muted` | `#a75151` | Texto secundario |
| `--red` | `#c52430` | Alertas |

### Estados de entrega

Se aplican en el borde izquierdo de 3 px de la fila, en el ícono y en el badge. Sobre cada lista hay una leyenda.

| Estado | Texto | Fondo | Borde |
|---|---|---|---|
| Vence hoy | `#8b6500` | `#fff4c2` | `#e5b62a` |
| Vencida | `#b51e32` | `#fce5e9` | `#d6384d` |
| Vence en unos días | `#256a45` | `#e5f5eb` | `#409c68` |
| Neutral / Entregada | `#786e73` | `#f3f0f2` | — |

Los tres estados se distinguen por **luminosidad y por texto**, no solo por tono.

## Tipografía

- **Familia:** Inter (respaldo: "Segoe UI", sans-serif). Tamaño base 14 px.

| Estilo | Tamaño / peso | Ejemplo |
|---|---|---|
| H1 | 30 px · 650 · tracking −1.1 px (26 px en móvil) | "Hola, Thais." |
| H2 | 18 px · 650 · tracking −0.4 px | "Mis pendientes" |
| H3 | 15 px · 1.5 de interlínea | Título de tarea en modal |
| Cuerpo | 12–14 px | Descripciones |
| Pequeño | 10–12 px | Metadatos, fechas |
| Eyebrow | 10 px · 700 · mayúsculas · tracking 1.6 px | "ESPACIO DOCENTE" |
| Login | 54 px · 500 · tracking −2.5 px | "Tu universidad. A tu ritmo." |

## Forma y espacio

- **Radios:**
  - botones: 9 px;
  - badges: 6 px;
  - paneles y tarjetas: 13 px;
  - modales: 18 px;
  - avatares: circulares.
- **Sombra:** muy suave (`0 6px 24px #23213405`). Los paneles se separan por borde, no por sombra.
- **Espaciado:** múltiplos de 4 y 8 px.
  - gaps de 12 a 25 px;
  - padding de paneles: 20 px;
  - contenido: 30 × 35 px en escritorio y 23 × 18 px en móvil.
- **Áreas táctiles:** botones de al menos 40 px de alto y botones de ícono de 38 × 38 px.

## Estructura

```
┌────────────── Barra de prototipo (34 px) ──────────────┐
│ Sidebar 220 px  │ Topbar: [rol*] [?] [🔔] [avatar]     │
│ · Marca MiU     ├──────────────────────────────────────┤
│ · Facultad      │ Encabezado de página (H1 + subtítulo │
│ · Navegación    │ + acción)                            │
│ · Nota          │ Contenido: columna principal +       │
│ · Usuario/salir │ columna derecha de 290 px            │
└─────────────────┴──────────────────────────────────────┘
* El selector de rol solo aparece para Administración.
```

## Componentes

| Componente | Descripción |
|---|---|
| **Botón** | Variantes: primario (rojo), secundario (blanco con borde), soft (lila), texto (rojo sin fondo) e ícono (38 px). |
| **Badge** | Variantes: default (lila), verde, naranja y rojo. Usado para estados, "Nuevo" y "Fijado". |
| **Fila de tarea** | Ícono por tipo, título, "Curso · X% de la nota", badges, fecha y hora a la derecha, y botón de acción. Color según el estado de entrega. |
| **Panel** | Fondo blanco, borde `--line` y radio de 13 px. |
| **Sección colapsable** | Título + contador + chevron. Recuerda si estaba abierta. |
| **Modal** | Título, subtítulo, cerrar con ícono, contenido y pie con acciones. Se cierra al hacer clic fuera. |
| **Toast** | Fondo oscuro abajo al centro. Confirma acciones ("Entrega registrada. Ya tenés tu comprobante."). |
| **Aviso (notice)** | Fondo lila. Da contexto o advierte. |
| **Comprobante** | Recuadro rosado con estado, código, hora y archivos. |
| **Área de carga** | Borde punteado. Acciones: Subir archivos, Google Drive y Enlace. |
| **Pestañas** | Tab activo en lila. Se usa en filtros y en grupos (Mis notas / Mi pensum). |
| **Tabla** | Encabezados de 10 px en el color secundario y filas de 17 px de padding. Scroll horizontal en móvil. |
| **Grilla de horario** | Lunes a viernes por hora. Bloques de clase clicables. |
| **Mensaje de chat** | Avatar, nombre, rol, hora, texto con menciones, adjuntos, "Responder en hilo" y "Me gusta". |
| **Tarjeta de curso** | Banda de color suave, símbolo grande, sección, créditos, catedrático y salón. |
| **Íconos** | De línea, SVG de 20 px, trazo de 1.7, sin relleno. Sin emojis. |

## Estados de interfaz

- **Vacío:** mensaje que guía, por ejemplo "✓ Todo entregado. ¡Buen trabajo!" o "Todavía no hay entregas de estudiantes para esta actividad."
- **Cargando:** texto "Cargando…" en el lugar del contenido.
- **Error:** un toast que explica qué pasó y qué hacer ("No se pudo subir X. Intentá de nuevo.").
- **Éxito:** un toast más el cambio visible (comprobante, badge, contador).
- **Deshabilitado:** opacidad al 50 %. Por ejemplo, "Confirmar entrega" está deshabilitado mientras no hay adjuntos.
- **Confirmación crítica:** los cambios de fecha piden "Confirmar que vi el cambio".

## Responsive

| Ancho | Comportamiento |
|---|---|
| ≥ 1500 px | Más aire vertical. |
| ≤ 1150 px | Sidebar de 190 px y columna derecha de 245 px. |
| ≤ 900 px | El dashboard pasa a una columna. |
| ≤ 650 px | El sidebar se esconde tras el botón de menú, las columnas se apilan, las filas de tareas se reacomodan y no hay scroll horizontal. |

El botón **"Vista móvil"** muestra la app a 430 px dentro del escritorio.

## Accesibilidad

- Botones y enlaces reales, con foco visible (contorno de 3 px `#df7b7b`).
- `aria-label` en los botones de ícono, `aria-current` en la navegación y `role="status"` en los toasts.
- Contraste AA en texto. Los estados no dependen solo del color.
- Se respeta `prefers-reduced-motion`.

## Roles y navegación

| Rol | Menú |
|---|---|
| Estudiante | Dashboard · Mis cursos · Mi progreso (Mis notas, Mi pensum) · Asignación · Conferencias · Pagos y parqueo |
| Catedrático | Dashboard · Mis cursos · Tareas y entregas · Calificaciones · Conferencias |
| Administración | Dashboard · Cursos y cupos (con Usuarios y roles, y Cursos: catedráticos y estudiantes) · Asignación · Conferencias · Pagos y parqueo |

El rol lo asigna Administración y queda guardado en la base de datos.
