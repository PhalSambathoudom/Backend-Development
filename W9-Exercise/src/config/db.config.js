import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME || 'Week9_Exercise',
  PORT: process.env.DB_PORT || 3306,
  dialect: process.env.DB_DIALECT || 'mysql',
  storage: './academic_db.sqlite', // for sqlite only
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

export default dbConfig;
