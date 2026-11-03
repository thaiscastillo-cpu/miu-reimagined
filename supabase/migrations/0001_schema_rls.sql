-- MIU Reimagined · Prototipo académico no oficial
-- Esquema, permisos (grants) y reglas RLS. Solo datos ficticios.

-- ───────────── Tablas ─────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Estudiante',
  role text not null default 'estudiante' check (role in ('estudiante')),
  created_at timestamptz not null default now()
);

create table public.courses (
  id int primary key,
  name text not null,
  code text not null,
  section text not null,
  teacher_name text not null,
  room text not null,
  schedule_label text not null,
  symbol text not null default '·'
);

create table public.enrollments (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id int not null references public.courses (id) on delete cascade,
  unique (user_id, course_id)
);

create table public.tasks (
  id int primary key,
  course_id int not null references public.courses (id) on delete cascade,
  title text not null,
  description text not null,
  type text not null check (type in ('Tarea', 'Proyecto', 'Examen', 'Lectura')),
  is_group boolean not null default false,
  weight int not null default 0 check (weight between 0 and 100),
  due_at timestamptz not null
);

create table public.submissions (
  id bigint generated always as identity primary key,
  task_id int not null references public.tasks (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  status text not null default 'entregada' check (status in ('en_progreso', 'entregada')),
  comment text check (char_length(comment) <= 1000),
  submitted_at timestamptz not null default now(),
  unique (task_id, user_id)
);

create table public.class_sessions (
  id int primary key,
  course_id int not null references public.courses (id) on delete cascade,
  weekday int not null check (weekday between 1 and 7), -- 1 = lunes
  starts_at time not null,
  ends_at time not null,
  location text not null
);

create table public.announcements (
  id int primary key,
  course_id int not null references public.courses (id) on delete cascade,
  title text not null,
  body text not null,
  important boolean not null default false,
  published_at timestamptz not null
);

create index on public.enrollments (user_id);
create index on public.enrollments (course_id);
create index on public.tasks (course_id);
create index on public.submissions (user_id);
create index on public.submissions (task_id);
create index on public.class_sessions (course_id);
create index on public.announcements (course_id);

-- ───────────── Grants: nada para anon, lo mínimo para authenticated ─────────────
revoke all on public.profiles, public.courses, public.enrollments, public.tasks,
  public.submissions, public.class_sessions, public.announcements from anon, authenticated;

grant select on public.courses, public.enrollments, public.tasks,
  public.class_sessions, public.announcements to authenticated;
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;
grant select, insert on public.submissions to authenticated;
grant update (status, comment, submitted_at) on public.submissions to authenticated;

-- ───────────── RLS ─────────────
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.tasks enable row level security;
alter table public.submissions enable row level security;
alter table public.class_sessions enable row level security;
alter table public.announcements enable row level security;

-- ¿Está el usuario actual inscrito en el curso? (security definer evita recursión de RLS)
create or replace function public.is_enrolled(p_course_id int)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.enrollments e
    where e.course_id = p_course_id and e.user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_enrolled(int) from public, anon;
grant execute on function public.is_enrolled(int) to authenticated;

create policy "perfil propio: leer" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "perfil propio: editar" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "inscripciones propias" on public.enrollments
  for select to authenticated using (user_id = (select auth.uid()));

create policy "cursos inscritos" on public.courses
  for select to authenticated using (public.is_enrolled(id));
create policy "tareas de cursos inscritos" on public.tasks
  for select to authenticated using (public.is_enrolled(course_id));
create policy "clases de cursos inscritos" on public.class_sessions
  for select to authenticated using (public.is_enrolled(course_id));
create policy "avisos de cursos inscritos" on public.announcements
  for select to authenticated using (public.is_enrolled(course_id));

-- Entregas: cada quien ve y modifica SOLO las suyas, y solo de tareas de sus cursos.
create policy "entregas propias: leer" on public.submissions
  for select to authenticated using (user_id = (select auth.uid()));
create policy "entregas propias: crear" on public.submissions
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.tasks t where t.id = task_id and public.is_enrolled(t.course_id))
  );
create policy "entregas propias: editar" on public.submissions
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- ───────────── Alta automática: perfil + inscripción en los cursos de demo ─────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(split_part(new.raw_user_meta_data ->> 'full_name', ' ', 1), ''),
      nullif(split_part(new.raw_user_meta_data ->> 'name', ' ', 1), ''),
      'Estudiante'
    )
  )
  on conflict (id) do nothing;

  insert into public.enrollments (user_id, course_id)
  select new.id, c.id from public.courses c
  on conflict do nothing;

  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
