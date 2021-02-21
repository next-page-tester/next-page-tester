module.exports = {
  serverRuntimeConfig: {
    value: 'true',
    domain: process.env.DOMAIN,
  },
  publicRuntimeConfig: {
    value: 'true',
    domain: process.env.DOMAIN,
  },
  i18n: {
    locales: ['en-AU'],
    defaultLocale: 'en-AU',
    domains: [
      {
        domain: process.env.DOMAIN,
        defaultLocale: 'en-AU',
      },
    ],
  },
};
