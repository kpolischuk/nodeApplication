const http = require('http');
const Koa = require('koa');
const config = require('config');
const Sentry = require('@sentry/node');
require('dnscache')(config.dnscache);
const serviceHeaders = require('ria-service-middleware');
const k8s = require('@bu-auto-modules/k8s-probes');

Sentry.init({
  environment: `server-${config.app.env}`,
  dsn: config.sentry.dsn,
});

const {
  routesPublic,
  routesPrivate,
} = require('./server/routes/index');

const
  app = new Koa();
app.use(serviceHeaders);
app.use(async (ctx, next) => {
  if (process.env.TEST_USER) {
    ctx.userId = process.env.TEST_USER;
  }
  await next();
});
app.use(routesPrivate());
app.use(routesPublic());

app.use(async (ctx, next) => {
  if (ctx.status >= 500) {
    const error = new Error();
    error.message = `Status->${ctx.status} Method->${ctx.method} headers-> ${JSON.stringify(ctx.request.headers)}`;
    console.error(error);
  }
  await next();
});
app.on('error', (err, ctx) => {
  if (!ctx.status || ctx.status >= 500) {
    Sentry.setUser({
      id: ctx.userId,
    });
    Sentry.withScope((scope) => {
      scope.addEventProcessor((event) => Sentry.Handlers.parseRequest(event, ctx.request));
      Sentry.captureException(err);
    });
  }
});
k8s.ready = true;
const server = http.createServer(app.callback())
  .listen(config.server.port, () => {
    // eslint-disable-next-line no-console
    console.table({
      Application: config.app.name,
      Version: config.app.version,
      Environment: config.app.env,
    });
  });

module.exports = {
  server,
  closeServer() {
    server.close();
  },
};
