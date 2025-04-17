import path from 'path';
import { parse } from 'pg-connection-string';

export default ({ env }) => {
  // Choose the database client based on the environment variable.
  // Default is 'postgres' if DATABASE_CLIENT is not defined.
  const client = env('DATABASE_CLIENT', 'postgres');

  // Define the connection settings for different supported databases.
  const connections = {
    mysql: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        // Enable SSL if DATABASE_SSL is set to true.
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
      },
    },
    postgres: {
      connection: {
        // For PostgreSQL, the connection string is parsed.
        // Ensure your connection string is properly formatted.
        connectionString: env('DATABASE_URL', 'postgresql://postgres:[YOUR-PASSWORD]@db.iigidhentirdptmbxhkg.supabase.co:5432/postgres'),
        // Spread the parsed configuration if DATABASE_URL exists.
        ...(env('DATABASE_URL') ? parse(env('DATABASE_URL')) : {}),
        // Enable SSL and configure it. Adjust these settings if your provider requires different options.
        ssl: env.bool('DATABASE_SSL', true) && {
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
      },
    },
    sqlite: {
      connection: {
        filename: path.join(
          __dirname,
          '..',
          '..',
          env('DATABASE_FILENAME', '.tmp/data.db')
        ),
      },
      // For SQLite, useNullAsDefault is generally required.
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      // Spread the specific connection configuration based on the selected client.
      ...connections[client],
      // Optional timeout for acquiring a connection.
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
