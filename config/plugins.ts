export default ({ env }) => ({
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDNAME'),
          api_key: env('CLOUDAPIKEY'),
          api_secret: env('CLOUDINARYSECRET'),
        },
        actionOptions: {
          upload: {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
            folder: 'test-folder',
            resource_type: 'auto',
            // Add the following configuration to enforce folder structure
            public_id: (_, resource) => `${resource?.folder ?? 'test-folder'}/${resource?.originalFilename}`,
          },
          delete: {},
        },
      },
    },
  });
  