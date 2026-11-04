> **Nota:** este fue el plan inicial (Fase 0). El proyecto final publica el diseño de Claude Design tal cual y lo conecta a Supabase; ver README y `docs/CAMBIOS.md`.

# MIU Reimagined — Plan de implementación (Fase 0)

> Prototipo académico **no oficial**. Sin vinculación operativa con MIU/UFM. Solo datos ficticios.
> Estado: **borrador para aprobar**. No se ha creado código ni tablas todavía.

## 1. Situación actual (revisado el 3 nov 2026)

| Pieza | Estado |
|---|---|
| Diseño Claude Design | Listo: HTML independiente "MiU" (≈350 KB), muy completo (16 pantallas). |
| Documento de ~30 entrevistas | **No lo tengo.** Es la fuente primaria según la guía. |
| Supabase | Proyecto `nsmjewjnyskwmusklthv` (us-west-2) activo y **vacío**, sin tablas. |
| Vercel | Cuenta conectada, **sin proyectos**. |
| GitHub | **Ningún repositorio** conectado a esta sesión. |
| Google OAuth | No configurado (lo tienes que hacer tú en Google Cloud Console). |
| Calendario | Hoy es lun 3 nov → **Demo day es mañana, mié 4 nov.** |

**Riesgo principal:** queda menos de un día. El plan recorta todo a los 3 flujos y deja el resto del diseño como pantallas de solo lectura o "próximamente".

## 2. Los 3 happy paths (propuesta, ajustar con tus entrevistas)

Tomados de la guía (sección 05) y mapeados a pantallas que ya existen en tu diseño:

| Flujo | Recorrido en la app | Criterio de aceptación | Pantallas del diseño |
|---|---|---|---|
| **A. Próxima entrega** | Dashboard → Mis tareas → Detalle → marcar "entregada" | Desde el dashboard veo la próxima entrega, su curso y fecha; al marcarla entregada, **sigue entregada tras recargar** y solo yo veo mi entrega. | `home`, `tasks`, detalle de tarea |
| **B. Próxima clase** | Dashboard → Horario → clase → aula y profesor | Puedo decir a qué hora y en qué aula es mi próxima clase, sin preguntar. | `schedule`, `course` |
| **C. Aviso académico** | Dashboard → Avisos → aviso de un curso → contenido | Encuentro el último aviso importante de un curso en ≤2 clics; ordenados por fecha. | Avisos del dashboard / chat de clase |

**Fuera de alcance (backlog, se ven pero no guardan datos):** pagos, parqueo, asignación de cursos, pensum, conferencias, chat completo, vista de profesor/admin, calificaciones editables, LinkedIn, Drive.

## 3. Stack y arquitectura

```
Navegador → Vercel (Next.js App Router + TypeScript + Tailwind)
              ├─ /login  → botón "Continuar con Google"
              ├─ /auth/callback  (canjea el code por sesión, PKCE)
              ├─ Supabase Auth  ← Google OAuth
              └─ Supabase Postgres (tablas + RLS)
GitHub (repo privado) → deploy automático en Vercel
```

- Arranque: `npx create-next-app@latest miu-reimagined -e with-supabase` (trae `@supabase/ssr`, cookies y Tailwind).
- El diseño se **traduce a componentes React** (Sidebar, Topbar, TaskRow, CourseCard, ScheduleGrid, NoticeCard, Badge, Button). No se pega el HTML entero.
- Los colores y tipografía de tu CSS (`--purple #c52430`, `--side #941b25`, `--bg #fcf9f9`, Inter) pasan a tokens de Tailwind.

```
app/
  (auth)/login/page.tsx
  auth/callback/route.ts
  (app)/layout.tsx          ← sidebar + topbar + etiqueta "Prototipo no oficial"
  (app)/page.tsx            ← Dashboard
  (app)/tareas/page.tsx  y  tareas/[id]/page.tsx
  (app)/horario/page.tsx
  (app)/avisos/page.tsx  y  avisos/[id]/page.tsx
components/  lib/supabase/{client,server,middleware}.ts  supabase/migrations/*.sql  supabase/seed.sql
```

## 4. Base de datos (datos ficticios)

| Tabla | Campos | Quién puede |
|---|---|---|
| `profiles` | id (= auth.users.id), display_name, role | Leer/editar solo el propio |
| `courses` | id, name, code, teacher_name, room, color | Leer: usuarios con sesión |
| `enrollments` | id, user_id, course_id | Leer solo las propias |
| `tasks` | id, course_id, title, description, type, due_at, weight | Leer si estoy inscrito en el curso |
| `submissions` | id, task_id, user_id, status, submitted_at | Leer/crear/editar **solo las propias** |
| `class_sessions` | id, course_id, weekday, starts_at, ends_at, location | Leer si estoy inscrito |
| `announcements` | id, course_id, title, body, published_at, important | Leer si estoy inscrito |

