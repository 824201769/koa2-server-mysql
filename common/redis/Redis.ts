import { createClient } from 'redis';
export abstract class Redis {
  private client:any;
  /**
   * 初始化 redis
   * @param redisUrl 连接
   * @param redisPwd 密码
   */
  protected abstract config(): { redisUrl: string; redisPwd: string; db?: number };

  constructor() {
    {
      this.client = createClient({
        legacyMode: true,
        url: this.config().redisUrl,
        password: this.config().redisPwd,
      });
      this.client.on('error', (err: any) => {
        console.log(err);
      });
      this.client.connect()
      this.client.ping()
    }
  }

  /**
   *
   * @param {string} key
   * @returns {Promise<string>}
   */
  async get(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.get(key, function (err: any, data: any) {
        resolve(data);
      });
    });
  }

  /**
   *
   * @param {string} key
   * @param {string} value
   * @param {number} exprires 过期时间 seconds
   */
  async set(key: string, value: string, exprires: number): Promise<any> {
    return new Promise((res, rej) => {
      this.client.set(key, value, function (err: any, data: unknown) {
        res(data);
      });
      if (exprires) {
        this.client.expire(key, exprires);
      }
    });
  }

  /**
	 * 
	 * @param {string} key 
	 
	 */
  async del(key: string) {
    return new Promise((res, rej) => {
      this.client.del(key, function (err: any, data: unknown) {
        if (err) {
          rej(err);
        } else {
          res(data);
        }
      });
    });
  }
  /**
	 * 
	 * @param {string} pattern 
	 
	 */
  async dels(pattern: string) {
    let t = this;
    return new Promise((res, rej) => {
      t.client.keys(pattern, function (err: any, keys: any) {
        if (err) {
          rej(err);
          return;
        }
        if (keys) {
          t.client.del(keys, function (err: any, data: unknown) {
            if (err) {
              rej(err);
            } else {
              res(data);
            }
          });
        }
      });
    });
  }
}
