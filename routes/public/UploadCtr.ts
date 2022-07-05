import UploadService from '../../server/UploadService';
import { authority, Controller, Get, LoginUser } from '../../config/lib';
import env from '../../config/env';
@Controller({ prefix: '/api/upload' })
export default class UploadCtr {
  /**
   * 上传预签名
   * @param ctx
   * @param user
   * @param next
   */
  @Get
  @authority([env.adminAuthority])
  async getObjectUrl(ctx: any, user: LoginUser, next: Function) {
    let lastName = ctx.request.query.lastName as any;
    let type = ctx.request.query.type as any;
    let Bucket = env.NoticeBucket;
    let Region = env.Region;
    if (type === 'unit') {
      Bucket = env.Bucket;
    }
    ctx.body = await UploadService.getObjectUrl(lastName, Bucket, Region);
    await next();
  }
  /**
   * 获取图片 url 连接
   * @param ctx
   * @param user
   * @param next
   */
  @Get
  @authority()
  async getUrl(ctx: any, user: LoginUser, next: Function) {
    ctx.body = await UploadService.getUrl(ctx.request.query.name as any);
    await next();
  }
}
