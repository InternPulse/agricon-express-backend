import dotenv from 'dotenv';
dotenv.config();

export const config = {
  RENDER_SERVICE_ID: process.env.RENDER_SERVICE_ID || '',
  RENDER_API_KEY: process.env.RENDER_API_KEY || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000'),
} as const;