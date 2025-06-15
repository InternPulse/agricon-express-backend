import dotenv from 'dotenv';
dotenv.config();
import { Sequelize, Dialect } from "sequelize";

// Define valid dialects
const validDialects: Dialect[] = ['postgres', 'mysql', 'sqlite', 'mariadb', 'mssql'];
const defaultDialect: Dialect = 'postgres';

const dbDialect: Dialect = validDialects.includes(process.env.DB_DIALECT as Dialect)
  ? process.env.DB_DIALECT as Dialect
  : defaultDialect;


const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT as string) || 5432,
        dialect: dbDialect,
        dialectOptions: {
            ssl:  {
                require: true,
                rejectUnauthorized: false,
            } 
        },
    }
);

export default sequelize;



