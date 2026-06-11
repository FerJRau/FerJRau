-- Imprenta CDMX — Orquestación IA de Producción
-- Esquema núcleo: máquinas, órdenes, etapas, checklists, holds, mantenimiento, eventos

create type stage_name as enum ('preprensa', 'planchas', 'impresion', 'acabado', 'empaque');
create type stage_status as enum ('pending', 'in_progress', 'blocked', 'completed');
create type hold_severity as enum ('info', 'minor', 'major', 'critical');
create type hold_status as enum ('open', 'acknowledged', 'released');
create type event_source as enum ('printos', 'fiery_iq', 'jmf', 'frigate', 'whatsapp', 'manual', 'cron');

create table machines (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,            -- ej. 'indigo-5500', 'vutek-gs3', 'jeti-mira'
  name text not null,
  machine_type text not null,           -- digital_offset | superwide_uv | flatbed_uv | finishing
  integration_route text not null,      -- printos | fiery_iq | jmf | cctv_agent
  serial_number text,
  software_version text,
  is_online boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table operators (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  whatsapp_phone text unique not null,  -- E.164
  role text not null default 'operator', -- operator | supervisor | direction
  shift text,
  active boolean default true,
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  filemaker_record_id text unique,      -- enlace al ERP (FileMaker)
  order_number text not null,
  customer_name text,
  description text,
  current_stage stage_name,
  on_hold boolean default false,
  due_date date,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table order_stages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  stage stage_name not null,
  machine_id uuid references machines(id),
  status stage_status not null default 'pending',
  operator_id uuid references operators(id),
  started_at timestamptz,
  completed_at timestamptz,
  unique (order_id, stage)
);

create table checklist_templates (
  id uuid primary key default gen_random_uuid(),
  stage stage_name not null,
  machine_id uuid references machines(id), -- null = aplica a todas las máquinas de la etapa
  title text not null,
  active boolean default true,
  created_at timestamptz default now()
);

create table checklist_template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references checklist_templates(id) on delete cascade,
  position int not null,
  prompt text not null,
  requires_photo boolean default false,   -- anti "checkbox theater"
  vision_check_prompt text                -- prompt para verificación con Claude vision
);

create table checklist_runs (
  id uuid primary key default gen_random_uuid(),
  order_stage_id uuid not null references order_stages(id) on delete cascade,
  template_id uuid not null references checklist_templates(id),
  operator_id uuid references operators(id),
  status text not null default 'sent',    -- sent | in_progress | completed | failed
  started_at timestamptz default now(),
  completed_at timestamptz
);

create table checklist_run_items (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references checklist_runs(id) on delete cascade,
  template_item_id uuid not null references checklist_template_items(id),
  confirmed boolean default false,
  photo_url text,                          -- evidencia en Storage
  vision_verdict text,                     -- approved | rejected | uncertain
  vision_notes text,
  confirmed_at timestamptz
);

create table holds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  machine_id uuid references machines(id),
  severity hold_severity not null,
  status hold_status not null default 'open',
  source event_source not null,
  reported_by uuid references operators(id),
  description text not null,
  photo_url text,
  ai_classification jsonb,                 -- salida cruda de Claude
  filemaker_synced boolean default false,
  released_by uuid references operators(id),
  released_at timestamptz,
  created_at timestamptz default now()
);

create table maintenance_tasks (
  id uuid primary key default gen_random_uuid(),
  machine_id uuid not null references machines(id),
  name text not null,                      -- ej. 'lavado de mantillas', 'calibración'
  cron_expression text not null,           -- programación del recordatorio
  escalation_hours int not null default 4, -- horas sin confirmación antes de escalar
  assigned_role text default 'operator',
  active boolean default true
);

create table maintenance_logs (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references maintenance_tasks(id),
  due_at timestamptz not null,
  reminded_at timestamptz,
  confirmed_by uuid references operators(id),
  confirmed_at timestamptz,
  escalated boolean default false,
  escalated_at timestamptz
);

create table machine_events (
  id uuid primary key default gen_random_uuid(),
  machine_id uuid references machines(id),
  source event_source not null,
  event_type text not null,                -- job_started | job_paused | error | job_completed | frame_alert | ...
  severity hold_severity,
  payload jsonb not null default '{}'::jsonb,
  processed boolean default false,
  created_at timestamptz default now()
);

create index idx_machine_events_unprocessed on machine_events (created_at) where not processed;
create index idx_holds_open on holds (created_at) where status <> 'released';
create index idx_orders_on_hold on orders (id) where on_hold;

-- updated_at trigger
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger orders_updated_at before update on orders for each row execute function set_updated_at();

-- RLS: acceso sólo vía service_role (n8n); sin acceso anónimo
alter table machines enable row level security;
alter table operators enable row level security;
alter table orders enable row level security;
alter table order_stages enable row level security;
alter table checklist_templates enable row level security;
alter table checklist_template_items enable row level security;
alter table checklist_runs enable row level security;
alter table checklist_run_items enable row level security;
alter table holds enable row level security;
alter table maintenance_tasks enable row level security;
alter table maintenance_logs enable row level security;
alter table machine_events enable row level security;
