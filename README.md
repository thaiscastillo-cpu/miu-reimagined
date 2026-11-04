# MiU — Tu universidad, a tu ritmo

> **Prototipo académico no oficial.** Sin vinculación operativa con MIU/UFM. Los cursos, notas, pagos y demás contenidos son datos de ejemplo.

**URL pública:** https://miu-reimagined.vercel.app
**Workshop:** Beyond Vibe Coding · UFM · octubre–noviembre 2026
**Entregables:** [`docs/ENTREGABLES.md`](docs/ENTREGABLES.md)

## El problema

> [Pendiente: problema principal y evidencia del documento de ~30 entrevistas. No se inventan hallazgos.] · Ver `docs/INVESTIGACION_USUARIOS.md`.

## La experiencia

El diseño completo se hizo en Claude Design y se publica **tal cual** (`index.html`). El export original está en `design/miu-diseno-original.html` y el design system documentado en [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md). Incluye:

- **Estudiante:** dashboard de pendientes por urgencia, mis cursos, progreso y notas, horario, asignación, conferencias, chat de clase, pagos y parqueo.
- **Catedrático:** tareas y entregas, publicación de actividades, revisión y calificaciones.
- **Administración:** cursos y cupos, asignación, conferencias, pagos, y **usuarios y roles**.

### Happy paths

| Flujo | Recorrido | Señal de que funciona |
|---|---|---|
| A. Próxima entrega | Dashboard → Mis pendientes → Entregar → adjuntar (archivo, enlace o Google Drive) → Confirmar | La entrega queda registrada con comprobante y sigue ahí al recargar o al entrar desde otro dispositivo. |
| B. Próxima clase | Dashboard → Ver semana → clase | Se ve día, hora, aula y curso. |
| C. Comunicación académica | Campana de avisos / chat de clase → aviso | Se encuentra el aviso sin explorar pantallas de más. |

## Qué es real y qué es demostración

| Funcionalidad | Estado |
|---|---|
| Login con Google | **Real** (Supabase Auth, OAuth 2.0 con PKCE) |
| Nombre y foto del usuario | **Real**, tomados de la cuenta de Google |
| Rol del usuario (Estudiante / Catedrático / Administración) | **Real**: lo asigna Administración y se guarda en la base de datos. Solo Administración puede cambiar de vista con el selector superior. |
| Guardado de lo que cada persona hace (entregas, preferencias, borradores…) | **Real**: se guarda en la cuenta del usuario en Supabase y se recupera al volver a entrar. |
| Entregas → revisión docente | **Real**: cuando un estudiante entrega, el catedrático la ve en *Tareas y entregas*, abre los adjuntos de Drive y califica; el estudiante ve su nota y retroalimentación. Solo catedráticos y Administración pueden calificar (`grade_submission`). |
| Chat de clase | **Real y compartido**: todos ven los mensajes de los demás en tiempo real (Supabase Realtime). Cada quien escribe solo a su nombre; un estudiante no puede firmar como catedrático. |
| Calificaciones (promedios) | **Real**: el catedrático elige el curso y publica el promedio de cada estudiante registrado; el estudiante lo ve en Mis notas. |
| Google Calendar | **Real**: crea un calendario «MiU» en la cuenta del usuario con clases (semanales), entregas, exámenes, lecturas y recordatorios, con avisos 24 h y 1 h antes. Permiso `calendar.app.created`: MiU solo toca ese calendario. |
| Adjuntar desde Google Drive | **Real** (Google Picker, permiso `drive.file`: la app solo accede a los archivos que el usuario elige). |
| Cursos e inscripciones | **Real**: el catálogo vive en la base. Administración asigna catedráticos y estudiantes a cada curso; cada quien ve solo los suyos. |
| Tareas publicadas por el catedrático | **Real**: "Publicación rápida" llega a los estudiantes inscritos, con aviso. |
| Archivos de entregas | **Real**: se guardan en Supabase Storage (privado, máx. 10 MB); solo los abren el estudiante y el catedrático del curso. |
| Asistencia a conferencias | **Real**: Administración la registra desde el QR y al estudiante le aparece en su cuenta. |
| Pagos, parqueo, pensum, horarios y datos de otros perfiles | Datos de ejemplo del diseño. |

## Arquitectura

