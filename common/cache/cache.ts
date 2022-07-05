import hash from 'murmurhash3js';

import { _config } from '../config';
import { ServiceResult } from '../core/ServiceResult';
const template = require('es6-template-strings');
function getCacheRedis() {
  if (!_config.cacheRedis) {
    throw 'cacheRedis is null';
  }
  return _config.cacheRedis;
}
/**
 * 通过cache 获取结果集
 * @param params
 */
export function cache(params: { prefix: string; keyExpress?: string; expiresIn?: number }) {
  return function (target: any, name: string, descriptor: PropertyDescriptor) {
    let fn: Function = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let key = toKey({ prefix: params.prefix, keyExpress: params.keyExpress }, args);

      let value = await getCacheRedis().get(key);
      if (value) {
        return JSON.parse(value);
      }
      let rt = (await fn(...args)) as ServiceResult<any>;
      if (rt.success && rt.data) {
        getCacheRedis()
          .set(key, JSON.stringify(rt), params.expiresIn || 60 * 10)
          .then();
      }
      return rt;
    };
    return descriptor;
  };
}

/**
 * 在方法执行完后，清除 cache
 * @param params
 */
export function clearCache(params: { prefix: string; keyExpress?: string }) {
  return function (target: any, name: string, descriptor: PropertyDescriptor) {
    let fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      if (!params.keyExpress) {
        //被认为是批量删除
        getCacheRedis().dels(params.prefix).then();
      } else {
        let key = toKey(params, args);
        getCacheRedis().del(key).then();
      }
      let rt = await fn(...args);
      return rt;
    };
    return descriptor;
  };
}

function toKey(params: { prefix: string; keyExpress?: string }, ...args: any[]) {
  let key = '';
  if (args && args.length > 0) {
    let express = params.keyExpress || '${JSON.stringify(args)}';
    let hashKey = hash.x86.hash32(template(params.keyExpress, { args: args[0] }));
    key = `${params.prefix}:${hashKey}`;
  } else if (params.keyExpress) {
    let hashKey = hash.x86.hash32(params.keyExpress);
    key = `${params.prefix}:${hashKey}`;
  }
  return key;
}

/**
 * 手工删除cache
 * @param params
 * @param args
 */
export function delCache(params: { prefix: string; keyExpress: string }, ...args: any[]) {
  if (!params.keyExpress) {
    //批量删除
    getCacheRedis().dels(params.prefix).then();
  } else {
    let key = toKey(params, args);
    getCacheRedis().del(key).then();
  }
}
