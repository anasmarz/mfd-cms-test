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
            public_id: (_, resource) => {
              const folder = resource?.folder || 'test-folder';
              const filename = resource?.name?.split('.')[0] || Date.now().toString();
              return `${folder}/${filename}`;
            },
          },
          delete: {},
        },
      },
    },
  });
  