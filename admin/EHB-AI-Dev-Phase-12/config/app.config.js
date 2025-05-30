module.exports = {
  name: 'EHB-AI-Dev-Phase-12',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  apiPrefix: '/api',
  corsOptions: {
    origin: process.env.CORS_ORIGIN || '*',
    optionsSuccessStatus: 200
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};
