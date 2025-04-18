import path from 'path';

export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL'),
      ssl: {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', env('NODE_ENV') === 'production'),
        ca: env('SUPABASE_CA_CERT')?.replace(/\\n/g, '\n')
      }
    },
    debug: env.bool('DATABASE_DEBUG', false),
  },
});
