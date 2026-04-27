-- Force Control: Logistics SaaS Database Schema (Supabase/PostgreSQL)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Companies (Multi-tenant Table)
create table companies (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  plan_suscripcion text check (plan_suscripcion in ('basic', 'professional', 'enterprise')) default 'basic',
  config_moneda text check (config_moneda in ('USD', 'VES')) default 'USD',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Profiles (Extends Supabase Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  nombre text not null,
  empresa_id uuid references companies(id) on delete set null,
  rol text check (rol in ('admin', 'driver', 'client')) not null default 'client',
  phone_number text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Deliveries (Core Logistics Table)
create table deliveries (
  id uuid primary key default uuid_generate_v4(),
  tracking_number text unique not null,
  empresa_id uuid references companies(id) on delete cascade not null,
  origen text not null, -- can be JSONB for complex addresses
  destino_coords jsonb not null, -- {lat: number, lng: number, address: string}
  status text check (status in ('pending', 'in_transit', 'delivered', 'cancelled')) default 'pending',
  driver_id uuid references profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Payment Logs (Venezuelan Context)
create table payment_logs (
  id uuid primary key default uuid_generate_v4(),
  delivery_id uuid references deliveries(id) on delete cascade not null,
  monto decimal(12, 2) not null,
  moneda text check (moneda in ('USD', 'VES')) not null,
  metodo text check (metodo in ('zelle', 'pago_movil', 'cash', 'transferencia')) not null,
  pago_referencia text, -- Capture reference number for Pago Movil/Zelle
  status_pago text check (status_pago in ('pending', 'confirmed', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table companies enable row level security;
alter table profiles enable row level security;
alter table deliveries enable row level security;
alter table payment_logs enable row level security;

-- Example RLS Policy: Users can only see data from their own company
create policy "Users can view their own company records" 
  on companies for select 
  using ( id = (select empresa_id from profiles where id = auth.uid()) );

create policy "Users can view deliveries from their company"
  on deliveries for select
  using ( empresa_id = (select empresa_id from profiles where id = auth.uid()) );

-- Trigger for updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_deliveries_updated_at
  before update on deliveries
  for each row execute procedure handle_updated_at();

create trigger set_profiles_updated_at
  before update on profiles
  for each row execute procedure handle_updated_at();