```
Navegador ── index.html (diseño MiU) ── supabase-js
                 │
Vercel (sitio estático) ◄── GitHub (cada push publica)
                 │
Supabase Auth ◄── Google OAuth
Supabase Postgres (RLS)
  ├─ profiles     rol y datos básicos de cada usuario
  ├─ user_state         lo que cada usuario hizo en MiU (JSON)
  ├─ task_submissions   entregas compartidas con el catedrático
  ├─ chat_messages      chat de clase compartido
  ├─ course_grades      promedios publicados por catedráticos
  ├─ teacher_links      LinkedIn de catedráticos (lo edita Administración)
  ├─ courses · enrollments · course_teachers   catálogo, inscripciones y asignaciones
  ├─ course_tasks       tareas publicadas por catedráticos
  ├─ conference_attendance   asistencia registrada por Administración
  └─ Storage: entregas  archivos de entregas (privado)
```

`supabase/migrations/` contiene el esquema completo (también tablas de cursos, tareas, horarios y avisos de una versión anterior en la rama `nextjs-supabase`).

## Seguridad

- **RLS en todas las tablas.** El rol `anon` no tiene permisos.
- Cada usuario solo puede **leer y escribir su propio** `user_state`.
- Un estudiante solo ve **sus** entregas y no puede ponerse nota; catedráticos y Administración ven todas y califican.
- Los catedráticos ven la lista de estudiantes (nombre y correo), pero no a otros catedráticos ni a Administración.
- Nadie puede cambiarse su propio rol. Solo Administración, a través de la función `set_user_role`, y no puede quitarse su propio rol de Administración.
- Probado con usuarios distintos:
  - un estudiante no ve ni modifica los datos de otro;
  - un estudiante no puede subirse de rol;
  - Administración sí asigna roles;
  - una sesión anónima no lee nada.
- En el navegador solo están la **clave publicable** de Supabase y valores públicos de Google. El Client Secret de Google vive únicamente en el panel de Supabase.

## Cómo correrlo localmente

Es una página estática:

```bash
python3 -m http.server 3000
```

Abrir http://localhost:3000. Para que el login funcione en local, agregá `http://localhost:3000/**` en Supabase → Authentication → URL Configuration → Redirect URLs.

## Configuración

**Google Login (Supabase)**
- Google Cloud → Clients → Authorized redirect URIs: `https://nsmjewjnyskwmusklthv.supabase.co/auth/v1/callback`
- Supabase → Authentication → Providers → Google: Client ID y Client Secret.
- Supabase → URL Configuration: Site URL `https://miu-reimagined.vercel.app` y Redirect URL `https://miu-reimagined.vercel.app/**`.

**Google Drive (opcional)**
En `index.html`, constante `DRIVE` (valores públicos):
- `clientId`: Client ID web.
- `apiKey`: API key restringida al sitio.
- `appId`: número del proyecto de Google Cloud.

Requiere activar Google Picker API y Google Drive API, agregar el alcance `drive.file` y `https://miu-reimagined.vercel.app` como Authorized JavaScript origin.

**Primer usuario de Administración**
```sql
update public.profiles set role = 'administracion' where email = 'correo@ejemplo.com';
```

## Pruebas con usuarios

Guion, matriz y hallazgos en [`docs/INVESTIGACION_USUARIOS.md`](docs/INVESTIGACION_USUARIOS.md).

## Cambios a partir del feedback

Lista completa con evidencia y commits en [`docs/CAMBIOS.md`](docs/CAMBIOS.md). Guion de la demo de 3 minutos en [`docs/GUION_DEMO.md`](docs/GUION_DEMO.md).

## Checklist del workshop

- [ ] Leímos el research original de ~30 estudiantes.
- [ ] Definimos 1 problema principal respaldado por evidencia.
- [x] Tenemos 3 happy paths con criterios de aceptación.
- [x] Construimos y documentamos un design system coherente.
- [x] Exportamos el HTML de Claude Design.
- [x] El agente preparó un plan (`docs/IMPLEMENTATION_PLAN.md`).
- [x] Creamos repositorio GitHub (sin secretos).
- [x] Supabase tiene tablas, grants y RLS.
- [x] Google OAuth funciona en la URL pública (login/logout).
- [x] Dos usuarios no pueden ver datos privados del otro.
- [x] Los 3 recorridos funcionan en computadora y móvil (diseño responsive con vista móvil).
- [x] La app está disponible por HTTPS en `*.vercel.app`.
- [ ] Probamos con 3 estudiantes y documentamos observaciones.
- [ ] Implementamos 2 mejoras basadas en lo observado.
- [x] Publicamos la última versión y verificamos la URL.
- [x] El producto informa que NO es el MIU oficial.
- [ ] README, URL, investigación y demo final están listos.
