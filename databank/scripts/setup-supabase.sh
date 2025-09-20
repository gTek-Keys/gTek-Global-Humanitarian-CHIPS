#!/bin/bash

# gTek Global Cyber Databank - Supabase Setup Script
# Configure Supabase project with security audit capabilities

set -e

echo "🔐 gTek Global Cyber Databank - Supabase Configuration"
echo "=================================================="

# Configuration
SUPABASE_PROJECT_NAME="gtek-databank"
SUPABASE_ORG="gtek-industries"
REGION="us-east-1"
SAML_DOMAIN="gtekglobal.design"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Verify Supabase CLI
log_info "Verifying Supabase CLI..."

if ! command -v supabase &> /dev/null; then
    log_error "Supabase CLI not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install supabase/tap/supabase
    else
        curl -fsSL https://supabase.com/docs/guides/cli | sh
    fi
fi

# Step 2: Login to Supabase
log_info "Authenticating with Supabase..."
supabase login

# Step 3: Initialize Supabase project
log_info "Initializing Supabase project..."

if [ ! -f "supabase/config.toml" ]; then
    supabase init
    log_success "Initialized Supabase project"
else
    log_success "Supabase project already initialized"
fi

# Step 4: Create project on Supabase platform
log_info "Creating Supabase project: $SUPABASE_PROJECT_NAME"

# Note: This requires manual creation via dashboard for organization-level projects
log_warning "Please create project '$SUPABASE_PROJECT_NAME' manually in Supabase dashboard:"
log_info "1. Go to https://supabase.com/dashboard"
log_info "2. Create new project: $SUPABASE_PROJECT_NAME"
log_info "3. Region: $REGION"
log_info "4. Organization: $SUPABASE_ORG"
log_info ""
read -p "Press Enter after creating the project..."

# Step 5: Link to project
log_info "Linking to Supabase project..."
echo "Please provide your project reference ID from the Supabase dashboard:"
read -p "Project Reference ID: " PROJECT_REF

supabase link --project-ref "$PROJECT_REF"
log_success "Linked to Supabase project: $PROJECT_REF"

# Step 6: Apply database schema
log_info "Applying security audit database schema..."

if [ -f "./supabase/security-audit-schema.sql" ]; then
    cp "./supabase/security-audit-schema.sql" "./supabase/migrations/001_security_audit_schema.sql"
    supabase db push
    log_success "Applied security audit schema"
else
    log_error "Security audit schema file not found"
    exit 1
fi

# Step 7: Configure authentication
log_info "Configuring authentication settings..."

# Update auth settings in supabase/config.toml
cat >> supabase/config.toml << 'EOF'

[auth]
# Enable email confirmations
enable_confirmations = true
# Disable signups (SAML only)
enable_signup = false
# Configure external URL
external_url = "https://databank.gtek.global"

[auth.saml]
# SAML configuration for gtekglobal.design
enabled = true
attribute_mapping = { email = "email", name = "name" }

[auth.email]
# Disable password-based auth for enterprise security
enable_signup = false
double_confirm_changes = true

[auth.external.google]
enabled = false

[auth.external.github]
enabled = false
EOF

log_success "Updated authentication configuration"

# Step 8: Set up Row Level Security policies
log_info "Configuring Row Level Security..."

cat > supabase/migrations/002_rls_policies.sql << 'EOF'
-- Enhanced RLS policies for gTek Databank

-- Admin users table
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null check (role in ('admin', 'auditor', 'security_admin', 'compliance_officer')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Insert default admin
insert into public.admin_users (email, role) 
values ('collabnonfablab@gtekglobal.design', 'admin')
on conflict (email) do nothing;

-- Function to check if user is admin
create or replace function public.is_admin(user_email text default null)
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users 
    where email = coalesce(user_email, auth.jwt() ->> 'email')
  );
end;
$$ language plpgsql security definer;

-- Enhanced RLS policies
drop policy if exists "Users can view their own audit logs" on security_audit.audit_logs;
drop policy if exists "Admins can view all audit logs" on security_audit.audit_logs;

