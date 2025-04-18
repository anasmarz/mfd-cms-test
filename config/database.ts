// Add fs import at the top
import fs from 'fs';
import path from 'path';
import { parse } from 'pg-connection-string';

export default ({ env }) => {
  // Determine the database client. For Supabase, we use 'postgres'.
  const client = env('DATABASE_CLIENT', 'postgres');

  // For IPv4 networks on Render, Supabase recommends using the Session Pooler.
  // The session pooler connection string (with IPv4 compatibility) is:
  // postgresql://postgres.iigidhentirdptmbxhkg:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
  // Replace [YOUR-PASSWORD] with your actual Supabase PostgreSQL password.
  const connectionString = env(
    'DATABASE_URL',
    'postgresql://postgres.iigidhentirdptmbxhkg:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
  );

  // Define connection configurations for supported databases.
  const connections = {
    postgres: {
      connection: {
        connectionString,
        ...(connectionString ? parse(connectionString) : {}),
        ssl: {
          ca: env('SUPABASE_CA_CERT')?.replace(/\\n/g, '\n'),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', env('NODE_ENV') === 'production')
        },
      },
      pool: {
        // Customize your connection pool settings as needed.
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10)
      },
    },
    mysql: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY'),
          cert: env('DATABASE_SSL_CERT'),
          ca: env('DATABASE_SSL_CA'),
          capath: env('DATABASE_SSL_CAPATH'),
          cipher: env('DATABASE_SSL_CIPHER'),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10)
      },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      // Optional timeout for acquiring a connection (in milliseconds)
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
