import { Redis } from "./Redis";

export class DefaultRedis extends Redis {

  protected config(): { redisUrl: string; redisPwd: string; db?: number | undefined; } {
    return { redisUrl: "//localhost:6379", redisPwd: "" }
  }

}

