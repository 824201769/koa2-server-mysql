var log4js = require('log4js');
var path = require('path');
var fs = require('fs');
const moment = require('moment');
let date = moment().format('YYYY-MM-DD');
var basePath = path.join(__dirname, `../../logs/${date}`);
var errorPath = basePath + `/errors/`;
var successPath = basePath + `/success/`;
var errorFilename = errorPath + '/error';
var successFilename = successPath + '/success';

log4js.configure({
  appenders: {
    errorLog: {
      type: 'dateFile', //日志类型
      filename: errorFilename, //日志输出位置
      alwaysIncludePattern: true, //是否总是有后缀名
      pattern: 'yyyy-MM-dd-hh.log', //后缀，每小时创建一个新的日志文件
      encoding: 'utf-8', //default "utf-8"，文件的编码
    },
    successLog: {
      type: 'dateFile',
      filename: successFilename,
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd-hh.log',
      encoding: 'utf-8', //default "utf-8"，文件的编码
    },
  },
  categories: {
    errorLog: { appenders: ['errorLog'], level: 'error' },
    successLog: { appenders: ['successLog'], level: 'info' },
    default: { appenders: ['successLog', 'errorLog'], level: 'trace' },
  },
  // pm2: true,
  // pm2InstanceVar: 'INSTANCE_ID',
  disableClustering: true,
});

export default log4js;
