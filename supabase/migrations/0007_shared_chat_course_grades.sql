-- Chat de clase compartido
create table public.chat_messages (
  id bigint generated always as identity primary key,
  course_id int not null,
  author_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  author_name text not null check (char_length(author_name) between 1 and 200),
  author_role text not null default 'Estudiante' check (author_role in ('Estudiante','Catedrático','Administración')),
  initials text not null default '' check (char_length(initials) <= 3),
  text text not null default '' check (char_length(text) <= 2000),
  files jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index on public.chat_messages (course_id, created_at);
revoke all on public.chat_messages from anon, authenticated;
grant select on public.chat_messages to authenticated;
grant insert (course_id, author_name, author_role, initials, text, files) on public.chat_messages to authenticated;
alter table public.chat_messages enable row level security;
create policy "chat: usuarios con sesión leen" on public.chat_messages for select to authenticated using (true);
create policy "chat: cada quien escribe a su nombre" on public.chat_messages for insert to authenticated
  with check (author_id = (select auth.uid())
    and (author_role = 'Estudiante' or private.is_teacher()));
alter publication supabase_realtime add table public.chat_messages;

-- Promedios por curso publicados por catedráticos
create table public.course_grades (
  student_id uuid not null references auth.users (id) on delete cascade,
  course_id int not null,
  grade int not null check (grade between 0 and 100),
  published_by uuid not null default auth.uid() references auth.users (id),
  published_at timestamptz not null default now(),
  primary key (student_id, course_id)
);
revoke all on public.course_grades from anon, authenticated;
grant select on public.course_grades to authenticated;
grant insert (student_id, course_id, grade, published_at), update (grade, published_at) on public.course_grades to authenticated;
alter table public.course_grades enable row level security;
create policy "notas: el estudiante ve las suyas, catedráticos todas" on public.course_grades for select to authenticated
  using (student_id = (select auth.uid()) or private.is_teacher());
create policy "notas: catedráticos publican" on public.course_grades for insert to authenticated with check (private.is_teacher() and published_by = (select auth.uid()));
create policy "notas: catedráticos corrigen" on public.course_grades for update to authenticated using (private.is_teacher()) with check (private.is_teacher());
