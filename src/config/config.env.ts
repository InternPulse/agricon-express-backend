import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config();
export const config = {
  RENDER_SERVICE_ID: process.env.RENDER_SERVICE_ID || '',
  RENDER_API_KEY: process.env.RENDER_API_KEY || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000'),
  JWT_SECRET: process.env.JWT_SECRET,
} as const;

export const configCors = ()=> {
    return cors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                process.env.FRONTEND_PORT1 || "http://localhost:3001",
                process.env.FRONTEND_PORT2 || "http://localhost:5173",
                process.env.FRONTEND_DEPLOYED || "https://agricon-ng.vercel.app",
                process.env.FRONTEND_DOMAIN || "https://agricon.com.ng"
            ]
            if(!origin || allowedOrigins.includes(origin)){
                callback(null, true);
            }else{
                callback(new Error("Not allowed by cors"))
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Accept",
            "Content-Range",
            "X-Content-Range"
        ],
        credentials: true,
        preflightContinue: false,
        maxAge: 600,
        optionsSuccessStatus: 204
    })
}