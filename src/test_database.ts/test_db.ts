
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import sequelize from '../config/config.db';
import { QueryTypes } from 'sequelize';

dotenv.config();

interface HealthCheckResult {
  current_time: Date;
}

// 
 const query = async <T = unknown>(text: string, params?: unknown[]): Promise<T[]> => {
  try {
    const result = await sequelize.query(text, {
      replacements: params,
      type: QueryTypes.SELECT,
    });
    return result as T[];
  } catch (error) {
    console.error('Sequelize query error:', error);
    throw error;
  }
};


// Health check endpoint
export const healthCheck = async (req: Request, res: Response) => {
  try {
    const result = await query<HealthCheckResult>('SELECT NOW() as current_time');
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: result[0].current_time,
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Initialize database tables
export const test_db =  async (req: Request, res: Response) => {
  const createTables = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    CREATE TABLE IF NOT EXISTS farmers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS farmer_products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2),
      user_id UUID REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(createTables);
    res.json({ 
      message: 'Database initialized successfully',
      tables: ['farmers', 'farmers_products']
    });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Database initialization failed'
    });
  }
};

