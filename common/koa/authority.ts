import jwt from 'jsonwebtoken';
import { IRouterContext } from 'koa-router';
import { _config } from '../config';
import { ServiceResult } from '../core/ServiceResult';
import { LoginUser } from './LoginUser';
function getAuthConfig() {
  if (!_config.authConfig) {
    throw 'authConfig is null';
  }
  return _config.authConfig;
}
// 登录鉴权
export const authority = function (authority?: any, params?: any) {
  return function (target: any, name: string, descriptor: PropertyDescriptor) {
    let fn = descriptor.value;
    descriptor.value = async function (ctx: IRouterContext, user: LoginUser, next: Function) {
      console.log("======",ctx);
      if (!user) {
        let token = ctx.headers['authorization'];
        if (!token) {
          ctx.body = ServiceResult.getFail('401', {}, 401);
          return;
        }
        token = token.substr(7);
        let noncestr;
        if (getAuthConfig().regexp) {
          noncestr = getAuthConfig().regexp(ctx.url);
        } else {
          noncestr = getAuthConfig().noncestr;
        }
        let isV;
        try {
          isV = jwt.verify(token, noncestr);
        } catch (error) {
          ctx.body = ServiceResult.getFail('401', {}, 401);
          return;
        }
        if (!isV) {
          ctx.body = ServiceResult.getFail('401', {}, 401);
          return;
        }
        user = isV as LoginUser;
        if (user.roles.length<=0) {
          ctx.body = ServiceResult.getFail('角色异常', {}, 401);
          return;
        }
        if (user.permissions.length<=0) {
          ctx.body = ServiceResult.getFail('权限异常', {}, 401);
          return;
        }
        if (authority && authority.length >= 1) {
          if (authority.indexOf(user.permissions.toString()) === -1) {
            ctx.body = ServiceResult.getFail('暂无访问权限', {}, 403);
            return;
          }
        }
      }
      if (getAuthConfig().auth) {
        let sr = await getAuthConfig().auth(user, params, ctx);
        if (!sr.success) {
          ctx.body = sr;
          return;
        }
      }
      await fn(ctx, user, next);
    };
    return descriptor;
  };
};
