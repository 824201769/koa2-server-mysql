const localEnv = require('./local.json');

//默认使用环境变量参数
for (const key in localEnv) {
  if (localEnv[key] && !process.env[key]) {
    process.env[key] = localEnv[key];
  }
}
interface Config {
  PORT: number; //启动端口
  dbUrl: string; //数据库地址
  dbName: string; //数据库名称
  dbUser: string; //数据库用户名
  dbPwd: string; //数据库密码
  noncestr: string; //鉴权字符串
  algorithm: string; //加密方式
  redisUrl: string; //redis 连接地址
  redisPwd: string; //redis 连接密码
  debug: boolean; //是开启数据库日志
  accessKeyId: string; //发送验证码 key
  accessKeySecret: string; //发送验证码Secret
  Bucket: string; // 存储桶名称
  Region: string; //存储桶 id
  QueueId: string; //列队 id
  SecretId: string; // 腾讯云 id
  SecretKey: string; // 腾讯云密钥
  NoticeBucket: string; // 通知上传存储桶名称
  NoticeUrl: string; // 存储桶域名不带/
}
//@ts-ignore
let env: Config = process.env as Config;
export default env;
