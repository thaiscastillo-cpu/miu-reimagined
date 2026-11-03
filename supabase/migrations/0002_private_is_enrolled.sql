-- Mueve la función auxiliar fuera del esquema expuesto por la API (aviso del linter de Supabase).
-- Las policies siguen funcionando: apuntan a la función, no a su nombre.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
alter function public.is_enrolled(int) set schema private;
