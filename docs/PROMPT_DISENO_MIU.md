# Prompt para recrear el diseño de MiU

Cómo usarlo:
1. Abrí Claude → **Artifacts → Design** (o elegí *Output → Design* en una conversación).
2. Pegá el **Prompt 1** completo. Si tenés el documento de entrevistas, adjuntalo también.
3. Cuando el diseño esté listo, usá **Export → Standalone HTML**.
4. Para convertirlo en app real (login con Google, base de datos, roles), abrí Claude Code con el HTML exportado y pegá el **Prompt 2**.

---

## Prompt 1 · Diseño completo (Claude Design)

```
Diseñá "MiU", un prototipo NAVEGABLE y NO OFICIAL de portal universitario para
estudiantes, catedráticos y administración de una universidad en Guatemala.
Es un único HTML independiente (HTML + CSS + JS en un solo archivo, sin
frameworks), con datos ficticios y estado guardado en localStorage.
Todo el texto en español de Guatemala con voseo ("Entregá", "Podés", "Revisá").
No inventes datos reales de alumnos ni uses marcas sin permiso: si no hay
permiso para el logo de la universidad, usá un wordmark "MiU".

IDENTIDAD VISUAL
- Tipografía: Inter (fallback "Segoe UI", sans-serif). Base 14px.
  h1 30px peso 650 letter-spacing -1.1px; h2 18px peso 650; eyebrows 10px
  mayúsculas letter-spacing 1.6px peso 700.
- Colores (tokens en :root):
  --purple (acento principal, botones y links) #c52430
  --side (sidebar) #941b25
  --lilac (fondos suaves, badges) #fcebed
  --bg (fondo de la app) #fcf9f9
  --line (bordes) #eedfe0
  --ink (texto) #24252a
  --muted (texto secundario) #a75151
  --red #c52430
- Estados de entrega con color semántico (borde izquierdo de 3px en la fila,
  ícono y badge del mismo tono):
  Vence hoy: texto #8b6500, fondo #fff4c2, borde #e5b62a
  Vencida: texto #b51e32, fondo #fce5e9, borde #d6384d
  Vence en unos días: texto #256a45, fondo #e5f5eb, borde #409c68
  Neutral/Entregada: texto #786e73, fondo #f3f0f2
  Mostrá una leyenda pequeña con esos tres puntos de color sobre las listas.
- Radios: botones 9px, tarjetas/paneles 13px, modales 18px. Sombra muy suave.
- Botones: primario rojo (--purple) texto blanco; secundario blanco con borde
  --line; "soft" fondo --lilac texto --purple; text-button rojo sin fondo.
- Íconos de línea SVG (stroke 1.7, sin relleno), nada de emojis.
- Evitar gradientes, tarjetas idénticas repetidas y UI genérica.

ESTRUCTURA
- Barra superior delgada (34px) en todas las pantallas:
  "MiU · Prototipo académico no oficial · Sin vinculación operativa con la
  universidad · Datos de ejemplo", con links "Vista móvil" y "Reiniciar demo".
- Sidebar izquierdo 220px color --side: logo/wordmark "MiU", nombre de la
  facultad, navegación según rol con ítem activo resaltado (fondo blanco 14%),
  contador de pendientes en "Mis cursos"/tareas, nota "Un lugar para todo lo
  que viene. · Segundo semestre 2026" y tarjeta de usuario (avatar con
  iniciales, nombre, rol, botón de salir).
- Topbar blanca: selector de rol (Estudiante / Catedrático / Administración),
  botón "?" de guía de primer ingreso, campana de avisos con badge de no
  leídos, avatar.
- Login a pantalla dividida: izquierda fondo --side con "Tu universidad.
  A tu ritmo." y "Menos vueltas. Más tiempo para lo que importa.";
  derecha: badge "Prototipo navegable", "Tu próximo paso empieza aquí.",
  botón "Continuar con Google" y un aviso de demostración.
- Responsive: en ≤650px el sidebar se oculta tras un botón de menú, las
  columnas se apilan, las filas de tareas se acomodan y no hay scroll
  horizontal. Botón "Vista móvil" para previsualizar a 430px.

ROLES Y MENÚS
- Estudiante: Dashboard · Mis cursos · Mi progreso (Mis notas | Mi pensum) ·
  Asignación · Conferencias · Pagos y parqueo (Pagos | Parqueo).
- Catedrático: Dashboard · Mis cursos · Tareas y entregas · Calificaciones ·
  Conferencias.
- Administración: Dashboard · Cursos y cupos · Asignación · Conferencias ·
  Pagos y parqueo.

PANTALLAS — ESTUDIANTE
1. Dashboard: "Hola, [nombre]." / "Un vistazo a tu día. Y a lo que sigue." y
   la fecha. Banner descartable "¿Primera vez en MiU? Conocé los pasos
   principales · Guía rápida". Fila de estado: aviso de mensajes nuevos en
   clases y contador "12 entradas de parqueo". Acceso "Mis cursos ·
   Ingeniería Empresarial · 10 cursos y workshops". Sección colapsable "Mis
   pendientes" (3 más urgentes, "Ver todo ↗"). Columna derecha: mini
   calendario del mes con días marcados, "Vincular Google Calendar", "Ver
   semana", y lista colapsable de cursos.
2. Fila de tarea (componente clave): ícono por tipo (archivo, grupo,
   examen), título, "Curso · X% de la nota", badges de estado + tipo +
   "En grupo"/"Nuevo", fecha y hora a la derecha, "Entrega habilitada" si
   venció, y botón "Entregar →" / "Ver detalle" / "Ver entrega".
3. Pendientes: "Nada se te pasa." Pestañas Todos / Por entregar /
   Entregadas / Tardías, ordenar por urgencia, fecha o peso, "+
   Recordatorio" personal y enlace a Google Calendar. Nota: "Las
   actividades fuera de plazo siguen aceptando entregas; el catedrático verá
   la marca Tarde."
4. Entregar (modal): descripción, materiales, rúbrica desplegable de 100
   pts, área de carga "Tu trabajo, desde donde estés." con Subir archivos /
   Google Drive / Enlace, lista de adjuntos removibles, para trabajos en
   grupo "¿Con quién trabajaste?" con checkboxes de compañeros, comentario
   para el catedrático, "Confirmar entrega" deshabilitado sin adjuntos.
   Al confirmar: comprobante con código, hora y archivos ("Tu entrega quedó
   registrada."), y la nota/retroalimentación cuando exista.
5. Mis cursos: vista Tarjetas | Lista. Tarjeta con banda de color suave,
   símbolo grande del curso, sección, créditos (UMA), catedrático y salón.
6. Curso: "Ver programa del curso", Pendientes del curso, Material de clase,
   Notas del curso por categoría (Primer parcial 20%, Segundo parcial 20%,
   Exámenes cortos 15%, Entregables 15%…) con actividades y calificación;
   columna derecha: catedrático y auxiliar (con "Ver perfil y reseñas"),
   "Chat de la clase", horario y salón.
7. Chat de clase: lista de espacios por curso a la izquierda; mensajes con
   avatar, nombre, rol, hora, mensaje fijado del catedrático, adjuntos,
   "Responder en hilo", "Me gusta", menciones con @, búsqueda, ver
   participantes de la clase.
8. Catedráticos: "Elegí con más contexto." Tarjetas con área, metodología,
   etiquetas, calificación ★, claridad, carga semanal, forma de evaluación,
   reseñas anónimas, enlace a LinkedIn y formulario para dejar reseña.
9. Mi horario: "Tu semana, de un vistazo." Grilla lunes–viernes por hora con
   bloques de clase clicables que abren el curso.
10. Mis notas: selector de semestre, promedio ponderado por créditos,
    detalle por curso y calculadora "¿Qué nota necesito en el final?".
11. Mi pensum: mapa por semestre con estados Aprobado / En curso /
    Pendiente, UMA aprobadas e inscritas y % de avance.
12. Asignación: "Compará catedráticos y horarios, materia por materia."
    Buscador, secciones con catedrático, horario y cupos, detección de
    choques de horario, borrador y confirmación; turnos (cuadro de honor /
    general) y escenarios de alta demanda/fila virtual.
13. Conferencias: calendario de la facultad, detalle, "Agregar a mi
    calendario", "Mi QR personal" (el personal escanea entrada y salida),
    evaluación posterior, comprobante y conteo de UMA.
14. Pagos: "Tus pagos, sin vueltas." Saldo pendiente, cuota del semestre,
    movimientos y confirmación simulada (sin pedir datos de tarjeta).
15. Parqueo: "Tu entrada al campus." Entradas disponibles y paquetes/pase
    semestral con compra simulada.
16. Avisos (campana): cambios de fecha, nuevas actividades, notas
    publicadas y recordatorios; los críticos piden "Confirmar que vi el
    cambio"; preferencias de avisos.
17. Guía de primer ingreso: pasos numerados con progreso, se retoma desde "?".

PANTALLAS — CATEDRÁTICO
- Dashboard: "Buen día, [nombre]." hero "Todo listo para tu próxima clase."
  y métricas (cursos, entregas, asignaciones).
- Tareas y entregas: tabla Actividad / Curso / Entregas / Acciones,
  "+ Publicación rápida" con plantilla (tipo, curso, peso, categoría de
  nota, grupal, fecha, materiales, rúbrica, vista previa y borrador), y
  "Revisar" para ver la lista de entregas, abrir adjuntos, calificar 0–100
  y dejar retroalimentación.
- Calificaciones: "Notas claras y a tiempo." elegir curso, publicar el
  promedio de cada estudiante e importar de Google Sheets (simulado).
- En cada curso, una sección "Estudiantes" con la lista de alumnos y sus
  entregas.

PANTALLAS — ADMINISTRACIÓN
- Dashboard: "Tu universidad, en perspectiva."
- Cursos y cupos: "Oferta académica, en orden." tabla de cursos y
  secciones con cupos, auxiliar y correos del equipo docente; turno de
  asignación (cuadro de honor); "Usuarios y roles" agrupado en
  Estudiantes / Catedráticos / Administración con buscador y selector de
  rol. Solo Administración edita LinkedIn de catedráticos y registra
  asistencia a conferencias.

DATOS DE EJEMPLO (ficticios)
Carrera Ingeniería Empresarial, plan 2026E, segundo semestre 2026.
Cursos: Contabilidad Financiera (C0004, H, Lun·Mié 08:00–09:20, Aula B-304),
Economía II (E004, B, Mar·Jue 10:00–11:20, Aula C-201), Cálculo Diferencial
(MC05, C, Lun·Mié 11:30–12:50, Aula B-202), Discovering the Business World
II, Física I, Marketing, Organizational Behavior, Project-Based Learning
Lab, más dos workshops. Catedráticos ficticios: Elena Morales, Andrés
Castillo, Lucía Herrera. Tareas: "Análisis de estados financieros" (Tarea
10%), "Ensayo: incentivos y decisiones" (Tarea 15%), "Proyecto de
aplicaciones de cálculo" (Proyecto 20%, en grupo), "Segundo examen
parcial" (Examen 20%), "Lectura: flujo de efectivo" (Lectura 0%).
Poné fechas de entrega a partir de la semana de la demo para que haya
tareas que vencen hoy, en unos días y vencidas.

ESTADOS Y CALIDAD
- Estados vacío, cargando, error, éxito (toasts) y confirmación en cada flujo.
- Accesible: botones reales, foco visible, aria-labels en botones de ícono,
  contraste AA, tamaños táctiles ≥40px.
- Persistencia en localStorage y botón "Reiniciar demo".

ENTREGA
Primero proponé 2 direcciones visuales cortas y esperá mi elección; luego
construí el prototipo completo y probá con clics los recorridos:
A) próxima entrega → entregar → comprobante,
B) próxima clase → horario → curso,
C) aviso importante → detalle.
No digas que el prototipo es un backend funcional.
```

