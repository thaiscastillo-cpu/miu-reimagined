# MIU Reimagined

> **Prototipo académico no oficial.** No tiene vinculación operativa con MIU/UFM. Todos los cursos, tareas, horarios y avisos son ficticios.

Propuesta estudiantil del workshop *Beyond Vibe Coding* (UFM, oct–nov 2026). Junta en un solo lugar las tres cosas que un estudiante consulta cada semana: qué entrega viene, cuándo y dónde es su próxima clase, y qué avisó el catedrático.

## Los 3 happy paths

| Flujo | Recorrido | Criterio de aceptación |
|---|---|---|
| **A. Próxima entrega** | Dashboard → Mis tareas → Detalle → *Marcar como entregada* | La tarea más urgente aparece primero; al marcarla, sigue entregada después de recargar y solo la ve su dueño. |
| **B. Próxima clase** | Dashboard → *Ver mi semana* → clase → aula y catedrático | La próxima clase está resaltada; al tocarla se ven día, hora, aula y catedrático. |
| **C. Aviso académico** | Dashboard → Avisos → curso → aviso | Los avisos están ordenados por fecha, los importantes marcados, y se abre el contenido completo en ≤ 2 clics. |

Fuera de alcance (backlog): pagos, parqueo, asignación de cursos, pensum, conferencias, chat, vista de catedrático y subida real de archivos.

## Stack

- **Next.js 16** (App Router, TypeScript) con los estilos del diseño exportado de Claude Design (`design/miu-design.html`) en `app/globals.css`, más Tailwind 4.
- **Supabase**: Postgres + Auth con Google OAuth, usando `@supabase/ssr` (cookies y PKCE).
- **Vercel** (Hobby) para el hosting.

```
app/
  login/                  Pantalla de ingreso + botón de Google
  auth/callback/route.ts  Supabase → Next.js: canjea el code por sesión
  auth/signout/route.ts   Cerrar sesión
  (app)/                  Rutas privadas (sidebar + etiqueta "no oficial")
    page.tsx              Dashboard
    tareas/               Lista, detalle y Server Actions de entrega
    horario/              Semana y detalle de clase
    avisos/               Lista por curso y detalle
components/  lib/  proxy.ts (refresca la sesión y protege rutas)
supabase/migrations/      Esquema + grants + RLS
supabase/seed.sql         Datos ficticios
```

## Seguridad

- Las 7 tablas tienen **RLS activado**. `anon` no tiene permisos.
- Un estudiante solo ve los cursos en los que está inscrito y **solo sus propias entregas**. No puede crear ni editar cursos, tareas, horarios ni avisos.
- Al primer login, un trigger crea su perfil y lo inscribe en los 5 cursos de demo.
- Probado con dos usuarios distintos: B no puede leer ni modificar la entrega de A, y una sesión anónima no lee nada.
- En el navegador solo se usa la **clave publicable**. El Client Secret de Google vive únicamente en el panel de Supabase.

## Correr localmente

```bash
npm install
cp .env.example .env.local   # completar con Supabase → Connect
npm run dev                  # http://localhost:3000
```

Variables (ambas públicas; no saltan RLS):

| Variable | Dónde se obtiene |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Connect → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Connect → Publishable key |

Para recrear la base: ejecutar `supabase/migrations/*.sql` en orden y después `supabase/seed.sql` en el SQL Editor.

## Google OAuth (dos callbacks distintos)

1. **Google → Supabase**: en Google Cloud → Clients → Authorized redirect URIs:
   `https://nsmjewjnyskwmusklthv.supabase.co/auth/v1/callback`
2. **Supabase → Next.js**: en Supabase → Authentication → URL Configuration → Redirect URLs:
   `http://localhost:3000/auth/callback` y `https://<tu-url>.vercel.app/auth/callback`

## Checklist del workshop

- [ ] Leímos el research original de ~30 estudiantes.
- [ ] Definimos 1 problema principal respaldado por evidencia.
- [x] Tenemos 3 happy paths con criterios de aceptación.
- [x] Construimos y documentamos un design system coherente.
- [x] Exportamos el HTML de Claude Design.
- [x] El agente preparó un plan (`docs/IMPLEMENTATION_PLAN.md`).
- [ ] Creamos repositorio GitHub (sin secretos).
- [x] Next.js corre localmente y `npm run build` no falla.
- [x] Supabase tiene tablas, datos ficticios, grants y RLS.
- [ ] Google OAuth funciona en la URL pública (login/logout).
- [x] Dos usuarios no pueden ver datos privados del otro (prueba SQL).
- [ ] Los 3 recorridos funcionan en computadora y móvil (verificar en la URL pública).
- [ ] La app está disponible por HTTPS en `*.vercel.app`.
- [ ] Probamos con 3 estudiantes y documentamos observaciones.
- [ ] Implementamos 2 mejoras basadas en lo observado.
- [ ] Publicamos la última versión y verificamos la URL.
- [x] El producto informa que NO es el MIU oficial.
- [ ] README, URL, investigación y demo final están listos.
