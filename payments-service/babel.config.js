module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@config': './src/config/index',
          '@controllers': './src/controllers',
          '@listeners': './src/events/listeners/index',
          '@models': './src/models',
          '@publishers': './src/events/publishers/index',
          '@routes': './src/routes',
          '@utils': './src/utils',
        },
      },
    ],
  ],
  ignore: ['**/*.spec.ts'],
};
