import env from './env';
import { config, LoginUser, ServiceResult } from '../common';
import redis from './Redis';
import authService from '../server/AuthService';
import { IRouterContext } from 'koa-router';
//配置公用设置
config({
  cacheRedis: redis,
  authConfig: {
    noncestr: env.noncestr,
    algorithm: [env.algorithm],
    auth: async function (user: LoginUser, params: any, ctx: IRouterContext): Promise<ServiceResult<LoginUser>> {
      return await authService.auth(user, params, ctx);
    },
  },
  routeConfig: { prefix: '/api' },
});
