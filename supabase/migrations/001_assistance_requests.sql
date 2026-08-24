create table if not exists public.assistance_requests (
  id uuid primary key default gen_random_uuid(),
  elder_email text not null,
  elder_name text not null default '',
  elder_phone text not null default '',
  category text not null,
  scheduled_at timestamptz,
  display_date text not null default '',
  display_time text not null default '',
  address jsonb not null,
  notes text not null default '',
  status text not null default 'pending' check (status in ('pending', 'accepted', 'inProgress', 'done', 'cancelled')),
  volunteer_email text,
  volunteer_name text,
  volunteer_phone text,
  created_at timestamptz not null default now()
);

alter table public.assistance_requests enable row level security;

create policy "signed in users can view assistance requests"
on public.assistance_requests for select
to authenticated
using (true);

create policy "elders can create assistance requests"
on public.assistance_requests for insert
to authenticated
with check (elder_email = (select auth.jwt() ->> 'email'));

create policy "volunteers can accept pending requests"
on public.assistance_requests for update
to authenticated
using (status = 'pending')
with check (status in ('accepted', 'cancelled'));

create index if not exists assistance_requests_status_created_idx
on public.assistance_requests (status, created_at desc);
