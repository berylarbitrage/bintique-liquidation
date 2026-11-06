-- Aggregate stats for the admin dashboard. Admin-only.
create or replace function public.admin_stats(p_week_start timestamptz)
returns json
language plpgsql stable security invoker set search_path = public as $$
declare result json;
begin
  if not public.is_admin() then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  select json_build_object(
    'total', (select count(*) from applications),
    'this_week', (select count(*) from applications where created_at >= p_week_start),
    'eligible', (select count(*) from applications where eligible),
    'by_source', coalesce((
      select json_agg(json_build_object('source', src, 'count', n) order by n desc)
      from (select coalesce(nullif(how_heard, ''), 'Not specified') as src, count(*) as n
            from applications group by 1) s
    ), '[]'::json)
  ) into result;
  return result;
end $$;

grant execute on function public.admin_stats(timestamptz) to authenticated;
