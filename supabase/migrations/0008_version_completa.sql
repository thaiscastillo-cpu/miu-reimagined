-- MiU versión completa: cursos e inscripciones reales, tareas del catedrático compartidas,
-- archivos guardados (Storage) y asistencia a conferencias registrada por Administración.

-- ── Cursos: el catálogo del diseño vive en la base ──
alter table public.courses add column if not exists data jsonb not null default '{}'::jsonb;
delete from public.courses; -- reemplaza el catálogo de prueba anterior (cascade a sus tablas de prueba)
insert into public.courses (id, name, code, section, teacher_name, room, schedule_label, symbol, data) values
(1,'Contabilidad Financiera','C0004','H','Elena Morales','Aula B-304','Lun · Mié 08:00–09:20','∑','{"id":1,"name":"Contabilidad Financiera","code":"C0004","section":"H","teacher":0,"credits":3,"grade":84,"aux":"Por confirmar","time":"Lun · Mié 08:00–09:20","room":"Aula B-304","symbol":"∑","bg":"#fce6e6","color":"#a52a2a","capacity":6}'::jsonb),
(2,'Economía II','E004','B','Andrés Castillo','Aula C-201','Mar · Jue 10:00–11:20','↗','{"id":2,"name":"Economía II","code":"E004","section":"B","teacher":1,"credits":3,"grade":91,"aux":"Por confirmar","time":"Mar · Jue 10:00–11:20","room":"Aula C-201","symbol":"↗","bg":"#f9e4e4","color":"#a52a2a","capacity":12}'::jsonb),
(3,'Cálculo Diferencial','MC05','C','Lucía Herrera','Aula B-202','Lun · Mié 11:30–12:50','∂','{"id":3,"name":"Cálculo Diferencial","code":"MC05","section":"C","teacher":2,"credits":3,"grade":88,"aux":"Por confirmar","time":"Lun · Mié 11:30–12:50","room":"Aula B-202","symbol":"∂","bg":"#f5e5e5","color":"#a52a2a","capacity":4}'::jsonb),
(4,'Discovering the Business World II','G0003','C','Andrés Castillo','Salón por confirmar','Horario por confirmar','↗','{"id":4,"name":"Discovering the Business World II","code":"G0003","section":"C","teacher":1,"credits":3,"grade":90,"aux":"Por confirmar","time":"Horario por confirmar","room":"Salón por confirmar","symbol":"↗","bg":"#fce6e6","color":"#a52a2a","capacity":10}'::jsonb),
(5,'Física I','MF005','A','Lucía Herrera','Salón por confirmar','Horario por confirmar','F','{"id":5,"name":"Física I","code":"MF005","section":"A","teacher":2,"credits":3,"grade":82,"aux":"Por confirmar","time":"Horario por confirmar","room":"Salón por confirmar","symbol":"F","bg":"#f9e4e4","color":"#a52a2a","capacity":8}'::jsonb),
(6,'Marketing','G298','A','Andrés Castillo','Salón por confirmar','Horario por confirmar','↗','{"id":6,"name":"Marketing","code":"G298","section":"A","teacher":1,"credits":3,"grade":89,"aux":"Por confirmar","time":"Horario por confirmar","room":"Salón por confirmar","symbol":"↗","bg":"#f5e5e5","color":"#a52a2a","capacity":6}'::jsonb),
(7,'Organizational Behavior','G118','A','Andrés Castillo','Salón por confirmar','Horario por confirmar','◎','{"id":7,"name":"Organizational Behavior","code":"G118","section":"A","teacher":1,"credits":1.5,"grade":94,"aux":"Por confirmar","time":"Horario por confirmar","room":"Salón por confirmar","symbol":"◎","bg":"#fce6e6","color":"#a52a2a","capacity":12}'::jsonb),
(8,'Project-Based Learning Lab: Fundamentals','IE0003','B','Elena Morales','Salón por confirmar','Horario por confirmar','⌘','{"id":8,"name":"Project-Based Learning Lab: Fundamentals","code":"IE0003","section":"B","teacher":0,"credits":2,"grade":93,"aux":"Por confirmar","time":"Horario por confirmar","room":"Salón por confirmar","symbol":"⌘","bg":"#f9e4e4","color":"#a52a2a","capacity":10}'::jsonb),
(9,'Skills Workshop - Own the room: Técnicas para Hablar en Público','SW0004','C | SEPT','Elena Morales','Salón por confirmar','Workshop · Septiembre','↗','{"id":9,"name":"Skills Workshop - Own the room: Técnicas para Hablar en Público","code":"SW0004","section":"C | SEPT","teacher":0,"credits":0.5,"grade":null,"aux":"Por confirmar","time":"Workshop · Septiembre","room":"Salón por confirmar","symbol":"↗","workshop":true,"bg":"#f5e5e5","color":"#a52a2a","capacity":5}'::jsonb),
(10,'Tech Workshop - Beyond Vibe Coding: Criterio para construir con IA','TWK0007','A | OCT','Lucía Herrera','Salón por confirmar','Workshop · Octubre','{}','{"id":10,"name":"Tech Workshop - Beyond Vibe Coding: Criterio para construir con IA","code":"TWK0007","section":"A | OCT","teacher":2,"credits":0.5,"grade":null,"aux":"Por confirmar","time":"Workshop · Octubre","room":"Salón por confirmar","symbol":"{}","workshop":true,"bg":"#fce6e6","color":"#a52a2a","capacity":8}'::jsonb)
;
drop policy if exists "cursos inscritos" on public.courses;
create policy "cursos: catálogo visible con sesión" on public.courses for select to authenticated using (true);
grant update (data, room, schedule_label) on public.courses to authenticated;
create policy "cursos: Administración edita" on public.courses for update to authenticated
  using (private.is_admin()) with check (private.is_admin());

