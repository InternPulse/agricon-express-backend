import dotenv from 'dotenv';
import express from 'express';
import { healthCheck, test_db } from './test_database.ts/test_db';
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use('/api/init-db', test_db)
app.use('/health', healthCheck);


export default app;