#!/bin/bash

# GitHub Container Registry Login Script
# Securely authenticate with GitHub Container Registry (GHCR)

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔐 GitHub Container Registry Authentication${NC}"

# Load environment variables
if [ -f .env.local ]; then
    # shellcheck disable=SC2046
    export $(grep -v '^#' .env.local | grep -E '^(GHCR_USERNAME|GHCR_PAT)=' | xargs)
else
    echo -e "${RED}❌ .env.local file not found${NC}"
    exit 1
fi

# Validate required environment variables
if [ -z "${GHCR_USERNAME:-}" ] || [ -z "${GHCR_PAT:-}" ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    echo "   - GHCR_USERNAME: GitHub username"
    echo "   - GHCR_PAT: GitHub Personal Access Token"
    echo ""
    echo "   Please ensure these are set in your .env.local file"
    exit 1
fi

echo "🔍 Authenticating as: $GHCR_USERNAME"

# Login to GitHub Container Registry
if echo "$GHCR_PAT" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin; then
    echo -e "${GREEN}✅ Successfully authenticated with GitHub Container Registry${NC}"
    echo ""
    echo "🚀 You can now push/pull images with:"
    echo "   docker tag your-image ghcr.io/$GHCR_USERNAME/your-image:latest"
    echo "   docker push ghcr.io/$GHCR_USERNAME/your-image:latest"
    echo ""
    echo "📋 Available gTek images:"
    echo "   - ghcr.io/$GHCR_USERNAME/gtek-humanitarian-chips:latest"
    echo "   - ghcr.io/$GHCR_USERNAME/gtek-databank:latest"
else
    echo -e "${RED}❌ Failed to authenticate with GitHub Container Registry${NC}"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   1. Verify your GitHub PAT has 'write:packages' scope"
    echo "   2. Ensure your PAT is not expired"
    echo "   3. Check your GitHub username is correct"
    exit 1
fi