-- ── Catedráticos asignados a cada curso ──
create table public.course_teachers (
  course_id int not null references public.courses (id) on delete cascade,
  teacher_id uuid not null references auth.users (id) on delete cascade,
  primary key (course_id, teacher_id)
);
create index on public.course_teachers (teacher_id);
revoke all on public.course_teachers from anon, authenticated;
grant select, insert, delete on public.course_teachers to authenticated;
alter table public.course_teachers enable row level security;
create policy "catedráticos por curso: visibles con sesión" on public.course_teachers for select to authenticated using (true);
create policy "catedráticos por curso: Administración asigna" on public.course_teachers for insert to authenticated with check (private.is_admin());
create policy "catedráticos por curso: Administración quita" on public.course_teachers for delete to authenticated using (private.is_admin());

-- ¿El usuario actual da este curso? (Administración cuenta como sí)
create or replace function private.teaches(p_course_id int)
returns boolean language sql stable security definer set search_path = ''
as $$
  select private.is_admin() or exists (
    select 1 from public.course_teachers ct
    where ct.course_id = p_course_id and ct.teacher_id = (select auth.uid()));
$$;
revoke all on function private.teaches(int) from public, anon;
grant execute on function private.teaches(int) to authenticated;

-- ── Inscripciones: las maneja Administración; el catedrático ve las de sus cursos ──
insert into public.enrollments (user_id, course_id)
select p.id, c.id from public.profiles p cross join public.courses c where p.role = 'estudiante'
on conflict do nothing;
grant insert, delete on public.enrollments to authenticated;
create policy "inscripciones: catedrático ve las de sus cursos" on public.enrollments for select to authenticated using (private.teaches(course_id));
create policy "inscripciones: Administración inscribe" on public.enrollments for insert to authenticated with check (private.is_admin());
create policy "inscripciones: Administración da de baja" on public.enrollments for delete to authenticated using (private.is_admin());

-- El catedrático ve solo a los estudiantes de sus cursos (antes: todos)
drop policy if exists "catedráticos: ver perfiles de estudiantes" on public.profiles;
create policy "catedráticos: ver estudiantes de sus cursos" on public.profiles for select to authenticated using (
  role = 'estudiante' and exists (
    select 1 from public.enrollments e where e.user_id = profiles.id and private.teaches(e.course_id)));

-- ── Tareas publicadas por catedráticos, visibles para los inscritos ──
create table public.course_tasks (
  task_id bigint primary key,
  course_id int not null references public.courses (id) on delete cascade,
  data jsonb not null,
  created_by uuid not null default auth.uid() references auth.users (id),
  updated_at timestamptz not null default now()
);
create index on public.course_tasks (course_id);
revoke all on public.course_tasks from anon, authenticated;
grant select on public.course_tasks to authenticated;
grant insert (task_id, course_id, data, updated_at), update (course_id, data, updated_at) on public.course_tasks to authenticated;
alter table public.course_tasks enable row level security;
create policy "tareas: inscritos y catedráticos del curso leen" on public.course_tasks for select to authenticated
  using (private.is_enrolled(course_id) or private.teaches(course_id));
create policy "tareas: catedrático del curso publica" on public.course_tasks for insert to authenticated
  with check (private.teaches(course_id) and created_by = (select auth.uid()));
