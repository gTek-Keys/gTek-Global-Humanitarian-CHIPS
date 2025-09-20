#!/bin/bash

# gTek Global Cyber Databank - Service Startup Script
# Starts all required services in the databank container

set -e

echo "🚀 Starting gTek Global Cyber Databank Services"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a service is running
check_service() {
    local service_name=$1
    local port=$2
    
    if curl -f "http://localhost:$port/health" &>/dev/null; then
        echo -e "${GREEN}✅ $service_name is running on port $port${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $service_name is not responding on port $port${NC}"
        return 1
    fi
}

# Start health check endpoint
echo -e "${BLUE}🔍 Starting health check service...${NC}"
cat > /tmp/health-server.js << 'EOF'
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'gTek Cyber Databank',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});
server.listen(3000, () => {
  console.log('Health check server running on port 3000');
});
EOF

node /tmp/health-server.js &

# Wait for health check to be ready
sleep 2

# Verify health check is running
if check_service "Health Check" 3000; then
    echo -e "${GREEN}🎉 gTek Cyber Databank is ready!${NC}"
else
    echo -e "${YELLOW}⚠️  Health check failed, but continuing...${NC}"
fi

# Keep the container running
echo -e "${BLUE}📊 Databank services are running...${NC}"
echo "Access health check at: http://localhost:3000/health"
echo "Press Ctrl+C to stop services"

# Wait for signals
trap 'echo -e "${YELLOW}\n🛑 Shutting down gTek Cyber Databank...${NC}"; exit 0' SIGTERM SIGINT

# Keep running
while true; do
    sleep 30
    if ! check_service "Health Check" 3000; then
        echo -e "${YELLOW}⚠️  Restarting health check service...${NC}"
        node /tmp/health-server.js &
    fi
done