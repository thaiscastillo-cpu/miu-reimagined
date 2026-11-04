# Lista de cambios con evidencia

Cada cambio dice **qué lo motivó**, **qué se cambió** y **cómo se verificó**. Cada uno remite a un commit del repositorio, donde se ve el cambio exacto.

## 1. Cambios a partir de las pruebas con 3 estudiantes

> Llenar con las mejoras que implementó el equipo después de las pruebas (mínimo 2). La evidencia sale de `docs/INVESTIGACION_USUARIOS.md`.

| # | Hallazgo (qué pasó en la prueba) | Evidencia (participante, observado o dicho) | Prioridad | Cambio implementado | Cómo se verificó |
|---|---|---|---|---|---|
| 1 | [ ] | [ ] | P0 / P1 / P2 | [ ] | [ ] |
| 2 | [ ] | [ ] | P0 / P1 / P2 | [ ] | [ ] |

**Trade-off:** [qué se dejó afuera y por qué]

## 2. Cambios a partir de la revisión del diseño (equipo)

Estos hallazgos salieron de usar la app publicada con distintos roles, durante la construcción.

| # | Problema encontrado | Cambio | Commit | Verificación |
|---|---|---|---|---|
| 1 | Una tarea grupal decía «Proyecto grupal · En grupo», que es redundante. | El tipo ahora dice «Proyecto» y la etiqueta «En grupo» se mantiene. | Diseño (comentario en el lienzo) | Visual en el dashboard |
| 2 | Al entrar con Google salía el nombre del usuario, pero el avatar seguía con las iniciales del perfil de ejemplo («SO»). | El avatar y el menú usan el nombre, las iniciales y la foto de la cuenta de Google. Si la foto no carga, salen las iniciales. | `c22faf1`, `f9e8251` | Prueba automatizada: foto, foto rota y sin sesión |
| 3 | Cualquier persona podía cambiarse de rol con el selector superior. | El rol lo asigna Administración en la base. Estudiantes y catedráticos ya no ven el selector y nadie puede subirse de rol. | `7e3c6f1`, `b9b7e9f` | Prueba en la base de datos con usuarios distintos (cambio de rol bloqueado) |
| 4 | Lo que hacía cada persona se guardaba solo en su navegador. | Se guarda en la cuenta del usuario (Supabase, `user_state`, con RLS). | `7e3c6f1` | Prueba: otro usuario no lee ni edita ese estado |
| 5 | El catedrático no veía las entregas reales de sus estudiantes. | Entregas compartidas: el estudiante entrega, el catedrático revisa y califica, y el estudiante ve su nota. | `28aa3d3` | Prueba en la base: el estudiante no puede ponerse nota |
| 6 | El selector de Google Drive no mostraba carpetas ni archivos compartidos. | Vistas Mi unidad (con carpetas), Compartidos conmigo, Destacados y Subir. | `b553efe` | Prueba automatizada con Picker simulado |
| 7 | En el perfil de catedrático no se veía la lista de alumnos. | Sección «Estudiantes» dentro de cada curso, con sus entregas. | `464de04`, `f9cf185` | Prueba automatizada y RLS: solo ve a los de sus cursos |
| 8 | Administración necesitaba ordenar a los usuarios. | «Usuarios y roles» se separa en Estudiantes / Catedráticos / Administración, con buscador. | `464de04` | Prueba automatizada de la búsqueda |
| 9 | Después de entregar, el estudiante no podía corregir su entrega. | «Volver a entregar» mientras no venza el plazo. La nota anterior se borra para calificar la versión nueva. | `b9b7e9f` | Prueba automatizada y trigger en la base |
| 10 | El estudiante podía agregar el LinkedIn del catedrático y registrar su propia asistencia. | Solo Administración edita LinkedIn y registra asistencia. El estudiante solo ve. | `b9b7e9f`, `f9cf185` | Prueba en la base: estudiante y catedrático bloqueados |
| 11 | Mensajes, comprobantes y grupos salían con el nombre de ejemplo «Sofía Ortega». | Todo lo que hace el usuario sale con su nombre. | `b0b6c92` | Prueba automatizada: chat, grupo y comprobante |
| 12 | El chat de clase no era compartido: cada quien veía solo sus mensajes. | Chat compartido en tiempo real. Nadie puede firmar como catedrático. | `44969ba` | Prueba en la base con suplantación bloqueada |
| 13 | Los promedios que publicaba el catedrático no le llegaban al estudiante. | Calificaciones con estudiantes reales por curso. El estudiante recibe la nota y un aviso. | `44969ba` | Prueba en la base: el estudiante solo ve sus notas |
| 14 | Cursos, inscripciones y tareas nuevas existían solo en el diseño. | Catálogo e inscripciones en la base. Administración asigna catedráticos y estudiantes. Las tareas publicadas llegan a los inscritos. Archivos en Storage privado. Asistencia real. | `f9cf185` | Prueba automatizada con los 3 roles y RLS (11 casos permitidos y bloqueados) |
| 15 | «Vincular Google Calendar» era simulado. | Conexión real: calendario «MiU» con clases, entregas, exámenes y recordatorios, sin duplicar al volver a sincronizar; «Desconectar» lo quita. | `83f512d` | Prueba automatizada con Google simulado (crear, re-sincronizar, desconectar) |

## 3. Cambios técnicos para cumplir la guía

| Requisito de la guía | Cambio | Commit |
|---|---|---|
| Publicar el diseño aprobado sin rediseñarlo | El sitio publica el export de Claude Design tal cual. La versión en Next.js queda en la rama `nextjs-supabase`. | `2bd39a0` |
| Login con Google (OAuth) | Supabase Auth con PKCE en el botón «Continuar con Google». | `4a4620c` |
| RLS y separación entre usuarios | Todas las tablas tienen RLS, permisos por columna y funciones `security definer` para las acciones de Administración y catedráticos. | `7e3c6f1` → `f9cf185` |
| Etiqueta visible de prototipo no oficial | «MiU · Prototipo académico no oficial · Sin vinculación operativa con MIU/UFM · Datos de ejemplo». | `7e3c6f1` |
| URL pública y despliegue | GitHub conectado a Vercel: cada push a `main` se publica. | `2bd39a0` |