create policy "tareas: catedrático del curso edita" on public.course_tasks for update to authenticated
  using (private.teaches(course_id)) with check (private.teaches(course_id));

-- ── Entregas: el catedrático ve las de SUS cursos ──
alter table public.task_submissions add column if not exists course_id int;
grant insert (course_id) on public.task_submissions to authenticated;
grant update (course_id) on public.task_submissions to authenticated;
drop policy if exists "entregas: el estudiante ve las suyas, catedráticos ven todas" on public.task_submissions;
create policy "entregas: el estudiante ve las suyas, el catedrático las de sus cursos" on public.task_submissions for select to authenticated
  using (student_id = (select auth.uid()) or private.is_admin()
         or (course_id is not null and private.teaches(course_id))
         or (course_id is null and private.is_teacher()));
create or replace function public.grade_submission(sub_id bigint, new_grade int, new_feedback text)
returns void language plpgsql security definer set search_path = ''
as $$
declare c int; begin
  select course_id into c from public.task_submissions where id = sub_id;
  if not (private.is_admin() or (c is not null and private.teaches(c)) or (c is null and private.is_teacher())) then
    raise exception 'Solo el catedrático del curso puede calificar' using errcode = '42501'; end if;
  if new_grade is null or new_grade < 0 or new_grade > 100 then raise exception 'La calificación debe estar entre 0 y 100'; end if;
  update public.task_submissions set grade = new_grade, feedback = left(coalesce(new_feedback, ''), 2000), graded_at = now() where id = sub_id;
end; $$;

-- Promedios: solo el catedrático del curso
drop policy if exists "notas: catedráticos publican" on public.course_grades;
drop policy if exists "notas: catedráticos corrigen" on public.course_grades;
create policy "notas: el catedrático del curso publica" on public.course_grades for insert to authenticated
  with check (private.teaches(course_id) and published_by = (select auth.uid()));
create policy "notas: el catedrático del curso corrige" on public.course_grades for update to authenticated
  using (private.teaches(course_id)) with check (private.teaches(course_id));

-- Chat: solo la clase (inscritos + catedráticos del curso)
drop policy if exists "chat: usuarios con sesión leen" on public.chat_messages;
drop policy if exists "chat: cada quien escribe a su nombre" on public.chat_messages;
create policy "chat: la clase lee" on public.chat_messages for select to authenticated
  using (private.is_enrolled(course_id) or private.teaches(course_id));
create policy "chat: la clase escribe a su nombre" on public.chat_messages for insert to authenticated
  with check (author_id = (select auth.uid())
    and (private.is_enrolled(course_id) or private.teaches(course_id))
    and (author_role = 'Estudiante' or private.is_teacher()));

-- ── Archivos de entregas (Storage privado, 10 MB) ──
insert into storage.buckets (id, name, public, file_size_limit)
values ('entregas', 'entregas', false, 10485760)
on conflict (id) do nothing;
-- Ruta: <id del estudiante>/<id del curso>/<id de la tarea>/<archivo>
create policy "entregas: el estudiante sube a su carpeta" on storage.objects for insert to authenticated
  with check (bucket_id = 'entregas' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "entregas: el estudiante y el catedrático del curso leen" on storage.objects for select to authenticated
  using (bucket_id = 'entregas' and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or private.teaches(nullif(regexp_replace((storage.foldername(name))[2], '\D', '', 'g'), '')::int)));

-- ── Asistencia a conferencias: la registra Administración, el estudiante la ve ──
create table public.conference_attendance (
  event_id text not null check (char_length(event_id) <= 100),
  student_id uuid not null references auth.users (id) on delete cascade,
  entry_at timestamptz,
  exit_at timestamptz,
  registered_by uuid not null default auth.uid() references auth.users (id),
  primary key (event_id, student_id)
);
revoke all on public.conference_attendance from anon, authenticated;
grant select on public.conference_attendance to authenticated;
grant insert (event_id, student_id, entry_at, exit_at), update (entry_at, exit_at) on public.conference_attendance to authenticated;
alter table public.conference_attendance enable row level security;
create policy "asistencia: el estudiante ve la suya" on public.conference_attendance for select to authenticated
  using (student_id = (select auth.uid()) or private.is_admin());
create policy "asistencia: Administración registra" on public.conference_attendance for insert to authenticated with check (private.is_admin());
create policy "asistencia: Administración corrige" on public.conference_attendance for update to authenticated using (private.is_admin()) with check (private.is_admin());
