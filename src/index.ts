import app from "./app";
import {prisma} from "./config/config.db";
import { config } from "./config/config.env";

const port = config.PORT || 4000;

const start = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Connected to database via Prisma');

    // Test with a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection verified');

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    await prisma.$disconnect();
    process.exit(1); // Exit with failure
  }
};

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

start();