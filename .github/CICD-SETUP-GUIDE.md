# 🔐 GitHub Repository Setup Guide - CI/CD Secrets & Variables

## 🎯 **Required GitHub Repository Configuration**

### **Repository Secrets** (Settings → Secrets and variables → Actions → Repository secrets)

#### **Docker Hub Authentication**
```
DOCKER_PAT = dckr_pat_qXhSP42-w_-xM8jvwO7jQEIVf68
```

#### **Google Cloud Platform** (for Cloud Run deployment)
```
GCP_SA_KEY = {
  "type": "service_account",
  "project_id": "gtek-global",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "github-actions@gtek-global.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

#### **Code Quality & Security** (Optional but recommended)
```
CODECOV_TOKEN = your-codecov-token-here
```

---

### **Repository Variables** (Settings → Secrets and variables → Actions → Repository variables)

#### **Docker Configuration**
```
DOCKER_USER = ceptokrem
```

#### **Google Cloud Configuration**
```
GCP_PROJECT_ID = gtek-global
GCP_REGION = us-central1
```

---

## 🚀 **CI/CD Pipeline Features**

### **Automated Builds** ✅
- **Multi-platform**: Builds for `linux/amd64` and `linux/arm64`
- **Multi-registry**: Pushes to both Docker Hub and GitHub Container Registry
- **Smart tagging**: Branch names, SHAs, semantic versions, and `latest` for main branch

### **Deployment Automation** ✅
- **Google Cloud Run**: Automatic deployment on main branch pushes
- **Production-ready**: Memory limits, CPU allocation, auto-scaling configuration
- **Environment variables**: Automated production environment setup

### **Code Quality Gates** ✅
- **ESLint**: Code style and quality checks
- **TypeScript**: Type safety verification
- **Prettier**: Code formatting validation
- **Jest Tests**: Unit and integration test execution
- **Docker Health Checks**: Container functionality verification

### **Security Scanning** ✅
- **Trivy**: Container vulnerability scanning
- **CodeQL**: Static application security testing (SAST)
- **npm audit**: Dependency vulnerability checks
- **SARIF Upload**: Security results in GitHub Security tab

### **Dependency Management** ✅
- **Dependabot**: Automated weekly dependency updates
- **Smart ignoring**: Major version updates for stable dependencies
- **Organized PRs**: Separate updates for npm, GitHub Actions, and Docker

---

## 🔧 **Setup Instructions**

### **Step 1: Configure Repository Secrets**
1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each secret listed above

### **Step 2: Configure Repository Variables**
1. In the same section, click the **Variables** tab
2. Click **New repository variable** for each variable listed above

### **Step 3: Google Cloud Service Account Setup**
```bash
# Create service account for GitHub Actions
gcloud iam service-accounts create github-actions \
  --description="Service account for GitHub Actions CI/CD" \
  --display-name="GitHub Actions"

# Grant necessary permissions
gcloud projects add-iam-policy-binding gtek-global \
  --member="serviceAccount:github-actions@gtek-global.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding gtek-global \
  --member="serviceAccount:github-actions@gtek-global.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding gtek-global \
  --member="serviceAccount:github-actions@gtek-global.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Generate key file
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions@gtek-global.iam.gserviceaccount.com

# Copy the contents of github-actions-key.json to GCP_SA_KEY secret
```

### **Step 4: Enable GitHub Actions**
1. Go to **Settings** → **Actions** → **General**
2. Ensure "Allow all actions and reusable workflows" is selected
3. Enable "Allow GitHub Actions to create and approve pull requests"

### **Step 5: Branch Protection Rules** (Recommended)
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Required status checks: `build-main-platform`, `build-databank`, `lint-and-type-check`, `test`
   - ✅ Restrict pushes that create files larger than 100 MB

---

## 📊 **Workflow Triggers**

### **Main CI/CD Pipeline** (`ci.yml`)
- **Push to main/develop**: Full build, test, and deploy
- **Pull requests to main**: Build and test only (no deployment)
- **Releases**: Tagged builds with semantic versioning

### **Code Quality Pipeline** (`quality.yml`)
- **Push to main/develop**: Linting, type checking, testing
- **Pull requests to main**: Code quality gates for PR approval

### **Dependabot**
- **Weekly Monday 9:00 AM**: Automated dependency updates
- **Separate PRs**: npm dependencies, GitHub Actions, Docker base images

---

## 🎉 **Expected CI/CD Flow**

### **Developer Workflow**
1. **Create feature branch**: `git checkout -b feature/new-humanitarian-feature`
2. **Push changes**: Triggers quality checks and test builds
3. **Create PR**: Full CI pipeline runs, all checks must pass
4. **Merge to main**: Automatic deployment to production Cloud Run

### **Automated Outputs**
- **Docker Hub**: `ceptokrem/gtek-humanitarian-chips:latest`
- **GitHub Container Registry**: `ghcr.io/gtek-keys/gtek-humanitarian-chips:latest`
- **Google Cloud Run**: `https://gtek-app-[hash]-uc.a.run.app`
- **Security Reports**: GitHub Security tab with vulnerability scans

### **Notifications**
- **Success**: ✅ All builds pass, deployment successful
- **Failure**: ❌ Detailed logs for debugging, no deployment
- **Security Issues**: 🛡️ Alerts in GitHub Security tab

**This CI/CD setup ensures your humanitarian platform has enterprise-grade automation for secure, reliable deployments! 🌍**