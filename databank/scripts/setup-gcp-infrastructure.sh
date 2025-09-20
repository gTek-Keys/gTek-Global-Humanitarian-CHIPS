#!/bin/bash

# gTek Global Cyber Databank - Google Cloud Setup Script
# IEEE + Red Hat aligned infrastructure deployment

set -e

echo "🏗️  gTek Global Cyber Databank - Infrastructure Setup"
echo "=================================================="

# Configuration
CONFIG_FILE="./gtek-databank-config.yaml"
ORG_DOMAIN="gtekglobal.design"
WORKSPACE_ADMIN="collabnonfablab@gtekglobal.design"

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

# Step 1: Verify prerequisites
log_info "Verifying prerequisites..."

if ! command -v gcloud &> /dev/null; then
    log_error "gcloud CLI not found. Please install Google Cloud SDK."
    exit 1
fi

if ! command -v yq &> /dev/null; then
    log_warning "yq not found. Installing yq for YAML parsing..."
    # Install yq based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install yq
    else
        sudo wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64
        sudo chmod +x /usr/local/bin/yq
    fi
fi

# Step 2: Authenticate with Google Cloud
log_info "Authenticating with Google Cloud..."
gcloud auth login --update-adc

# Step 3: Enable necessary APIs
log_info "Enabling required Google Cloud APIs..."
gcloud services enable cloudidentity.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable iam.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable logging.googleapis.com
gcloud services enable bigquery.googleapis.com
gcloud services enable cloudkms.googleapis.com

# Step 4: Create organization (if not exists)
log_info "Setting up Google Cloud Organization..."

# Check if organization exists
ORG_ID=$(gcloud organizations list --filter="displayName:${ORG_DOMAIN}" --format="value(name)" 2>/dev/null || echo "")

if [ -z "$ORG_ID" ]; then
    log_warning "Organization ${ORG_DOMAIN} not found. Please ensure Google Workspace is set up."
    log_info "Please visit: https://admin.google.com and set up Google Workspace first."
    exit 1
else
    log_success "Found organization: $ORG_ID"
fi

# Step 5: Create projects
log_info "Creating Google Cloud projects..."

PROJECTS=("gtek-databank-core" "gtek-databank-analytics" "gtek-databank-audit")

for PROJECT_ID in "${PROJECTS[@]}"; do
    if gcloud projects describe "$PROJECT_ID" &>/dev/null; then
        log_success "Project $PROJECT_ID already exists"
    else
        log_info "Creating project: $PROJECT_ID"
        gcloud projects create "$PROJECT_ID" \
            --organization="$ORG_ID" \
            --name="$PROJECT_ID"
        log_success "Created project: $PROJECT_ID"
    fi
    
    # Set billing account (if configured)
    BILLING_ACCOUNT=$(gcloud billing accounts list --format="value(name)" --limit=1 2>/dev/null || echo "")
    if [ -n "$BILLING_ACCOUNT" ]; then
        gcloud billing projects link "$PROJECT_ID" --billing-account="$BILLING_ACCOUNT"
        log_success "Linked billing account to $PROJECT_ID"
    else
        log_warning "No billing account found. Please link billing manually."
    fi
done

# Step 6: Enable services for each project
log_info "Enabling services for projects..."

# Core project services
gcloud config set project gtek-databank-core
gcloud services enable storage.googleapis.com
gcloud services enable iam.googleapis.com
gcloud services enable cloudkms.googleapis.com
gcloud services enable logging.googleapis.com

# Analytics project services  
gcloud config set project gtek-databank-analytics
gcloud services enable bigquery.googleapis.com
gcloud services enable monitoring.googleapis.com

# Audit project services
gcloud config set project gtek-databank-audit
gcloud services enable logging.googleapis.com

# Step 7: Create service accounts
log_info "Creating service accounts..."

gcloud config set project gtek-databank-core

# Create databank service account
SA_EMAIL="gtek-databank-sa@gtek-databank-core.iam.gserviceaccount.com"

if gcloud iam service-accounts describe "$SA_EMAIL" &>/dev/null; then
    log_success "Service account $SA_EMAIL already exists"
