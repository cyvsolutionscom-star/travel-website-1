-- Auto-grant admin role to the first user who signs up (bootstrap admin)
create or replace function public.handle_new_user_bootstrap_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- If no admin exists yet, make this new user the admin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_bootstrap_admin on auth.users;
create trigger on_auth_user_created_bootstrap_admin
  after insert on auth.users
  for each row execute function public.handle_new_user_bootstrap_admin();