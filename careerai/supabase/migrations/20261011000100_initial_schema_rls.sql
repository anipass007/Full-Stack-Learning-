-- CareerAI initial application schema and client-facing access rules.
-- Roles are deliberately not accepted from user metadata during signup.
-- The first admin must be provisioned by a trusted operator in the SQL Editor:
--   UPDATE public.profiles SET role = 'admin' WHERE id = '<auth.users.id>'::uuid;

begin;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'student'
    check (role in ('student', 'recruiter', 'admin')),
  full_name text not null default '',
  email text not null,
  phone text not null default '',
  course text not null default '',
  year_of_study text not null default '',
  college text not null default '',
  location text not null default '',
  target_role text not null default '',
  interests text[] not null default '{}',
  summary text not null default '',
  links jsonb not null default '{}'::jsonb check (jsonb_typeof(links) = 'object'),
  skills jsonb not null default '{}'::jsonb check (jsonb_typeof(skills) = 'object'),
  preferences jsonb not null default '{}'::jsonb check (jsonb_typeof(preferences) = 'object'),
  recruiter_title text not null default '',
  company_name text not null default '',
  industry text not null default '',
  company_size text not null default '',
  website text not null default '',
  about text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (length(btrim(title)) > 0),
  company text not null check (length(btrim(company)) > 0),
  location text not null default '',
  mode text not null check (mode in ('Remote', 'Hybrid', 'On-site')),
  type text not null check (type in ('Internship', 'Full-time', 'Part-time', 'Contract')),
  experience text not null default 'Fresher',
  salary_min numeric(12, 2),
  salary_max numeric(12, 2),
  salary_unit text not null default 'per month' check (salary_unit in ('per month', 'LPA')),
  deadline date,
  description text not null,
  responsibilities text[] not null default '{}',
  skills text[] not null default '{}',
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'closed')),
  moderation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint jobs_salary_range_check check (
    (salary_min is null and salary_max is null)
    or (salary_min is not null and salary_max is not null
      and salary_min >= 0 and salary_max >= salary_min)
  )
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  job_id uuid not null references public.jobs (id) on delete cascade,
  status text not null default 'New'
    check (status in ('New', 'Shortlisted', 'Interview', 'Hired', 'Rejected', 'Withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.resume_analyses (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  resume_label text not null default '',
  score smallint not null check (score between 0 and 100),
  skills text[] not null default '{}',
  result jsonb not null default '{}'::jsonb check (jsonb_typeof(result) = 'object'),
  created_at timestamptz not null default now()
);

create table public.roadmap_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  target_role text not null,
  task_id text not null check (length(btrim(task_id)) > 0),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint roadmap_progress_student_role_task_unique unique (student_id, target_role, task_id)
);

create table public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  target_role text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  score smallint not null check (score between 0 and 100),
  answered_count smallint not null default 0 check (answered_count >= 0),
  question_count smallint not null check (question_count > 0),
  answers jsonb not null default '[]'::jsonb check (jsonb_typeof(answers) = 'array'),
  created_at timestamptz not null default now(),
  constraint interview_answer_count_check check (answered_count <= question_count)
);

create index profiles_role_idx on public.profiles (role);
create index jobs_recruiter_created_idx on public.jobs (recruiter_id, created_at desc);
create index jobs_approved_created_idx on public.jobs (created_at desc) where status = 'approved';
create index applications_student_created_idx on public.applications (student_id, created_at desc);
create index applications_job_status_idx on public.applications (job_id, status, created_at desc);
create unique index applications_one_active_job_per_student_idx
  on public.applications (student_id, job_id) where status <> 'Withdrawn';
create index resume_analyses_student_created_idx on public.resume_analyses (student_id, created_at desc);
create index roadmap_progress_student_role_idx on public.roadmap_progress (student_id, target_role);
create index interview_sessions_student_created_idx on public.interview_sessions (student_id, created_at desc);

comment on table public.resume_analyses is
  'Stores derived ATS results only; raw resume text and uploaded files are intentionally not stored.';
comment on table public.interview_sessions is
  'Interview answers and rule-based feedback are private to the student and authorized admins.';

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger jobs_set_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

create trigger applications_set_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

create trigger roadmap_progress_set_updated_at
before update on public.roadmap_progress
for each row execute function public.set_updated_at();

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''), '')
  );
  -- Signup metadata is user controlled. In particular, it must never choose a role.
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create function public.sync_auth_user_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
after update of email on auth.users
for each row
when (old.email is distinct from new.email)
execute function public.sync_auth_user_email();

-- These SECURITY DEFINER helpers avoid recursive profile RLS lookups in policies.
-- They are owned by the trusted migration role, use an empty search_path, and return
-- only the current caller's role or a boolean authorization result.
create function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles as p
  where p.id = (select auth.uid())
$$;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_app_role() = 'admin', false)
$$;

create function public.can_recruiter_view_student(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_app_role() = 'recruiter', false)
    and exists (
      select 1
      from public.applications as a
      join public.jobs as j on j.id = a.job_id
      where a.student_id = target_student_id
        and a.status <> 'Withdrawn'
        and j.recruiter_id = (select auth.uid())
    )
