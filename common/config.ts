import { LoginUser, ServiceResult, Redis } from '.';
import { DefaultRedis } from './redis/DefaultRedis';
import { IRouterContext } from 'koa-router';

export interface Config {
  cacheRedis?: Redis;
  authConfig?: AuthConfig;
  routeConfig?: RouteConfig;
}

export interface RouteConfig {
  prefix: string;
}

export interface AuthConfig {
  noncestr: string;
  regexp?: Function;
  algorithm?: string[];
  auth?(user: LoginUser, params: any, ctx: IRouterContext): Promise<ServiceResult<LoginUser>>;
}

export let _config: Config = {} as Config;

export function config(cfg: Config) {
  if (!cfg.cacheRedis) {
    //设置redis默认值
    cfg.cacheRedis = new DefaultRedis();
  }
  _config = cfg;
}
