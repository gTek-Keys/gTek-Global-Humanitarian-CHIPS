#!/bin/bash

# Docker Login Script for gTek Global Humanitarian CHIPS
# Automatically logs into Docker Hub using stored credentials

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Docker Login for gTek Global Humanitarian CHIPS${NC}"
echo "=================================================="

# Load environment variables
if [ -f ".env.local" ]; then
    export $(grep -v '^#' .env.local | xargs)
    echo -e "${GREEN}✅ Loaded environment variables from .env.local${NC}"
else
    echo -e "${RED}❌ .env.local file not found${NC}"
    exit 1
fi

# Check if Docker credentials are set
if [ -z "$DOCKER_USERNAME" ] || [ -z "$DOCKER_ACCESS_TOKEN" ]; then
    echo -e "${RED}❌ Docker credentials not found in environment variables${NC}"
    echo "Please ensure DOCKER_USERNAME and DOCKER_ACCESS_TOKEN are set in .env.local"
    exit 1
fi

# Login to Docker Hub
echo -e "${BLUE}🔐 Logging into Docker Hub...${NC}"
echo "$DOCKER_ACCESS_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully logged into Docker Hub as $DOCKER_USERNAME${NC}"
    echo -e "${GREEN}🚀 Ready to push/pull Docker images${NC}"
else
    echo -e "${RED}❌ Docker login failed${NC}"
    exit 1
fi

# Display Docker info
echo ""
echo -e "${BLUE}📊 Docker Environment Info:${NC}"
docker version --format "Client: {{.Client.Version}}, Server: {{.Server.Version}}"
echo "Username: $DOCKER_USERNAME"
echo "Registry: Docker Hub (docker.io)"

echo ""
echo -e "${GREEN}🎉 Docker setup complete!${NC}"
echo ""
echo "Usage examples:"
echo "  docker pull ubuntu:latest"
echo "  docker build -t ceptokrem/gtek-app ."
echo "  docker push ceptokrem/gtek-app"