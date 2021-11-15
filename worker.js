const amqp = require('amqplib');
const config = require('config');

const sampleWorker = require('./workers/sampleWorker');

const {
  hostname, port, username, password,
} = config.worker.qmConnection;

const rabbitMqUrl = `amqp://${username}:${password}@${hostname}:${port}`;

async function run() {
  const connection = await amqp.connect(rabbitMqUrl);
  return sampleWorker(connection);
}

run().catch((e) => {
  console.error('error 95:', e.message);
});
