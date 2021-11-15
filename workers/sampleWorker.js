const config = require('config');

const workerCfg = config.worker;

module.exports = (connection) => {
  async function consume(channel, msg) {
    let message;

    try {
      message = JSON.parse(msg.content.toString());
    } catch (e) {
      console.error('error 24:', e.message);
      return channel.ack(msg);
    }
    // TODO::Consumer code

    return channel.ack(msg);
  }

  async function prepareQueues(conn, values) {
    const channel = await conn.createConfirmChannel();
    await channel.assertExchange(values.EXCHANGE_NAME, 'direct', values.EXCHANGE_OPTIONS);
    await channel.assertExchange(values.DLX_EXCHANGE_NAME, 'direct', values.EXCHANGE_OPTIONS);
    await channel.assertQueue(values.QUEUE_NAME, values.QUEUE_OPTIONS);
    await channel.assertQueue(values.DLX_QUEUE_NAME, values.DLX_QUEUE_OPTIONS);
    await channel.prefetch(values.PREFETCH_COUNT);
    await channel.bindQueue(values.QUEUE_NAME, values.EXCHANGE_NAME, values.ROUTING_KEY);
    // eslint-disable-next-line max-len
    await channel.bindQueue(values.DLX_QUEUE_NAME, values.DLX_EXCHANGE_NAME, values.DLX_ROUTING_KEY);
    return channel;
  }

  async function run() {
    const channel = await prepareQueues(connection, workerCfg.channelData);
    channel.consume(workerCfg.channelData.QUEUE_NAME, consume.bind(null, channel));
    return channel;
  }

  return run;
};
