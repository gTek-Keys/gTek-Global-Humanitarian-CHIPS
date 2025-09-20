#!/bin/bash
set -e

# 🎯 gTek Global Humanitarian CHIPS - Vertex AI Deployment Preflight Audit
# Comprehensive validation for AI model deployment infrastructure

PROJECT_ID="gtek-global"
REGION="us-west2"
BACKUP_REGION="us-central1"
BUCKET="gs://$PROJECT_ID-models"
DATABANK_BUCKET="gs://$PROJECT_ID-humanitarian-data"
ARTIFACT_REPO="gtek-ai-models"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚦 gTek Humanitarian CHIPS - Vertex AI Preflight Audit${NC}"
echo "============================================================"
echo -e "${YELLOW}Validating AI deployment infrastructure for humanitarian platform${NC}"
echo ""

# Track overall status
AUDIT_PASSED=true

# 1. Check gcloud installation and version
echo -e "${BLUE}1. Checking Google Cloud SDK...${NC}"
if ! command -v gcloud &> /dev/null; then
  echo -e "${RED}❌ gcloud not installed.${NC}"
  echo "   Install: https://cloud.google.com/sdk/docs/install"
  AUDIT_PASSED=false
else
  GCLOUD_VERSION=$(gcloud version | head -n 1)
  echo -e "${GREEN}✅ gcloud installed: $GCLOUD_VERSION${NC}"
fi

# 2. Verify active account and authentication
echo -e "${BLUE}2. Checking authentication...${NC}"
ACCOUNT=$(gcloud config get-value account 2>/dev/null)
if [ -z "$ACCOUNT" ]; then
  echo -e "${RED}❌ No active gcloud account set.${NC}"
  echo "   Run: gcloud auth login"
  AUDIT_PASSED=false
else
  echo -e "${GREEN}✅ Active account: $ACCOUNT${NC}"
fi

# 3. Verify project configuration
echo -e "${BLUE}3. Checking project configuration...${NC}"
ACTIVE_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ "$ACTIVE_PROJECT" != "$PROJECT_ID" ]; then
  echo -e "${YELLOW}⚠️ Project mismatch. Expected: $PROJECT_ID, Found: $ACTIVE_PROJECT${NC}"
  echo "   Run: gcloud config set project $PROJECT_ID"
else
  echo -e "${GREEN}✅ Project set: $ACTIVE_PROJECT${NC}"
fi

# 4. Check billing account
echo -e "${BLUE}4. Verifying billing configuration...${NC}"
BILLING=$(gcloud beta billing accounts list --format="value(name)" 2>/dev/null | head -n 1)
if [ -z "$BILLING" ]; then
  echo -e "${RED}❌ No billing account linked!${NC}"
  echo "   Link billing: https://console.cloud.google.com/billing"
  AUDIT_PASSED=false
else
  echo -e "${GREEN}✅ Billing account detected: $BILLING${NC}"
fi

# 5. Check essential APIs
echo -e "${BLUE}5. Checking required APIs...${NC}"
REQUIRED_APIS=(
  "aiplatform.googleapis.com"
  "compute.googleapis.com"
  "storage.googleapis.com"
  "artifactregistry.googleapis.com"
  "cloudbuild.googleapis.com"
  "run.googleapis.com"
)

for api in "${REQUIRED_APIS[@]}"; do
  if gcloud services list --enabled --filter="name:$api" --format="value(name)" | grep -q "$api"; then
    echo -e "${GREEN}✅ $api enabled${NC}"
  else
    echo -e "${RED}❌ $api not enabled${NC}"
    echo "   Enable: gcloud services enable $api"
    AUDIT_PASSED=false
  fi
done

# 6. Check IAM permissions
echo -e "${BLUE}6. Checking IAM permissions...${NC}"
REQUIRED_ROLES=(
  "roles/aiplatform.admin"
  "roles/storage.admin"
  "roles/artifactregistry.admin"
  "roles/run.admin"
)

for role in "${REQUIRED_ROLES[@]}"; do
  if gcloud projects get-iam-policy $PROJECT_ID \
    --flatten="bindings[].members" \
    --filter="bindings.role:$role AND bindings.members:user:$ACCOUNT" \
    --format="value(bindings.role)" 2>/dev/null | grep -q "$role"; then
    echo -e "${GREEN}✅ User has $role${NC}"
  else
    echo -e "${RED}❌ User lacks $role${NC}"
    echo "   Grant: gcloud projects add-iam-policy-binding $PROJECT_ID --member=user:$ACCOUNT --role=$role"
    AUDIT_PASSED=false
  fi
done

# 7. Verify storage buckets
echo -e "${BLUE}7. Checking storage infrastructure...${NC}"
for bucket in "$BUCKET" "$DATABANK_BUCKET"; do
  if gsutil ls -b $bucket >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Bucket exists: $bucket${NC}"
  else
    echo -e "${YELLOW}⚠️ Bucket missing: $bucket${NC}"
    echo "   Creating bucket..."
    if gsutil mb -l $REGION $bucket 2>/dev/null; then
      echo -e "${GREEN}✅ Created: $bucket${NC}"
    else
      echo -e "${RED}❌ Failed to create: $bucket${NC}"
      AUDIT_PASSED=false
    fi
  fi
done

# 8. Check Artifact Registry for custom containers
echo -e "${BLUE}8. Checking Artifact Registry...${NC}"
if gcloud artifacts repositories list --location=$REGION --format="value(name)" | grep -q "$ARTIFACT_REPO"; then
  echo -e "${GREEN}✅ Artifact Registry repository exists: $ARTIFACT_REPO${NC}"
