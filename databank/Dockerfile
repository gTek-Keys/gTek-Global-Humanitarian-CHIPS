# gTek Global Cyber Databank - Infrastructure Dockerfile
# Multi-service container for databank operations

FROM node:18-alpine AS base

# Install system dependencies
RUN apk update && apk add --no-cache \
    curl \
    bash \
    postgresql-client \
    docker-cli \
    git \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Copy databank configuration (relative to build context)
COPY ./databank/ ./databank/
COPY ./package*.json ./
COPY .env.example ./

# Install dependencies
RUN npm ci --omit=dev --ignore-scripts

# Install Supabase CLI
RUN curl -sSfL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz -C /usr/local/bin

# Create non-root user
RUN addgroup --system --gid 1001 databank
RUN adduser --system --uid 1001 databank --ingroup databank

# Set permissions
RUN chown -R databank:databank /app
RUN chmod +x /app/databank/scripts/*.sh

# Set environment variables
ENV NODE_ENV=production
ENV PATH="/app/databank/scripts:${PATH}"

# Expose ports for services
EXPOSE 3000 5432 9090 3001

# Switch to non-root user
USER databank

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Default command
CMD ["bash", "/app/databank/scripts/start-services.sh"]

# Labels
LABEL org.opencontainers.image.title="gTek Cyber Databank"
LABEL org.opencontainers.image.description="IEEE + Red Hat aligned secure databank infrastructure"
LABEL org.opencontainers.image.vendor="gTek Industries"
LABEL org.opencontainers.image.url="https://databank.gtek.global"
LABEL org.opencontainers.image.source="https://github.com/gTek-Keys/gTek-Global-Humanitarian-CHIPS"
LABEL org.opencontainers.image.licenses="MIT"