const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-body');
const logger = require('koa-logger');
const path = require('path');
const fs = require('fs');
const KoaStatic = require('koa-static');
import deleteLog from './lib/index';
import log from './lib/log4js';
import cors from 'koa2-cors';
import './config/index';

global.Promise = require('bluebird');
onerror(app);
app.use(
  cors({
    origin: function (ctx) {
      if (ctx.url) {
        return '*'; // 允许来自所有域名请求
      }
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
);

// middlewares
app.use(
  bodyparser({
    multipart: true,
    enableTypes: ['json', 'form', 'text'],
    jsonLimit: '300mb',
    formidable: {
      maxFileSize: 300000000,
    },
  })
);
app.use(json());
app.use(logger());
app.use(KoaStatic(path.join(__dirname + '/public')));
app.use(KoaStatic(path.join(__dirname + '/upload')));
// logger
app.use(async (ctx: any, next: () => any) => {
  //响应开始时间
  const start = new Date().getTime();
  //响应间隔时间
  var ms;
  try {
    //开始进入到下一个中间件
    await next();
    //记录响应日志
    ms = new Date().getTime() - start;
    log.i(ctx, ms);
  } catch (error) {
    //记录异常日志
    ms = new Date().getTime() - start;
    log.e(ctx, error, ms);
  }
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
initRouters('./routes/public');
initRouters('./routes/controller');
// 解析路由
function initRouters(path: string) {
  let files = fs.readdirSync(path);
  files.map((item: string) => {
    if (item.endsWith('.js') || item.endsWith('.ts')) {
      import(`${path}/${item.substr(0, item.indexOf('.'))}`)
        .then(router => {
          if (router.default.$) {
            app.use(router.default.$.routes());
          } else {
            console.log(item);
            app.use(router.default.routes()).use(router.default.allowedMethods());
          }
          console.log('注册路由: ', item);
        })
        .catch(err => {
          console.log('错误路由: ', path, ' : ', item);
          console.log('错误信息: ', err);
        });
    }
  });
}
// error-handling
app.on('error', (err: any, ctx: any) => {
  console.error('server error', err, ctx);
});
deleteLog();
export default app;