$$;

create function public.admin_set_profile_role(target_user_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Only an admin may assign account roles.' using errcode = '42501';
  end if;

  if new_role not in ('student', 'recruiter', 'admin') then
    raise exception 'Unsupported account role.' using errcode = '22023';
  end if;

  if target_user_id = (select auth.uid()) then
    raise exception 'Admins cannot change their own role.' using errcode = '42501';
  end if;

  update public.profiles set role = new_role where id = target_user_id;
  if not found then
    raise exception 'Profile not found.' using errcode = 'P0002';
  end if;
end;
$$;

create function public.admin_set_job_status(target_job_id uuid, new_status text, reason text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Only an admin may change job moderation status.' using errcode = '42501';
  end if;

  if new_status not in ('pending', 'approved', 'rejected', 'closed') then
    raise exception 'Unsupported job status.' using errcode = '22023';
  end if;

  update public.jobs
  set status = new_status, moderation_reason = reason
  where id = target_job_id;
  if not found then
    raise exception 'Job not found.' using errcode = 'P0002';
  end if;
end;
$$;

create function public.recruiter_transition_job(target_job_id uuid, new_status text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_status text;
begin
  if public.current_app_role() <> 'recruiter' then
    raise exception 'Only a recruiter may change the state of their own job.' using errcode = '42501';
  end if;

  select j.status into existing_status
  from public.jobs as j
  where j.id = target_job_id and j.recruiter_id = (select auth.uid())
  for update;

  if not found then
    raise exception 'Owned job not found.' using errcode = 'P0002';
  end if;

  if not (
    (existing_status = 'approved' and new_status = 'closed')
    or (existing_status = 'closed' and new_status = 'approved')
    or (existing_status = 'rejected' and new_status = 'pending')
  ) then
    raise exception 'Unsupported job state transition.' using errcode = '22023';
  end if;

  update public.jobs
  set status = new_status,
      moderation_reason = case when new_status = 'pending' then null else moderation_reason end
  where id = target_job_id;
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
revoke all on function public.sync_auth_user_email() from public, anon, authenticated;
revoke all on function public.current_app_role() from public, anon, authenticated;
revoke all on function public.is_admin() from public, anon, authenticated;
revoke all on function public.can_recruiter_view_student(uuid) from public, anon, authenticated;
revoke all on function public.admin_set_profile_role(uuid, text) from public, anon, authenticated;
revoke all on function public.admin_set_job_status(uuid, text, text) from public, anon, authenticated;
revoke all on function public.recruiter_transition_job(uuid, text) from public, anon, authenticated;
grant execute on function public.current_app_role() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.can_recruiter_view_student(uuid) to authenticated;
grant execute on function public.admin_set_profile_role(uuid, text) to authenticated;
grant execute on function public.admin_set_job_status(uuid, text, text) to authenticated;
grant execute on function public.recruiter_transition_job(uuid, text) to authenticated;

-- RLS and table privileges are both required: policies constrain rows, grants constrain operations.
alter table public.profiles enable row level security;
alter table public.profiles force row level security;
alter table public.jobs enable row level security;
alter table public.jobs force row level security;
alter table public.applications enable row level security;
alter table public.applications force row level security;
alter table public.resume_analyses enable row level security;
alter table public.resume_analyses force row level security;
alter table public.roadmap_progress enable row level security;
alter table public.roadmap_progress force row level security;
alter table public.interview_sessions enable row level security;
alter table public.interview_sessions force row level security;

revoke all on table public.profiles, public.jobs, public.applications,
  public.resume_analyses, public.roadmap_progress, public.interview_sessions
  from public, anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (
  full_name, phone, course, year_of_study, college, location, target_role,
  interests, summary, links, skills, preferences, recruiter_title, company_name,
  industry, company_size, website, about
) on table public.profiles to authenticated;

grant select on table public.jobs to anon, authenticated;
grant insert (recruiter_id, title, company, location, mode, type, experience,
  salary_min, salary_max, salary_unit, deadline, description, responsibilities, skills)
  on table public.jobs to authenticated;
grant update (title, company, location, mode, type, experience, salary_min,
  salary_max, salary_unit, deadline, description, responsibilities, skills)
  on table public.jobs to authenticated;
grant delete on table public.jobs to authenticated;

grant select, delete on table public.applications to authenticated;
grant insert (student_id, job_id) on table public.applications to authenticated;
grant update (status) on table public.applications to authenticated;

grant select, delete on table public.resume_analyses to authenticated;
grant insert (student_id, resume_label, score, skills, result)
  on table public.resume_analyses to authenticated;

grant select, delete on table public.roadmap_progress to authenticated;
grant insert (student_id, target_role, task_id, completed)
  on table public.roadmap_progress to authenticated;
grant update (completed) on table public.roadmap_progress to authenticated;

grant select, delete on table public.interview_sessions to authenticated;
grant insert (student_id, target_role, difficulty, score, answered_count, question_count, answers)
  on table public.interview_sessions to authenticated;

create policy profiles_read_self_applicant_or_admin
on public.profiles for select to authenticated
using (
  id = (select auth.uid())
  or public.is_admin()
  or public.can_recruiter_view_student(id)
);

create policy profiles_update_self
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()) and role = public.current_app_role());

create policy profiles_update_admin
on public.profiles for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy jobs_read_approved_owner_or_admin
on public.jobs for select to anon, authenticated
using (
  status = 'approved'
  or (
    (select auth.uid()) is not null
    and (public.is_admin()
      or (recruiter_id = (select auth.uid()) and public.current_app_role() = 'recruiter'))
  )
);

create policy jobs_insert_recruiter_or_admin
on public.jobs for insert to authenticated
with check (
  public.is_admin()
  or (recruiter_id = (select auth.uid())
    and public.current_app_role() = 'recruiter')
);

create policy jobs_update_owner_or_admin
on public.jobs for update to authenticated
using (
  public.is_admin()
  or (recruiter_id = (select auth.uid()) and public.current_app_role() = 'recruiter')
)
with check (
  public.is_admin()
  or (recruiter_id = (select auth.uid()) and public.current_app_role() = 'recruiter')
);

create policy jobs_delete_owner_or_admin
on public.jobs for delete to authenticated
using (
  public.is_admin()
  or (recruiter_id = (select auth.uid()) and public.current_app_role() = 'recruiter')
);

create policy applications_read_student_job_recruiter_or_admin
on public.applications for select to authenticated
using (
  student_id = (select auth.uid())
  or public.is_admin()
  or exists (
    select 1 from public.jobs as j
    where j.id = applications.job_id
      and j.recruiter_id = (select auth.uid())
      and public.current_app_role() = 'recruiter'
  )
);

create policy applications_insert_student_or_admin
on public.applications for insert to authenticated
with check (
  public.is_admin()
  or (
    student_id = (select auth.uid())
    and public.current_app_role() = 'student'
    and exists (
      select 1 from public.jobs as j
      where j.id = applications.job_id and j.status = 'approved'
    )
  )
);

create policy applications_update_student_recruiter_or_admin
on public.applications for update to authenticated
using (
  public.is_admin()
  or (
    student_id = (select auth.uid())
    and status not in ('Hired', 'Rejected', 'Withdrawn')
    and public.current_app_role() = 'student'
  )
  or exists (
    select 1 from public.jobs as j
    where j.id = applications.job_id
      and j.recruiter_id = (select auth.uid())
      and public.current_app_role() = 'recruiter'
  )
)
with check (
  public.is_admin()
  or (student_id = (select auth.uid()) and status = 'Withdrawn'
    and public.current_app_role() = 'student')
  or (status in ('New', 'Shortlisted', 'Interview', 'Hired', 'Rejected')
    and exists (
      select 1 from public.jobs as j
      where j.id = applications.job_id
        and j.recruiter_id = (select auth.uid())
        and public.current_app_role() = 'recruiter'
    ))
);

create policy applications_delete_student_or_admin
on public.applications for delete to authenticated
using (student_id = (select auth.uid()) or public.is_admin());

create policy resume_analyses_read_owner_or_admin
on public.resume_analyses for select to authenticated
using (student_id = (select auth.uid()) or public.is_admin());

create policy resume_analyses_insert_owner_or_admin
on public.resume_analyses for insert to authenticated
with check (
  public.is_admin()
  or (student_id = (select auth.uid()) and public.current_app_role() = 'student')
);

create policy resume_analyses_delete_owner_or_admin
on public.resume_analyses for delete to authenticated
using (student_id = (select auth.uid()) or public.is_admin());

create policy roadmap_progress_read_owner_or_admin
on public.roadmap_progress for select to authenticated
using (student_id = (select auth.uid()) or public.is_admin());

create policy roadmap_progress_insert_owner_or_admin
on public.roadmap_progress for insert to authenticated
with check (
  public.is_admin()
  or (student_id = (select auth.uid()) and public.current_app_role() = 'student')
);

create policy roadmap_progress_update_owner_or_admin
on public.roadmap_progress for update to authenticated
using (student_id = (select auth.uid()) or public.is_admin())
with check (student_id = (select auth.uid()) or public.is_admin());

create policy roadmap_progress_delete_owner_or_admin
on public.roadmap_progress for delete to authenticated
using (student_id = (select auth.uid()) or public.is_admin());

create policy interview_sessions_read_owner_or_admin
on public.interview_sessions for select to authenticated
using (student_id = (select auth.uid()) or public.is_admin());

create policy interview_sessions_insert_owner_or_admin
on public.interview_sessions for insert to authenticated
with check (
  public.is_admin()
  or (student_id = (select auth.uid()) and public.current_app_role() = 'student')
);

create policy interview_sessions_delete_owner_or_admin
on public.interview_sessions for delete to authenticated
using (student_id = (select auth.uid()) or public.is_admin());

commit;
