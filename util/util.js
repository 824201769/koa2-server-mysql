'use strict';
var crypto = require('crypto');
var getAuth = function (opt) {
  opt = opt || {};

  var SecretId = opt.SecretId;
  var SecretKey = opt.SecretKey;
  var KeyTime = opt.KeyTime;
  var method = (opt.method || opt.Method || 'get').toLowerCase();
  var queryParams = clone(opt.Query || opt.params || {});
  var headers = clone(opt.Headers || opt.headers || {});

  var Key = opt.Key || '';
  var pathname;
  if (opt.UseRawKey) {
    pathname = opt.Pathname || opt.pathname || '/' + Key;
  } else {
    pathname = opt.Pathname || opt.pathname || Key;
    pathname.indexOf('/') !== 0 && (pathname = '/' + pathname);
  }

  if (!SecretId) throw new Error('missing param SecretId');
  if (!SecretKey) throw new Error('missing param SecretKey');

  // 签名有效起止时间
  var now = Math.round(getSkewTime(opt.SystemClockOffset) / 1000) - 1;
  var exp = now;

  var Expires = opt.Expires || opt.expires;
  if (Expires === undefined) {
    exp += 900; // 签名过期时间为当前 + 900s
  } else {
    exp += Expires * 1 || 0;
  }

  // 要用到的 Authorization 参数列表
  var qSignAlgorithm = 'sha1';
  var qAk = SecretId;
  var qSignTime = KeyTime || now + ';' + exp;
  var qKeyTime = KeyTime || now + ';' + exp;
  var qHeaderList = getObjectKeys(headers, true).join(';').toLowerCase();
  var qUrlParamList = getObjectKeys(queryParams, true).join(';').toLowerCase();

  // 签名算法说明文档：https://www.qcloud.com/document/product/436/7778
  // 步骤一：计算 SignKey
  var signKey = crypto.createHmac('sha1', SecretKey).update(qKeyTime).digest('hex');

  // 步骤二：构成 FormatString
  var formatString = [method, pathname, obj2str(queryParams), obj2str(headers), ''].join('\n');
  formatString = Buffer.from(formatString, 'utf8');

  // 步骤三：计算 StringToSign
  var res = crypto.createHash('sha1').update(formatString).digest('hex');
  var stringToSign = ['sha1', qSignTime, res, ''].join('\n');

  // 步骤四：计算 Signature
  var qSignature = crypto.createHmac('sha1', signKey).update(stringToSign).digest('hex');

  // 步骤五：构造 Authorization
  var authorization = [
    'q-sign-algorithm=' + qSignAlgorithm,
    'q-ak=' + qAk,
    'q-sign-time=' + qSignTime,
    'q-key-time=' + qKeyTime,
    'q-header-list=' + qHeaderList,
    'q-url-param-list=' + qUrlParamList,
    'q-signature=' + qSignature,
  ].join('&');

  return authorization;
};

function clone(obj) {
  return map(obj, function (v) {
    return typeof v === 'object' && v !== null ? clone(v) : v;
  });
}
function map(obj, fn) {
  var o = isArray(obj) ? [] : {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = fn(obj[i], i);
    }
  }
  return o;
}
function isArray(arr) {
  return arr instanceof Array;
}
var getObjectKeys = function (obj, forKey) {
  var list = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      list.push(forKey ? camSafeUrlEncode(key).toLowerCase() : key);
    }
  }
  return list.sort(function (a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a === b ? 0 : a > b ? 1 : -1;
  });
};
// 获取调正的时间戳
var getSkewTime = function (offset) {
  return Date.now() + (offset || 0);
};
function camSafeUrlEncode(str) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');
}
var obj2str = function (obj) {
  var i, key, val;
  var list = [];
  var keyList = getObjectKeys(obj);
  for (i = 0; i < keyList.length; i++) {
    key = keyList[i];
    val = obj[key] === undefined || obj[key] === null ? '' : '' + obj[key];
    key = camSafeUrlEncode(key).toLowerCase();
    val = camSafeUrlEncode(val) || '';
    list.push(key + '=' + val);
  }
  return list.join('&');
};
var util = {
  getAuth: getAuth,
};

module.exports = util;