else
  echo -e "${YELLOW}⚠️ Artifact Registry repository missing: $ARTIFACT_REPO${NC}"
  echo "   Creating repository..."
  if gcloud artifacts repositories create $ARTIFACT_REPO \
    --repository-format=docker \
    --location=$REGION \
    --description="gTek Humanitarian AI Models" 2>/dev/null; then
    echo -e "${GREEN}✅ Created Artifact Registry: $ARTIFACT_REPO${NC}"
  else
    echo -e "${RED}❌ Failed to create Artifact Registry${NC}"
    AUDIT_PASSED=false
  fi
fi

# 9. Check Vertex AI quotas
echo -e "${BLUE}9. Checking Vertex AI quotas...${NC}"
echo "   Checking available machine types in $REGION:"
QUOTA_CHECK=$(gcloud compute regions describe $REGION --format="flatten(quotas)" 2>/dev/null | grep -E "(NVIDIA|TPU)" | head -3)
if [ -n "$QUOTA_CHECK" ]; then
  echo -e "${GREEN}✅ GPU/TPU quotas available${NC}"
  echo "$QUOTA_CHECK" | sed 's/^/     /'
else
  echo -e "${YELLOW}⚠️ No GPU/TPU quotas found. CPU-only deployment available.${NC}"
fi

# 10. Verify Docker authentication
echo -e "${BLUE}10. Checking Docker authentication...${NC}"
if grep -q "gcr.io\|pkg.dev" ~/.docker/config.json 2>/dev/null; then
  echo -e "${GREEN}✅ Docker authenticated with GCR/Artifact Registry${NC}"
else
  echo -e "${YELLOW}⚠️ Docker not authenticated${NC}"
  echo "   Run: gcloud auth configure-docker $REGION-docker.pkg.dev"
fi

# 11. Check Vertex AI Workbench (for model development)
echo -e "${BLUE}11. Checking AI development environment...${NC}"
WORKBENCH_COUNT=$(gcloud notebooks instances list --location=$REGION --format="value(name)" 2>/dev/null | wc -l)
if [ "$WORKBENCH_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✅ Vertex AI Workbench instances available: $WORKBENCH_COUNT${NC}"
else
  echo -e "${YELLOW}⚠️ No Vertex AI Workbench instances found${NC}"
  echo "   Consider creating for model development"
fi

# 12. Test Vertex AI Model API access
echo -e "${BLUE}12. Testing Vertex AI API connectivity...${NC}"
if gcloud ai models list --region=$REGION --limit=1 >/dev/null 2>&1; then
  echo -e "${GREEN}✅ Vertex AI API accessible${NC}"
else
  echo -e "${RED}❌ Cannot access Vertex AI API${NC}"
  AUDIT_PASSED=false
fi

# 13. Check humanitarian data compliance setup
echo -e "${BLUE}13. Checking humanitarian data compliance...${NC}"
# Check for data encryption and access controls
if gsutil iam get $DATABANK_BUCKET 2>/dev/null | grep -q "encryptionConfig"; then
  echo -e "${GREEN}✅ Data encryption configured${NC}"
else
  echo -e "${YELLOW}⚠️ Consider enabling encryption for humanitarian data${NC}"
fi

# 14. Network and security validation
echo -e "${BLUE}14. Checking network security...${NC}"
VPC_COUNT=$(gcloud compute networks list --format="value(name)" | wc -l)
if [ "$VPC_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✅ VPC networks available: $VPC_COUNT${NC}"
else
  echo -e "${YELLOW}⚠️ No custom VPC found (using default)${NC}"
fi

# 15. Final summary and recommendations
echo ""
echo "============================================================"
echo -e "${BLUE}📊 AUDIT SUMMARY${NC}"
echo "============================================================"

if [ "$AUDIT_PASSED" = true ]; then
  echo -e "${GREEN}🎉 PREFLIGHT AUDIT PASSED!${NC}"
  echo -e "${GREEN}✅ Your gTek Humanitarian CHIPS platform is ready for Vertex AI deployment${NC}"
  echo ""
  echo -e "${BLUE}🚀 Next Steps:${NC}"
  echo "   1. Deploy your humanitarian AI models"
  echo "   2. Set up model monitoring and logging"
  echo "   3. Configure ethical AI guidelines"
  echo "   4. Test with humanitarian datasets"
else
  echo -e "${RED}❌ PREFLIGHT AUDIT FAILED!${NC}"
  echo -e "${RED}Please resolve the issues marked with ❌ above before deploying${NC}"
  echo ""
  echo -e "${BLUE}🔧 Quick Fix Commands:${NC}"
  echo "   gcloud auth login"
  echo "   gcloud config set project $PROJECT_ID"
  echo "   gcloud services enable aiplatform.googleapis.com compute.googleapis.com storage.googleapis.com"
  echo "   gcloud auth configure-docker $REGION-docker.pkg.dev"
fi

echo ""
echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "   Project ID: $PROJECT_ID"
echo "   Primary Region: $REGION"
echo "   Backup Region: $BACKUP_REGION"
echo "   Model Storage: $BUCKET"
echo "   Data Storage: $DATABANK_BUCKET"
echo "   Container Registry: $REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO"
echo ""
echo -e "${YELLOW}🌍 Ready to deploy AI for humanitarian impact!${NC}"

# Exit with appropriate code
if [ "$AUDIT_PASSED" = true ]; then
  exit 0
else
  exit 1
fi