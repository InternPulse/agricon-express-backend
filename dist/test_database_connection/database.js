import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
// Create connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
// Database connection function
export const connectDB = async () => {
    try {
        const client = await pool.connect();
        return client;
        // console.log(client)
    }
    catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const query = async (text, params) => {
    const client = await connectDB();
    try {
        const result = await client.query(text, params);
        return result;
    }
    catch (error) {
        console.error('Query error:', error);
        throw error;
    }
    finally {
        client.release();
    }
};
// Close all connections
export const closeDB = async () => {
    await pool.end();
};
