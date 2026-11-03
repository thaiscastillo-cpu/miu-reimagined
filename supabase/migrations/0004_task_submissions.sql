-- Entregas compartidas: el estudiante entrega, el catedrático revisa y califica.
create or replace function private.is_teacher()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.profiles where id = (select auth.uid()) and role in ('catedratico','administracion')); $$;
revoke all on function private.is_teacher() from public, anon;
grant execute on function private.is_teacher() to authenticated;

create table public.task_submissions (
  id bigint generated always as identity primary key,
  task_id int not null,
  student_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  student_name text not null default '' check (char_length(student_name) <= 200),
  receipt jsonb not null,
  grade int check (grade between 0 and 100),
  feedback text check (char_length(feedback) <= 2000),
  submitted_at timestamptz not null default now(),
  graded_at timestamptz,
  unique (task_id, student_id)
);
create index on public.task_submissions (task_id);

revoke all on public.task_submissions from anon, authenticated;
grant select on public.task_submissions to authenticated;
grant insert (task_id, student_name, receipt, submitted_at) on public.task_submissions to authenticated;
grant update (student_name, receipt, submitted_at) on public.task_submissions to authenticated;

alter table public.task_submissions enable row level security;
create policy "entregas: el estudiante ve las suyas, catedráticos ven todas" on public.task_submissions
  for select to authenticated using (student_id = (select auth.uid()) or private.is_teacher());
create policy "entregas: el estudiante crea la suya" on public.task_submissions
  for insert to authenticated with check (student_id = (select auth.uid()));
create policy "entregas: el estudiante actualiza la suya" on public.task_submissions
  for update to authenticated using (student_id = (select auth.uid())) with check (student_id = (select auth.uid()));

-- Solo catedráticos (o Administración) califican; el estudiante no puede tocar grade/feedback.
create or replace function public.grade_submission(sub_id bigint, new_grade int, new_feedback text)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if not private.is_teacher() then raise exception 'Solo catedráticos pueden calificar' using errcode = '42501'; end if;
  if new_grade is null or new_grade < 0 or new_grade > 100 then raise exception 'La calificación debe estar entre 0 y 100'; end if;
  update public.task_submissions
     set grade = new_grade, feedback = left(coalesce(new_feedback, ''), 2000), graded_at = now()
   where id = sub_id;
end;
$$;
revoke all on function public.grade_submission(bigint, int, text) from public, anon;
grant execute on function public.grade_submission(bigint, int, text) to authenticated;
