-- Roles asignados por Administración + datos del diseño guardados por usuario.
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('estudiante','catedratico','administracion'));
alter table public.profiles add column if not exists email text;
update public.profiles p set email = u.email from auth.users u where u.id = p.id and p.email is null;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (new.id, coalesce(
    nullif(split_part(new.raw_user_meta_data ->> 'full_name', ' ', 1), ''),
    nullif(split_part(new.raw_user_meta_data ->> 'name', ' ', 1), ''),
    'Estudiante'), new.email)
  on conflict (id) do nothing;
  insert into public.enrollments (user_id, course_id)
  select new.id, c.id from public.courses c on conflict do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'administracion'); $$;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create policy "administración: ver todos los perfiles" on public.profiles
  for select to authenticated using (private.is_admin());

-- Solo Administración cambia roles (los usuarios no pueden editar su propio rol).
create or replace function public.set_user_role(target uuid, new_role text)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if not private.is_admin() then raise exception 'Solo Administración puede asignar roles' using errcode = '42501'; end if;
  if new_role not in ('estudiante','catedratico','administracion') then raise exception 'Rol no válido'; end if;
  if target = (select auth.uid()) and new_role <> 'administracion' then raise exception 'No podés quitarte tu propio rol de Administración'; end if;
  update public.profiles set role = new_role where id = target;
end;
$$;
revoke all on function public.set_user_role(uuid, text) from public, anon;
grant execute on function public.set_user_role(uuid, text) to authenticated;

create table public.user_state (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
revoke all on public.user_state from anon, authenticated;
grant select, insert, update on public.user_state to authenticated;
alter table public.user_state enable row level security;
create policy "estado propio: leer" on public.user_state for select to authenticated using (user_id = (select auth.uid()));
create policy "estado propio: crear" on public.user_state for insert to authenticated with check (user_id = (select auth.uid()));
create policy "estado propio: editar" on public.user_state for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Primera administradora del prototipo.
update public.profiles set role = 'administracion' where email = 'thaiscastillo@ufm.edu';
