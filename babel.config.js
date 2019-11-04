module.exports = {
  env: {
    vue: {
      presets: [
        '@vue/app',
        '@babel/preset-env',
      ],
    },
  },
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
  ],
};