---

## Prompt 2 · Convertirlo en app real (Claude Code)

```
Tengo el HTML exportado de Claude Design de "MiU" (index.html). Quiero
publicarlo tal cual, sin cambiar pantallas ni textos, y conectar lo que hoy
es simulado. Primero escribí un plan corto y esperá mi aprobación.

Stack: sitio estático en Vercel (desde GitHub) + Supabase (Auth + Postgres)
con supabase-js por CDN. Clave publicable en el navegador; nada de secretos.

Conectar, sin rediseñar:
1. Login con Google (Supabase Auth, PKCE) en el botón "Continuar con Google";
   nombre, iniciales y foto de Google en saludo, sidebar, avatares, chat,
   QR y comprobantes.
2. Roles en la base: profiles.role (estudiante / catedratico / administracion).
   Solo Administración cambia roles (función security definer) y es la única
   que ve el selector de rol; tabla "Usuarios y roles" agrupada por rol con
   buscador dentro de "Cursos y cupos".
3. Guardar el estado de cada usuario (lo que antes iba a localStorage) en
   user_state (jsonb, RLS: solo el dueño).
4. Entregas compartidas (task_submissions): el estudiante entrega y puede
   volver a entregar dentro del plazo (la nota anterior se borra); el
   catedrático ve la lista, abre adjuntos de Drive y califica con una
   función que solo permite catedráticos; el estudiante ve su nota.
5. Google Drive Picker real (alcance drive.file) en el botón "Google Drive",
   con Mi unidad, Compartidos, Destacados y Subir.
6. Chat de clase compartido en tiempo real (chat_messages + Realtime);
   nadie puede firmar como catedrático.
7. Promedios publicados por catedráticos (course_grades) que el estudiante
   ve en Mis notas.
8. Catedrático ve a sus estudiantes en cada curso. LinkedIn de catedráticos
   compartido (solo Administración edita). Registro de asistencia solo
   Administración.

Seguridad: RLS en todas las tablas, anon sin permisos, grants por columna y
pruebas con dos usuarios distintos (uno no ve ni modifica lo del otro; un
estudiante no puede subirse de rol ni ponerse nota). Mantener visible
"Prototipo académico no oficial".
```
