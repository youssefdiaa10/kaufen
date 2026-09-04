export default () => ({
  app: {
    port: process.env.PORT || 3000,
  },
  database: {
    postgres: {
      type: 'postgres' as const,
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5433,
      username: process.env.DB_USERNAME || 'kaufen_user',
      password: process.env.DB_PASSWORD || 'kaufen_pass',
      database: process.env.DB_NAME || 'kaufen_db',
      //! ⚠️ Automatically disables synchronize in production
      synchronize: process.env.NODE_ENV !== 'production',
    },
  },
});
