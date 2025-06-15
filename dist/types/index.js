import app from '../app';
import sequelize from '../config/config.db';
import { config } from '../config/config.env';
const port = config.PORT;
const start = async () => {
    try {
        // Connect to Database
        await sequelize.authenticate();
        console.log('Connected to postgres DB');
        // Sync all table models
        await sequelize.sync({ alter: true });
        console.log("Models synchronized");
        // Start the server
        app.listen(port, () => {
            console.log(`Server running on port: ${port}`);
        });
    }
    catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1); // Exit with failure
    }
};
start();
