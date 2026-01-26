-- Add specialized columns for Bird Farm items
alter table posts 
add column if not exists price numeric,
add column if not exists code text,
add column if not exists status text default 'available',
add column if not exists type text default 'bird',
add column if not exists tags text[],
add column if not exists description text,
add column if not exists specs jsonb default '[]'::jsonb,
add column if not exists pedigree jsonb default '{}'::jsonb,
add column if not exists videos jsonb default '{}'::jsonb;

-- Re-create policies for Admin insert/update to ensure they cover new columns if strict
-- (Standard Postgres policies cover row-access, not column-access, but good to refresh)

drop policy if exists "Admins can insert posts" on posts;
create policy "Admins can insert posts" on posts for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Admins can update posts" on posts;
create policy "Admins can update posts" on posts for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
