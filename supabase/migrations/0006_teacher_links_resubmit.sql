-- LinkedIn de los catedráticos: lo ven todos, solo Administración lo edita.
create table public.teacher_links (
  teacher_index int primary key check (teacher_index between 0 and 99),
  linkedin_url text not null check (linkedin_url ~ '^https://([a-z]+\.)?linkedin\.com/in/[^/]+'),
  updated_at timestamptz not null default now()
);
revoke all on public.teacher_links from anon, authenticated;
grant select on public.teacher_links to authenticated;
grant insert (teacher_index, linkedin_url, updated_at), update (linkedin_url, updated_at) on public.teacher_links to authenticated;
alter table public.teacher_links enable row level security;
create policy "linkedin: todos leen" on public.teacher_links for select to authenticated using (true);
create policy "linkedin: Administración crea" on public.teacher_links for insert to authenticated with check (private.is_admin());
create policy "linkedin: Administración edita" on public.teacher_links for update to authenticated using (private.is_admin()) with check (private.is_admin());

-- Volver a entregar: si cambia la entrega, la nota anterior se borra para calificar la nueva.
create or replace function private.reset_grade_on_resubmit()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if new.receipt is distinct from old.receipt then
    new.grade := null; new.feedback := null; new.graded_at := null;
  end if;
  return new;
end;
$$;
create trigger reset_grade_on_resubmit before update on public.task_submissions
  for each row execute function private.reset_grade_on_resubmit();