create policy "Enhanced audit log access" on security_audit.audit_logs
  for all using (
    auth.jwt() ->> 'email' = actor_email or
    public.is_admin() or
    auth.jwt() ->> 'role' in ('admin', 'auditor', 'security_admin')
  );

-- Compliance events - restricted access
create policy "Compliance events access" on security_audit.compliance_events
  for all using (
    public.is_admin() or
    auth.jwt() ->> 'role' = 'compliance_officer'
  );

-- Grant permissions
grant usage on schema public to authenticated;
grant select on public.admin_users to authenticated;
grant execute on function public.is_admin to authenticated;
EOF

supabase db push
log_success "Applied enhanced RLS policies"

# Step 9: Create storage buckets
log_info "Setting up Supabase Storage..."

cat > supabase/migrations/003_storage_setup.sql << 'EOF'
-- Create storage buckets for databank

-- Main file storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'databank-files',
  'databank-files',
  false,
  52428800, -- 50MB limit
  array['application/pdf', 'text/plain', 'application/json', 'image/png', 'image/jpeg']
) on conflict (id) do nothing;

-- Audit document storage
insert into storage.buckets (id, name, public, file_size_limit)
values (
  'audit-documents',
  'audit-documents', 
  false,
  104857600 -- 100MB limit
) on conflict (id) do nothing;

-- Storage RLS policies
create policy "Authenticated users can upload files" on storage.objects
  for insert with check (
    bucket_id = 'databank-files' and
    auth.role() = 'authenticated'
  );

create policy "Users can view their own files" on storage.objects
  for select using (
    bucket_id = 'databank-files' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Admins can access all files" on storage.objects
  for all using (
    public.is_admin() or
    bucket_id = 'audit-documents'
  );
EOF

supabase db push
log_success "Configured Supabase Storage"

# Step 10: Set up real-time subscriptions
log_info "Configuring real-time features..."

cat > supabase/migrations/004_realtime_setup.sql << 'EOF'
-- Enable real-time for audit tables
alter publication supabase_realtime add table security_audit.audit_logs;
alter publication supabase_realtime add table security_audit.user_sessions;

-- Create notification function for critical events
create or replace function security_audit.notify_critical_event()
returns trigger as $$
begin
  if new.severity = 'CRITICAL' then
    perform pg_notify(
      'critical_security_event',
      json_build_object(
        'actor_email', new.actor_email,
        'action', new.action,
        'timestamp', new.timestamp,
        'resource_path', new.resource_path
      )::text
    );
  end if;
  return new;
end;
$$ language plpgsql;

-- Create trigger for critical events
create trigger audit_critical_events
  after insert on security_audit.audit_logs
  for each row execute function security_audit.notify_critical_event();
EOF

supabase db push
log_success "Configured real-time features"

# Step 11: Generate types for TypeScript
log_info "Generating TypeScript types..."
supabase gen types typescript --local > ../types/supabase.ts
log_success "Generated TypeScript types"

# Step 12: Output configuration
log_info "Generating configuration file..."

cat > databank-supabase-config.json << EOF
{
  "project_name": "$SUPABASE_PROJECT_NAME",
  "project_ref": "$PROJECT_REF",
  "region": "$REGION",
  "saml_domain": "$SAML_DOMAIN",
  "external_url": "https://databank.gtek.global",
  "features_enabled": [
    "row_level_security",
    "real_time",
    "storage",
    "saml_auth",
    "audit_logging"
  ],
  "setup_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

log_success "Configuration saved to: databank-supabase-config.json"

echo ""
echo "🎉 Supabase configuration completed!"
echo ""
echo "Next steps:"
echo "1. Configure SAML in Supabase dashboard"
echo "2. Set up custom domain: databank.gtek.global"
echo "3. Configure API keys in environment variables"
echo "4. Test authentication and audit logging"
echo ""
echo "Dashboard: https://supabase.com/dashboard/project/$PROJECT_REF"