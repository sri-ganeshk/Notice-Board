import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  MONGO_URI: string;
  JWT_SECRET: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/taskinn',
  JWT_SECRET: process.env.JWT_SECRET || 'password123'

};

export default config;