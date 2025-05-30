/**
 * Health status API endpoint
 * Returns the health status of all services in the EHB system
 */
export default function handler(req, res) {
  // In a real app, this would check the actual health of various components
  const healthData = {
    admin: { status: 'healthy', percentage: 98 },
    services: { status: 'healthy', percentage: 95 },
    system: { status: 'warning', percentage: 82 },
    api: { status: 'healthy', percentage: 96 },
    database: { status: 'healthy', percentage: 97 },
    storage: { status: 'warning', percentage: 78 },
  };

  res.status(200).json(healthData);
}