else
    gcloud iam service-accounts create gtek-databank-sa \
        --display-name="gTek Databank Service Account" \
        --description="Service account for gTek Global Cyber Databank"
    log_success "Created service account: $SA_EMAIL"
fi

# Assign roles to service account
ROLES=("roles/storage.admin" "roles/logging.admin" "roles/iam.securityAdmin")

for ROLE in "${ROLES[@]}"; do
    gcloud projects add-iam-policy-binding gtek-databank-core \
        --member="serviceAccount:$SA_EMAIL" \
        --role="$ROLE"
    log_success "Assigned $ROLE to $SA_EMAIL"
done

# Step 8: Create KMS key ring and key
log_info "Creating KMS encryption keys..."

gcloud config set project gtek-databank-core

if gcloud kms keyrings describe gtek-databank --location=global &>/dev/null; then
    log_success "KMS keyring already exists"
else
    gcloud kms keyrings create gtek-databank --location=global
    log_success "Created KMS keyring: gtek-databank"
fi

if gcloud kms keys describe gtek-databank-key --keyring=gtek-databank --location=global &>/dev/null; then
    log_success "KMS key already exists"
else
    gcloud kms keys create gtek-databank-key \
        --keyring=gtek-databank \
        --location=global \
        --purpose=encryption
    log_success "Created KMS key: gtek-databank-key"
fi

# Step 9: Create storage bucket
log_info "Creating secure storage bucket..."

BUCKET_NAME="databank.gtek.global"

if gsutil ls -b gs://"$BUCKET_NAME" &>/dev/null; then
    log_success "Bucket $BUCKET_NAME already exists"
else
    gsutil mb -p gtek-databank-core -c STANDARD -l us gs://"$BUCKET_NAME"
    
    # Configure bucket settings
    gsutil versioning set on gs://"$BUCKET_NAME"
    gsutil uniformbucketlevelaccess set on gs://"$BUCKET_NAME"
    
    # Set retention policy (7 years)
    gsutil retention set 2555d gs://"$BUCKET_NAME"
    
    log_success "Created and configured bucket: $BUCKET_NAME"
fi

# Step 10: Set up IAM for workspace admin
log_info "Configuring IAM for workspace admin..."

gcloud projects add-iam-policy-binding gtek-databank-core \
    --member="user:$WORKSPACE_ADMIN" \
    --role="roles/owner"

gcloud projects add-iam-policy-binding gtek-databank-analytics \
    --member="user:$WORKSPACE_ADMIN" \
    --role="roles/owner"

gcloud projects add-iam-policy-binding gtek-databank-audit \
    --member="user:$WORKSPACE_ADMIN" \
    --role="roles/owner"

log_success "Configured IAM for workspace admin: $WORKSPACE_ADMIN"

# Step 11: Create BigQuery dataset
log_info "Creating BigQuery datasets..."

gcloud config set project gtek-databank-analytics

if bq ls -d gtek_databank_metrics &>/dev/null; then
    log_success "BigQuery dataset already exists"
else
    bq mk --dataset --location=US gtek-databank-analytics:gtek_databank_metrics
    log_success "Created BigQuery dataset: gtek_databank_metrics"
fi

# Step 12: Export configuration
log_info "Exporting deployment configuration..."

cat > databank-deployment-info.json << EOF
{
  "deployment_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "organization_id": "$ORG_ID",
  "projects": {
    "core": "gtek-databank-core",
    "analytics": "gtek-databank-analytics", 
    "audit": "gtek-databank-audit"
  },
  "storage": {
    "bucket": "$BUCKET_NAME",
    "kms_key": "projects/gtek-databank-core/locations/global/keyRings/gtek-databank/cryptoKeys/gtek-databank-key"
  },
  "service_account": "$SA_EMAIL",
  "workspace_admin": "$WORKSPACE_ADMIN"
}
EOF

log_success "Deployment configuration exported to: databank-deployment-info.json"

echo ""
echo "🎉 gTek Global Cyber Databank infrastructure setup completed!"
echo ""
echo "Next steps:"
echo "1. Configure Supabase project with SAML authentication"
echo "2. Set up monitoring and alerting"
echo "3. Deploy the web interface"
echo "4. Configure audit log streaming"
echo ""
echo "For support: collabnonfablab@gtekglobal.design"