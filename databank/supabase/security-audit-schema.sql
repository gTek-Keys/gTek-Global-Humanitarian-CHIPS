-- gTek Global Cyber Databank - Security Audit Schema
-- IEEE + Red Hat aligned database schema for audit logging

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create security audit schema
create schema if not exists security_audit;

-- Main audit log table
create table if not exists security_audit.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_email text not null,
  actor_ip inet,
  action text not null check (action in (
    'UPLOAD', 'DOWNLOAD', 'DELETE', 'VIEW', 'SHARE',
    'LOGIN', 'LOGOUT', 'FAILED_LOGIN', 'PERMISSION_CHANGE',
    'ADMIN_ACTION', 'BULK_OPERATION', 'API_ACCESS'
  )),
  resource_type text check (resource_type in (
    'FILE', 'FOLDER', 'USER', 'PERMISSION', 'SYSTEM'
  )),
  resource_id text,
  resource_path text,
  metadata jsonb default '{}',
  user_agent text,
  session_id text,
  timestamp timestamptz default now(),
  severity text default 'INFO' check (severity in ('LOW', 'INFO', 'WARNING', 'HIGH', 'CRITICAL'))
);

-- File operations tracking
create table if not exists security_audit.file_operations (
  id uuid primary key default gen_random_uuid(),
  audit_log_id uuid references security_audit.audit_logs(id),
  file_name text not null,
  file_path text not null,
  file_size bigint,
  file_type text,
  checksum text,
  encryption_status boolean default false,
  gcs_object_id text,
  timestamp timestamptz default now()
);

-- User sessions tracking
create table if not exists security_audit.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  session_token text not null,
  ip_address inet,
  user_agent text,
  login_timestamp timestamptz default now(),
  logout_timestamp timestamptz,
  is_active boolean default true,
  login_method text check (login_method in ('SAML', 'EMAIL', 'API_KEY'))
);

-- Data retention tracking
create table if not exists security_audit.retention_tracking (
  id uuid primary key default gen_random_uuid(),
  resource_id text not null,
  resource_type text not null,
  created_at timestamptz not null,
  retention_policy text not null,
  expires_at timestamptz not null,
  auto_delete boolean default true,
  status text default 'ACTIVE' check (status in ('ACTIVE', 'EXPIRED', 'DELETED', 'ARCHIVED'))
);

-- Compliance audit trail
create table if not exists security_audit.compliance_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in (
    'DATA_EXPORT', 'GDPR_REQUEST', 'AUDIT_TRAIL_ACCESS',
    'POLICY_VIOLATION', 'REGULATORY_REPORT'
  )),
  actor_email text not null,
  affected_users text[],
  description text,
  compliance_framework text check (compliance_framework in (
    'GDPR', 'HIPAA', 'SOX', 'IEEE', 'ISO27001'
  )),
  metadata jsonb default '{}',
  timestamp timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table security_audit.audit_logs enable row level security;
alter table security_audit.file_operations enable row level security;
alter table security_audit.user_sessions enable row level security;
alter table security_audit.retention_tracking enable row level security;
alter table security_audit.compliance_events enable row level security;

-- RLS Policies for audit_logs
create policy "Users can view their own audit logs" on security_audit.audit_logs
  for select using (auth.jwt() ->> 'email' = actor_email);

create policy "Admins can view all audit logs" on security_audit.audit_logs
  for all using (
    auth.jwt() ->> 'role' in ('admin', 'auditor') or
    auth.jwt() ->> 'email' = 'collabnonfablab@gtekglobal.design'
  );

-- RLS Policies for user_sessions
create policy "Users can view their own sessions" on security_audit.user_sessions
  for select using (auth.jwt() ->> 'email' = user_email);

create policy "Admins can view all sessions" on security_audit.user_sessions
  for all using (
    auth.jwt() ->> 'role' in ('admin', 'security_admin')
  );

-- Indexes for performance
create index idx_audit_logs_actor_email on security_audit.audit_logs(actor_email);
create index idx_audit_logs_timestamp on security_audit.audit_logs(timestamp);
create index idx_audit_logs_action on security_audit.audit_logs(action);
create index idx_audit_logs_severity on security_audit.audit_logs(severity);

create index idx_file_ops_timestamp on security_audit.file_operations(timestamp);
create index idx_file_ops_file_path on security_audit.file_operations(file_path);

create index idx_sessions_user_email on security_audit.user_sessions(user_email);
create index idx_sessions_active on security_audit.user_sessions(is_active);

-- Functions for audit logging
create or replace function security_audit.log_action(
  p_actor_email text,
  p_action text,
  p_resource_type text default null,
  p_resource_id text default null,
  p_resource_path text default null,
  p_metadata jsonb default '{}',
  p_severity text default 'INFO'
) returns uuid as $$
declare
  audit_id uuid;
begin
  insert into security_audit.audit_logs (
    actor_email, action, resource_type, resource_id, 
    resource_path, metadata, actor_ip, user_agent, severity
  ) values (
    p_actor_email, p_action, p_resource_type, p_resource_id,
    p_resource_path, p_metadata, 
    inet_client_addr(), 
    current_setting('request.headers', true)::json->>'user-agent',
    p_severity
  ) returning id into audit_id;
  
  return audit_id;
end;
$$ language plpgsql security definer;

-- Views for common queries
create view security_audit.recent_activities as
select 
  al.actor_email,
  al.action,
  al.resource_type,
  al.resource_path,
  al.timestamp,
  al.severity
from security_audit.audit_logs al
where al.timestamp >= now() - interval '24 hours'
order by al.timestamp desc;

create view security_audit.failed_login_attempts as
select 
  actor_email,
  actor_ip,
  count(*) as attempt_count,
  max(timestamp) as last_attempt
from security_audit.audit_logs
where action = 'FAILED_LOGIN'
  and timestamp >= now() - interval '1 hour'
group by actor_email, actor_ip
having count(*) >= 3;

-- Grant permissions
grant usage on schema security_audit to authenticated;
grant select on all tables in schema security_audit to authenticated;
grant execute on function security_audit.log_action to authenticated;