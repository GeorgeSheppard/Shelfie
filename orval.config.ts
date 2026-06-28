export default {
  api: {
    input: {
      target: './openapi.json',
    },
    output: {
      target: './src/api/generated/hooks.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'single',
      prettier: true,
      clean: true,
      mock: false,
      override: {
        mutator: {
          path: './src/lib/axios.ts',
          name: 'axiosInstance',
        },
      },
    },
  },
};
