-- Hide expired approved jobs from student/public API reads and prevent applications
-- after their deadline, including direct API calls.
-- Keep this as a new migration so deployments that already ran the initial schema
-- receive the stricter policy without editing migration history.
begin;

drop policy if exists applications_insert_student_or_admin on public.applications;

create policy applications_insert_student_or_admin
on public.applications for insert to authenticated
with check (
  public.is_admin()
  or (
    student_id = (select auth.uid())
    and public.current_app_role() = 'student'
    and exists (
      select 1
      from public.jobs as j
      where j.id = applications.job_id
        and j.status = 'approved'
        and (j.deadline is null or j.deadline >= current_date)
    )
  )
);

drop policy if exists jobs_read_approved_owner_or_admin on public.jobs;

create policy jobs_read_approved_owner_or_admin
on public.jobs for select to anon, authenticated
using (
  (
    status = 'approved'
    and (deadline is null or deadline >= current_date)
  )
  or (
    (select auth.uid()) is not null
    and (
      public.is_admin()
      or (recruiter_id = (select auth.uid()) and public.current_app_role() = 'recruiter')
    )
  )
);

commit;
