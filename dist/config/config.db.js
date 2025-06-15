import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from "sequelize";
// Define valid dialects
const validDialects = ['postgres', 'mysql', 'sqlite', 'mariadb', 'mssql'];
const defaultDialect = 'postgres';
const dbDialect = validDialects.includes(process.env.DB_DIALECT)
    ? process.env.DB_DIALECT
    : defaultDialect;
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: dbDialect,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        }
    },
});
export default sequelize;
