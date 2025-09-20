// gTek Global Humanitarian CHIPS - Health Check API
// Used by Docker health checks and monitoring systems

import { NextApiRequest, NextApiResponse } from 'next';

interface HealthCheckResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
  environment: string;
  uptime: number;
  memory: NodeJS.MemoryUsage;
  database?: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Basic health check
  const healthCheck: HealthCheckResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'gTek Humanitarian CHIPS',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };

  // Check database connection (if available)
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    healthCheck.database = 'configured';
  }

  // Return health status
  res.status(200).json(healthCheck);
}