const Agenda = require('agenda');
const Sentry = require('@sentry/node');
const os = require('os');
const c = require('config');

Sentry.init({
  environment: `cron-${c.app.env}`,
  dsn: c.sentry.dsn,
});

const MONGO_DEFAULT_PORT = 27017;
const db = c.cron.stateDb;
const config = {
  db: {
    address: `${db.protocol}//${db.hostname}:${db?.port ?? MONGO_DEFAULT_PORT}/${db.database}`,
    collection: db.collection,
  },
  name: `${os.hostname}-${process.pid}`,
};

const agenda = new Agenda(config);

const gracefulShutdown = () => {
  // eslint-disable-next-line no-console
  console.info('GRACEFUL EXIT');
  return agenda
    .stop()
    .then(process.exit(0));
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

agenda.on('fail', (e, job) => {
  const options = {
    tags: {
      job: job?.attrs?.name ?? 'undefined_job',
    },
  };
  Sentry.captureException(e, options);
  console.error(`❌  Agenda job ${job?.attrs?.name ?? 'undefined_job'} fails with message ${e.message}`);
});

module.exports = agenda;
