-- =========================================================================
-- Donor recruitment site — initial schema
-- =========================================================================

create extension if not exists pgcrypto;

-- ---------- Tables -------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null default 'applicant' check (role in ('applicant','admin')),
  created_at timestamptz default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references auth.users on delete set null,
  donor_type text not null check (donor_type in ('egg','sperm')),
  first_name text not null, last_name text not null,
  email text not null, phone text not null,
  sms_consent boolean default false,
  date_of_birth date not null, state text not null, zip text not null,
  education text, how_heard text,
  height_in int, weight_lb int, bmi numeric(4,1),
  smoker boolean, regular_cycles boolean, birth_control text,
  previous_donation boolean, within_60_min boolean, can_commit_6_months boolean,
  eligible boolean not null, fail_reasons text[] default '{}',
  referral_code text,
  status text not null default 'new' check (status in (
    'new','contacted','full_app_pending','full_app_submitted','screening',
    'active','matched','completed','rejected','withdrawn'
  )),
  updated_at timestamptz default now()
);

create index applications_email_created_idx on public.applications (lower(email), created_at desc);
create index applications_created_idx on public.applications (created_at desc);
create index applications_user_idx on public.applications (user_id);
create index applications_status_idx on public.applications (status);

create table public.full_applications (
  application_id uuid primary key references public.applications on delete cascade,
  sections jsonb not null default '{}',     -- one key per section
  completed_sections text[] default '{}',
  signed_name text, signed_at timestamptz,
  submitted_at timestamptz
);

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications on delete cascade,
  storage_path text not null, kind text check (kind in ('childhood','recent')),
  created_at timestamptz default now()
);
create index photos_application_idx on public.photos (application_id);

create table public.referrers (
  code text primary key,
  name text not null, email text not null,
  created_at timestamptz default now()
);
create index referrers_email_idx on public.referrers (lower(email));

create table public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications on delete cascade,
  author_id uuid references auth.users on delete set null, body text not null,
  created_at timestamptz default now()
);
create index admin_notes_application_idx on public.admin_notes (application_id, created_at);

create table public.audit_log (
  id bigserial primary key,
  actor_id uuid, action text, target_id uuid, meta jsonb,
  created_at timestamptz default now()
);
create index audit_log_target_idx on public.audit_log (target_id, created_at desc);

-- ---------- Triggers -----------------------------------------------------

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger applications_updated_at before update on public.applications
  for each row execute function public.set_updated_at();

-- Create a profile row for every new auth user.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Helpers ------------------------------------------------------

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Look up an auth user id by email. Server (service role) only.
create or replace function public.user_id_by_email(p_email text) returns uuid
language sql stable security definer set search_path = auth, public as $$
  select id from auth.users where lower(email) = lower(p_email) limit 1;
$$;
revoke all on function public.user_id_by_email(text) from public, anon, authenticated;
grant execute on function public.user_id_by_email(text) to service_role;

-- Does the current user own this application?
create or replace function public.owns_application(p_app uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.applications where id = p_app and user_id = auth.uid());
$$;

-- ---------- Row Level Security ------------------------------------------
-- Anonymous users get no policies at all: pre-screen inserts go through the
-- server API using the service role key.

alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.full_applications enable row level security;
alter table public.photos enable row level security;
alter table public.referrers enable row level security;
alter table public.admin_notes enable row level security;
alter table public.audit_log enable row level security;

-- profiles: read own; admins read/write all. Applicants cannot change their role.
create policy profiles_select_own on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy profiles_admin_write on public.profiles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- applications: applicants read their own (writes to status/eligibility are server-only).
create policy applications_select_own on public.applications for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy applications_admin_all on public.applications for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- full_applications: applicants read/write their own until submitted.
create policy full_apps_select on public.full_applications for select to authenticated
  using (public.owns_application(application_id) or public.is_admin());
create policy full_apps_insert on public.full_applications for insert to authenticated
  with check (public.owns_application(application_id) or public.is_admin());
create policy full_apps_update on public.full_applications for update to authenticated
  using ((public.owns_application(application_id) and submitted_at is null) or public.is_admin())
  with check (public.owns_application(application_id) or public.is_admin());
create policy full_apps_admin_delete on public.full_applications for delete to authenticated
  using (public.is_admin());

-- photos: applicants read/insert/delete their own.
create policy photos_select on public.photos for select to authenticated
  using (public.owns_application(application_id) or public.is_admin());
create policy photos_insert on public.photos for insert to authenticated
  with check (public.owns_application(application_id) or public.is_admin());
create policy photos_delete on public.photos for delete to authenticated
  using (public.owns_application(application_id) or public.is_admin());

-- referrers, admin_notes, audit_log: admins only.
create policy referrers_admin on public.referrers for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy admin_notes_admin on public.admin_notes for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy audit_log_admin_select on public.audit_log for select to authenticated
  using (public.is_admin());
create policy audit_log_admin_insert on public.audit_log for insert to authenticated
  with check (public.is_admin());

-- ---------- Storage ------------------------------------------------------
-- Private bucket. Object path convention: {application_id}/{uuid}.{ext}

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('donor-photos', 'donor-photos', false, 5242880, array['image/jpeg','image/png'])
on conflict (id) do update set public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy donor_photos_select on storage.objects for select to authenticated
  using (
    bucket_id = 'donor-photos' and (
      public.is_admin()
      or public.owns_application(((storage.foldername(name))[1])::uuid)
    )
  );
create policy donor_photos_insert on storage.objects for insert to authenticated
  with check (
    bucket_id = 'donor-photos'
    and public.owns_application(((storage.foldername(name))[1])::uuid)
  );
create policy donor_photos_delete on storage.objects for delete to authenticated
  using (
    bucket_id = 'donor-photos' and (
      public.is_admin()
      or public.owns_application(((storage.foldername(name))[1])::uuid)
    )
  );
