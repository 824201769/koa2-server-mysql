import { Redis } from '../common';
import env from './env';

class RedisClient extends Redis {
  config(): { redisUrl: string; redisPwd: string; db?: number } {
    return { redisUrl: env.redisUrl, redisPwd: env.redisPwd };
  }
}
const redis = new RedisClient();
export default redis;
