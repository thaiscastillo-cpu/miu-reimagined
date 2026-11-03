create policy "catedráticos: ver perfiles de estudiantes" on public.profiles
  for select to authenticated using (role = 'estudiante' and private.is_teacher());
