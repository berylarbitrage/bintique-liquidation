-- RLS assertions. Any failure raises an exception (psql exits non-zero).
\set ON_ERROR_STOP 1
set client_min_messages = warning;

create function pg_temp.expect(label text, actual bigint, expected bigint) returns void
language plpgsql as $$
begin
  if actual is distinct from expected then
    raise exception 'FAIL %: expected %, got %', label, expected, actual;
  end if;
end $$;
grant execute on function pg_temp.expect(text,bigint,bigint) to anon, authenticated;

insert into auth.users (id,email) values
 ('00000000-0000-0000-0000-00000000000a','a@x.com'),
 ('00000000-0000-0000-0000-00000000000b','b@x.com'),
 ('00000000-0000-0000-0000-0000000000ad','admin@x.com');
update profiles set role='admin' where id='00000000-0000-0000-0000-0000000000ad';
insert into applications (id,user_id,donor_type,first_name,last_name,email,phone,date_of_birth,state,zip,eligible)
values ('10000000-0000-0000-0000-00000000000a','00000000-0000-0000-0000-00000000000a','egg','A','A','a@x.com','1','2000-01-01','IL','60601',true),
       ('10000000-0000-0000-0000-00000000000b','00000000-0000-0000-0000-00000000000b','egg','B','B','b@x.com','1','2000-01-01','IL','60601',true);
insert into full_applications (application_id, sections) values ('10000000-0000-0000-0000-00000000000b','{"medical":{"x":1}}');
insert into photos (application_id, storage_path) values ('10000000-0000-0000-0000-00000000000b','10000000-0000-0000-0000-00000000000b/p.jpg');
insert into storage.objects (bucket_id,name) values ('donor-photos','10000000-0000-0000-0000-00000000000b/p.jpg');

-- ---- Applicant A cannot see or modify applicant B's data ----
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
select pg_temp.expect('A sees only own application', (select count(*) from applications), 1);
select pg_temp.expect('A cannot read B full app', (select count(*) from full_applications), 0);
select pg_temp.expect('A cannot read B photos', (select count(*) from photos), 0);
select pg_temp.expect('A cannot read B storage objects', (select count(*) from storage.objects), 0);
update applications set status='completed', eligible=true;
update profiles set role='admin';
select pg_temp.expect('A cannot read audit log', (select count(*) from audit_log), 0);
do $$ begin
  insert into full_applications (application_id) values ('10000000-0000-0000-0000-00000000000b');
  raise exception 'FAIL: A could insert full app for B';
exception when insufficient_privilege then null;
end $$;
do $$ begin
  insert into storage.objects (bucket_id, name) values ('donor-photos','10000000-0000-0000-0000-00000000000b/evil.jpg');
  raise exception 'FAIL: A could upload into B folder';
exception when insufficient_privilege then null;
end $$;
insert into full_applications (application_id, sections) values ('10000000-0000-0000-0000-00000000000a','{}');
select pg_temp.expect('A can write own full app', (select count(*) from full_applications), 1);
update full_applications set submitted_at = now();
update full_applications set sections = '{"x":1}';
reset role;
select pg_temp.expect('A status unchanged',
  (select count(*) from applications where status='new'), 2);
select pg_temp.expect('A role unchanged',
  (select count(*) from profiles where role='admin'), 1);
select pg_temp.expect('A cannot edit after submit',
  (select count(*) from full_applications where sections = '{}'::jsonb), 1);

-- ---- Anonymous users cannot read or write anything ----
set role anon; reset request.jwt.claim.sub;
select pg_temp.expect('anon reads no applications', (select count(*) from applications), 0);
select pg_temp.expect('anon reads no referrers', (select count(*) from referrers), 0);
do $$ begin
  insert into applications (donor_type,first_name,last_name,email,phone,date_of_birth,state,zip,eligible)
  values ('egg','x','x','x','1','2000-01-01','IL','1',true);
  raise exception 'FAIL: anon could insert application';
exception when insufficient_privilege then null;
end $$;
reset role;

-- ---- Admin sees everything ----
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000ad';
select pg_temp.expect('admin sees all applications', (select count(*) from applications), 2);
select pg_temp.expect('admin sees storage objects', (select count(*) from storage.objects), 1);
reset role;

-- ---- Privileged helper is not callable by end users ----
set role authenticated;
do $$ begin
  perform public.user_id_by_email('a@x.com');
  raise exception 'FAIL: authenticated could call user_id_by_email';
exception when insufficient_privilege then null;
end $$;
reset role;

\echo 'All RLS assertions passed'
