import * as dotenv from 'dotenv';

import { DataSource } from 'typeorm';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

export default new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),

  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,

  database: process.env.DB_DATABASE,

  entities: ['src/modules/**/*.orm-entity.ts'],

  migrations: ['src/database/migrations/*.ts'],
});
