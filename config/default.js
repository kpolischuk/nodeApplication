const pkg = require('../package.json');

module.exports = {
  app: {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    env: process.env.NODE_ENV,
  },
  server: {
    port: 3000,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN_SERVICE_SKELETON,
  },
  cron: {
    stateDb: {
      protocol: 'mongodb:',
      port: 27017,
      hostname: process.env.MONGODB_CRON_HOSTNAME,
      database: process.env.MONGODB_CRON_DATABASE,
      collection: pkg.name,
    },
  },
  worker: {
    qmConnection: {
      hostname: '',
      port: '',
      username: '',
      password: '',
    },
    channelData: {
      PREFETCH_COUNT: '',
      EXCHANGE_NAME: '',
      DLX_EXCHANGE_NAME: '',
      QUEUE_NAME: '',
      DLX_QUEUE_NAME: '',
      ROUTING_KEY: '',
      DLX_ROUTING_KEY: '',
      QUEUE_OPTIONS: '',
      EXCHANGE_OPTIONS: '',
      DLX_QUEUE_OPTIONS: '',
    },

  },
};