- **RLS activado en todas.** Nadie puede escribir en cursos, tareas ni avisos desde el navegador.
- Al primer login, un trigger crea el `profile` y **auto-inscribe** al usuario en los 5 cursos ficticios, para que cualquier compañero que pruebe la demo vea datos.
- Seed con los cursos del diseño (Contabilidad Financiera, Economía II, Cálculo Diferencial…) y tareas/avisos inventados, sin nombres de alumnos reales.
- **Prueba de seguridad:** con dos cuentas Google distintas, B no puede leer ni modificar las entregas de A (consulta directa a la API).

## 5. Variables de entorno

| Variable | Dónde | ¿Pública? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` y Vercel | Sí |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `.env.local` y Vercel | Sí (no salta RLS) |
| Google Client ID / Secret | **Solo en el panel de Supabase** | Nunca en código |

`.gitignore` excluye `.env*.local`, `node_modules/`, `.next/`.

## 6. Google OAuth: dos callbacks diferentes

1. Google → Supabase: `https://nsmjewjnyskwmusklthv.supabase.co/auth/v1/callback` (va en Google Cloud → Authorized redirect URIs).
2. Supabase → Next.js: `http://localhost:3000/auth/callback` y `https://<tu-proyecto>.vercel.app/auth/callback` (van en Supabase → Authentication → URL Configuration).

**Plan B si Google bloquea correos @ufm.edu:** usar cuentas Gmail personales como usuarios de prueba (app en modo Testing), o login por enlace mágico de Supabase como alternativa demostrable.

## 7. Fases con verificación

| Fase | Qué hago yo | Qué haces tú | Listo cuando |
|---|---|---|---|
| **1. Scaffold y diseño** (~2 h) | Proyecto Next.js, tokens, layout, Dashboard/Tareas/Horario/Avisos con datos de prueba; `npm run build` sin errores | Crear repo vacío `miu-reimagined` en GitHub (privado) y conectarlo a esta sesión | Las 4 pantallas se ven como tu diseño, en escritorio y móvil |
| **2. Datos y login** (~2 h) | Migraciones SQL + RLS + seed (te muestro el SQL antes de aplicarlo), login/logout, callback, rutas protegidas, marcar entrega | Crear cliente OAuth en Google Cloud y pegar Client ID/Secret en Supabase | Login real; marcar entrega persiste tras recargar; prueba con 2 usuarios pasa |
| **3. Publicar** (~1 h) | Proyecto en Vercel desde GitHub, variables, deploy, README, pruebas en URL pública | Agregar la URL de Vercel en Supabase y probar en el teléfono | App en `*.vercel.app` con HTTPS, login y los 3 flujos funcionando |
| **4. Feedback** (lo que alcance) | Tabla de hallazgos, 2 mejoras, changelog, guion de demo de 3 min | Probar con 3 compañeros (guion de la sección 10) y pasarme notas | 2 mejoras implementadas y redeploy |

**No hago sin tu aprobación:** ejecutar SQL en tu Supabase, crear el proyecto en Vercel, desplegar públicamente, comprar dominio o cualquier pago.

## 8. Preguntas bloqueantes

1. **Entrevistas:** ¿me pasas el documento de las ~30 entrevistas? Sin él, los 3 flujos son la propuesta de la guía, no hallazgos tuyos (te costaría puntos en "Discovery", 20 pts).
2. **GitHub:** ¿tienes cuenta? Crea un repo vacío `miu-reimagined` y dime tu usuario para conectarlo aquí.
3. **¿Los 3 flujos de la sección 2 te sirven**, o tu research apunta a otros (p. ej. calificaciones o asignación)?
4. **Marca UFM:** el diseño usa el logo de UFM. La guía pide confirmar permiso o usar identidad diferenciada. Propongo quitar el logo y dejar "MIU Reimagined — demo estudiantil".
5. **¿Ya pruebas con 3 estudiantes?** Si no, hay que agendarlos para mañana antes de la demo.

## 9. Checklist (copiar al README)

- [ ] Research leído y problema principal definido
- [ ] 3 happy paths con criterios de aceptación
- [ ] Design system documentado / HTML exportado
- [ ] Plan aprobado
- [ ] Repo GitHub sin secretos
- [ ] `npm run build` sin errores
- [ ] Tablas, seed y RLS en Supabase
- [ ] Google OAuth en URL pública (login/logout)
- [ ] Dos usuarios no ven datos del otro
- [ ] 3 recorridos en computadora y móvil
- [ ] HTTPS en `*.vercel.app`
- [ ] 3 pruebas con estudiantes documentadas
- [ ] 2 mejoras implementadas
- [ ] Etiqueta visible "Prototipo académico no oficial"
- [ ] README, URL, investigación y demo listos
