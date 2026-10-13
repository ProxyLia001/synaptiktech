-- Roles: kept in their own table so privileges can never be edited by users.
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(auth.uid(), 'admin');
$$;

grant execute on function public.current_user_is_admin() to authenticated;
grant execute on function public.has_role(uuid, app_role) to authenticated;

-- Products shown on the public site; only the owner can write them.
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  summary text not null default '',
  stage text not null default 'Early-stage project',
  tags text[] not null default '{}',
  link text,
  link_label text not null default 'Open project',
  disclaimer text not null default '',
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;

create policy "Visitors read published products"
on public.products for select to anon, authenticated
using (is_published);

create policy "Owner reads every product"
on public.products for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Owner writes products"
on public.products for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Owner updates products"
on public.products for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Owner deletes products"
on public.products for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_product_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_touch_updated_at
before update on public.products
for each row execute function public.touch_product_updated_at();

-- The owner is the verified account below and nobody else.
create or replace function public.grant_owner_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null
     and lower(new.email) = 'abigailjames8221@gmail.com' then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created_grant_owner
after insert on auth.users
for each row execute function public.grant_owner_role();

create trigger on_auth_user_confirmed_grant_owner
after update of email_confirmed_at on auth.users
for each row
when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
execute function public.grant_owner_role();

-- First product, exactly as described by the owner.
insert into public.products
  (slug, name, tagline, summary, stage, tags, link, link_label, disclaimer, is_published, sort_order)
values
  ('neura', 'Neura', 'A closer look at the brain’s signals.',
   'An EEG analysis application exploring how machine learning can help identify seizure-related patterns in brain activity.',
   'Early-stage project',
   array['EEG analysis','Machine learning','Neuroscience'],
   'https://neura-eeg-analysis.onrender.com', 'Open Neura',
   'An exploratory project, not a clinically validated diagnostic tool. No research outcomes or performance claims are presented.',
   true, 0);