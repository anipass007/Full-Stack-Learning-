-- Stage 4 auth bootstrap: allow only student/recruiter self-selection at signup.
-- Admin remains assignable only through the existing trusted admin role function.
begin;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text;
begin
  requested_role := case
    when new.raw_user_meta_data ->> 'requested_role' in ('student', 'recruiter')
      then new.raw_user_meta_data ->> 'requested_role'
    else 'student'
  end;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''), ''),
    requested_role
  );
  return new;
end;
$$;

revoke all on function public.handle_new_auth_user() from public, anon, authenticated;

commit;
