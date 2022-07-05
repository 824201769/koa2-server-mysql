const moment = require('moment');
const schedule = require('node-schedule');
const path = require('path');
import { delDir } from './delDir/delDir';

//定时任务删除1天前的日志文件
function deleteLog() {
  let date = moment().format('YYYY-MM-DD');
  let datetime = moment(date).valueOf();
  let deleteDate = datetime - 172800000;
  let date_ = moment(deleteDate).format('YYYY-MM-DD');
  let logpath = path.resolve(__dirname, `./logs/${date_}`);
  console.log('开始执行日志删除任务', logpath);
  //每天的凌晨3点3分30秒触发
  const schedule_ = schedule.scheduleJob('30 3 3 * * *', function () {
    delDir(logpath);
  });
}
export default deleteLog;
