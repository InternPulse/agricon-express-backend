import express from 'express';
import { query } from './database';
import dotenv from 'dotenv';
dotenv.config();
const dbtest = express();
// Middleware
dbtest.use(express.json());
// Health check endpoint
dbtest.get('/health', async (req, res) => {
    try {
        const result = await query('SELECT NOW() as current_time');
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: result.rows[0].current_time,
            environment: process.env.NODE_ENV
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            database: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Initialize database tables
dbtest.post('/api/init-db', async (req, res) => {
    const createTables = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS products (
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
            tables: ['users', 'products']
        });
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Database initialization failed'
        });
    }
});
// Get all users
dbtest.get('/api/users', async (req, res) => {
    try {
        const result = await query('SELECT * FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to fetch users'
        });
    }
});
// Create new user
dbtest.post('/api/users', async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).json({
            error: 'Name and email are required'
        });
        return;
    }
    try {
        const result = await query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        if (error.code === '23505') { // Unique violation
            res.status(400).json({ error: 'Email already exists' });
        }
        else {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to create user'
            });
        }
    }
});
// Get user by ID
dbtest.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to fetch user'
        });
    }
});
// Update user
dbtest.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name && !email) {
        res.status(400).json({
            error: 'At least one field (name or email) is required'
        });
        return;
    }
    try {
        let updateQuery = 'UPDATE users SET ';
        const values = [];
        const updates = [];
        if (name) {
            updates.push(`name = $${values.length + 1}`);
            values.push(name);
        }
        if (email) {
            updates.push(`email = $${values.length + 1}`);
            values.push(email);
        }
        updateQuery += updates.join(', ');
        updateQuery += ` WHERE id = $${values.length + 1} RETURNING *`;
        values.push(id);
        const result = await query(updateQuery, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        if (error.code === '23505') { // Unique violation
            res.status(400).json({ error: 'Email already exists' });
        }
        else {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to update user'
            });
        }
    }
});
// Delete user
dbtest.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({
            message: 'User deleted successfully',
            user: result.rows[0]
        });
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to delete user'
        });
    }
});
export default dbtest;
