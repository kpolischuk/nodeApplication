const cron = require('./cron/agenda');
const job = require('./cron/jobs/sampleJob');

// -----Declare your jobs here----
cron.define('ext_job', job);
const main = async () => {
  await cron.start();
  const unconditionalTasks = await cron.purge();
  // eslint-disable-next-line no-console
  console.info(`${unconditionalTasks} unconditional tasks was deleted`);
  // ------Declare your schedule here------
  await cron.every('10 seconds', 'ext_job', { foo: 1, baz: new Date().toLocaleString() });
};

main();
