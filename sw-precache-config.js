module.exports = {
  staticFileGlobs: [
    'manifest.json',
    'images/*',
    'src/**/*',
  ],
  runtimeCaching: [
    {
      urlPattern: /\/@webcomponents\/webcomponentsjs\//,
      handler: 'fastest'
    },
    {
      urlPattern: /^https:\/\/jsonplaceholder\.typicode\.com\/posts/,
      handler: 'networkFirst'
    }
  ],
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^(?!.*\.js$|\/data\/).*/]
};
