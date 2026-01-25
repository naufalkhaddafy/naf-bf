-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles (for Admins)
create table profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Leads (Contact Form)
create table leads (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text not null,
  message text,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Subscribers (Newsletter)
create table subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Posts (Blog/Content)
create table posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  content text, -- Can be HTML or Markdown
  image_url text, -- Supabase Storage URL
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Storage Bucket
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

-- RLS Policies
alter table profiles enable row level security;
alter table leads enable row level security;
alter table subscribers enable row level security;
alter table posts enable row level security;

-- Profiles: View self, Admin views all
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);

-- Leads: Public can insert, Admin can view
create policy "Public can insert leads" on leads for insert with check (true);
create policy "Admins can view leads" on leads for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Subscribers: Public can insert, Admin can view
create policy "Public can subscribe" on subscribers for insert with check (true);
create policy "Admins can view subscribers" on subscribers for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Posts: Public can view published, Admin can CRUD
create policy "Public view published posts" on posts for select using (is_published = true);
create policy "Admins can view all posts" on posts for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can insert posts" on posts for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update posts" on posts for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can delete posts" on posts for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Storage Policies (Simplified)
create policy "Public Access" on storage.objects for select using ( bucket_id = 'media' );
create policy "Admin Upload" on storage.objects for insert with check (
    bucket_id = 'media' 
    and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
