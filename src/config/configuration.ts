export default () => ({
  app: {
    environment: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3000),
  },

  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'surf_school',
    password: process.env.DB_PASSWORD ?? 'surf_school',
    database: process.env.DB_DATABASE ?? 'surf_school',
  },
});
