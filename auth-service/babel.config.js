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
          '@config': './src/config',
          '@controllers': './src/controllers',
          '@errors': './src/errors',
          '@middlewares': './src/middlewares',
          '@models': './src/models',
          '@routes': './src/routes',
        },
      },
    ],
  ],
  ignore: ['**/*.spec.ts'],
};
