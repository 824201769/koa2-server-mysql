import KoaRouter, { IRouterContext } from 'koa-router';
import { _config } from '../config';

function getRouteConfig() {
  if (!_config.routeConfig) {
    throw 'routeConfig is null';
  }
  return _config.routeConfig;
}
export function Controller(params?: { prefix: string }): any {
  return function (target: any) {
    let router = new KoaRouter();

    if (params && params.prefix) {
      router.prefix(params.prefix);
    } else {
      let name: string = target.name;
      if (name == 'default_1') {
        throw 'class name is null';
      }
      if (!name.endsWith('Ctr')) {
        throw 'class name must be end with "Ctr"';
      }
      let routeName = name.charAt(0).toLowerCase() + name.substr(1, name.length - 4);
      router.prefix(getRouteConfig().prefix + '/' + routeName);
    }

    let reqList = Object.getOwnPropertyDescriptors(target.prototype);
    for (let v in reqList) {
      // 排除类的构造方法
      if (v !== 'constructor' && v !== '__authority' && v !== '__isAuthority') {
        let fn = reqList[v].value;
        fn(router, target.prototype.__authority);
      }
    }
    target.$ = router;
  };
}

export const controller = Controller();
export class Param {
  url?: string;
  middlewares?: any[];
}

function method(name: string, mth: string, descriptor: PropertyDescriptor, param?: string | Param) {
  let url: string;
  let middlewares: any[] = [];
  if (!param) {
    url = `/${name}`;
  } else {
    if (param instanceof Param) {
      url = param.url || '';
      middlewares = param.middlewares || [];
    } else {
      url = param;
    }
  }
  bind(url, mth, descriptor, middlewares);
}

export function POST(_url?: string): any;
export function POST(param?: Param): any;
export function POST(param?: string | Param): any {
  return function (target: any, name: string, descriptor: PropertyDescriptor) {
    method(name, 'post', descriptor, param);
  };
}
export const Post = POST();

export function GET(_url?: string): any;
export function GET(param?: Param): any;
export function GET(param?: string | Param): any {
  return function (target: any, name: string, descriptor: PropertyDescriptor) {
    method(name, 'get', descriptor, param);
  };
}
export const Get = GET();

export function PUT(_url?: string): any;
export function PUT(param?: Param): any;
export function PUT(param?: string | Param): any {
  return function (target: any, name: string, descriptor: PropertyDescriptor) {
    method(name, 'put', descriptor, param);
  };
}
export const Put = PUT();

export function DELETE(_url?: string): any;
export function DELETE(param?: Param): any;
export function DELETE(param?: string | Param): any {
  return function (target: any, name: string, descriptor: PropertyDescriptor) {
    method(name, 'delete', descriptor, param);
  };
}
export const Delete = DELETE();

/**
 * 绑定 路由
 * @param url
 * @param method
 * @param descriptor
 * @param roles
 */
function bind(url: string, method: string, descriptor: PropertyDescriptor, middlewares: any[]) {
  let fn = descriptor.value;
  descriptor.value = (router: any, authority: any) => {
    router[method](url, ...middlewares, async (ctx: any, next: Function) => {
      let user;
      if (authority) {
        let sr = await authority(ctx);

        if (!sr.success) {
          ctx.body = sr;
          return;
        }
        user = sr.data;
      }
      await fn(ctx, user, next);
    });
  };
  return descriptor;
}
