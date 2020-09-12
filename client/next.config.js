module.exports = {
  webpack(config) {
    config.watchOptions.poll = 300;
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
