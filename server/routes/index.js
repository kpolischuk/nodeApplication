const Router = require('koa-router');
const koaBody = require('koa-body');
const config = require('config');
const prometheusPlugin = require('@bu-auto-modules/prometheus/plugins/koa2').default();
const { auth, strictAuth } = require('@bu-auto-modules/auth');
const k8s = require('@bu-auto-modules/k8s-probes');
// const
// require controllers here
// ;
const {
  name, version, description, env,
} = config.app;
const routesPublic = new Router();
const routesPrivate = new Router();

routesPublic
  .use(prometheusPlugin.middleware())
  .use(auth)
  // юзати там де юзер обовязковий, вертає 401
  .use(strictAuth)
  .use(koaBody())
  .prefix('/public');
// public routes here
// ->

routesPrivate
  // service routes
  .use(prometheusPlugin.middleware())
  .get('/', (ctx) => {
    Object.assign(ctx, {
      body:
      {
        name, version, description, env, date: new Date(),
      },
    });
  })

  .get('/metrics', prometheusPlugin.handler);
// private routes here
// ->

k8s.routesInit
  .koa2(routesPrivate);

module.exports = {
  routesPublic() {
    return routesPublic.routes();
  },
  routesPrivate() {
    return routesPrivate.routes();
  },
};
